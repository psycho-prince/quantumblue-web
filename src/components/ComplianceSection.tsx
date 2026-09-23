"use client";

import { motion } from "framer-motion";
import { FileCheck, Shield, Database, Clock, Lock } from "lucide-react";

export function ComplianceSection() {
  return (
    <section className="py-24 bg-black border-t border-border-bright">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-accent-blue font-bold text-[10px] uppercase tracking-[0.2em] block font-mono">LEGAL & SECURITY FRAMEWORK</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white font-mono mt-4">
            BUILT ON RECOGNIZED STANDARDS
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {[
            { name: "BSA §63", desc: "Electronic Evidence", icon: FileCheck },
            { name: "IT Act", desc: "Security Controls", icon: Shield },
            { name: "DPDP", desc: "Data Governance", icon: Database },
            { name: "RFC 3161", desc: "Trusted Timestamping", icon: Clock },
            { name: "FIPS 203/204", desc: "Post-Quantum Crypto", icon: Lock },
          ].map((fw) => (
            <motion.div
              key={fw.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass p-10 flex flex-col items-center justify-center border border-border-bright group hover:border-accent-blue/50 transition-all"
            >
              <fw.icon className="w-6 h-6 text-accent-blue mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-bold text-sm font-mono tracking-wider">{fw.name}</h3>
              <p className="text-zinc-500 text-[10px] font-mono mt-2 uppercase tracking-widest">{fw.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="p-6 bg-accent-blue/5 border border-accent-blue/20 rounded-none text-center">
          <p className="text-zinc-400 text-xs font-mono leading-relaxed">
            Control mapping — not a representation that QuantumBlue itself guarantees statutory compliance or legal admissibility.
            QuantumBlue provides technical controls that support applicable legal and evidentiary requirements.
          </p>
          <p className="text-zinc-600 text-[10px] font-mono leading-relaxed mt-3">
            The Proof of Migration framework produces independently verifiable evidence artifacts — SHA-256 integrity hashes, digital signatures, RFC 3161 timestamps, and full chain-of-custody records — that auditable regulatory frameworks can reference without requiring trust in QuantumBlue&apos;s internal logs.
          </p>
        </div>
      </div>
    </section>
  );
}
