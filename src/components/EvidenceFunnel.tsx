"use client";

import { motion } from "framer-motion";

export function EvidenceFunnel() {
  const steps = [
    { num: "01", label: "CAPTURE", desc: "Record evidence metadata and source information." },
    { num: "02", label: "HASH", desc: "Generate cryptographic fingerprints with SHA-256." },
    { num: "03", label: "SIGN", desc: "Apply hybrid classical + post-quantum signatures." },
    { num: "04", label: "TIMESTAMP", desc: "Bind evidence to a trusted time source (RFC 3161)." },
    { num: "05", label: "PRESERVE", desc: "Maintain provenance and chain of custody." },
    { num: "06", label: "VERIFY", desc: "Detect modification or integrity failure." },
    { num: "07", label: "CERTIFY", desc: "Generate the applicable evidence documentation." },
  ];

  return (
    <section className="py-24 bg-black border-t border-border-bright">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-accent-blue font-bold text-[10px] uppercase tracking-[0.2em] block font-mono">EVIDENCE_FLOW</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white font-mono mt-4">
            FROM CAPTURE TO CERTIFICATION
          </h2>
          <p className="text-zinc-500 text-sm font-mono mt-4 max-w-2xl mx-auto">
            EVERY EVIDENCE RECORD FOLLOWS THIS CRYPTOGRAPHIC PIPELINE — EACH STEP BUILT ON THE PREVIOUS ONE.
          </p>
        </div>

        <div className="space-y-12">
          {steps.map((step, i) => (
            <div key={step.num} className="flex items-start gap-6 group">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="w-12 h-12 rounded-full bg-accent-blue/10 border border-accent-blue/30 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-blue group-hover:text-black transition-colors"
              >
                <span className="text-accent-blue font-bold text-sm font-mono">{step.num}</span>
              </motion.div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg font-mono tracking-tight group-hover:text-accent-blue transition-colors">
                  {step.label}
                </h3>
                <p className="text-zinc-500 text-sm font-mono mt-1">{step.desc}</p>
              </div>
              <div className="hidden md:block w-px bg-border-bright flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
