import { redirect, notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Gift, ArrowRight, User, Store } from 'lucide-react';
import { Button, Card } from '@/components/ui';

interface Props {
  params: { code: string };
}

export default async function ReferralPage({ params }: Props) {
  const { code } = params;

  const supabase = createServerSupabaseClient();

  // Validate the referral code
  const { data: referralCode, error } = await supabase
    .from('referral_codes')
    .select(`
      *,
      referrer:profiles(id, full_name, avatar_url)
    `)
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single();

  if (error || !referralCode) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-accent-50">
      {/* Header */}
      <nav className="p-4">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/25">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <span className="text-xl font-bold text-surface-900">Refer</span>
        </Link>
      </nav>

      <main className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Referral Card */}
          <Card variant="elevated" className="p-8 text-center">
            {/* Gift Icon */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/25">
              <Gift className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-2xl font-bold text-surface-900 mb-2">
              You've Been Referred!
            </h1>
            <p className="text-surface-600 mb-6">
              Get <span className="font-semibold text-green-600">5% off</span> your first visit
              at any participating business
            </p>

            {/* Referrer Info */}
            <div className="flex items-center justify-center gap-3 p-4 bg-surface-50 rounded-xl mb-6">
              <div className="w-12 h-12 rounded-full bg-surface-200 flex items-center justify-center overflow-hidden">
                {referralCode.referrer?.avatar_url ? (
                  <img
                    src={referralCode.referrer.avatar_url}
                    alt={referralCode.referrer.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-surface-400" />
                )}
              </div>
              <div className="text-left">
                <p className="text-sm text-surface-500">Referred by</p>
                <p className="font-semibold text-surface-900">
                  {referralCode.referrer?.full_name || 'A friend'}
                </p>
              </div>
            </div>

            {/* Referral Code */}
            <div className="mb-8">
              <p className="text-sm text-surface-500 mb-2">Your referral code</p>
              <p className="text-3xl font-bold tracking-widest text-surface-900 font-mono">
                {code.toUpperCase()}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link href="/explore" className="block">
                <Button size="lg" className="w-full">
                  <Store className="w-5 h-5 mr-2" />
                  Find Services Near Me
                </Button>
              </Link>

              <Link href="/auth/signup" className="block">
                <Button variant="outline" size="lg" className="w-full">
                  Create an Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Note */}
            <p className="mt-6 text-sm text-surface-500">
              Show this code when you visit to claim your discount
            </p>
          </Card>

          {/* How it works */}
          <div className="mt-8 text-center">
            <h2 className="font-semibold text-surface-900 mb-4">
              How It Works
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { step: '1', text: 'Show this code' },
                { step: '2', text: 'Get 5% off' },
                { step: '3', text: 'Enjoy your service' },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mx-auto mb-2 font-semibold">
                    {item.step}
                  </div>
                  <p className="text-sm text-surface-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
