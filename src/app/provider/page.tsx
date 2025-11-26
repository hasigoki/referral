import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Navigation } from '@/components/layout/Navigation';
import { Card, Badge, Button } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import {
  Store,
  Settings,
  DollarSign,
  Users,
  TrendingUp,
  MapPin,
  Phone,
  Globe,
  CreditCard,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export default async function ProviderPage() {
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

  if (!profile || profile.role !== 'provider') {
    redirect('/dashboard');
  }

  // Get service provider data
  const { data: provider } = await supabase
    .from('service_providers')
    .select('*')
    .eq('owner_id', user.id)
    .single();

  if (!provider) {
    redirect('/dashboard');
  }

  // Get recent transactions
  const { data: recentTransactions } = await supabase
    .from('transactions')
    .select(`
      *,
      client:profiles!transactions_client_id_fkey(full_name, email),
      referrer:profiles!transactions_referrer_id_fkey(full_name)
    `)
    .eq('provider_id', provider.id)
    .order('created_at', { ascending: false })
    .limit(10);

  const categoryLabels: Record<string, string> = {
    barber: 'Barber Shop',
    salon: 'Salon',
    restaurant: 'Restaurant',
    mechanic: 'Auto Mechanic',
    car_sales: 'Car Dealership',
    retail: 'Retail Store',
    health: 'Health Services',
    fitness: 'Fitness Center',
    beauty: 'Beauty Services',
    home_services: 'Home Services',
    professional: 'Professional Services',
    other: 'Other',
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-surface-900">
                {provider.business_name}
              </h1>
              <p className="text-surface-600 mt-1">
                Manage your business settings and view analytics
              </p>
            </div>
            <Link href="/provider/settings">
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Edit Business
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card variant="bordered" padding="md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-surface-900">
                {formatCurrency(provider.total_revenue || 0)}
              </p>
              <p className="text-sm text-surface-500">Total Revenue</p>
            </Card>

            <Card variant="bordered" padding="md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                  <Users className="w-5 h-5 text-brand-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-surface-900">
                {provider.total_transactions || 0}
              </p>
              <p className="text-sm text-surface-500">Transactions</p>
            </Card>

            <Card variant="bordered" padding="md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-accent-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-surface-900">
                {provider.client_discount_percent}%
              </p>
              <p className="text-sm text-surface-500">Client Discount</p>
            </Card>

            <Card variant="bordered" padding="md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-amber-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-surface-900">
                {provider.referrer_commission_percent}%
              </p>
              <p className="text-sm text-surface-500">Referrer Commission</p>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Business Info */}
            <div className="lg:col-span-1 space-y-6">
              <Card variant="bordered" padding="lg">
                <h3 className="font-semibold text-surface-900 mb-4 flex items-center gap-2">
                  <Store className="w-5 h-5" />
                  Business Info
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-surface-500">Category</p>
                    <p className="font-medium text-surface-900">
                      {categoryLabels[provider.category] || provider.category}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-surface-500">Base Service Price</p>
                    <p className="font-medium text-surface-900">
                      {formatCurrency(provider.base_service_price)}
                    </p>
                  </div>

                  {provider.description && (
                    <div>
                      <p className="text-sm text-surface-500">Description</p>
                      <p className="font-medium text-surface-900">
                        {provider.description}
                      </p>
                    </div>
                  )}

                  {(provider.address || provider.city) && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-surface-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-surface-500">Location</p>
                        <p className="font-medium text-surface-900">
                          {[provider.address, provider.city, provider.state].filter(Boolean).join(', ')}
                        </p>
                      </div>
                    </div>
                  )}

                  {provider.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-surface-400" />
                      <p className="text-surface-700">{provider.phone}</p>
                    </div>
                  )}

                  {provider.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-surface-400" />
                      <a
                        href={provider.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-600 hover:text-brand-700 flex items-center gap-1"
                      >
                        Website
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </Card>

              {/* Stripe Status */}
              <Card variant="bordered" padding="lg">
                <h3 className="font-semibold text-surface-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Status
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-surface-600">Stripe Account</span>
                    {provider.stripe_account_id ? (
                      <Badge variant="success" size="sm">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Connected
                      </Badge>
                    ) : (
                      <Badge variant="warning" size="sm">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Not Connected
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-surface-600">Payouts</span>
                    {provider.payouts_enabled ? (
                      <Badge variant="success" size="sm">Enabled</Badge>
                    ) : (
                      <Badge variant="default" size="sm">Disabled</Badge>
                    )}
                  </div>

                  {!provider.stripe_account_id && (
                    <Link href="/api/connect/onboard" className="block mt-4">
                      <Button className="w-full">
                        Connect Stripe Account
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            </div>

            {/* Recent Transactions */}
            <div className="lg:col-span-2">
              <Card variant="bordered" padding="none">
                <div className="p-4 border-b border-surface-200 flex items-center justify-between">
                  <h3 className="font-semibold text-surface-900">
                    Recent Transactions
                  </h3>
                  <Link
                    href="/provider/transactions"
                    className="text-sm text-brand-600 hover:text-brand-700"
                  >
                    View All
                  </Link>
                </div>

                {recentTransactions && recentTransactions.length > 0 ? (
                  <div className="divide-y divide-surface-200">
                    {recentTransactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="p-4 flex items-center justify-between hover:bg-surface-50"
                      >
                        <div>
                          <p className="font-medium text-surface-900">
                            {tx.client?.full_name || tx.client?.email || 'Anonymous'}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-surface-500">
                              {new Date(tx.created_at).toLocaleDateString()}
                            </p>
                            {tx.is_first_interaction && (
                              <Badge variant="success" size="sm">Referral</Badge>
                            )}
                            {tx.referrer && (
                              <span className="text-xs text-surface-400">
                                via {tx.referrer.full_name}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-surface-900">
                            {formatCurrency(tx.provider_payout)}
                          </p>
                          <Badge
                            variant={
                              tx.status === 'completed' ? 'success' :
                              tx.status === 'failed' ? 'error' : 'warning'
                            }
                            size="sm"
                          >
                            {tx.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Users className="w-12 h-12 text-surface-300 mx-auto mb-3" />
                    <p className="text-surface-500">
                      No transactions yet. Share your business or scan referral codes to get started!
                    </p>
                    <Link href="/scan" className="inline-block mt-4">
                      <Button>
                        Scan a Code
                      </Button>
                    </Link>
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
