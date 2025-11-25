import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createConnectAccount, createAccountLink, getAccountStatus } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name, role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'provider') {
      return NextResponse.json({ error: 'Only providers can onboard' }, { status: 403 });
    }

    // Get provider record
    const { data: provider } = await supabase
      .from('service_providers')
      .select('id, business_name, stripe_account_id')
      .eq('owner_id', user.id)
      .single();

    if (!provider) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
    }

    let stripeAccountId = provider.stripe_account_id;

    // Create Stripe Connect account if doesn't exist
    if (!stripeAccountId) {
      const account = await createConnectAccount(profile.email, provider.business_name);
      stripeAccountId = account.id;

      // Save to database
      await supabase
        .from('service_providers')
        .update({ stripe_account_id: stripeAccountId })
        .eq('id', provider.id);

      await supabase
        .from('profiles')
        .update({ stripe_connect_account_id: stripeAccountId })
        .eq('id', user.id);
    }

    // Check if account is already fully onboarded
    const status = await getAccountStatus(stripeAccountId);

    if (status.chargesEnabled && status.payoutsEnabled) {
      return NextResponse.json({
        message: 'Account already onboarded',
        status,
      });
    }

    // Create onboarding link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const accountLink = await createAccountLink(
      stripeAccountId,
      `${baseUrl}/provider/onboarding/complete`,
      `${baseUrl}/provider/onboarding/refresh`
    );

    return NextResponse.json({
      url: accountLink.url,
      accountId: stripeAccountId,
    });
  } catch (error) {
    console.error('Connect onboarding error:', error);
    return NextResponse.json(
      { error: 'Failed to create onboarding link' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get provider's Stripe account
    const { data: provider } = await supabase
      .from('service_providers')
      .select('stripe_account_id')
      .eq('owner_id', user.id)
      .single();

    if (!provider?.stripe_account_id) {
      return NextResponse.json({
        connected: false,
        status: null,
      });
    }

    const status = await getAccountStatus(provider.stripe_account_id);

    return NextResponse.json({
      connected: true,
      status,
    });
  } catch (error) {
    console.error('Connect status error:', error);
    return NextResponse.json(
      { error: 'Failed to get status' },
      { status: 500 }
    );
  }
}
