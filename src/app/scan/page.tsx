'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanLine, X, Check, AlertCircle, User, Gift, ArrowRight, Loader2 } from 'lucide-react';
import { QRCodeScanner } from '@/components/QRCodeScanner';
import { TransactionBreakdown } from '@/components/TransactionBreakdown';
import { Button, Card, Input } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { getSupabaseClient } from '@/lib/supabase/client';

type ScanState = 'loading' | 'idle' | 'scanning' | 'validating' | 'confirmed' | 'processing' | 'success' | 'error';

interface ReferralData {
  code: string;
  referrer: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface TransactionData {
  clientSecret: string;
  splits: {
    originalAmount: number;
    discountAmount: number;
    finalAmount: number;
    referrerCommission: number;
    platformFee: number;
    providerPayout: number;
  };
  isFirstInteraction: boolean;
  hasReferral: boolean;
  referrerName?: string;
}

export default function ScanPage() {
  const router = useRouter();
  const [state, setState] = useState<ScanState>('loading');
  const [providerId, setProviderId] = useState<string | null>(null);
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Load the provider ID for the current user
  useEffect(() => {
    async function loadProvider() {
      const supabase = getSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/login');
        return;
      }

      // Get the service provider for this user
      const { data: provider, error: providerError } = await supabase
        .from('service_providers')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (providerError || !provider) {
        setError('You must have a business account to scan codes');
        setState('error');
        return;
      }

      setProviderId(provider.id);
      setState('idle');
    }

    loadProvider();
  }, [router]);

  const validateCode = async (code: string) => {
    setState('validating');
    setError(null);

    try {
      const response = await fetch(`/api/referral/validate?code=${code}&providerId=${providerId}`);
      const data = await response.json();

      if (!data.valid) {
        setError(data.error || 'Invalid referral code');
        setState('error');
        return;
      }

      setReferralData({
        code: data.code,
        referrer: data.referrer,
      });
      setState('confirmed');
    } catch (err) {
      setError('Failed to validate code. Please try again.');
      setState('error');
    }
  };

  const handleScan = useCallback((code: string) => {
    validateCode(code);
  }, [providerId]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.length === 8) {
      validateCode(manualCode.toUpperCase());
    }
  };

  const processTransaction = async () => {
    if (!referralData || !providerId) return;

    setState('processing');
    setError(null);

    try {
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: providerId,
          referralCode: referralData.code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment');
      }

      setTransactionData(data);
      setState('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
      setState('error');
    }
  };

  const resetScan = () => {
    setState('idle');
    setReferralData(null);
    setTransactionData(null);
    setManualCode('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-surface-200">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold text-surface-900">Scan Referral Code</h1>
          <button
            onClick={() => router.back()}
            className="p-2 text-surface-600 hover:bg-surface-100 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="pt-16 pb-8 px-4">
        <div className="max-w-lg mx-auto">
          <AnimatePresence mode="wait">
            {/* Loading State */}
            {state === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center min-h-[60vh]"
              >
                <Loader2 className="w-8 h-8 animate-spin text-brand-500 mb-4" />
                <p className="text-surface-600">Loading...</p>
              </motion.div>
            )}

            {/* Idle State - Show scan options */}
            {state === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6 mt-8"
              >
                <Card variant="elevated" className="p-8 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-6">
                    <ScanLine className="w-10 h-10 text-brand-500" />
                  </div>
                  <h2 className="text-xl font-semibold text-surface-900 mb-2">
                    Scan Customer's Code
                  </h2>
                  <p className="text-surface-600 mb-6">
                    Ask the customer to show their referral QR code
                  </p>
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => setState('scanning')}
                  >
                    <ScanLine className="w-5 h-5 mr-2" />
                    Open Scanner
                  </Button>
                </Card>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-surface-200" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-surface-50 text-sm text-surface-500">
                      or enter manually
                    </span>
                  </div>
                </div>

                <Card variant="bordered" className="p-6">
                  <form onSubmit={handleManualSubmit}>
                    <Input
                      label="Referral Code"
                      placeholder="ABCD1234"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                      maxLength={8}
                      className="font-mono text-center text-lg tracking-widest"
                    />
                    <Button
                      type="submit"
                      variant="outline"
                      className="w-full mt-4"
                      disabled={manualCode.length !== 8}
                    >
                      Validate Code
                    </Button>
                  </form>
                </Card>
              </motion.div>
            )}

            {/* Scanning State */}
            {state === 'scanning' && (
              <QRCodeScanner
                isOpen={true}
                onScan={handleScan}
                onClose={() => setState('idle')}
              />
            )}

            {/* Validating State */}
            {state === 'validating' && (
              <motion.div
                key="validating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center min-h-[60vh]"
              >
                <div className="w-16 h-16 rounded-full border-4 border-brand-200 border-t-brand-500 animate-spin mb-4" />
                <p className="text-surface-600">Validating code...</p>
              </motion.div>
            )}

            {/* Confirmed State - Show referrer info */}
            {state === 'confirmed' && referralData && (
              <motion.div
                key="confirmed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6 mt-8"
              >
                <Card variant="gradient" className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center">
                      {referralData.referrer.avatar ? (
                        <img
                          src={referralData.referrer.avatar}
                          alt={referralData.referrer.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-7 h-7 text-surface-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-surface-500">Referred by</p>
                      <p className="text-xl font-semibold text-surface-900">
                        {referralData.referrer.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-white/80 rounded-xl">
                    <Gift className="w-6 h-6 text-green-500" />
                    <div>
                      <p className="font-medium text-surface-900">
                        First-time customer discount applies!
                      </p>
                      <p className="text-sm text-surface-500">
                        Customer will receive 5% off their purchase
                      </p>
                    </div>
                  </div>
                </Card>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={resetScan} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={processTransaction} className="flex-1">
                    Process Payment
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Processing State */}
            {state === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center min-h-[60vh]"
              >
                <div className="w-16 h-16 rounded-full border-4 border-brand-200 border-t-brand-500 animate-spin mb-4" />
                <p className="text-surface-600">Processing transaction...</p>
              </motion.div>
            )}

            {/* Success State */}
            {state === 'success' && transactionData && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 mt-8"
              >
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"
                  >
                    <Check className="w-10 h-10 text-green-500" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-surface-900">
                    Payment Successful!
                  </h2>
                </div>

                <TransactionBreakdown
                  originalAmount={transactionData.splits.originalAmount}
                  discountAmount={transactionData.splits.discountAmount}
                  finalAmount={transactionData.splits.finalAmount}
                  referrerCommission={transactionData.splits.referrerCommission}
                  platformFee={transactionData.splits.platformFee}
                  providerPayout={transactionData.splits.providerPayout}
                  referrerName={transactionData.referrerName}
                  isFirstInteraction={transactionData.isFirstInteraction}
                />

                <Button onClick={resetScan} className="w-full" size="lg">
                  Scan Another Code
                </Button>
              </motion.div>
            )}

            {/* Error State */}
            {state === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6 mt-8"
              >
                <Card variant="bordered" className="p-8 text-center border-red-200 bg-red-50">
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <h2 className="text-xl font-semibold text-surface-900 mb-2">
                    Something went wrong
                  </h2>
                  <p className="text-surface-600 mb-6">{error}</p>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={() => router.push('/dashboard')} variant="outline">
                      Go to Dashboard
                    </Button>
                    <Button onClick={resetScan}>
                      Try Again
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
