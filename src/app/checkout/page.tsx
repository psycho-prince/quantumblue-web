"use client";

import { useState } from "react";
import { CreditCard, Check, Info, ArrowLeft, Smartphone } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi">("card");
  const [isAutoPayEnabled, setIsAutoPayEnabled] = useState(false);

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/pricing" 
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Pricing
        </Link>

        <div className="grid md:grid-cols-5 gap-12">
          {/* Main Checkout Form */}
          <div className="md:col-span-3 space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white tracking-tight">Complete your upgrade</h1>
              <p className="text-zinc-500">Your 14-day free trial starts now. You won&apos;t be charged until May 17, 2026.</p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 p-1 glass rounded-2xl">
                <button 
                  onClick={() => setPaymentMethod("card")}
                  className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all ${paymentMethod === "card" ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                >
                  <CreditCard className="w-4 h-4" />
                  Credit / Debit Card
                </button>
                <button 
                  onClick={() => setPaymentMethod("upi")}
                  className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all ${paymentMethod === "upi" ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                >
                  <Smartphone className="w-4 h-4" />
                  UPI / Auto-pay
                </button>
              </div>

              {paymentMethod === "card" ? (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Card Information</label>
                    <div className="glass p-4 rounded-2xl space-y-4">
                      <input 
                        type="text" 
                        placeholder="Card Number" 
                        className="w-full bg-transparent border-none outline-none text-white placeholder:text-zinc-700 font-medium"
                      />
                      <div className="flex gap-4 pt-4 border-t border-white/5">
                        <input 
                          type="text" 
                          placeholder="MM / YY" 
                          className="w-1/2 bg-transparent border-none outline-none text-white placeholder:text-zinc-700 font-medium"
                        />
                        <input 
                          type="text" 
                          placeholder="CVC" 
                          className="w-1/2 bg-transparent border-none outline-none text-white placeholder:text-zinc-700 font-medium"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Cardholder Name</label>
                    <input 
                      type="text" 
                      placeholder="Full Name on Card" 
                      className="w-full glass p-4 rounded-2xl outline-none text-white placeholder:text-zinc-700 font-medium"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">UPI ID (VPA)</label>
                    <input 
                      type="text" 
                      placeholder="username@bank" 
                      className="w-full glass p-4 rounded-2xl outline-none text-white placeholder:text-zinc-700 font-medium border border-blue-500/20"
                    />
                  </div>
                  
                  <div className="glass p-6 rounded-[2rem] border border-blue-500/20 bg-blue-500/5">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <input 
                          type="checkbox" 
                          id="autopay" 
                          checked={isAutoPayEnabled}
                          onChange={(e) => setIsAutoPayEnabled(e.target.checked)}
                          className="w-5 h-5 rounded-lg accent-blue-500 cursor-pointer"
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="autopay" className="text-sm font-bold text-white cursor-pointer select-none">Enable UPI Auto-pay</label>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                          By enabling Auto-pay, your subscription will be automatically renewed each month. You can cancel anytime from your dashboard.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4 pt-4">
                <button className="w-full btn-saas-primary py-4 text-sm">
                  Start My 14-Day Free Trial
                </button>
                <p className="text-[10px] text-zinc-600 text-center uppercase tracking-widest leading-loose">
                  By clicking above, you agree to our <Link href="/legal" className="underline hover:text-zinc-400">Terms of Service</Link> <br />
                  and authorize Quantum Blue to charge your payment method after the trial ends.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-2">
            <div className="glass p-8 rounded-[3rem] sticky top-32">
              <h3 className="text-lg font-bold text-white mb-8">Order Summary</h3>
              
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-white">Professional Plan</h4>
                    <p className="text-xs text-zinc-500 mt-1">14-day free trial</p>
                  </div>
                  <span className="text-sm font-bold text-white">$29.00</span>
                </div>

                <div className="pt-6 border-t border-white/5 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Subtotal</span>
                    <span className="text-white font-medium">$29.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Due Now</span>
                    <span className="text-blue-500 font-bold">$0.00</span>
                  </div>
                </div>

                <div className="pt-8 space-y-4">
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <Check className="w-4 h-4 text-blue-500" />
                    Unlimited PQC Endpoints
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <Check className="w-4 h-4 text-blue-500" />
                    Team RBAC Support
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <Check className="w-4 h-4 text-blue-500" />
                    Priority Support
                  </div>
                </div>

                <div className="bg-zinc-900/50 p-4 rounded-2xl flex gap-3 items-start border border-white/5">
                  <Info className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-zinc-500 leading-relaxed uppercase tracking-wider font-bold">
                    To set up payments for free during development, we recommend using Stripe Test Mode. This allows you to test the entire flow without actual charges.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
