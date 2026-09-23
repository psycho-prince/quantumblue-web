"use client";

import { motion } from "framer-motion";
import { Shield, Fingerprint, Lock, Database, CheckCircle2 } from "lucide-react";

export function Pillars() {
  return (
    <section id="pillars" className="py-32 bg-black border-t border-border-bright">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4 max-w-2xl"
          >
            <span className="text-accent-blue font-bold text-[10px] uppercase tracking-[0.2em] block font-mono">FOUR_LAYERS</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white font-mono">
              DISCOVER → PROTECT → PRESERVE → VERIFY
            </h2>
            <p className="text-zinc-400 text-lg font-mono leading-relaxed">
              QUANTUMBLUE COMBINES POST-QUANTUM CRYPTOGRAPHY, DIGITAL EVIDENCE INTEGRITY, SECURITY CONTROLS, AND PRIVACY GOVERNANCE IN A SINGLE PLATFORM.
            </p>
            <p className="text-zinc-600 text-sm font-mono mt-4 max-w-xl">
              The Cryptographic Digital Twin continuously models your organization&apos;s cryptographic surface — what exists, where it lives, what data it protects, and whether migration has been verified. This is what makes the platform hard to replace.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              num: "01",
              title: "POST-QUANTUM CRYPTOGRAPHY",
              subtitle: "ML-DSA-65 · ML-KEM-768 · Hybrid Signatures · Crypto-Agility",
              icon: Shield,
              description: "NIST-standardized post-quantum algorithms protecting against \"Store Now, Decrypt Later\" attacks. Hybrid signatures combining ML-DSA-65 and Ed25519 for post-quantum migration with classical verification compatibility.",
            },
            {
              num: "02",
              title: "DIGITAL EVIDENCE",
              subtitle: "BSA §63 · Evidence Hashing · Metadata · Chain of Custody · Certificates",
              icon: Fingerprint,
              description: "Cryptographic integrity, provenance, metadata capture and certificate-generation capabilities designed to support electronic-record workflows under Section 63 of the Bharatiya Sakshya Adhiniyam, 2023.",
            },
            {
              num: "03",
              title: "SECURITY",
              subtitle: "Access Control · Audit Trails · Tamper Detection · Incident Evidence",
              icon: Lock,
              description: "IT Act-aligned controls for access monitoring, integrity verification, and tamper-evident logging. Security incident evidence captured with cryptographic signatures and chain-of-custody integrity.",
            },
            {
              num: "04",
              title: "PRIVACY",
              subtitle: "Encryption · Data Classification · Retention · Controlled Deletion",
              icon: Database,
              description: "Personal-data governance with AES-256-GCM encryption at rest, data classification policies, retention enforcement, and controlled deletion workflows aligned with the DPDP framework.",
            },
            {
              num: "05",
              title: "PROOF_OF_MIGRATION",
              subtitle: "Digital Twin · Risk Scoring · Evidence Artifacts · Public Verification",
              icon: CheckCircle2,
              description: "The highest-value layer: a continuously updated Cryptographic Digital Twin that scores quantum risk, tracks migration events, produces independently verifiable evidence, and lets anyone verify integrity without trusting the platform.",
            },
          ].map((pillar) => (
            <motion.div
              key={pillar.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="glass p-10 rounded-none border border-border-bright hover:border-accent-blue transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/5 rounded-full blur-3xl -mr-20 -mt-20 transition-all group-hover:bg-accent-blue/10" />
              <div className="relative">
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-12 h-12 bg-black border border-accent-blue/50 flex items-center justify-center group-hover:bg-accent-blue group-hover:text-black transition-colors flex-shrink-0">
                    <pillar.icon className="w-5 h-5 text-accent-blue group-hover:text-black transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-accent-blue uppercase tracking-widest font-mono">{pillar.num}</span>
                    <h3 className="text-xl font-bold text-white tracking-tight font-mono">{pillar.title}</h3>
                  </div>
                </div>
                <p className="text-zinc-400 font-mono text-sm leading-relaxed mb-6">{pillar.description}</p>
                <div className="flex flex-wrap gap-2">
                  {pillar.subtitle.split("·").map((item, idx) => (
                    <span key={idx} className="px-3 py-1 bg-accent-blue/5 border border-accent-blue/20 text-[9px] font-bold uppercase tracking-widest text-accent-blue font-mono">
                      {item.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
