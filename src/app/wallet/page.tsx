import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Navigation } from '@/components/layout/Navigation';
import { WalletStats } from '@/components/WalletStats';
import { Card, Badge, Button } from '@/components/ui';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle } from 'lucide-react';

export default async function WalletPage() {
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

  // Get wallet
  const { data: wallet } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // Get referral code for referral count
  const { data: referralCode } = await supabase
    .from('referral_codes')
    .select('times_used')
    .eq('referrer_id', user.id)
    .single();

  // Get wallet transactions
  const { data: walletTransactions } = await supabase
    .from('wallet_transactions')
    .select('*')
    .eq('wallet_id', wallet?.id)
    .order('created_at', { ascending: false })
    .limit(20);

  // Get payouts
  const { data: payouts } = await supabase
    .from('payouts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
      case 'processing':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
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
            <h1 className="text-3xl font-bold text-surface-900">Wallet</h1>
            <p className="text-surface-600 mt-1">
              Manage your earnings and payouts
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Wallet Stats */}
            <div className="lg:col-span-2">
              <WalletStats
                availableBalance={wallet?.available_balance || 0}
                pendingBalance={wallet?.pending_balance || 0}
                totalEarned={wallet?.total_earned || 0}
                totalWithdrawn={wallet?.total_withdrawn || 0}
                referralCount={referralCode?.times_used || 0}
              />

              {/* Transaction History */}
              <Card variant="bordered" padding="none" className="mt-8">
                <div className="p-4 border-b border-surface-200">
                  <h3 className="font-semibold text-surface-900">
                    Transaction History
                  </h3>
                </div>
                {walletTransactions && walletTransactions.length > 0 ? (
                  <div className="divide-y divide-surface-200">
                    {walletTransactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              tx.amount > 0
                                ? 'bg-green-50'
                                : 'bg-red-50'
                            }`}
                          >
                            {tx.amount > 0 ? (
                              <ArrowDownLeft className="w-5 h-5 text-green-600" />
                            ) : (
                              <ArrowUpRight className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-surface-900">
                              {tx.transaction_type === 'referral_commission'
                                ? 'Referral Commission'
                                : tx.transaction_type === 'payout'
                                ? 'Withdrawal'
                                : tx.description || 'Transaction'}
                            </p>
                            <p className="text-sm text-surface-500">
                              {formatDateTime(tx.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-semibold ${
                              tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {tx.amount > 0 ? '+' : ''}
                            {formatCurrency(tx.amount)}
                          </p>
                          <p className="text-xs text-surface-500">
                            Balance: {formatCurrency(tx.balance_after)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-surface-500">No transactions yet</p>
                  </div>
                )}
              </Card>
            </div>

            {/* Payouts Sidebar */}
            <div>
              <Card variant="bordered" padding="none">
                <div className="p-4 border-b border-surface-200">
                  <h3 className="font-semibold text-surface-900">
                    Payout History
                  </h3>
                </div>
                {payouts && payouts.length > 0 ? (
                  <div className="divide-y divide-surface-200">
                    {payouts.map((payout) => (
                      <div key={payout.id} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-surface-900">
                            {formatCurrency(payout.amount)}
                          </p>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(payout.status)}
                            <Badge
                              variant={
                                payout.status === 'completed'
                                  ? 'success'
                                  : payout.status === 'failed'
                                  ? 'danger'
                                  : 'warning'
                              }
                              size="sm"
                            >
                              {payout.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-surface-500">
                          {formatDateTime(payout.created_at)}
                        </p>
                        {payout.failure_reason && (
                          <p className="text-sm text-red-500 mt-1">
                            {payout.failure_reason}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-surface-500">No payouts yet</p>
                  </div>
                )}
              </Card>

              {/* Payout Info */}
              <Card variant="bordered" className="mt-6 p-4">
                <h4 className="font-medium text-surface-900 mb-2">
                  Payout Information
                </h4>
                <ul className="space-y-2 text-sm text-surface-600">
                  <li>• Minimum withdrawal: {formatCurrency(1000)}</li>
                  <li>• Payouts are processed within 2-3 business days</li>
                  <li>• Funds are sent directly to your linked bank account</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
