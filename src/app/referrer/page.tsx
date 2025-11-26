import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Navigation } from '@/components/layout/Navigation';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';
import { TrendingUp, Users, DollarSign, Clock } from 'lucide-react';

export default async function ReferrerPage() {
  const supabase = await createServerSupabaseClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    redirect('/auth/login');
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile || !['referrer', 'provider'].includes(profile.role)) {
    redirect('/dashboard');
  }

  // Get referral code
  const { data: referralCode } = await supabase
    .from('referral_codes')
    .select('*')
    .eq('referrer_id', user.id)
    .eq('is_active', true)
    .single();

  // Get wallet data
  const { data: wallet } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // Get recent referral transactions
  const { data: recentReferrals } = await supabase
    .from('transactions')
    .select(`
      *,
      provider:service_providers(business_name),
      client:profiles!transactions_client_id_fkey(full_name)
    `)
    .eq('referrer_id', user.id)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(10);

  const stats = [
    {
      label: 'Total Earned',
      value: formatCurrency(wallet?.total_earned || 0),
      icon: DollarSign,
      color: 'green',
    },
    {
      label: 'Available',
      value: formatCurrency(wallet?.available_balance || 0),
      icon: TrendingUp,
      color: 'brand',
    },
    {
      label: 'Referrals',
      value: referralCode?.times_used?.toString() || '0',
      icon: Users,
      color: 'accent',
    },
    {
      label: 'Pending',
      value: formatCurrency(wallet?.pending_balance || 0),
      icon: Clock,
      color: 'amber',
    },
  ];

  return (
    <div className="min-h-screen bg-surface-50">
      <Navigation
        userRole={profile.role}
        userName={profile.full_name || profile.email}
        userAvatar={profile.avatar_url || undefined}
      />

      <main className="lg:pl-64 pt-16 lg:pt-0 pb-24 lg:pb-8">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-surface-900">
              Your Referral Code
            </h1>
            <p className="text-surface-600 mt-1">
              Share this code to earn commissions on first-time visits
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* QR Code Section */}
            <div>
              <Card variant="elevated" className="p-8">
                {referralCode ? (
                  <QRCodeDisplay
                    code={referralCode.code}
                    referrerName={profile.full_name || undefined}
                  />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-surface-500">
                      No referral code found. Please contact support.
                    </p>
                  </div>
                )}
              </Card>

              {/* How it works */}
              <Card variant="bordered" className="mt-6 p-6">
                <h3 className="font-semibold text-surface-900 mb-4">
                  How It Works
                </h3>
                <ol className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-sm font-medium">
                      1
                    </span>
                    <p className="text-surface-600">
                      Share your QR code with friends, family, or anyone looking for services
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-sm font-medium">
                      2
                    </span>
                    <p className="text-surface-600">
                      They scan your code at any participating business for their first visit
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-sm font-medium">
                      3
                    </span>
                    <p className="text-surface-600">
                      They get a discount, and you earn a commission instantly!
                    </p>
                  </li>
                </ol>
              </Card>
            </div>

            {/* Stats and History */}
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat) => (
                  <Card key={stat.label} variant="bordered" padding="md">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-${stat.color}-50 flex items-center justify-center`}>
                        <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-surface-900">
                      {stat.value}
                    </p>
                    <p className="text-sm text-surface-500">{stat.label}</p>
                  </Card>
                ))}
              </div>

              {/* Recent Referrals */}
              <Card variant="bordered" padding="none">
                <div className="p-4 border-b border-surface-200">
                  <h3 className="font-semibold text-surface-900">
                    Recent Referrals
                  </h3>
                </div>
                {recentReferrals && recentReferrals.length > 0 ? (
                  <div className="divide-y divide-surface-200">
                    {recentReferrals.map((referral) => (
                      <div
                        key={referral.id}
                        className="p-4 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium text-surface-900">
                            {referral.provider?.business_name || 'Unknown Business'}
                          </p>
                          <p className="text-sm text-surface-500">
                            {formatDate(referral.created_at)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">
                            +{formatCurrency(referral.referrer_commission)}
                          </p>
                          <Badge variant="success" size="sm">
                            Earned
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Users className="w-12 h-12 text-surface-300 mx-auto mb-3" />
                    <p className="text-surface-500">
                      No referrals yet. Share your code to start earning!
                    </p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
