import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';
import { stripe, calculateSplits, createPaymentIntent } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { providerId, referralCode } = body;

    if (!providerId) {
      return NextResponse.json({ error: 'Provider ID is required' }, { status: 400 });
    }

    // Get provider details
    const { data: provider, error: providerError } = await supabase
      .from('service_providers')
      .select('*')
      .eq('id', providerId)
      .single();

    if (providerError || !provider) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
    }

    if (!provider.stripe_account_id || !provider.payouts_enabled) {
      return NextResponse.json({ error: 'Provider not set up for payments' }, { status: 400 });
    }

    // Check if this is first interaction
    const adminClient = createAdminClient();
    const { data: isFirst } = await adminClient.rpc('is_first_interaction', {
      p_client_id: user.id,
      p_provider_id: providerId,
    });

    let referrer = null;
    let referralCodeRecord = null;
    let isReferral = false;

    // Validate referral code if provided
    if (referralCode && isFirst) {
      const { data: codeData } = await supabase
        .from('referral_codes')
        .select('*, referrer:profiles(*)')
        .eq('code', referralCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (codeData) {
        // Check if this code hasn't been used by this client for this provider
        const { data: existingUse } = await supabase
          .from('referral_code_uses')
          .select('id')
          .eq('referral_code_id', codeData.id)
          .eq('client_id', user.id)
          .eq('provider_id', providerId)
          .single();

        if (!existingUse && codeData.referrer_id !== user.id) {
          referralCodeRecord = codeData;
          referrer = codeData.referrer;
          isReferral = true;
        }
      }
    }

    // Calculate splits
    const splits = calculateSplits(
      provider.base_service_price,
      provider.client_discount_percent,
      provider.referrer_commission_percent,
      isReferral
    );

    // Create payment intent
    const paymentIntent = await createPaymentIntent({
      amount: splits.finalAmount,
      providerStripeAccountId: provider.stripe_account_id,
      providerPayout: splits.providerPayout,
      referrerCommission: splits.referrerCommission,
      metadata: {
        client_id: user.id,
        provider_id: providerId,
        referrer_id: referrer?.id || '',
        referral_code_id: referralCodeRecord?.id || '',
        is_first_interaction: String(isFirst),
        original_amount: String(splits.originalAmount),
        discount_amount: String(splits.discountAmount),
        platform_fee: String(splits.platformFee),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      splits,
      isFirstInteraction: isFirst,
      hasReferral: isReferral,
      referrerName: referrer?.full_name,
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}
