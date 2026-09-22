"use client";

import Link from "next/link";
import { ArrowRight, Upload, Hash, Key, Clock, ShieldCheck, CheckCircle, FileCheck } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "CAPTURE",
    description: "Record evidence metadata and source information. The foundation of every evidence record — capturing what was acquired, from where, and under what conditions.",
    icon: Upload,
  },
  {
    num: "02",
    title: "HASH",
    description: "Generate cryptographic fingerprints using SHA-256. The document's digital fingerprint — any modification changes the hash and breaks the chain.",
    icon: Hash,
  },
  {
    num: "03",
    title: "SIGN",
    description: "Apply hybrid classical + post-quantum signatures. ML-DSA-65 combined with Ed25519 for quantum-safe authenticity with classical verification compatibility.",
    icon: Key,
  },
  {
    num: "04",
    title: "TIMESTAMP",
    description: "Bind evidence to a trusted time source via RFC 3161. Proof of existence at a specific moment — independent of the evidence creator.",
    icon: Clock,
  },
  {
    num: "05",
    title: "PRESERVE",
    description: "Maintain provenance and chain of custody. Every access, transfer, and transformation is logged in a tamper-evident hash chain.",
    icon: ShieldCheck,
  },
  {
    num: "06",
    title: "VERIFY",
    description: "Detect modification or integrity failure. Anyone can verify the evidence independently — the chain, signature, timestamp, and hash all confirm integrity.",
    icon: CheckCircle,
  },
  {
    num: "07",
    title: "CERTIFY",
    description: "Generate the applicable evidence documentation. BSA §63 certificate workflows produce court-ready records with device particulars, production details, and operating conditions.",
    icon: FileCheck,
  },
];

export function HowItWorks() {
  return (
    <section className="py-32 bg-black border-t border-border-bright">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <span className="text-accent-blue font-bold text-[10px] uppercase tracking-[0.2em] mb-4 block font-mono">EVIDENCE_PIPELINE</span>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-none font-mono">
            CAPTURE. HASH. SIGN. <br />TIMESTAMP. PRESERVE. VERIFY. CERTIFY.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="glass p-8 rounded-none space-y-6 group border border-border-bright hover:border-accent-blue transition-all">
              <div className="w-12 h-12 bg-black border border-accent-blue/50 flex items-center justify-center group-hover:bg-accent-blue group-hover:text-black transition-colors">
                <step.icon className="w-5 h-5 text-accent-blue group-hover:text-black transition-colors" />
              </div>
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-accent-blue uppercase tracking-widest font-mono">{step.num}</span>
                <h3 className="text-lg font-bold text-white tracking-tight font-mono">{step.title}</h3>
                <p className="text-zinc-500 text-xs font-mono leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="#verify"
            className="inline-flex items-center gap-3 px-8 py-4 bg-accent-blue text-black font-bold text-xs uppercase tracking-widest hover:bg-blue-400 transition-colors"
          >
            TRY VERIFICATION <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
