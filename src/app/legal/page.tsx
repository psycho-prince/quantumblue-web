"use client";

import { motion } from "framer-motion";
import { Scale, ShieldCheck, FileCheck, Gavel, Lock, Info } from "lucide-react";
import Link from "next/link";

const LEGAL_DOCS = [
  {
    title: "Terms of Service",
    description: "Legal agreement governing the use of the Quantum Blue platform, CLI, and hosted APIs.",
    lastUpdated: "January 15, 2026",
    icon: Gavel
  },
  {
    title: "Privacy Policy",
    description: "Detailed information on how we handle data and our commitment to zero-knowledge protocols.",
    lastUpdated: "January 15, 2026",
    icon: Lock
  },
  {
    title: "DPA & Compliance",
    description: "Data Processing Addendum and our adherence to NIST post-quantum standards.",
    lastUpdated: "February 01, 2026",
    icon: FileCheck
  }
];

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-24 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-blue-500 font-bold text-[10px] uppercase tracking-[0.2em]"
          >
            <Scale className="w-4 h-4" />
            Legal & Compliance
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white tracking-tight"
          >
            Trust & Transparency.
          </motion.h1>
          <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="text-zinc-500 text-xl font-medium max-w-2xl leading-relaxed"
          >
            Our legal framework is designed to match the rigor of our cryptographic standards. We prioritize your sovereignty and data integrity.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {LEGAL_DOCS.map((doc, i) => (
            <motion.div 
              key={doc.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-10 rounded-[3rem] space-y-8 flex flex-col justify-between hover:border-white/10 transition-all"
            >
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500">
                  <doc.icon className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-xl font-bold text-white tracking-tight">{doc.title}</h3>
                   <p className="text-zinc-500 text-sm font-medium leading-relaxed">{doc.description}</p>
                </div>
              </div>
              <div className="pt-8 border-t border-white/5 flex flex-col gap-4">
                 <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                    <Info className="w-3 h-3" /> Last Updated: {doc.lastUpdated}
                 </span>
                 <Link href="/coming-soon" className="text-xs font-bold text-white hover:text-blue-500 transition-colors uppercase tracking-widest">
                    View Document →
                 </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="glass p-12 rounded-[3rem] bg-blue-500/[0.02] border-blue-500/20"
        >
           <div className="max-w-3xl space-y-6">
              <h3 className="text-2xl font-bold text-white">Security & Audit Compliance</h3>
              <p className="text-zinc-500 text-lg font-medium leading-relaxed">
                 Quantum Blue is engineered to meet and exceed the evolving standards of the **National Institute of Standards and Technology (NIST)** for Post-Quantum Cryptography. We undergo regular third-party security audits to ensure our lattice-based implementations remain irrefutable.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                 <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">SOC2 Type II Compliant</span>
                 </div>
                 <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">GDPR Ready</span>
                 </div>
                 <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">NIST FIPS-203 Verified</span>
                 </div>
              </div>
           </div>
        </motion.div>
      </div>
    </div>
  );
}
