"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Mock data
const mockBusiness = {
  name: "Fade Masters Barbershop",
  type: "Barber / Salon",
  totalRevenue: 8450.00,
  newCustomers: 34,
  thisMonthRevenue: 1240.00,
  avgServicePrice: 30.00,
};

const mockTransactions = [
  { id: 1, client: "Carlos M.", referrer: "Alex R.", originalPrice: 30, paid: 28.50, yourShare: 25.50, date: "2024-01-15", time: "2:30 PM" },
  { id: 2, client: "Jennifer L.", referrer: "Maria G.", originalPrice: 45, paid: 42.75, yourShare: 38.25, date: "2024-01-15", time: "1:15 PM" },
  { id: 3, client: "David K.", referrer: null, originalPrice: 30, paid: 30.00, yourShare: 30.00, date: "2024-01-15", time: "11:00 AM" },
  { id: 4, client: "Sarah P.", referrer: "John D.", originalPrice: 30, paid: 28.50, yourShare: 25.50, date: "2024-01-14", time: "4:45 PM" },
];

export default function ProviderDashboard() {
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState<{
    referrerCode: string;
    referrerName: string;
    discount: number;
    referrerShare: number;
    platformFee: number;
    yourShare: number;
  } | null>(null);

  const simulateScan = () => {
    // Simulate a successful scan
    setTimeout(() => {
      setScanResult({
        referrerCode: "ALEX2024",
        referrerName: "Alex Rivera",
        discount: 1.50,
        referrerShare: 2.40,
        platformFee: 0.60,
        yourShare: 25.50,
      });
    }, 1500);
  };

  const processPayment = () => {
    // Would integrate with Stripe here
    alert("Payment processed! In production, this would trigger Stripe Connect payment splitting.");
    setScanResult(null);
    setShowScanner(false);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold block leading-tight">Refer</span>
              <span className="text-xs text-white/50">Business</span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center font-bold">
              F
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Business Info */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">{mockBusiness.name}</h1>
          <p className="text-white/50">{mockBusiness.type}</p>
        </div>

        {/* Scan Button - Prominent CTA */}
        <motion.button
          onClick={() => setShowScanner(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full p-8 mb-8 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 transition-all shadow-xl shadow-blue-500/25"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold">Scan Referral Code</p>
              <p className="text-white/70">Process a new customer referral</p>
            </div>
          </div>
        </motion.button>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-white/[0.02] border border-white/10"
          >
            <p className="text-sm text-white/50 mb-1">Total Revenue</p>
            <p className="text-3xl font-bold font-mono">${mockBusiness.totalRevenue.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20"
          >
            <p className="text-sm text-white/50 mb-1">New Customers</p>
            <p className="text-3xl font-bold text-blue-400">{mockBusiness.newCustomers}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-white/[0.02] border border-white/10"
          >
            <p className="text-sm text-white/50 mb-1">This Month</p>
            <p className="text-3xl font-bold font-mono">${mockBusiness.thisMonthRevenue.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl bg-white/[0.02] border border-white/10"
          >
            <p className="text-sm text-white/50 mb-1">Avg Service</p>
            <p className="text-3xl font-bold font-mono">${mockBusiness.avgServicePrice}</p>
          </motion.div>
        </div>

        {/* Cost Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 mb-8"
        >
          <h2 className="text-xl font-bold mb-4">Customer Acquisition Cost Analysis</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-xl bg-white/5">
              <p className="text-sm text-white/50 mb-2">Refer App Cost</p>
              <p className="text-4xl font-bold text-emerald-400">15%</p>
              <p className="text-xs text-white/40 mt-1">per new customer</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/5">
              <p className="text-sm text-white/50 mb-2">Industry Average</p>
              <p className="text-4xl font-bold text-white/30">25%</p>
              <p className="text-xs text-white/40 mt-1">Google/Facebook Ads</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/5">
              <p className="text-sm text-white/50 mb-2">You Save</p>
              <p className="text-4xl font-bold text-emerald-400">10%</p>
              <p className="text-xs text-white/40 mt-1">+ higher conversion rate</p>
            </div>
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-3xl bg-white/[0.02] border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Transactions</h2>
            <button className="text-sm text-blue-400 hover:text-blue-300">View All</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-white/50 border-b border-white/10">
                  <th className="pb-4 font-medium">Client</th>
                  <th className="pb-4 font-medium">Referrer</th>
                  <th className="pb-4 font-medium text-right">Original</th>
                  <th className="pb-4 font-medium text-right">Client Paid</th>
                  <th className="pb-4 font-medium text-right">Your Share</th>
                  <th className="pb-4 font-medium text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {mockTransactions.map((tx, i) => (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="border-b border-white/5 last:border-0"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">
                          {tx.client.charAt(0)}
                        </div>
                        <span className="font-medium">{tx.client}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      {tx.referrer ? (
                        <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs">
                          {tx.referrer}
                        </span>
                      ) : (
                        <span className="text-white/30 text-sm">Direct</span>
                      )}
                    </td>
                    <td className="py-4 text-right font-mono text-white/50">
                      ${tx.originalPrice.toFixed(2)}
                    </td>
                    <td className="py-4 text-right font-mono">
                      ${tx.paid.toFixed(2)}
                    </td>
                    <td className="py-4 text-right font-mono font-medium text-emerald-400">
                      ${tx.yourShare.toFixed(2)}
                    </td>
                    <td className="py-4 text-right text-sm text-white/50">
                      {tx.date}<br />
                      <span className="text-xs">{tx.time}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Scanner Modal */}
      <AnimatePresence>
        {showScanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0a0a0a] rounded-3xl p-6 max-w-md w-full border border-white/10"
            >
              {!scanResult ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Scan Referral Code</h2>
                    <button
                      onClick={() => setShowScanner(false)}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Camera view placeholder */}
                  <div 
                    className="aspect-square rounded-2xl bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center mb-6 cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={simulateScan}
                  >
                    <div className="text-center">
                      <svg className="w-16 h-16 mx-auto mb-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-white/50">Point camera at QR code</p>
                      <p className="text-xs text-white/30 mt-2">(Click to simulate scan)</p>
                    </div>
                  </div>

                  <p className="text-center text-sm text-white/40">
                    Or enter code manually
                  </p>
                  <div className="flex gap-2 mt-3">
                    <input
                      type="text"
                      placeholder="REFERRAL CODE"
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl font-mono uppercase tracking-wider text-center"
                    />
                    <button className="px-6 py-3 bg-blue-500 hover:bg-blue-400 rounded-xl font-semibold transition-colors">
                      Apply
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold">Referral Code Valid!</h2>
                    <p className="text-white/50">Code: {scanResult.referrerCode}</p>
                  </div>

                  {/* Payment Breakdown */}
                  <div className="p-4 rounded-2xl bg-white/5 mb-6">
                    <h3 className="font-semibold mb-4 text-center">Payment Breakdown ($30 service)</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/50">Original Price</span>
                        <span className="font-mono">$30.00</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-amber-400">
                        <span>Client Discount (5%)</span>
                        <span className="font-mono">-${scanResult.discount.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-white/10 pt-3 flex justify-between items-center text-sm">
                        <span className="text-white/50">Client Pays</span>
                        <span className="font-mono font-bold">$28.50</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-emerald-400">
                        <span>→ Referrer ({scanResult.referrerName})</span>
                        <span className="font-mono">-${scanResult.referrerShare.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-white/40">
                        <span>→ Platform Fee</span>
                        <span className="font-mono">-${scanResult.platformFee.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                        <span className="font-semibold">You Receive</span>
                        <span className="font-mono font-bold text-xl text-blue-400">${scanResult.yourShare.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setScanResult(null)}
                      className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={processPayment}
                      className="flex-1 py-3 bg-blue-500 hover:bg-blue-400 rounded-xl font-semibold transition-colors"
                    >
                      Process Payment
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
