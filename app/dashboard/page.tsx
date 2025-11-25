import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Navigation } from '@/components/layout/Navigation';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';
import { TrendingUp, Users, DollarSign, Activity, QrCode, Store, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/auth/login');
  }

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // If no profile exists, create a default one
  if (!profile) {
    console.error('Profile error:', profileError);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Setting up your profile...</h1>
          <p className="text-surface-600">Please wait while we create your profile.</p>
          <p className="text-sm text-red-600 mt-4">Error: {profileError?.message || 'Profile not found'}</p>
        </div>
      </div>
    );
  }

  // Get role-specific data
  let stats = {
    totalEarnings: 0,
    totalTransactions: 0,
    pendingBalance: 0,
    referralCount: 0,
  };

  let recentTransactions: any[] = [];

  if (profile.role === 'referrer' || profile.role === 'provider') {
    // Get wallet data
    const { data: wallet } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (wallet) {
      stats.totalEarnings = wallet.total_earned;
      stats.pendingBalance = wallet.pending_balance;
    }

    // Get referral code stats
    const { data: referralCode } = await supabase
      .from('referral_codes')
      .select('times_used, total_earnings')
      .eq('referrer_id', user.id)
      .single();

    if (referralCode) {
      stats.referralCount = referralCode.times_used;
    }
  }

  if (profile.role === 'provider') {
    // Get provider stats
    const { data: provider } = await supabase
      .from('service_providers')
      .select('total_transactions, total_revenue')
      .eq('owner_id', user.id)
      .single();

    if (provider) {
      stats.totalTransactions = provider.total_transactions;
      stats.totalEarnings = provider.total_revenue;
    }

    // Get recent transactions
    const { data: transactions } = await supabase
      .from('transactions')
      .select(`
        *,
        client:profiles!transactions_client_id_fkey(full_name),
        referrer:profiles!transactions_referrer_id_fkey(full_name)
      `)
      .eq('provider_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    recentTransactions = transactions || [];
  }

  const quickActions = {
    referrer: [
      { label: 'View QR Code', href: '/referrer', icon: QrCode },
      { label: 'Wallet', href: '/wallet', icon: DollarSign },
    ],
    provider: [
      { label: 'Scan Code', href: '/scan', icon: QrCode },
      { label: 'My Business', href: '/provider', icon: Store },
      { label: 'Wallet', href: '/wallet', icon: DollarSign },
    ],
    client: [
      { label: 'Find Services', href: '/explore', icon: Store },
    ],
  };

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
              Welcome back, {profile.full_name?.split(' ')[0] || 'there'}!
            </h1>
            <p className="text-surface-600 mt-1">
              Here's what's happening with your account
            </p>
          </div>

          {/* Stats Grid */}
          {(profile.role === 'referrer' || profile.role === 'provider') && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card variant="bordered" padding="md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-surface-900">
                  {formatCurrency(stats.totalEarnings)}
                </p>
                <p className="text-sm text-surface-500">Total Earnings</p>
              </Card>

              <Card variant="bordered" padding="md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                    <Users className="w-5 h-5 text-brand-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-surface-900">
                  {stats.referralCount}
                </p>
                <p className="text-sm text-surface-500">Referrals</p>
              </Card>

              <Card variant="bordered" padding="md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-accent-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-surface-900">
                  {stats.totalTransactions}
                </p>
                <p className="text-sm text-surface-500">Transactions</p>
              </Card>

              <Card variant="bordered" padding="md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-amber-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-surface-900">
                  {formatCurrency(stats.pendingBalance)}
                </p>
                <p className="text-sm text-surface-500">Pending</p>
              </Card>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-surface-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions[profile.role as keyof typeof quickActions]?.map((action) => (
                <Link key={action.href} href={action.href}>
                  <Card
                    variant="bordered"
                    padding="md"
                    className="hover:border-brand-300 hover:bg-brand-50/50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-surface-100 group-hover:bg-brand-100 flex items-center justify-center transition-colors">
                          <action.icon className="w-5 h-5 text-surface-600 group-hover:text-brand-600" />
                        </div>
                        <span className="font-medium text-surface-900">
                          {action.label}
                        </span>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-surface-400 group-hover:text-brand-500 transition-colors" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Transactions (for providers) */}
          {profile.role === 'provider' && recentTransactions.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-surface-900">
                  Recent Transactions
                </h2>
                <Link
                  href="/provider/transactions"
                  className="text-sm text-brand-600 hover:text-brand-700"
                >
                  View all
                </Link>
              </div>
              <Card variant="bordered" padding="none">
                <div className="divide-y divide-surface-200">
                  {recentTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-surface-900">
                          {tx.client?.full_name || 'Anonymous'}
                        </p>
                        <p className="text-sm text-surface-500">
                          {formatDate(tx.created_at)}
                          {tx.is_first_interaction && (
                            <Badge variant="success" size="sm" className="ml-2">
                              Referral
                            </Badge>
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-surface-900">
                          {formatCurrency(tx.provider_payout)}
                        </p>
                        <Badge
                          variant={tx.status === 'completed' ? 'success' : 'warning'}
                          size="sm"
                        >
                          {tx.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
