import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Navigation } from '@/components/layout/Navigation';
import { Card, Badge, Input } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import {
  Search,
  MapPin,
  Star,
  Store,
  Scissors,
  UtensilsCrossed,
  Wrench,
  Car,
  ShoppingBag,
  Heart,
  Dumbbell,
  Sparkles,
  Home,
  Briefcase,
  Grid,
} from 'lucide-react';

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  barber: Scissors,
  salon: Sparkles,
  restaurant: UtensilsCrossed,
  mechanic: Wrench,
  car_sales: Car,
  retail: ShoppingBag,
  health: Heart,
  fitness: Dumbbell,
  beauty: Sparkles,
  home_services: Home,
  professional: Briefcase,
  other: Store,
};

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

const categoryColors: Record<string, string> = {
  barber: 'bg-blue-50 text-blue-600',
  salon: 'bg-pink-50 text-pink-600',
  restaurant: 'bg-orange-50 text-orange-600',
  mechanic: 'bg-slate-50 text-slate-600',
  car_sales: 'bg-indigo-50 text-indigo-600',
  retail: 'bg-emerald-50 text-emerald-600',
  health: 'bg-red-50 text-red-600',
  fitness: 'bg-purple-50 text-purple-600',
  beauty: 'bg-rose-50 text-rose-600',
  home_services: 'bg-amber-50 text-amber-600',
  professional: 'bg-cyan-50 text-cyan-600',
  other: 'bg-gray-50 text-gray-600',
};

export default async function ExplorePage() {
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

  if (!profile) {
    redirect('/auth/login');
  }

  // Get all active service providers
  const { data: providers } = await supabase
    .from('service_providers')
    .select('*')
    .eq('is_active', true)
    .order('total_transactions', { ascending: false });

  // Get category counts
  const categories = Object.keys(categoryLabels);
  const categoryCounts: Record<string, number> = {};

  if (providers) {
    providers.forEach((provider) => {
      categoryCounts[provider.category] = (categoryCounts[provider.category] || 0) + 1;
    });
  }

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
              Explore Businesses
            </h1>
            <p className="text-surface-600 mt-1">
              Find participating businesses and get discounts on your first visit
            </p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type="text"
                placeholder="Search businesses..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-surface-900 mb-4">
              Categories
            </h2>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-brand-500 text-white rounded-full text-sm font-medium">
                <Grid className="w-4 h-4 inline mr-2" />
                All ({providers?.length || 0})
              </button>
              {categories.map((cat) => {
                const Icon = categoryIcons[cat] || Store;
                const count = categoryCounts[cat] || 0;
                if (count === 0) return null;
                return (
                  <button
                    key={cat}
                    className="px-4 py-2 bg-white border border-surface-200 rounded-full text-sm font-medium text-surface-700 hover:border-brand-300 hover:bg-brand-50 transition-colors"
                  >
                    <Icon className="w-4 h-4 inline mr-2" />
                    {categoryLabels[cat]} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Business Grid */}
          {providers && providers.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map((provider) => {
                const Icon = categoryIcons[provider.category] || Store;
                const colorClass = categoryColors[provider.category] || categoryColors.other;

                return (
                  <Card
                    key={provider.id}
                    variant="bordered"
                    padding="none"
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Cover Image / Placeholder */}
                    <div className="h-32 bg-gradient-to-br from-surface-100 to-surface-200 relative">
                      {provider.cover_image_url ? (
                        <img
                          src={provider.cover_image_url}
                          alt={provider.business_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Icon className="w-12 h-12 text-surface-300" />
                        </div>
                      )}
                      {/* Discount Badge */}
                      <div className="absolute top-3 right-3">
                        <Badge variant="success" size="sm">
                          {provider.client_discount_percent}% OFF
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4">
                      {/* Logo & Name */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                          {provider.logo_url ? (
                            <img
                              src={provider.logo_url}
                              alt=""
                              className="w-8 h-8 rounded-lg object-cover"
                            />
                          ) : (
                            <Icon className="w-6 h-6" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-surface-900 truncate">
                            {provider.business_name}
                          </h3>
                          <p className="text-sm text-surface-500">
                            {categoryLabels[provider.category]}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      {provider.description && (
                        <p className="text-sm text-surface-600 mb-3 line-clamp-2">
                          {provider.description}
                        </p>
                      )}

                      {/* Location */}
                      {(provider.city || provider.state) && (
                        <div className="flex items-center gap-1 text-sm text-surface-500 mb-3">
                          <MapPin className="w-4 h-4" />
                          {[provider.city, provider.state].filter(Boolean).join(', ')}
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center justify-between pt-3 border-t border-surface-100">
                        <div className="text-sm">
                          <span className="text-surface-500">Starting at </span>
                          <span className="font-semibold text-surface-900">
                            {formatCurrency(provider.base_service_price)}
                          </span>
                        </div>
                        {provider.average_rating && (
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span className="font-medium text-surface-900">
                              {provider.average_rating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card variant="bordered" padding="lg" className="text-center">
              <Store className="w-16 h-16 text-surface-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-surface-900 mb-2">
                No businesses yet
              </h3>
              <p className="text-surface-600 max-w-md mx-auto">
                Be the first to list your business and start acquiring new customers through referrals!
              </p>
              <Link href="/auth/signup?role=provider" className="inline-block mt-4">
                <button className="px-6 py-3 bg-brand-500 text-white font-medium rounded-xl hover:bg-brand-600 transition-colors">
                  List Your Business
                </button>
              </Link>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
