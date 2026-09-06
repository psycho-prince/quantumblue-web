"use client";

import { motion } from "framer-motion";
import { Lock, Cpu, Fingerprint, Terminal, Shield, Database } from "lucide-react";

const CARDS = [
  {
    title: "PQC_API_ENDPOINTS",
    description: "ENTERPRISE_GRADE ML-KEM AND ML-DSA ENDPOINTS. FUTURE_PROOF YOUR APPLICATIONS WITH ONE API CALL.",
    icon: Cpu,
    span: "md:col-span-8",
    tags: ["FIPS_203_READY", "HIGH_THROUGHPUT"],
    bg: "bg-accent-blue/10"
  },
  {
    title: "ZERO_TRUST_VAULTS",
    description: "IMMUTABLE STORAGE WITH LATTICE_BASED ENCRYPTION AT REST AND IN TRANSIT.",
    icon: Database,
    span: "md:col-span-4",
    status: "V2.4.1_STABLE",
    bg: "bg-accent-blue/10"
  },
  {
    title: "IDENTITY_CORE",
    description: "BIOMETRIC AND DEVICE_BOUND IDENTITY PROTOCOLS DESIGNED FOR THE POST_QUANTUM ERA.",
    icon: Fingerprint,
    span: "md:col-span-4",
    live: true,
    bg: "bg-accent-green/10"
  },
  {
    title: "QUANTUM_BLUE_CLI",
    description: "THE ULTIMATE DEVELOPER TOOL. ENCRYPT, SIGN, AND DEPLOY FROM YOUR TERMINAL.",
    icon: Terminal,
    span: "md:col-span-8",
    terminal: true,
    bg: "bg-accent-blue/10"
  },
  {
    title: "COMPLIANCE_HUB",
    description: "REAL_TIME AUDITING AND AUTOMATED COMPLIANCE REPORTS FOR NIST AND ISO STANDARDS.",
    icon: Shield,
    span: "md:col-span-6",
    bg: "bg-accent-blue/10"
  },
  {
    title: "HYBRID_PROTOCOL",
    description: "SEAMLESSLY BRIDGE LEGACY RSA/ECC WITH NEXT_GEN LATTICE_BASED SECURITY.",
    icon: Lock,
    span: "md:col-span-6",
    bg: "bg-accent-blue/10"
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
          <span className="text-accent-blue font-bold text-[10px] uppercase tracking-[0.2em] block font-mono">PLATFORM_ECOSYSTEM</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white font-mono">QUANTUM_SAFE <br />INFRASTRUCTURE.</h2>
          <p className="text-zinc-400 text-lg font-mono leading-relaxed">
            EVERYTHING YOU NEED TO SECURE YOUR MODERN ENTERPRISE AGAINST THE THREATS OF TOMORROW.
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
            className={`${card.span} glass rounded-none p-8 md:p-10 min-h-[380px] flex flex-col justify-between group overflow-hidden relative border border-border-bright transition-all hover:border-accent-blue`}
          >
            <div className="relative z-10">
              <div className="w-12 h-12 bg-black border border-accent-blue/50 flex items-center justify-center mb-8 group-hover:bg-accent-blue group-hover:text-black transition-colors">
                <card.icon className="w-5 h-5 text-accent-blue group-hover:text-black transition-colors" />
              </div>
              <h3 className={`font-bold text-white tracking-tight mb-4 font-mono ${card.span.includes('col-span-8') ? 'text-3xl' : 'text-xl'}`}>
                {card.title}
              </h3>
              <p className="text-zinc-400 text-sm font-mono leading-relaxed max-w-md">
                {card.description}
              </p>
            </div>

            <div className="relative z-10 mt-8">
              {card.tags && (
                <div className="flex gap-2">
                  {card.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-accent-blue/10 border border-accent-blue/30 text-[9px] font-bold uppercase tracking-widest text-accent-blue font-mono">{tag}</span>
                  ))}
                </div>
              )}
              {card.status && <div className="font-mono text-[10px] text-zinc-600">{card.status}</div>}
              {card.live && (
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                  <span className="font-mono text-[9px] text-accent-green uppercase tracking-widest">ACTIVE_NODES</span>
                </div>
              )}
              {card.terminal && (
                <div className="bg-black border border-accent-blue/30 p-6 font-mono text-[10px] sm:text-xs">
                  <div className="space-y-2">
                    <p className="flex gap-2"><span className="text-zinc-600">$</span> <span className="text-zinc-300">qb init --project enterprise</span></p>
                    <p className="text-accent-green ml-4 font-bold">✓ INFRASTRUCTURE_DEPLOYED</p>
                    <p className="text-zinc-500 ml-4 font-bold">INITIALIZING_ML_KEM_KEYPAIRS...</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
