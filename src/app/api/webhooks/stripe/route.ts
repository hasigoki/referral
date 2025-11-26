import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe, constructWebhookEvent, transferToReferrer } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/server';
import type Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = constructWebhookEvent(body, signature);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const metadata = paymentIntent.metadata;

        // Idempotency check: Skip if transaction already exists for this payment intent
        const { data: existingTx } = await supabase
          .from('transactions')
          .select('id')
          .eq('stripe_payment_intent_id', paymentIntent.id)
          .single();

        if (existingTx) {
          console.log(`Transaction already exists for payment intent ${paymentIntent.id}, skipping`);
          break;
        }

        // Safe parsing helper with validation
        const safeParseInt = (value: string | undefined, defaultValue = 0): number => {
          if (!value) return defaultValue;
          const parsed = parseInt(value, 10);
          return isNaN(parsed) ? defaultValue : parsed;
        };

        // Create transaction record
        const { data: transaction, error: txError } = await supabase
          .from('transactions')
          .insert({
            client_id: metadata.client_id,
            provider_id: metadata.provider_id,
            referrer_id: metadata.referrer_id || null,
            referral_code_id: metadata.referral_code_id || null,
            original_amount: safeParseInt(metadata.original_amount),
            discount_amount: safeParseInt(metadata.discount_amount),
            final_amount: paymentIntent.amount,
            referrer_commission: safeParseInt(metadata.referrer_commission),
            platform_fee: safeParseInt(metadata.platform_fee),
            provider_payout: paymentIntent.transfer_data?.amount || 0,
            is_first_interaction: metadata.is_first_interaction === 'true',
            stripe_payment_intent_id: paymentIntent.id,
            status: 'processing',
          })
          .select()
          .single();

        if (txError) {
          console.error('Failed to create transaction:', txError);
          break;
        }

        // Record referral code use
        if (metadata.referral_code_id && metadata.referrer_id) {
          await supabase.from('referral_code_uses').insert({
            referral_code_id: metadata.referral_code_id,
            client_id: metadata.client_id,
            provider_id: metadata.provider_id,
            transaction_id: transaction.id,
          });
        }

        // Transfer to referrer if applicable
        const referrerCommission = safeParseInt(metadata.referrer_commission);
        if (referrerCommission > 0 && metadata.referrer_id) {
          // Get referrer's Stripe account
          const { data: referrerProfile } = await supabase
            .from('profiles')
            .select('stripe_connect_account_id')
            .eq('id', metadata.referrer_id)
            .single();

          if (referrerProfile?.stripe_connect_account_id) {
            // Get the charge ID from the payment intent
            const charges = await stripe.charges.list({
              payment_intent: paymentIntent.id,
              limit: 1,
            });

            if (charges.data.length > 0) {
              try {
                const transfer = await transferToReferrer({
                  amount: referrerCommission,
                  referrerStripeAccountId: referrerProfile.stripe_connect_account_id,
                  chargeId: charges.data[0].id,
                  transactionId: transaction.id,
                });

                await supabase
                  .from('transactions')
                  .update({
                    stripe_referrer_transfer_id: transfer.id,
                  })
                  .eq('id', transaction.id);
              } catch (transferError) {
                console.error('Referrer transfer failed:', transferError);
                // Continue - we'll add to wallet instead
              }
            }
          }
        }

        // Mark transaction as completed
        await supabase
          .from('transactions')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
          })
          .eq('id', transaction.id);

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        await supabase
          .from('transactions')
          .update({
            status: 'failed',
            status_message: paymentIntent.last_payment_error?.message,
          })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        break;
      }

      case 'account.updated': {
        const account = event.data.object as Stripe.Account;

        // Update provider's Stripe account status
        await supabase
          .from('service_providers')
          .update({
            stripe_account_status: account.details_submitted ? 'active' : 'pending',
            payouts_enabled: account.payouts_enabled,
          })
          .eq('stripe_account_id', account.id);

        break;
      }

      case 'payout.paid': {
        const payout = event.data.object as Stripe.Payout;
        const payoutId = payout.metadata?.payout_id;

        if (payoutId) {
          await supabase
            .from('payouts')
            .update({
              status: 'completed',
              stripe_payout_id: payout.id,
              processed_at: new Date().toISOString(),
            })
            .eq('id', payoutId);
        }

        break;
      }

      case 'payout.failed': {
        const payout = event.data.object as Stripe.Payout;
        const payoutId = payout.metadata?.payout_id;

        if (payoutId) {
          await supabase
            .from('payouts')
            .update({
              status: 'failed',
              failure_reason: payout.failure_message,
            })
            .eq('id', payoutId);

          // Return funds to wallet
          const { data: payoutRecord } = await supabase
            .from('payouts')
            .select('wallet_id, amount')
            .eq('id', payoutId)
            .single();

          if (payoutRecord) {
            // Return failed payout amount to wallet using raw SQL increment
            const { error: walletError } = await supabase.rpc('increment_wallet_balance', {
              p_wallet_id: payoutRecord.wallet_id,
              p_amount: payoutRecord.amount,
            });

            if (walletError) {
              console.error('Failed to return funds to wallet:', walletError);
            }
          }
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
