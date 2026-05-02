"use client";

import { motion } from "framer-motion";
import { Cpu, Database, Fingerprint, ArrowRight, ShieldCheck, Zap, Globe, Lock } from "lucide-react";
import Link from "next/link";

const MODULES = [
  {
    title: "Post-Quantum Cryptography APIs",
    description: "Enterprise-grade ML-KEM and ML-DSA endpoints. Deploy quantum-resistant encryption across your applications with a single API call.",
    icon: Cpu,
    features: ["REST & gRPC Support", "Lattice-Based Security", "High-Throughput Nodes", "Edge Deployment"],
    status: "Stable v2.4"
  },
  {
    title: "Zero-Trust Data Vaults",
    description: "Immutable, distributed storage built on sovereign lattice architecture. Protect your sensitive assets from harvesting attacks.",
    icon: Database,
    features: ["Erasure Coding", "Atomic Notarization", "Geographic Sharding", "Quantum-Safe Integrity"],
    status: "Beta Access"
  },
  {
    title: "Quantum Identity Core",
    description: "Decentralized identity protocols using device-bound, post-quantum signatures. The foundation for secure user authentication.",
    icon: Fingerprint,
    features: ["Biometric Fusion", "Passkey Integration", "Zero-Knowledge Proofs", "Sovereign Key Management"],
    status: "Alpha Preview"
  }
];

export default function EcosystemPage() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-24 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-blue-500 font-bold text-[10px] uppercase tracking-[0.2em]"
          >
            <ShieldCheck className="w-4 h-4" />
            Platform Ecosystem
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white tracking-tight"
          >
            Modular Security. <br /> Universal Scale.
          </motion.h1>
          <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="text-zinc-500 text-xl font-medium max-w-2xl leading-relaxed"
          >
            Deploy individual modules or the full stack. Quantum Blue provides the infrastructure needed to survive the post-quantum epoch.
          </motion.p>
        </div>

        <div className="space-y-12">
          {MODULES.map((module, i) => (
            <motion.div 
              key={module.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 md:p-12 rounded-[3rem] grid lg:grid-cols-2 gap-12 items-center relative overflow-hidden group"
            >
              <div className="space-y-8 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:border-blue-500/40 transition-colors">
                  <module.icon className="w-8 h-8 text-blue-500" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-bold text-white tracking-tight">{module.title}</h2>
                    <span className="text-[10px] font-bold text-zinc-500 bg-white/5 px-2 py-0.5 rounded uppercase tracking-widest">{module.status}</span>
                  </div>
                  <p className="text-zinc-400 text-lg font-medium leading-relaxed">
                    {module.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {module.features.map(feature => (
                    <div key={feature} className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                       <Zap className="w-3 h-3 text-blue-500" />
                       {feature}
                    </div>
                  ))}
                </div>
                <div className="pt-4">
                   <Link href="/contact" className="btn-saas-primary px-10 gap-2">
                      Request Module Access <ArrowRight className="w-4 h-4" />
                   </Link>
                </div>
              </div>

              <div className="relative aspect-video glass rounded-3xl overflow-hidden flex items-center justify-center bg-black/40 border-white/5 group-hover:border-white/10 transition-all shadow-2xl">
                 {/* Abstract Visualization Placeholders */}
                 {i === 0 && <div className="grid grid-cols-4 gap-4 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                    {Array(12).fill(0).map((_, idx) => <div key={idx} className="h-10 bg-blue-500 rounded-lg animate-pulse" style={{ animationDelay: `${idx * 100}ms` }} />)}
                 </div>}
                 {i === 1 && <div className="relative">
                    <Database className="w-32 h-32 text-blue-500/20 group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full" />
                 </div>}
                 {i === 2 && <div className="relative">
                    <Lock className="w-32 h-32 text-blue-500/20" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-blue-500/10 rounded-full animate-ping" />
                 </div>}
                 <div className="absolute top-4 right-4 text-[10px] font-mono text-zinc-600">QB_PROTO_0x{i}F</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
