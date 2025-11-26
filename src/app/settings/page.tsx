'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/layout/Navigation';
import { Card, Button, Input } from '@/components/ui';
import { getSupabaseClient } from '@/lib/supabase/client';
import {
  User,
  Mail,
  Phone,
  Camera,
  Shield,
  Bell,
  CreditCard,
  Loader2,
  Save,
  Check,
} from 'lucide-react';
import type { Profile } from '@/types';

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    async function loadProfile() {
      const supabase = getSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/login');
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        setFullName(profileData.full_name || '');
        setPhone(profileData.phone || '');
      }
      setLoading(false);
    }

    loadProfile();
  }, [router]);

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    setError(null);

    try {
      const supabase = getSupabaseClient();
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone: phone || null,
        })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, full_name: fullName, phone });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <Navigation
        userRole={profile.role}
        userName={profile.full_name || profile.email}
        userAvatar={profile.avatar_url || undefined}
      />

      <main className="lg:pl-64 pt-16 lg:pt-0 pb-24 lg:pb-8">
        <div className="p-6 lg:p-8 max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-surface-900">Settings</h1>
            <p className="text-surface-600 mt-1">
              Manage your account preferences
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Profile Section */}
          <Card variant="bordered" padding="lg" className="mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                <User className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <h2 className="font-semibold text-surface-900">Profile</h2>
                <p className="text-sm text-surface-500">
                  Your personal information
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-surface-200 flex items-center justify-center overflow-hidden">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name || 'Avatar'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-surface-400" />
                  )}
                </div>
                <button className="px-4 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50 rounded-lg transition-colors flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Change Photo
                </button>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Full Name
                </label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                />
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Email
                </label>
                <div className="flex items-center gap-3 px-4 py-3 bg-surface-100 rounded-xl text-surface-600">
                  <Mail className="w-5 h-5" />
                  {profile.email}
                </div>
                <p className="text-xs text-surface-500 mt-1">
                  Contact support to change your email
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Phone Number
                </label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  type="tel"
                />
              </div>

              {/* Role Badge */}
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Account Type
                </label>
                <span className="inline-flex items-center px-3 py-1.5 bg-brand-50 text-brand-700 rounded-lg text-sm font-medium capitalize">
                  {profile.role}
                </span>
              </div>
            </div>
          </Card>

          {/* Security Section */}
          <Card variant="bordered" padding="lg" className="mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="font-semibold text-surface-900">Security</h2>
                <p className="text-sm text-surface-500">
                  Manage your password and security
                </p>
              </div>
            </div>

            <button className="w-full text-left px-4 py-3 rounded-xl border border-surface-200 hover:border-brand-300 hover:bg-brand-50/50 transition-colors flex items-center justify-between">
              <div>
                <p className="font-medium text-surface-900">Change Password</p>
                <p className="text-sm text-surface-500">
                  Update your password periodically for security
                </p>
              </div>
              <span className="text-brand-600">Update</span>
            </button>
          </Card>

          {/* Notifications Section */}
          <Card variant="bordered" padding="lg" className="mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center">
                <Bell className="w-5 h-5 text-accent-600" />
              </div>
              <div>
                <h2 className="font-semibold text-surface-900">Notifications</h2>
                <p className="text-sm text-surface-500">
                  Manage how you receive updates
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-medium text-surface-900">Email Notifications</p>
                  <p className="text-sm text-surface-500">
                    Receive transaction updates via email
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded border-surface-300 text-brand-500 focus:ring-brand-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-medium text-surface-900">Marketing Emails</p>
                  <p className="text-sm text-surface-500">
                    Receive tips and promotional updates
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-surface-300 text-brand-500 focus:ring-brand-500"
                />
              </label>
            </div>
          </Card>

          {/* Payment Section */}
          {(profile.role === 'referrer' || profile.role === 'provider') && (
            <Card variant="bordered" padding="lg" className="mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-surface-900">Payments</h2>
                  <p className="text-sm text-surface-500">
                    Manage your payout settings
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {profile.stripe_connect_account_id ? (
                  <div className="px-4 py-3 bg-green-50 rounded-xl flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Stripe Connected</p>
                      <p className="text-sm text-green-700">
                        Your payout account is set up
                      </p>
                    </div>
                  </div>
                ) : (
                  <button className="w-full text-left px-4 py-3 rounded-xl border border-surface-200 hover:border-brand-300 hover:bg-brand-50/50 transition-colors flex items-center justify-between">
                    <div>
                      <p className="font-medium text-surface-900">Connect Stripe</p>
                      <p className="text-sm text-surface-500">
                        Set up payouts to receive your earnings
                      </p>
                    </div>
                    <span className="text-brand-600">Connect</span>
                  </button>
                )}
              </div>
            </Card>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              loading={saving}
              disabled={saving}
              className="min-w-[120px]"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
