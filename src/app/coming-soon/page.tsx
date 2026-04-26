"use client";

import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

export default function ComingSoon() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#050505]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass-vault p-12 rounded-[2rem] text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-8">
          <Terminal className="w-8 h-8 text-cyan-400" />
        </div>
        
        <h1 className="text-3xl font-black uppercase tracking-tighter text-white mb-4">Vanguard Access</h1>
        <p className="text-zinc-500 text-sm font-medium mb-10 leading-relaxed">
          The requested module is currently being reinforced with lattice armor. Join the vanguard for early access.
        </p>

        <form className="space-y-4">
          <div className="relative">
            <input 
              type="email" 
              placeholder="ENTER EMAIL ADDRESS" 
              className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 text-[10px] font-mono text-cyan-400 placeholder:text-zinc-700 focus:outline-none focus:border-cyan-500/50 transition-all"
            />
          </div>
          <button className="w-full btn-sovereign">
            Request Early Access
          </button>
        </form>
      </motion.div>
    </div>
  );
}
