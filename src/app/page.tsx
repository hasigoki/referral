import Link from 'next/link';
import { ArrowRight, Gift, TrendingUp, Store, Users, Sparkles, Check } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/25">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-bold text-surface-900">Refer</span>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/auth/login"
                className="text-surface-600 hover:text-surface-900 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="px-5 py-2.5 bg-brand-500 text-white font-medium rounded-xl shadow-lg shadow-brand-500/25 hover:bg-brand-600 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 rounded-full text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              The future of word-of-mouth marketing
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-surface-900 leading-tight mb-6">
              Share. Save.{' '}
              <span className="gradient-text">Earn.</span>
            </h1>

            <p className="text-xl text-surface-600 mb-10 max-w-2xl mx-auto">
              Get discounts on your first visit. Grow your business with new clients.
              Earn passive income by simply sharing your code.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/signup"
                className="w-full sm:w-auto px-8 py-4 bg-brand-500 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/25 hover:bg-brand-600 transition-all hover:shadow-brand-500/40 flex items-center justify-center gap-2"
              >
                Start Earning Today
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/auth/signup?role=provider"
                className="w-full sm:w-auto px-8 py-4 bg-white text-surface-900 font-semibold rounded-xl border-2 border-surface-200 hover:border-surface-300 transition-colors flex items-center justify-center gap-2"
              >
                <Store className="w-5 h-5" />
                List Your Business
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '$2M+', label: 'Paid to Referrers' },
              { value: '50K+', label: 'Active Users' },
              { value: '3,000+', label: 'Businesses' },
              { value: '98%', label: 'Satisfaction' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold text-surface-900">{stat.value}</p>
                <p className="text-surface-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-surface-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-surface-600">
              Three simple roles, one powerful ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Client */}
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
              <div className="w-14 h-14 rounded-2xl bg-green-500 flex items-center justify-center mb-6 shadow-lg shadow-green-500/25">
                <Gift className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-surface-900 mb-3">
                New Clients
              </h3>
              <p className="text-surface-600 mb-6">
                Scan a referral code and get an instant discount on your first visit
                to any participating business.
              </p>
              <ul className="space-y-3">
                {['5% off first purchase', 'Works everywhere', 'No signup required'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-surface-700">
                    <Check className="w-5 h-5 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Referrer */}
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-brand-50 to-amber-50 border border-brand-100">
              <div className="w-14 h-14 rounded-2xl bg-brand-500 flex items-center justify-center mb-6 shadow-lg shadow-brand-500/25">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-surface-900 mb-3">
                Referrers
              </h3>
              <p className="text-surface-600 mb-6">
                Share your unique QR code and earn a commission every time someone
                uses it for their first visit.
              </p>
              <ul className="space-y-3">
                {['8% commission per referral', 'Passive income stream', 'Instant payouts'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-surface-700">
                    <Check className="w-5 h-5 text-brand-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Provider */}
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-accent-50 to-teal-50 border border-accent-100">
              <div className="w-14 h-14 rounded-2xl bg-accent-500 flex items-center justify-center mb-6 shadow-lg shadow-accent-500/25">
                <Store className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-surface-900 mb-3">
                Businesses
              </h3>
              <p className="text-surface-600 mb-6">
                Acquire new customers through word-of-mouth. Only pay when you
                get a new paying customer.
              </p>
              <ul className="space-y-3">
                {['Acquire new customers', 'Pay only for results', 'Instant settlements'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-surface-700">
                    <Check className="w-5 h-5 text-accent-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-surface-900 mb-4">
              Works Everywhere
            </h2>
            <p className="text-xl text-surface-600">
              From haircuts to car sales, any business can join
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              'Barber Shops',
              'Restaurants',
              'Auto Mechanics',
              'Car Dealerships',
              'Salons',
              'Fitness Centers',
              'Spas',
              'Retail Stores',
              'Professional Services',
              'Home Services',
            ].map((category) => (
              <span
                key={category}
                className="px-5 py-2.5 bg-white rounded-full text-surface-700 font-medium border border-surface-200 hover:border-brand-300 hover:bg-brand-50 transition-colors cursor-default"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-12 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-600 text-white text-center overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2" />

            <div className="relative">
              <h2 className="text-4xl font-bold mb-4">
                Ready to Start Earning?
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-xl mx-auto">
                Join thousands of people already earning passive income through referrals.
              </p>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-600 font-semibold rounded-xl hover:bg-surface-100 transition-colors"
              >
                Create Your Account
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-surface-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="font-bold text-surface-900">Refer</span>
            </div>

            <div className="flex items-center gap-8 text-sm text-surface-500">
              <Link href="/about" className="hover:text-surface-900 transition-colors">
                About
              </Link>
              <Link href="/terms" className="hover:text-surface-900 transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-surface-900 transition-colors">
                Privacy
              </Link>
              <Link href="/contact" className="hover:text-surface-900 transition-colors">
                Contact
              </Link>
            </div>

            <p className="text-sm text-surface-500">
              © 2024 Refer. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
