"use client";

import { motion } from "framer-motion";
import { Lock, Cpu, Fingerprint, Terminal, Shield, Database } from "lucide-react";

const CARDS = [
  {
    title: "Post-Quantum Cryptography APIs",
    description: "Enterprise-grade ML-KEM and ML-DSA endpoints. Future-proof your applications with one API call.",
    icon: Cpu,
    span: "md:col-span-8",
    tags: ["FIPS-203 Ready", "High Throughput"],
    bg: "bg-blue-600/5"
  },
  {
    title: "Zero-Trust Data Vaults",
    description: "Immutable storage with lattice-based encryption at rest and in transit.",
    icon: Database,
    span: "md:col-span-4",
    status: "v2.4.1 Stable",
    bg: "bg-indigo-600/5"
  },
  {
    title: "Quantum Identity Core",
    description: "Biometric and device-bound identity protocols designed for the post-quantum era.",
    icon: Fingerprint,
    span: "md:col-span-4",
    live: true,
    bg: "bg-emerald-600/5"
  },
  {
    title: "Quantum Blue CLI",
    description: "The ultimate developer tool. Encrypt, sign, and deploy from your terminal.",
    icon: Terminal,
    span: "md:col-span-8",
    terminal: true,
    bg: "bg-slate-600/5"
  },
  {
    title: "Compliance & Security Hub",
    description: "Real-time auditing and automated compliance reports for NIST and ISO standards.",
    icon: Shield,
    span: "md:col-span-6",
    bg: "bg-purple-600/5"
  },
  {
    title: "Hybrid Network Protocol",
    description: "Seamlessly bridge legacy RSA/ECC with next-gen lattice-based security.",
    icon: Lock,
    span: "md:col-span-6",
    bg: "bg-cyan-600/5"
  }
];

export function BentoGrid() {
  return (
    <section id="platform" className="py-32 max-w-7xl mx-auto px-6 bg-black">
      <div className="mb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4 max-w-2xl"
        >
          <span className="text-blue-500 font-bold text-[10px] uppercase tracking-[0.2em] block">Platform Ecosystem</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white">Quantum-Safe <br />Infrastructure.</h2>
          <p className="text-zinc-500 text-lg font-medium leading-relaxed">
            Everything you need to secure your modern enterprise against the threats of tomorrow. A complete ecosystem for post-quantum security.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {CARDS.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className={`${card.span} glass rounded-[2.5rem] p-8 md:p-10 min-h-[380px] flex flex-col justify-between group overflow-hidden relative border border-white/5 hover:border-white/10 transition-all`}
          >
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:border-blue-500/30 transition-colors">
                <card.icon className="w-5 h-5 text-zinc-400 group-hover:text-blue-400 transition-colors" />
              </div>
              <h3 className={`font-bold text-white tracking-tight mb-4 ${card.span.includes('col-span-8') ? 'text-3xl' : 'text-xl'}`}>
                {card.title}
              </h3>
              <p className="text-zinc-500 text-lg font-medium leading-relaxed max-w-md">
                {card.description}
              </p>
            </div>

            <div className="relative z-10 mt-8">
              {card.tags && (
                <div className="flex gap-2">
                  {card.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold uppercase tracking-widest text-zinc-400">{tag}</span>
                  ))}
                </div>
              )}
              {card.status && <div className="font-mono text-[10px] text-zinc-600">{card.status}</div>}
              {card.live && (
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <span className="font-mono text-[9px] text-blue-500 uppercase tracking-widest">Active Nodes</span>
                </div>
              )}
              {card.terminal && (
                <div className="bg-black/60 border border-white/10 rounded-xl p-6 font-mono text-[10px] sm:text-xs shadow-2xl">
                  <div className="space-y-2">
                    <p className="flex gap-2"><span className="text-zinc-600">$</span> <span className="text-zinc-300">qb init --project enterprise</span></p>
                    <p className="text-emerald-500 ml-4 font-bold">✓ Infrastructure Deployed</p>
                    <p className="text-zinc-500 ml-4 font-bold">Initializing ML-KEM Keypairs...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Subtle Gradient Backdrop */}
            <div className={`absolute -bottom-20 -right-20 w-80 h-80 ${card.bg} rounded-full blur-[100px] group-hover:opacity-100 opacity-30 transition-all duration-700`} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
