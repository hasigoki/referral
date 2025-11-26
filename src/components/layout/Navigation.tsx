'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  QrCode,
  ScanLine,
  Wallet,
  Store,
  User,
  Menu,
  X,
  LogOut,
  Settings,
  Compass,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { UserRole } from '@/types';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: Home,
    roles: ['client', 'referrer', 'provider', 'admin'],
  },
  {
    href: '/explore',
    label: 'Explore',
    icon: Compass,
    roles: ['client'],
  },
  {
    href: '/referrer',
    label: 'My QR Code',
    icon: QrCode,
    roles: ['referrer', 'provider'],
  },
  {
    href: '/scan',
    label: 'Scan Code',
    icon: ScanLine,
    roles: ['provider'],
  },
  {
    href: '/wallet',
    label: 'Wallet',
    icon: Wallet,
    roles: ['referrer', 'provider'],
  },
  {
    href: '/provider',
    label: 'My Business',
    icon: Store,
    roles: ['provider'],
  },
];

interface NavigationProps {
  userRole: UserRole;
  userName?: string;
  userAvatar?: string;
}

export function Navigation({ userRole, userName, userAvatar }: NavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const filteredNavItems = navItems.filter((item) => item.roles.includes(userRole));

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-surface-200">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-surface-200">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/25">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <span className="text-xl font-bold text-surface-900">Refer</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-brand-50 text-brand-600'
                    : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-surface-200">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-surface-200 flex items-center justify-center overflow-hidden">
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-surface-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-surface-900 truncate">
                {userName || 'User'}
              </p>
              <p className="text-xs text-surface-500 capitalize">{userRole}</p>
            </div>
          </div>

          <div className="mt-2 space-y-1">
            <Link
              href="/settings"
              className="flex items-center gap-3 px-4 py-2 text-sm text-surface-600 hover:bg-surface-50 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
              {isSigningOut ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-surface-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-lg font-bold text-surface-900">Refer</span>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-surface-600 hover:bg-surface-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-black/50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 right-0 bottom-0 z-50 w-80 bg-white"
            >
              <div className="flex items-center justify-between p-4 border-b border-surface-200">
                <span className="text-lg font-bold text-surface-900">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-surface-600 hover:bg-surface-100 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="p-4 space-y-1">
                {filteredNavItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                        isActive
                          ? 'bg-brand-50 text-brand-600'
                          : 'text-surface-600 hover:bg-surface-50'
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-surface-200">
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                >
                  <LogOut className="w-5 h-5" />
                  {isSigningOut ? 'Signing out...' : 'Sign Out'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-surface-200 pb-safe">
        <div className="flex items-center justify-around py-2">
          {filteredNavItems.slice(0, 4).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors',
                  isActive ? 'text-brand-600' : 'text-surface-500'
                )}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
