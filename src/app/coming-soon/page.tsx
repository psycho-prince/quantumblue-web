"use client";

import { motion } from "framer-motion";
import { Terminal, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ComingSoon() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-black relative overflow-hidden">
      {/* Subtle Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass p-12 rounded-[3rem] text-center relative z-10"
      >
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-8">
          <Terminal className="w-8 h-8 text-blue-500" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight text-white mb-4">Module Initializing</h1>
        <p className="text-zinc-500 text-sm font-medium mb-10 leading-relaxed">
          The requested infrastructure component is currently under development. Join our priority list for early access to the beta release.
        </p>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Work Email Address" 
            className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 transition-all"
          />
          <button className="w-full btn-saas-primary">
            Request Early Access
          </button>
        </form>

        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-white transition-colors uppercase tracking-widest mt-10">
           <ArrowLeft className="w-3 h-3" /> Back to Safety
        </Link>
      </motion.div>
    </div>
  );
}
