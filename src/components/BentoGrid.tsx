"use client";

import { motion } from "framer-motion";
import { Lock, Award, Activity, Terminal, Globe, Database } from "lucide-react";

const CARDS = [
  {
    title: "ML-KEM Confidentiality",
    description: "Hybrid encapsulation fusing classical X25519 with Kyber-768. Provable forward secrecy.",
    icon: Lock,
    span: "md:col-span-8",
    tags: ["NIST FIPS-203", "Post-Quantum"],
    bg: "bg-blue-600/5"
  },
  {
    title: "ML-DSA Authenticity",
    description: "Irrefutable authorship signed with Dilithium3 lattice structure.",
    icon: Award,
    span: "md:col-span-4",
    status: "Protocol 0xFA4B",
    bg: "bg-indigo-600/5"
  },
  {
    title: "Sovereign Sentinel",
    description: "Background daemon monitoring workspace for real-time artifact notarization.",
    icon: Activity,
    span: "md:col-span-4",
    live: true,
    bg: "bg-emerald-600/5"
  },
  {
    title: "Seamless CLI",
    description: "Zero friction. One command for absolute mathematical protection.",
    icon: Terminal,
    span: "md:col-span-8",
    terminal: true,
    bg: "bg-slate-600/5"
  },
  {
    title: "Immutable Vault",
    description: "Distributed storage with erasure coding and quantum-resistant integrity checks.",
    icon: Database,
    span: "md:col-span-6",
    bg: "bg-purple-600/5"
  },
  {
    title: "Global Mesh",
    description: "Low-latency verification nodes across 40+ regions worldwide.",
    icon: Globe,
    span: "md:col-span-6",
    bg: "bg-cyan-600/5"
  }
];

export function BentoGrid() {
  return (
    <section id="platform" className="py-40 max-w-7xl mx-auto px-10 bg-[#020617]">
      <div className="mb-24 flex flex-col md:flex-row items-end justify-between gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <span className="text-[#3B82F6] font-black text-xs uppercase tracking-[0.3em] block">Defensive Architecture</span>
          <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none text-white">Mathematical <br />Immunity.</h2>
        </motion.div>
        <motion.p 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-slate-400 text-xl font-medium max-w-xs leading-relaxed"
        >
          Eliminate complexity with the first platform built for the Post-Quantum transition.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {CARDS.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className={`${card.span} glass-vault rounded-[2.5rem] p-10 min-h-[400px] flex flex-col justify-between group overflow-hidden relative border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all`}
          >
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:border-blue-500/30 transition-colors">
                <card.icon className="w-6 h-6 text-slate-400 group-hover:text-blue-400 transition-colors" />
              </div>
              <h3 className={`font-black text-white uppercase tracking-tighter mb-4 leading-none ${card.span.includes('col-span-8') ? 'text-4xl' : 'text-2xl'}`}>
                {card.title.split(' ').map((word, idx) => (
                  <span key={idx}>{word} {idx === 0 && <br />}</span>
                ))}
              </h3>
              <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
                {card.description}
              </p>
            </div>

            <div className="relative z-10 mt-8">
              {card.tags && (
                <div className="flex gap-3">
                  {card.tags.map(tag => (
                    <span key={tag} className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400">{tag}</span>
                  ))}
                </div>
              )}
              {card.status && <div className="font-mono text-[9px] text-slate-500">{card.status}</div>}
              {card.live && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="font-mono text-[9px] text-blue-400 uppercase tracking-widest">Live Status</span>
                </div>
              )}
              {card.terminal && (
                <div className="bg-black/40 border border-white/5 rounded-xl p-6 font-mono text-[10px] sm:text-xs">
                  <div className="space-y-3">
                    <p className="flex gap-3"><span className="text-slate-600">➜</span> <span className="text-slate-300">quantumblue seal contract.sol</span></p>
                    <p className="text-blue-400 font-bold ml-6">🔒 Sealed & Synced</p>
                  </div>
                </div>
              )}
            </div>

            {/* Visual Decoration */}
            <div className={`absolute -bottom-20 -right-20 w-80 h-80 ${card.bg} rounded-full blur-[100px] group-hover:opacity-100 opacity-50 transition-all duration-700`} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
