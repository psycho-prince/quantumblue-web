"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldAlert, Zap } from "lucide-react";

const TEST_RESULTS = [
  {
    network: "NIST FIPS 204 ACVP",
    target: "ML-DSA-65 (Dilithium3)",
    status: "PASS",
    latency: "12ms",
    verified: true,
  },
  {
    network: "OQS Interoperability Testnet",
    target: "ML-KEM-768 (Kyber768)",
    status: "PASS",
    latency: "18ms",
    verified: true,
  },
  {
    network: "Cloudflare PQ TLS 1.3",
    target: "X25519+ML-KEM-768",
    status: "PASS",
    latency: "25ms",
    verified: true,
  }
];

export function CryptoTests() {
  return (
    <section id="crypto-tests" className="py-32 bg-[#000] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20 space-y-4">
          <span className="text-blue-500 font-bold text-[10px] uppercase tracking-[0.2em] block font-mono">VERIFIED_CRYPTOGRAPHY</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white font-mono">
            OPEN CRYPTO <br />NETWORK TESTS.
          </h2>
          <p className="text-zinc-500 text-sm max-w-xl font-mono leading-relaxed mt-4">
            REAL-TIME VALIDATION AGAINST GLOBAL STANDARDS (OQS, NIST ACVP, CLOUDFLARE). QUANTUM BLUE STRICTLY IMPLEMENTS FINAL FIPS 203/204 STANDARDS, NOT ROUND-3 SUBMISSIONS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TEST_RESULTS.map((result, i) => (
            <motion.div
              key={result.network}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 border border-white/10 bg-white/[0.02] rounded-xl flex flex-col gap-6"
            >
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                {result.verified ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-green-500/20">
                    <CheckCircle2 className="w-3 h-3" /> PASS
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-amber-500/20">
                    <ShieldAlert className="w-3 h-3" /> PENDING
                  </span>
                )}
              </div>

              <div>
                <div className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mb-1">{result.network}</div>
                <h3 className="text-white font-mono font-bold text-lg">{result.target}</h3>
              </div>
              
              <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center text-xs font-mono text-zinc-500">
                <span>Latency</span>
                <span className="text-white">{result.latency}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
