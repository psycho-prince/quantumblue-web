"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Terminal } from "lucide-react";
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
            className="flex flex-wrap items-center gap-2.5 px-4 py-1.5 bg-blue-500/5 border border-blue-500/20 rounded-full mb-8 backdrop-blur-xl"
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-[9px] font-extrabold text-blue-400 uppercase tracking-widest">Emergent Ventures Backed</span>
            <span className="text-[9px] text-zinc-600 font-bold uppercase">|</span>
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Founded by Prince T. Philip</span>
          </motion.div>

          <div className="mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight text-white"
            >
              Future-Proof Your <br />
              <span className="text-blue-500">Enterprise Data.</span>
            </motion.h1>
          </div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-zinc-400 max-w-xl font-medium mb-12 leading-relaxed"
          >
            Deploy quantum-resistant security infrastructure across your entire stack. From CLI tools to high-scale APIs, secure your legacy against the quantum threat.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link href="/dashboard" className="btn-saas-primary group gap-2">
              Start Building <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/coming-soon" className="btn-saas-secondary group gap-2">
              <Terminal className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
              Explore CLI Docs
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
          <div className="absolute -inset-10 bg-blue-500/10 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="relative glass rounded-[2.5rem] p-1 border-white/10 shadow-2xl overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
             <div className="bg-black/80 rounded-[2.4rem] p-4">
               <TerminalWidget />
             </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
