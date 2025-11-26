import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const providerId = searchParams.get('providerId');

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Find the referral code
    const { data: referralCode, error } = await supabase
      .from('referral_codes')
      .select(`
        id,
        code,
        is_active,
        referrer:profiles (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('code', code.toUpperCase())
      .single();

    if (error || !referralCode) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid referral code',
      });
    }

    if (!referralCode.is_active) {
      return NextResponse.json({
        valid: false,
        error: 'This referral code is no longer active',
      });
    }

    // Check if user is trying to use their own code
    if (user && referralCode.referrer?.id === user.id) {
      return NextResponse.json({
        valid: false,
        error: 'You cannot use your own referral code',
      });
    }

    // If provider specified, check if already used for this provider
    if (user && providerId) {
      const { data: existingUse } = await supabase
        .from('referral_code_uses')
        .select('id')
        .eq('referral_code_id', referralCode.id)
        .eq('client_id', user.id)
        .eq('provider_id', providerId)
        .single();

      if (existingUse) {
        return NextResponse.json({
          valid: false,
          error: 'You have already used this code with this provider',
        });
      }
    }

    return NextResponse.json({
      valid: true,
      code: referralCode.code,
      referrer: {
        id: referralCode.referrer?.id,
        name: referralCode.referrer?.full_name,
        avatar: referralCode.referrer?.avatar_url,
      },
    });
  } catch (error) {
    console.error('Referral code validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate code' },
      { status: 500 }
    );
  }
}
