"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { TerminalWidget } from "./TerminalWidget";
import { LatticeVisualization } from "./LatticeVisualization";

export function Hero() {
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.98]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6 overflow-hidden bg-[#020617]">
      {/* Background Elements */}
      <LatticeVisualization />
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 via-transparent to-transparent pointer-events-none" />
      
      <motion.div 
        style={{ scale: heroScale, opacity: heroOpacity }}
        className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-20 items-center z-10"
      >
        <div className="flex flex-col items-start text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-xl"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
            <span className="font-mono text-[8px] text-blue-400 tracking-[0.3em] uppercase">Quantum Sovereign Protocol V2.1</span>
          </motion.div>

          <div className="overflow-hidden mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter uppercase text-white"
            >
              Secure Your <br />
              <span className="text-[#3B82F6] italic">Digital Legacy.</span>
            </motion.h1>
          </div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-slate-400 max-w-xl font-medium mb-12 leading-relaxed"
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
              Whitepaper <div className="w-5 h-5 rounded-full border border-blue-500 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">↓</div>
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative p-1 bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-[2.5rem] shadow-2xl"
        >
          <div className="bg-[#020617] rounded-[2.4rem] p-4 overflow-hidden">
            <div className="absolute -inset-20 bg-blue-600/10 rounded-full blur-[100px] -z-10 animate-pulse" />
            <TerminalWidget />
          </div>
        </motion.div>
      </motion.div>


      {/* Scroll Prompt */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-12 flex flex-col items-center gap-4 opacity-40"
      >
        <span className="font-mono text-[8px] text-blue-400 uppercase tracking-widest">Scroll to Arm</span>
        <div className="w-px h-12 bg-gradient-to-b from-blue-500 to-transparent" />
      </motion.div>
    </section>
  );
}
