"use client";

import { motion } from "framer-motion";
import { Cpu, Database, Workflow, Router, BarChart3, GitBranch, ArrowRight, ShieldCheck, Zap, Lock } from "lucide-react";
import Link from "next/link";

const CAPABILITIES = [
  {
    id: "ebpf-discovery",
    title: "Zero-Instrumentation Runtime Discovery",
    subtitle: "eBPF-powered production ground truth",
    description: "QuantumBlue's eBPF sensor hooks into the Linux kernel to observe real cryptographic library calls — OpenSSL, BoringSSL, Java Crypto — as they execute. No code changes, no language-specific agents, no static guessing. This is how you build an undeniable Cryptographic Asset Graph.",
    icon: Cpu,
    features: [
      "eBPF kernel probe — observes crypto calls as they happen",
      "No instrumentation required — works on running production systems",
      "OpenSSL, BoringSSL, Java Crypto — covers the major libraries",
      "Cryptographic Asset Graph — maps what actually runs, not what code says",
      "CD into Phase 2 — this is what separates QuantumBlue from static scanners"
    ],
    status: "Phase 2 — In Development",
    statusColor: "text-accent-blue"
  },
  {
    id: "shift-left-guardrail",
    title: "Shift-Left Cryptographic Guardrail",
    subtitle: "Block legacy crypto before it reaches production",
    description: "While you're mapping production debt, developers are committing new RSA-2048. QuantumBlue integrates with GitHub and GitLab to block pull requests that introduce legacy cryptography — RSA-2048, ECDSA, SHA-1, and other pre-quantum primitives. This moves you from an auditing tool to an essential developer security platform.",
    icon: GitBranch,
    features: [
      "GitHub App — blocks PRs introducing legacy crypto",
      "GitLab MR integration — same gate for GitLab workflows",
      "CLI CI mode — qb guardrail --source . for any pipeline",
      "Prevents new cryptographic debt — stop the bleeding at the source",
      "Phase 4 expands with AI Copilot auto-remediation suggestions"
    ],
    status: "Phase 4 — Planned",
    statusColor: "text-accent-red"
  },
  {
    id: "migration-rollback",
    title: "Automated Rollback — Fearless, Reversible Migration",
    subtitle: "One-click rollback safety net for every PQC migration",
    description: "The biggest fear enterprise IT has about PQC migration isn't algorithm strength — it's that ML-KEM or ML-DSA certificates will break legacy load balancers, drop packets, or crash apps. QuantumBlue integrates with Envoy, Istio, and Kong to dynamically route traffic to PQC endpoints, then monitors error rates in real time. If error thresholds spike, one click reverts to ECDSA/RSA — instantly.",
    icon: Router,
    features: [
      "Envoy Proxy — route PQC traffic with real-time 5xx monitoring",
      "Istio — service mesh PQC rollout with automatic rollback triggers",
      "Kong — API gateway PQC tunnel management",
      "One-click rollback — revert to classical algorithms in seconds",
      "Proof of Migration — auditable artifact for every completed migration",
      "Phase 3 — migration campaigns with rollback safety nets win enterprise deals"
    ],
    status: "Phase 3 — Planned",
    statusColor: "text-accent-yellow"
  },
  {
    id: "dspm-hndl",
    title: "DSPM Integration for Automated HNDL Prioritization",
    subtitle: "Data sensitivity × retention = real HNDL risk",
    description: "HNDL prioritization is only as good as the data-sensitivity data behind it. QuantumBlue integrates with leading Data Security Posture Management (DSPM) tools via API. When the DSPM flags a database as containing PII with 10-year compliance retention, QuantumBlue automatically ingests that tag, sees the database uses AES-128, and elevates it to a P0 HNDL risk. No manual tagging required.",
    icon: Database,
    features: [
      "DSPM API integration — ingest sensitivity tags automatically",
      "PII auto-tagging — no manual data classification needed",
      "Retention-aware risk scoring — Data Sensitivity × Retention × Weakness",
      "P0 HNDL elevation — prioritized migration queue based on real business risk",
      "Phase 4 — AI Copilot enriches with remediation guidance"
    ],
    status: "Phase 4 — Planned",
    statusColor: "text-accent-red"
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
            Continuous Cryptographic Posture Management
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white tracking-tight"
          >
            Discover. Assess. Prioritize.
            <br />
            Migrate. Verify. Prove.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 text-xl font-medium max-w-2xl leading-relaxed"
          >
            QuantumBlue is an operational platform that orchestrates the entire post-quantum migration lifecycle — not just a dashboard that generates more alerts. Four differentiating capabilities separate us from the incumbents: IBM Quantum Safe, SandboxAQ AQtive Guard, Entrust, and Encryption Consulting CBOM Secure.
          </motion.p>
        </div>

        {/* 4 Differentiating Capabilities */}
        <div className="space-y-12 mb-20">
          {CAPABILITIES.map((cap, i) => (
            <motion.div
              key={cap.id}
              id={cap.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 md:p-12 rounded-[3rem] grid lg:grid-cols-2 gap-12 items-center relative overflow-hidden group scroll-mt-24"
            >
              <div className="space-y-8 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:border-blue-500/40 transition-colors">
                  <cap.icon className="w-8 h-8 text-blue-500" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-bold text-white tracking-tight">{cap.title}</h2>
                    <span className={`text-[10px] font-bold ${cap.statusColor} bg-black/50 px-2 py-0.5 rounded uppercase tracking-widest border border-border-bright`}>
                      {cap.status}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-lg font-medium leading-relaxed">
                    {cap.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {cap.features.map(feature => (
                    <div key={feature} className="flex items-start gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                      <Zap className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
                <div className="pt-4">
                  <Link href="/docs" className="btn-saas-primary px-10 gap-2">
                    Read the Docs <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="relative aspect-video glass rounded-3xl overflow-hidden flex items-center justify-center bg-black/40 border-white/5 group-hover:border-white/10 transition-all shadow-2xl">
                {i === 0 && (
                  <div className="grid grid-cols-4 gap-4 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                    {Array(12).fill(0).map((_, idx) => (
                      <div key={idx} className="h-10 bg-blue-500 rounded-lg animate-pulse" style={{ animationDelay: `${idx * 100}ms` }} />
                    ))}
                  </div>
                )}
                {i === 1 && (
                  <div className="relative">
                    <Workflow className="w-32 h-32 text-blue-500/20 group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full" />
                  </div>
                )}
                {i === 2 && (
                  <div className="relative">
                    <Router className="w-32 h-32 text-blue-500/20" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-blue-500/10 rounded-full animate-ping" />
                  </div>
                )}
                {i === 3 && (
                  <div className="relative">
                    <BarChart3 className="w-32 h-32 text-blue-500/20" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-blue-500/10 rounded-full animate-ping" />
                  </div>
                )}
                <div className="absolute top-4 right-4 text-[10px] font-mono text-zinc-600">QB_CCPM_{cap.id}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Core PQC Module */}
        <div className="glass p-8 md:p-12 rounded-[3rem] grid lg:grid-cols-2 gap-12 items-center relative overflow-hidden group scroll-mt-24">
          <div className="space-y-8 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-accent-green/10 border border-accent-green/20 flex items-center justify-center">
              <Cpu className="w-8 h-8 text-accent-green" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold text-white tracking-tight">Quantum-Safe Core</h2>
                <span className="text-[10px] font-bold text-accent-green bg-accent-green/10 px-2 py-0.5 rounded uppercase tracking-widest border border-accent-green/20">
                  Stable v2.4
                </span>
              </div>
              <p className="text-zinc-400 text-lg font-medium leading-relaxed">
                Enterprise-grade ML-KEM-768 (FIPS 203) and ML-DSA-65 (FIPS 204) endpoints. Deploy quantum-resistant encryption and signatures across your applications with a single API call. Hybrid signatures (ML-DSA-65 + Ed25519) for transitional compatibility.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {["REST & gRPC Support", "Lattice-Based Security", "High-Throughput Nodes", "Edge Deployment", "Hybrid Signatures", "FIPS 203/204 Compliant"].map(feature => (
                <div key={feature} className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  <Zap className="w-3 h-3 text-accent-green" />
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
            <div className="grid grid-cols-4 gap-4 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
              {Array(12).fill(0).map((_, idx) => (
                <div key={idx} className="h-10 bg-accent-green rounded-lg animate-pulse" style={{ animationDelay: `${idx * 100}ms` }} />
              ))}
            </div>
            <div className="absolute top-4 right-4 text-[10px] font-mono text-zinc-600">QB_PROTO_0xPQC</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-16 space-y-6">
          <h2 className="text-4xl font-bold text-white tracking-tight">From scanner to full CCPM platform</h2>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto">
            Start free with the External Attack Surface Scanner. Upgrade to the full platform for eBPF discovery, CI/CD guardrails, DSPM integrations, and reversible migration orchestration.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/scanner" className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest font-mono hover:bg-zinc-200 transition-all inline-block">
              Run a Free Scan
            </Link>
            <Link href="/sign-up" className="px-8 py-3 bg-accent-blue text-black font-bold uppercase tracking-widest font-mono hover:bg-blue-400 transition-all inline-block">
              Start Free Trial
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
