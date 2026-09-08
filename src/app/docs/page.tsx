"use client";

import { motion } from "framer-motion";
import { Terminal, Shield, Key, FileText, Cpu, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6 text-white selection:bg-accent-blue selection:text-black">
      <div className="max-w-5xl mx-auto space-y-24">
        
        {/* Header */}
        <section className="text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue font-mono text-xs font-bold uppercase tracking-widest border border-accent-blue/20"
          >
            <Terminal className="w-4 h-4" />
            Developer Documentation
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight font-mono uppercase"
          >
            PQC API Reference
          </motion.h1>
          <motion.p 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
             className="text-zinc-400 text-lg md:text-xl font-mono max-w-2xl mx-auto leading-relaxed"
          >
            Integrate military-grade Post-Quantum Cryptography directly into your application using our RESTful JSON endpoints.
          </motion.p>
        </section>

        {/* API Endpoints */}
        <section className="space-y-12">
          <div className="border-b border-border-bright pb-4">
            <h2 className="text-2xl font-bold font-mono tracking-widest text-white uppercase">Core Endpoints</h2>
          </div>

          <div className="grid gap-8">
            {/* Generate Keys */}
            <div className="glass p-8 border border-border-bright space-y-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-accent-blue/10"></div>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-accent-blue text-black font-bold font-mono text-xs tracking-widest">POST</span>
                <code className="text-white font-mono text-lg">/v1/keys</code>
              </div>
              <p className="text-zinc-400 font-mono text-sm leading-relaxed">
                Generates a pure ML-DSA-65 (Kyber/Dilithium) public and private keypair.
              </p>
              <div className="bg-black border border-border-bright p-4 overflow-x-auto">
                <pre className="text-xs text-zinc-300 font-mono">
                  {`curl -X POST https://quantumblue-cli.onrender.com/v1/keys \\
  -H "Authorization: Bearer <YOUR_API_KEY>" \\
  -H "Content-Type: application/json"`}
                </pre>
              </div>
            </div>

            {/* Sign */}
            <div className="glass p-8 border border-border-bright space-y-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-green/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-accent-green/10"></div>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-accent-green text-black font-bold font-mono text-xs tracking-widest">POST</span>
                <code className="text-white font-mono text-lg">/v1/sign</code>
              </div>
              <p className="text-zinc-400 font-mono text-sm leading-relaxed">
                Cryptographically signs a payload using your ML-DSA-65 private key.
              </p>
              <div className="bg-black border border-border-bright p-4 overflow-x-auto">
                <pre className="text-xs text-zinc-300 font-mono">
                  {`curl -X POST https://quantumblue-cli.onrender.com/v1/sign \\
  -H "Authorization: Bearer <YOUR_API_KEY>" \\
  -d '{"data": "base64_payload", "private_key": "your_private_key"}'`}
                </pre>
              </div>
            </div>

            {/* Verify */}
            <div className="glass p-8 border border-border-bright space-y-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-red/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-accent-red/10"></div>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-accent-red text-black font-bold font-mono text-xs tracking-widest">POST</span>
                <code className="text-white font-mono text-lg">/v1/verify</code>
              </div>
              <p className="text-zinc-400 font-mono text-sm leading-relaxed">
                Verifies a digital signature against the original payload and public key.
              </p>
            </div>
            
            {/* CBOM */}
            <div className="glass p-8 border border-border-bright space-y-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-yellow-500/10"></div>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-yellow-500 text-black font-bold font-mono text-xs tracking-widest">POST</span>
                <code className="text-white font-mono text-lg">/v1/cbom</code>
              </div>
              <p className="text-zinc-400 font-mono text-sm leading-relaxed">
                Generates a Cryptographic Bill of Materials (CBOM) by scanning your source code for legacy primitives.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="space-y-12">
          <div className="border-b border-border-bright pb-4">
            <h2 className="text-2xl font-bold font-mono tracking-widest text-white uppercase">Platform Features</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass p-8 border border-border-bright space-y-4">
              <Shield className="w-8 h-8 text-accent-blue" />
              <h3 className="text-lg font-bold font-mono text-white">Quantum-Safe Core</h3>
              <p className="text-zinc-400 font-mono text-sm">NIST-approved ML-DSA-65 algorithms to protect against "Store Now, Decrypt Later" attacks.</p>
            </div>
            <div className="glass p-8 border border-border-bright space-y-4">
              <FileText className="w-8 h-8 text-accent-green" />
              <h3 className="text-lg font-bold font-mono text-white">Immutable Audit Logs</h3>
              <p className="text-zinc-400 font-mono text-sm">Every single cryptographic operation is immutably logged in your PostgreSQL database for compliance.</p>
            </div>
            <div className="glass p-8 border border-border-bright space-y-4">
              <Cpu className="w-8 h-8 text-accent-red" />
              <h3 className="text-lg font-bold font-mono text-white">CBOM Pipeline</h3>
              <p className="text-zinc-400 font-mono text-sm">Automated CI/CD scanning to detect deprecated RSA/ECC usage across your entire enterprise infrastructure.</p>
            </div>
            <div className="glass p-8 border border-border-bright space-y-4">
              <Key className="w-8 h-8 text-yellow-500" />
              <h3 className="text-lg font-bold font-mono text-white">Tenant Isolation</h3>
              <p className="text-zinc-400 font-mono text-sm">Strict RBAC and organizational boundaries for multi-tenant SaaS environments.</p>
            </div>
          </div>
        </section>

        {/* Pricing Link */}
        <section className="py-12 border-t border-border-bright text-center space-y-6">
          <h2 className="text-3xl font-bold font-mono text-white">Ready to deploy?</h2>
          <p className="text-zinc-400 font-mono text-sm max-w-lg mx-auto">
            Review our flexible pricing plans designed to scale with your enterprise infrastructure.
          </p>
          <div className="pt-4">
            <Link href="/pricing" className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest font-mono hover:bg-zinc-200 transition-all">
              VIEW PRICING
            </Link>
          </div>
        </section>
        
      </div>
    </div>
  );
}
