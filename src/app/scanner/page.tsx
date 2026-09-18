"use client";

import { useState } from "react";
import { Search, ShieldAlert, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ScannerPage() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;
    
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/scanner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain })
      });
      const data = await res.json();
      
      if (!data.success) {
        setError(data.error || "Failed to scan domain.");
      } else {
        setResult(data);
      }
    } catch(err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-black py-20 px-6 font-mono flex flex-col items-center">
      <div className="max-w-3xl w-full space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-block px-3 py-1 border border-accent-blue/30 bg-accent-blue/5 text-accent-blue text-xs font-bold tracking-widest uppercase mb-4">
            Free Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            PQC RISK SCANNER
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Enter a domain to instantly check if its TLS certificates are vulnerable to "Harvest Now, Decrypt Later" quantum attacks.
          </p>
        </div>

        <form onSubmit={handleScan} className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-accent-blue/20 to-accent-red/20 blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
          <div className="relative flex bg-black border border-border-bright p-2 rounded-none">
            <input 
              type="text" 
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com"
              className="flex-1 bg-transparent px-4 py-3 text-white placeholder:text-zinc-700 focus:outline-none"
              autoFocus
            />
            <button 
              type="submit" 
              disabled={loading}
              className="bg-white text-black px-8 font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-colors flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? "SCANNING..." : "SCAN"}
            </button>
          </div>
        </form>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-accent-red/10 border border-accent-red/30 text-accent-red text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="glass p-8 border border-border-bright space-y-8"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-border-bright">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{result.domain}</h2>
                  <div className="flex items-center gap-3 text-xs text-zinc-500">
                    <span>Protocol: {result.certificate.protocol}</span>
                    <span>&bull;</span>
                    <span>Issuer: {result.certificate.issuer}</span>
                  </div>
                </div>
                <div className={`flex items-center gap-4 px-6 py-4 border ${result.analysis.isPQC ? 'bg-accent-green/10 border-accent-green' : 'bg-accent-red/10 border-accent-red'}`}>
                  <span className="text-4xl font-bold">{result.analysis.grade}</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-400">Risk Level</span>
                    <span className={`font-bold ${result.analysis.isPQC ? 'text-accent-green' : 'text-accent-red'}`}>
                      {result.analysis.riskLevel}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  {result.analysis.isPQC ? (
                    <ShieldCheck className="w-8 h-8 text-accent-green flex-shrink-0" />
                  ) : (
                    <ShieldAlert className="w-8 h-8 text-accent-red flex-shrink-0" />
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      {result.analysis.isPQC ? "Quantum-Safe Signature" : "Classical Vulnerability Detected"}
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {result.analysis.message}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-black border border-border-bright">
                    <div className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Algorithm</div>
                    <div className="text-sm font-bold text-white truncate" title={result.certificate.pubkeyAlgorithm}>
                      {result.certificate.pubkeyAlgorithm}
                    </div>
                  </div>
                  <div className="p-4 bg-black border border-border-bright">
                    <div className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Key Size</div>
                    <div className="text-sm font-bold text-white">{result.certificate.bits} bits</div>
                  </div>
                </div>
              </div>

              {!result.analysis.isPQC && (
                <div className="mt-8 p-6 bg-accent-blue/5 border border-accent-blue/30 text-center space-y-4">
                  <h4 className="text-white font-bold">Fix this vulnerability.</h4>
                  <p className="text-sm text-zinc-400 max-w-lg mx-auto">
                    Sign up to generate a complete Cryptographic Bill of Materials (CBOM) and let our AI Analyst write the exact migration configurations for your servers.
                  </p>
                  <Link href="/sign-up" className="inline-flex items-center gap-2 mt-2 px-6 py-3 bg-accent-blue text-black font-bold text-xs uppercase tracking-widest hover:bg-blue-400 transition-colors">
                    Start Free Trial <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
