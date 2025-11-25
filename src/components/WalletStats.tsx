'use client';

import { motion } from 'framer-motion';
import { Wallet, TrendingUp, ArrowUpRight, Clock, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';

interface WalletStatsProps {
  availableBalance: number;
  pendingBalance: number;
  totalEarned: number;
  totalWithdrawn: number;
  referralCount: number;
  onWithdraw?: () => void;
}

export function WalletStats({
  availableBalance,
  pendingBalance,
  totalEarned,
  totalWithdrawn,
  referralCount,
  onWithdraw,
}: WalletStatsProps) {
  const stats = [
    {
      label: 'Total Earned',
      value: formatCurrency(totalEarned),
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Pending',
      value: formatCurrency(pendingBalance),
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Withdrawn',
      value: formatCurrency(totalWithdrawn),
      icon: ArrowUpRight,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Referrals',
      value: referralCount.toString(),
      icon: DollarSign,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card
          variant="gradient"
          className="relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-400/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-400/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/25">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-surface-500">Available Balance</p>
                <p className="text-sm text-surface-400">Ready to withdraw</p>
              </div>
            </div>

            <div className="flex items-end justify-between">
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl font-bold text-surface-900"
              >
                {formatCurrency(availableBalance)}
              </motion.p>

              {onWithdraw && availableBalance >= 1000 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  onClick={onWithdraw}
                  className="px-6 py-3 bg-brand-500 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/25 hover:bg-brand-600 transition-colors flex items-center gap-2"
                >
                  <ArrowUpRight className="w-5 h-5" />
                  Withdraw
                </motion.button>
              )}
            </div>

            {availableBalance < 1000 && (
              <p className="mt-4 text-sm text-surface-500">
                Minimum withdrawal: {formatCurrency(1000)}
              </p>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
          >
            <Card variant="bordered" padding="md">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-surface-900">{stat.value}</p>
              <p className="text-sm text-surface-500">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
