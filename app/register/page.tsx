"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type Role = "referrer" | "client" | "provider";

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    businessName: "",
    businessType: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // This would connect to Supabase Auth
    console.log("Registering:", { role: selectedRole, ...formData });
    // Redirect based on role
    window.location.href = `/${selectedRole}/dashboard`;
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-amber-900/20" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />
      
      <div className="relative z-10 min-h-screen flex">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-emerald-600/20 to-transparent">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight">Refer</span>
          </Link>
          
          <div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Join the referral<br />
              <span className="bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">
                revolution
              </span>
            </h1>
            <p className="text-xl text-white/60 max-w-md">
              Whether you're here to earn, save, or grow your business — there's a place for you.
            </p>
          </div>
          
          <p className="text-sm text-white/40">© 2024 Refer App. Everyone wins.</p>
        </div>

        {/* Right side - Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <Link href="/" className="lg:hidden flex items-center gap-3 mb-12">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-2xl font-bold tracking-tight">Refer</span>
            </Link>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-8">
              <div className={`h-1 flex-1 rounded-full ${step >= 1 ? "bg-emerald-500" : "bg-white/10"}`} />
              <div className={`h-1 flex-1 rounded-full ${step >= 2 ? "bg-emerald-500" : "bg-white/10"}`} />
            </div>

            {step === 1 ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-3xl font-bold mb-2">Choose your role</h2>
                <p className="text-white/50 mb-8">How do you want to use Refer?</p>

                <div className="space-y-4">
                  {/* Referrer option */}
                  <button
                    onClick={() => setSelectedRole("referrer")}
                    className={`w-full p-6 rounded-2xl border text-left transition-all ${
                      selectedRole === "referrer"
                        ? "bg-emerald-500/10 border-emerald-500/50"
                        : "bg-white/[0.02] border-white/10 hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">I want to earn money</h3>
                        <p className="text-sm text-white/50">Share referral codes and earn 8% on every first purchase</p>
                      </div>
                    </div>
                  </button>

                  {/* Client option */}
                  <button
                    onClick={() => setSelectedRole("client")}
                    className={`w-full p-6 rounded-2xl border text-left transition-all ${
                      selectedRole === "client"
                        ? "bg-amber-500/10 border-amber-500/50"
                        : "bg-white/[0.02] border-white/10 hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">I want to save money</h3>
                        <p className="text-sm text-white/50">Use referral codes to get 5% off your first visits</p>
                      </div>
                    </div>
                  </button>

                  {/* Provider option */}
                  <button
                    onClick={() => setSelectedRole("provider")}
                    className={`w-full p-6 rounded-2xl border text-left transition-all ${
                      selectedRole === "provider"
                        ? "bg-blue-500/10 border-blue-500/50"
                        : "bg-white/[0.02] border-white/10 hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">I'm a business owner</h3>
                        <p className="text-sm text-white/50">Get new customers through referrals at 15% acquisition cost</p>
                      </div>
                    </div>
                  </button>
                </div>

                <button
                  onClick={() => selectedRole && setStep(2)}
                  disabled={!selectedRole}
                  className="w-full mt-8 py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-white/10 disabled:text-white/30 rounded-full font-semibold transition-all"
                >
                  Continue
                </button>

                <p className="text-center mt-6 text-white/50">
                  Already have an account?{" "}
                  <Link href="/login" className="text-emerald-400 hover:text-emerald-300">
                    Sign in
                  </Link>
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-white/50 hover:text-white mb-6 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>

                <h2 className="text-3xl font-bold mb-2">Create your account</h2>
                <p className="text-white/50 mb-8">
                  {selectedRole === "referrer" && "Start earning passive income today"}
                  {selectedRole === "client" && "Get discounts on your first visits"}
                  {selectedRole === "provider" && "Grow your business with referrals"}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl focus:border-emerald-500/50 focus:bg-white/[0.08] outline-none transition-all"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white/70 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl focus:border-emerald-500/50 focus:bg-white/[0.08] outline-none transition-all"
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white/70 mb-2">Password</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl focus:border-emerald-500/50 focus:bg-white/[0.08] outline-none transition-all"
                      placeholder="••••••••"
                      required
                      minLength={8}
                    />
                  </div>

                  {selectedRole === "provider" && (
                    <>
                      <div>
                        <label className="block text-sm text-white/70 mb-2">Business Name</label>
                        <input
                          type="text"
                          value={formData.businessName}
                          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                          className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl focus:border-emerald-500/50 focus:bg-white/[0.08] outline-none transition-all"
                          placeholder="My Awesome Barbershop"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/70 mb-2">Business Type</label>
                        <select
                          value={formData.businessType}
                          onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                          className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl focus:border-emerald-500/50 focus:bg-white/[0.08] outline-none transition-all"
                          required
                        >
                          <option value="">Select a category</option>
                          <option value="barber">Barber / Salon</option>
                          <option value="restaurant">Restaurant</option>
                          <option value="mechanic">Auto Mechanic</option>
                          <option value="dealership">Car Dealership</option>
                          <option value="fitness">Fitness / Gym</option>
                          <option value="spa">Spa / Wellness</option>
                          <option value="home">Home Services</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm text-white/70 mb-2">Phone (optional)</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl focus:border-emerald-500/50 focus:bg-white/[0.08] outline-none transition-all"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 py-4 bg-emerald-500 hover:bg-emerald-400 rounded-full font-semibold transition-all hover:shadow-lg hover:shadow-emerald-500/25"
                  >
                    Create Account
                  </button>
                </form>

                <p className="text-center mt-6 text-xs text-white/40">
                  By creating an account, you agree to our Terms of Service and Privacy Policy
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
