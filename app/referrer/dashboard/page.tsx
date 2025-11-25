"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// Mock data - would come from Supabase
const mockUser = {
  name: "Alex Rivera",
  referralCode: "ALEX2024",
  totalEarnings: 342.50,
  pendingEarnings: 28.50,
  totalReferrals: 47,
  thisMonthReferrals: 8,
};

const mockTransactions = [
  { id: 1, client: "Maria G.", provider: "Fade Masters Barbershop", amount: 2.40, date: "2024-01-15", status: "completed" },
  { id: 2, client: "Carlos R.", provider: "Taqueria El Sol", amount: 1.60, date: "2024-01-14", status: "completed" },
  { id: 3, client: "Jennifer L.", provider: "AutoFix Pro", amount: 12.00, date: "2024-01-13", status: "pending" },
  { id: 4, client: "David M.", provider: "Zen Spa & Wellness", amount: 6.40, date: "2024-01-12", status: "completed" },
  { id: 5, client: "Sarah K.", provider: "Fade Masters Barbershop", amount: 2.40, date: "2024-01-10", status: "completed" },
];

export default function ReferrerDashboard() {
  const [showQRModal, setShowQRModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(mockUser.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold">Refer</span>
          </Link>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-bold">
              {mockUser.name.charAt(0)}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {mockUser.name.split(" ")[0]}!</h1>
          <p className="text-white/50">Here's how your referrals are performing</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20"
          >
            <p className="text-sm text-white/50 mb-1">Total Earnings</p>
            <p className="text-3xl font-bold font-mono">${mockUser.totalEarnings.toFixed(2)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl bg-white/[0.02] border border-white/10"
          >
            <p className="text-sm text-white/50 mb-1">Pending</p>
            <p className="text-3xl font-bold font-mono text-amber-400">${mockUser.pendingEarnings.toFixed(2)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-white/[0.02] border border-white/10"
          >
            <p className="text-sm text-white/50 mb-1">Total Referrals</p>
            <p className="text-3xl font-bold">{mockUser.totalReferrals}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl bg-white/[0.02] border border-white/10"
          >
            <p className="text-sm text-white/50 mb-1">This Month</p>
            <p className="text-3xl font-bold">{mockUser.thisMonthReferrals}</p>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* QR Code Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20">
              <h2 className="text-xl font-bold mb-4">Your Referral Code</h2>
              
              {/* QR Code Display */}
              <button
                onClick={() => setShowQRModal(true)}
                className="w-full aspect-square rounded-2xl bg-white p-6 mb-4 hover:scale-[1.02] transition-transform cursor-pointer"
              >
                {/* Placeholder QR - would use a real QR library */}
                <div className="w-full h-full rounded-xl bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-4 grid grid-cols-8 gap-1">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm ${Math.random() > 0.5 ? "bg-white" : "bg-transparent"}`}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>

              {/* Code display */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 px-4 py-3 bg-white/5 rounded-xl font-mono text-lg text-center">
                  {mockUser.referralCode}
                </div>
                <button
                  onClick={copyCode}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                >
                  {copied ? (
                    <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Share buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </button>
                <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </button>
                <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </div>

              <p className="text-center text-xs text-white/40 mt-4">
                Tap QR to enlarge • Share to earn 8% per referral
              </p>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Recent Activity</h2>
                <button className="text-sm text-emerald-400 hover:text-emerald-300">View All</button>
              </div>

              <div className="space-y-3">
                {mockTransactions.map((tx, i) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-sm font-medium">
                        {tx.client.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{tx.client}</p>
                        <p className="text-sm text-white/50">{tx.provider}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-mono font-medium ${tx.status === "pending" ? "text-amber-400" : "text-emerald-400"}`}>
                        +${tx.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-white/40">{tx.date}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Payout Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-6 p-6 rounded-3xl bg-white/[0.02] border border-white/10"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-1">Ready to withdraw?</h2>
                  <p className="text-white/50">Minimum payout: $25.00</p>
                </div>
                <button className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-full font-semibold transition-all hover:shadow-lg hover:shadow-emerald-500/25">
                  Withdraw ${mockUser.totalEarnings.toFixed(2)}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* QR Modal */}
      {showQRModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
          onClick={() => setShowQRModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-square rounded-2xl bg-[#0a0a0a] p-8 mb-4">
              <div className="w-full h-full rounded-xl relative overflow-hidden">
                <div className="absolute inset-0 grid grid-cols-12 gap-1">
                  {Array.from({ length: 144 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-sm ${Math.random() > 0.5 ? "bg-white" : "bg-transparent"}`}
                    />
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-xl bg-emerald-500 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-[#0a0a0a] font-mono text-2xl font-bold mb-2">
              {mockUser.referralCode}
            </p>
            <p className="text-center text-gray-500 text-sm">
              Scan to get 5% off your first visit
            </p>
          </motion.div>
        </motion.div>
      )}
    </main>
  );
}
