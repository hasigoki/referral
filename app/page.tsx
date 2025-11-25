"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [activeRole, setActiveRole] = useState<"client" | "referrer" | "provider" | null>(null);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-amber-900/20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px]" />

      <div className="relative z-10">
        {/* Header */}
        <header className="px-6 py-8 flex items-center justify-between max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight">Refer</span>
          </motion.div>
          
          <motion.nav
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6"
          >
            <a href="/auth/login" className="text-white/60 hover:text-white transition-colors text-sm font-medium">
              Sign In
            </a>
            <a href="/auth/signup" className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 rounded-full text-sm font-semibold transition-all hover:shadow-lg hover:shadow-emerald-500/25">
              Sign Up Free
            </a>
          </motion.nav>
        </header>

        {/* Hero Section */}
        <section className="px-6 pt-20 pb-32 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-white/70">Everyone wins with referrals</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              Share local businesses.
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-400 bg-clip-text text-transparent">
                Earn 8% every time.
              </span>
            </h1>

            <p className="text-xl text-white/50 max-w-2xl mx-auto mb-4 leading-relaxed">
              Recommend your favorite barbers, salons, mechanics, and restaurants to friends.
            </p>
            <p className="text-lg text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed">
              💰 You earn 8% commission • 🎁 They get 5% off • 🏪 Businesses get new customers
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/auth/signup" className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full text-lg font-semibold transition-all hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-105 flex items-center gap-2">
                Create Free Account
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <button onClick={() => {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }} className="px-8 py-4 rounded-full text-lg font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all">
                See How It Works
              </button>
            </div>
          </motion.div>
        </section>

        {/* How It Works - Interactive Cards */}
        <section id="how-it-works" className="px-6 py-24 bg-gradient-to-b from-transparent via-emerald-950/20 to-transparent">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">How does it work?</h2>
              <p className="text-white/50 text-lg">Click on a role below to see the breakdown</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Referrer Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                onClick={() => setActiveRole(activeRole === "referrer" ? null : "referrer")}
                className={`group cursor-pointer p-8 rounded-3xl border transition-all duration-300 ${
                  activeRole === "referrer" 
                    ? "bg-emerald-500/10 border-emerald-500/50 scale-105" 
                    : "bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20"
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">Referrer</h3>
                <p className="text-white/50 mb-6">Share your unique code and earn 8% on every first purchase your friends make.</p>
                
                {activeRole === "referrer" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="pt-6 border-t border-white/10"
                  >
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/50">Your friend pays</span>
                        <span className="font-mono">$28.50</span>
                      </div>
                      <div className="flex justify-between text-emerald-400">
                        <span>You earn</span>
                        <span className="font-mono font-bold">$2.40</span>
                      </div>
                      <p className="text-xs text-white/30 pt-2">*Based on a $30 service</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Client Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                onClick={() => setActiveRole(activeRole === "client" ? null : "client")}
                className={`group cursor-pointer p-8 rounded-3xl border transition-all duration-300 ${
                  activeRole === "client" 
                    ? "bg-amber-500/10 border-amber-500/50 scale-105" 
                    : "bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20"
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">New Client</h3>
                <p className="text-white/50 mb-6">Use a referral code and get 5% off your first visit to any participating service.</p>
                
                {activeRole === "client" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="pt-6 border-t border-white/10"
                  >
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/50">Original price</span>
                        <span className="font-mono line-through text-white/30">$30.00</span>
                      </div>
                      <div className="flex justify-between text-amber-400">
                        <span>You pay</span>
                        <span className="font-mono font-bold">$28.50</span>
                      </div>
                      <p className="text-xs text-white/30 pt-2">5% discount on first visit</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Provider Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                onClick={() => setActiveRole(activeRole === "provider" ? null : "provider")}
                className={`group cursor-pointer p-8 rounded-3xl border transition-all duration-300 ${
                  activeRole === "provider" 
                    ? "bg-blue-500/10 border-blue-500/50 scale-105" 
                    : "bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20"
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">Service Provider</h3>
                <p className="text-white/50 mb-6">Get new customers through referrals. Pay less than traditional advertising.</p>
                
                {activeRole === "provider" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="pt-6 border-t border-white/10"
                  >
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/50">Client pays</span>
                        <span className="font-mono">$28.50</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">Referrer earns</span>
                        <span className="font-mono">-$2.40</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">Platform fee</span>
                        <span className="font-mono">-$0.60</span>
                      </div>
                      <div className="flex justify-between text-blue-400 pt-2 border-t border-white/10">
                        <span>You receive</span>
                        <span className="font-mono font-bold">$25.50</span>
                      </div>
                      <p className="text-xs text-white/30 pt-2">15% customer acquisition cost (industry avg: 20-30%)</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Service Categories */}
        <section className="px-6 py-24">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">Works for any business</h2>
              <p className="text-white/50 text-lg">From haircuts to car sales, referrals work everywhere</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Barbers & Salons", icon: "✂️", count: "2,340+" },
                { name: "Restaurants", icon: "🍽️", count: "1,890+" },
                { name: "Auto Mechanics", icon: "🔧", count: "956+" },
                { name: "Car Dealerships", icon: "🚗", count: "234+" },
                { name: "Fitness & Gyms", icon: "💪", count: "1,120+" },
                { name: "Spas & Wellness", icon: "🧖", count: "890+" },
                { name: "Home Services", icon: "🏠", count: "1,450+" },
                { name: "And More...", icon: "✨", count: "5,000+" },
              ].map((category, i) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] hover:border-white/20 transition-all cursor-pointer"
                >
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm text-white/40">{category.count} providers</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center p-12 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20"
          >
            <h2 className="text-4xl font-bold mb-4">Ready to start earning?</h2>
            <p className="text-white/60 text-lg mb-8">Join thousands of people already earning passive income through referrals.</p>
            <a href="/auth/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full text-lg font-semibold hover:bg-white/90 transition-all hover:scale-105">
              Create Free Account
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-12 border-t border-white/10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-bold">Refer</span>
            </div>
            <p className="text-sm text-white/40">© 2024 Refer App. Everyone wins.</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
