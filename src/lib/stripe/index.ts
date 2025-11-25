import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
});

// Platform fee in basis points (100 = 1%)
export const PLATFORM_FEE_BPS = parseInt(process.env.PLATFORM_FEE_BPS || '200', 10);

/**
 * Calculate the payment splits for a referral transaction
 */
export function calculateSplits(
  originalAmount: number, // in cents
  clientDiscountPercent: number,
  referrerCommissionPercent: number,
  isReferral: boolean = false
) {
  let discountAmount = 0;
  let referrerCommission = 0;

  if (isReferral) {
    // Client discount (percentage of original)
    discountAmount = Math.round(originalAmount * clientDiscountPercent / 100);
    // Referrer commission (percentage of original)
    referrerCommission = Math.round(originalAmount * referrerCommissionPercent / 100);
  }

  // Final amount charged to client
  const finalAmount = originalAmount - discountAmount;

  // Platform fee (percentage of final amount)
  const platformFee = Math.round(finalAmount * PLATFORM_FEE_BPS / 10000);

  // Provider receives: final - platform fee - referrer commission
  const providerPayout = finalAmount - platformFee - referrerCommission;

  return {
    originalAmount,
    discountAmount,
    finalAmount,
    referrerCommission,
    platformFee,
    providerPayout,
  };
}

/**
 * Create a Stripe Connect account for a service provider
 */
export async function createConnectAccount(email: string, businessName: string) {
  const account = await stripe.accounts.create({
    type: 'express',
    email,
    business_type: 'individual',
    business_profile: {
      name: businessName,
      mcc: '7299', // Personal services
    },
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });

  return account;
}

/**
 * Create an onboarding link for a Connect account
 */
export async function createAccountLink(accountId: string, returnUrl: string, refreshUrl: string) {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: 'account_onboarding',
  });

  return accountLink;
}

/**
 * Create a payment intent with automatic transfer to provider
 */
export async function createPaymentIntent(params: {
  amount: number; // Final amount in cents
  providerStripeAccountId: string;
  providerPayout: number; // Amount to transfer to provider in cents
  referrerCommission?: number; // Amount for referrer in cents
  metadata: Record<string, string>;
}) {
  const { amount, providerStripeAccountId, providerPayout, referrerCommission, metadata } = params;

  // Create payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    automatic_payment_methods: {
      enabled: true,
    },
    // Transfer to provider after successful payment
    transfer_data: {
      destination: providerStripeAccountId,
      amount: providerPayout,
    },
    metadata: {
      ...metadata,
      referrer_commission: referrerCommission?.toString() || '0',
    },
  });

  return paymentIntent;
}

/**
 * Create a transfer to a referrer's bank account
 * This is called after the payment is successful
 */
export async function transferToReferrer(params: {
  amount: number;
  referrerStripeAccountId: string;
  chargeId: string;
  transactionId: string;
}) {
  const { amount, referrerStripeAccountId, chargeId, transactionId } = params;

  const transfer = await stripe.transfers.create({
    amount,
    currency: 'usd',
    destination: referrerStripeAccountId,
    source_transaction: chargeId,
    metadata: {
      transaction_id: transactionId,
      type: 'referrer_commission',
    },
  });

  return transfer;
}

/**
 * Create a payout from the referrer's balance
 */
export async function createPayout(params: {
  amount: number;
  stripeAccountId: string;
  payoutId: string;
}) {
  const { amount, stripeAccountId, payoutId } = params;

  const payout = await stripe.payouts.create(
    {
      amount,
      currency: 'usd',
      metadata: {
        payout_id: payoutId,
      },
    },
    {
      stripeAccount: stripeAccountId,
    }
  );

  return payout;
}

/**
 * Retrieve a Connect account status
 */
export async function getAccountStatus(accountId: string) {
  const account = await stripe.accounts.retrieve(accountId);
  
  return {
    id: account.id,
    chargesEnabled: account.charges_enabled,
    payoutsEnabled: account.payouts_enabled,
    detailsSubmitted: account.details_submitted,
    requiresAction: !account.details_submitted || !account.charges_enabled,
  };
}

/**
 * Verify a webhook signature
 */
export function constructWebhookEvent(payload: string | Buffer, signature: string) {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
}
