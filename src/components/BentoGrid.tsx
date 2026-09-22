"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Fingerprint, Lock, Database, Upload, Hash, Clock, FileCheck, CheckCircle } from "lucide-react";

const PILLARS = [
  {
    num: "01",
    title: "POST-QUANTUM CRYPTOGRAPHY",
    items: ["ML-DSA-65", "ML-KEM-768", "Hybrid Signatures", "Crypto-Agility"],
    icon: ShieldCheck,
    description: "NIST-standardized post-quantum algorithms. Hybrid signatures combining ML-DSA-65 and Ed25519 for post-quantum migration with classical verification compatibility."
  },
  {
    num: "02",
    title: "DIGITAL EVIDENCE",
    items: ["BSA §63", "Evidence Hashing", "Metadata", "Chain of Custody", "Certificate Workflows"],
    icon: Fingerprint,
    description: "Cryptographic integrity, provenance, metadata capture and certificate-generation capabilities designed to support electronic-record workflows under Section 63 of the Bharatiya Sakshya Adhiniyam, 2023."
  },
  {
    num: "03",
    title: "SECURITY",
    items: ["Access Control", "Audit Trails", "Tamper Detection", "Incident Evidence"],
    icon: Lock,
    description: "IT Act-aligned controls for access monitoring, integrity verification, and tamper-evident logging. Security incident evidence captured with cryptographic signatures."
  },
  {
    num: "04",
    title: "PRIVACY",
    items: ["Encryption", "Data Classification", "Retention", "Controlled Deletion"],
    icon: Database,
    description: "Personal-data governance with AES-256-GCM encryption at rest, data classification policies, retention enforcement, and controlled deletion workflows aligned with the DPDP framework."
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
          <span className="text-accent-blue font-bold text-[10px] uppercase tracking-[0.2em] block font-mono">FOUR_LAYERS</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white font-mono">
            EVIDENCE <br />INTEGRITY.
          </h2>
          <p className="text-zinc-400 text-lg font-mono leading-relaxed">
            FOUR LAYERS. ONE PLATFORM. POST-QUANTUM CRYPTOGRAPHY, DIGITAL EVIDENCE, SECURITY CONTROLS, AND PRIVACY GOVERNANCE.
          </p>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {PILLARS.map((pillar, i) => (
          <motion.div
            key={pillar.num}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="glass rounded-none p-10 md:p-12 min-h-[320px] flex flex-col justify-between group overflow-hidden relative border border-border-bright transition-all hover:border-accent-blue"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 bg-black border border-accent-blue/50 flex items-center justify-center mb-8 group-hover:bg-accent-blue group-hover:text-black transition-colors">
                <pillar.icon className="w-5 h-5 text-accent-blue group-hover:text-black transition-colors" />
              </div>
              <span className="text-[10px] font-bold text-accent-blue uppercase tracking-widest font-mono">{pillar.num}</span>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-mono mt-2">
                {pillar.title}
              </h3>
              <p className="text-zinc-400 text-sm font-mono leading-relaxed mt-6 max-w-md">
                {pillar.description}
              </p>
            </div>

            <div className="relative z-10 mt-8 flex flex-wrap gap-2">
              {pillar.items.map((item) => (
                <span key={item} className="px-3 py-1 bg-accent-blue/5 border border-accent-blue/20 text-[9px] font-bold uppercase tracking-widest text-accent-blue font-mono">
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
