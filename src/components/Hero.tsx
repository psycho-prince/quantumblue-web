"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Cpu, Terminal } from "lucide-react";
import Link from "next/link";
import { TerminalWidget } from "./TerminalWidget";
import { LatticeVisualization } from "./LatticeVisualization";

export function Hero() {
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.98]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 pb-20 px-6 overflow-hidden bg-black">
      {/* Background Elements */}
      <LatticeVisualization />
      
      <motion.div 
        style={{ scale: heroScale, opacity: heroOpacity }}
        className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-20 items-center z-10"
      >
        <div className="flex flex-col items-start text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-3 py-1 bg-accent-blue/10 border border-accent-blue/30 rounded-none mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-accent-blue animate-pulse" />
            <span className="text-[10px] font-bold text-accent-blue uppercase tracking-widest font-mono">SYSTEM_STATUS: SECURE_V3.0</span>
          </motion.div>

          <div className="mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight text-white font-mono"
            >
              FUTURE_PROOF YOUR <br />
              <span className="neon-text-blue">ENTERPRISE_DATA</span>
            </motion.h1>
          </div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-zinc-400 max-w-xl font-mono mb-12 leading-relaxed"
          >
            DEPLOY QUANTUM_RESISTANT SECURITY INFRASTRUCTURE. FROM CLI_TOOLS TO HIGH_SCALE APIS, SECURE YOUR LEGACY AGAINST THE THREAT.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link href="/dashboard" className="px-8 py-4 bg-accent-blue text-black font-bold uppercase tracking-widest font-mono group flex items-center gap-2">
              BUILD_NOW <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/coming-soon" className="px-8 py-4 border border-accent-blue text-accent-blue font-bold uppercase tracking-widest font-mono group flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              CLI_DOCS
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative group"
        >
          {/* Subtle Glow behind terminal */}
          <div className="absolute -inset-10 bg-accent-blue/10 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="relative glass-glow-blue rounded-none p-1 border-accent-blue/30 shadow-[0_0_50px_rgba(59,130,246,0.1)] overflow-hidden">
             <div className="bg-black/90 p-4">
               <TerminalWidget />
             </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
