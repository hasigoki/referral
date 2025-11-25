'use client';

import { motion } from 'framer-motion';
import { Check, User, Store, Gift, Coins, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';

interface TransactionBreakdownProps {
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  referrerCommission: number;
  platformFee: number;
  providerPayout: number;
  clientName?: string;
  referrerName?: string;
  isFirstInteraction: boolean;
}

export function TransactionBreakdown({
  originalAmount,
  discountAmount,
  finalAmount,
  referrerCommission,
  platformFee,
  providerPayout,
  clientName = 'New Client',
  referrerName,
  isFirstInteraction,
}: TransactionBreakdownProps) {
  return (
    <Card variant="elevated" className="overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-500 to-brand-600 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Check className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold">Transaction Breakdown</h3>
            <p className="text-sm text-white/80">
              {isFirstInteraction ? 'Referral transaction' : 'Regular transaction'}
            </p>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="p-6 space-y-4">
        {/* Original Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center">
              <Store className="w-4 h-4 text-surface-600" />
            </div>
            <span className="text-surface-600">Service Price</span>
          </div>
          <span className="font-semibold">{formatCurrency(originalAmount)}</span>
        </div>

        {/* Discount (if applicable) */}
        {isFirstInteraction && discountAmount > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                <Gift className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-green-600">Client Discount</span>
            </div>
            <span className="font-semibold text-green-600">
              -{formatCurrency(discountAmount)}
            </span>
          </motion.div>
        )}

        <div className="border-t border-surface-200 my-4" />

        {/* Client Pays */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
              <User className="w-4 h-4 text-brand-600" />
            </div>
            <div>
              <span className="text-surface-900 font-medium">{clientName} pays</span>
            </div>
          </div>
          <span className="font-bold text-lg">{formatCurrency(finalAmount)}</span>
        </div>

        <div className="border-t border-surface-200 my-4" />

        {/* Distribution Section */}
        <p className="text-sm text-surface-500 font-medium uppercase tracking-wide">
          Distribution
        </p>

        {/* Referrer Commission */}
        {isFirstInteraction && referrerCommission > 0 && referrerName && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent-50 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-accent-600" />
              </div>
              <div>
                <span className="text-surface-600">Referrer Commission</span>
                <p className="text-xs text-surface-400">{referrerName}</p>
              </div>
            </div>
            <span className="font-semibold text-accent-600">
              {formatCurrency(referrerCommission)}
            </span>
          </motion.div>
        )}

        {/* Platform Fee */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-50 flex items-center justify-center">
              <Coins className="w-4 h-4 text-surface-400" />
            </div>
            <span className="text-surface-400">Platform Fee</span>
          </div>
          <span className="text-surface-400">{formatCurrency(platformFee)}</span>
        </div>

        <div className="border-t border-surface-200 my-4" />

        {/* Provider Payout - Highlighted */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between bg-gradient-to-r from-brand-50 to-accent-50 -mx-6 px-6 py-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
              <Store className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <span className="text-surface-900 font-semibold">Your Earnings</span>
              <p className="text-xs text-surface-500">Deposited instantly</p>
            </div>
          </div>
          <span className="font-bold text-2xl text-brand-600">
            {formatCurrency(providerPayout)}
          </span>
        </motion.div>
      </div>
    </Card>
  );
}
