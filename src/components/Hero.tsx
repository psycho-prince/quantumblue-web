"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { TerminalWidget } from "./TerminalWidget";

export function Hero() {
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6 overflow-hidden bg-[#F8FAFC]">
      <motion.div 
        style={{ scale: heroScale, opacity: heroOpacity }}
        className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-20 items-center z-10"
      >
        <div className="flex flex-col items-start text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-4 py-1.5 bg-slate-100 border border-slate-200 rounded-full mb-8 backdrop-blur-xl"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
            <span className="font-mono text-[8px] text-slate-500 tracking-[0.3em] uppercase">Quantum Sovereign Protocol V2.1</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl font-black leading-[0.9] mb-8 tracking-tighter uppercase text-slate-900"
          >
            Secure Your <br />
            <span className="text-[#2563EB] italic">Digital Legacy.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-slate-600 max-w-xl font-medium mb-12 leading-relaxed"
          >
            The definitive sovereign notary suite. Seal assets with mathematical lattice armor built to survive the Post-Quantum epoch.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            <Link href="/dashboard" className="btn-sovereign group flex items-center gap-3">
              Access Workspace <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="btn-glass flex items-center gap-3 group">
              Whitepaper <div className="w-5 h-5 rounded-full border border-[#2563EB] flex items-center justify-center group-hover:bg-[#2563EB] group-hover:text-white transition-all">↓</div>
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="relative p-4 bg-white border border-slate-200 rounded-[2rem] shadow-2xl"
        >
          <div className="absolute -inset-20 bg-[#2563EB]/5 rounded-full blur-[100px] -z-10 animate-pulse" />
          <TerminalWidget />
        </motion.div>
      </motion.div>


      {/* Scroll Prompt */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-12 flex flex-col items-center gap-4 opacity-40"
      >
        <span className="font-tactical text-[8px] text-slate-900 uppercase tracking-widest">Scroll to Arm</span>
        <div className="w-px h-12 bg-gradient-to-b from-slate-900 to-transparent" />
      </motion.div>
    </section>
  );
}
