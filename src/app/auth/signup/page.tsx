'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, User, Store, TrendingUp } from 'lucide-react';
import { Button, Input, Card } from '@/components/ui';
import { getSupabaseClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/types';

const roles = [
  {
    id: 'client' as UserRole,
    title: 'Client',
    description: 'Get discounts on first visits',
    icon: User,
    color: 'green',
  },
  {
    id: 'referrer' as UserRole,
    title: 'Referrer',
    description: 'Earn by sharing your code',
    icon: TrendingUp,
    color: 'brand',
  },
  {
    id: 'provider' as UserRole,
    title: 'Business',
    description: 'Acquire new customers',
    icon: Store,
    color: 'accent',
  },
];

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role') as UserRole || 'referrer';

  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = getSupabaseClient();

      // Sign up
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: selectedRole,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase.from('profiles').insert({
          id: authData.user.id,
          email,
          full_name: fullName,
          role: selectedRole,
        });

        if (profileError) throw profileError;

        // If provider, create service provider record
        if (selectedRole === 'provider' && businessName) {
          const { error: providerError } = await supabase
            .from('service_providers')
            .insert({
              owner_id: authData.user.id,
              business_name: businessName,
              category: 'other',
              base_service_price: 3000, // Default $30
            });

          if (providerError) throw providerError;
        }

        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/25">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-bold text-surface-900">Refer</span>
          </Link>

          <h1 className="text-3xl font-bold text-surface-900 mb-2">
            Create your account
          </h1>
          <p className="text-surface-600 mb-8">
            {step === 1 ? 'How do you want to use Refer?' : 'Complete your profile'}
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
            >
              {error}
            </motion.div>
          )}

          {step === 1 ? (
            <div className="space-y-4">
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={cn(
                    'w-full p-5 rounded-2xl border-2 transition-all text-left',
                    selectedRole === role.id
                      ? `border-${role.color}-400 bg-${role.color}-50`
                      : 'border-surface-200 hover:border-surface-300 bg-white'
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center',
                        selectedRole === role.id
                          ? `bg-${role.color}-500 text-white`
                          : 'bg-surface-100 text-surface-500'
                      )}
                    >
                      <role.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-surface-900">
                        {role.title}
                      </h3>
                      <p className="text-sm text-surface-500">{role.description}</p>
                    </div>
                  </div>
                </button>
              ))}

              <Button
                type="button"
                className="w-full mt-6"
                size="lg"
                onClick={() => setStep(2)}
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Full Name"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              {selectedRole === 'provider' && (
                <Input
                  label="Business Name"
                  placeholder="Joe's Barber Shop"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
              )}

              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  hint="At least 8 characters"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[38px] text-surface-400 hover:text-surface-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  size="lg"
                  loading={loading}
                >
                  Create Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </form>
          )}

          <p className="mt-8 text-center text-surface-600">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="text-brand-600 hover:text-brand-700 font-medium"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right side - Decorative */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-accent-500 to-accent-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-brand-400/20 rounded-full blur-3xl" />
        </div>

        <div className="relative flex items-center justify-center w-full p-12">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">
              Join the Community
            </h2>
            <p className="text-xl text-white/80 max-w-md">
              Whether you're a client, referrer, or business - there's a place for you
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
