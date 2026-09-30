import { Metadata } from "next";
import { Terminal, Shield, Key, FileText, Cpu, Link as LinkIcon, BarChart3, Router, GitBranch, Database } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CCPM Platform Documentation | Quantum Blue",
  description: "QuantumBlue Continuous Cryptographic Posture Management (CCPM) — Discover, assess, prioritize, migrate, verify, and prove. eBPF runtime discovery, shift-left CI/CD guardrails, automated rollback, DSPM integrations.",
  openGraph: {
    title: "CCPM Platform — Quantum Blue",
    description: "Continuous Cryptographic Posture Management: eBPF discovery, CI/CD blockers, DSPM HNDL prioritization, and one-click rollback migrations.",
  },
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6 text-white selection:bg-accent-blue selection:text-black">
      <div className="max-w-5xl mx-auto space-y-24">

        {/* Header */}
        <section className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue font-mono text-xs font-bold uppercase tracking-widest border border-accent-blue/20">
            <Terminal className="w-4 h-4" />
            Platform Documentation
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight font-mono uppercase">
            Continuous Cryptographic Posture Management
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl font-mono max-w-2xl mx-auto leading-relaxed">
            QuantumBlue is not just a scanner. It is an operational platform that discovers your cryptographic assets, prioritizes HNDL risk, blocks new debt at the source, orchestrates reversible migrations, and generates the Proof of Migration your auditors need.
          </p>
        </section>

        {/* The 4 Capabilities */}
        <section className="space-y-12">
          <div className="border-b border-border-bright pb-4">
            <h2 className="text-2xl font-bold font-mono tracking-widest text-white uppercase">The 4 Capabilities That Differentiate QuantumBlue</h2>
          </div>

          {/* 1. eBPF */}
          <div className="glass p-8 border border-border-bright space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-accent-blue/10"></div>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-accent-blue text-black font-bold font-mono text-xs tracking-widest">CAPABILITY 1</span>
              <span className="text-white font-mono text-lg font-bold">Zero-Instrumentation Runtime Discovery (eBPF)</span>
            </div>
            <p className="text-zinc-400 font-mono text-sm leading-relaxed">
              Most competitors build CBOMs by scanning source code, file systems, or network traffic — which is blind to what's actually executing in production. QuantumBlue's eBPF-based runtime sensor hooks into the Linux kernel to observe real cryptographic library calls (OpenSSL, BoringSSL, Java Crypto) as they happen, without requiring developers to install language-specific agents or alter their code.
            </p>
            <div className="bg-black border border-border-bright p-4 overflow-x-auto font-mono text-xs text-zinc-300">
              <pre className="text-xs text-zinc-300 font-mono">
{`Why this matters:
  Static scanners guess based on code on disk.
  eBPF proves what is actually running in production.
  The resulting Cryptographic Asset Graph is undeniable evidence
  for auditors, CISOs, and migration planning.}`}
              </pre>
            </div>
            <div className="flex flex-wrap gap-2">
              {["eBPF kernel probe", "No code changes required", "OpenSSL / BoringSSL / Java Crypto", "Cryptographic Asset Graph", "Production ground truth"].map(tag => (
                <span key={tag} className="text-[10px] font-bold text-zinc-500 border border-border-bright px-2 py-1 rounded uppercase tracking-widest">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 2. Shift-Left */}
          <div className="glass p-8 border border-border-bright space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-green/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-accent-green/10"></div>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-accent-green text-black font-bold font-mono text-xs tracking-widest">CAPABILITY 2</span>
              <span className="text-white font-mono text-lg font-bold">Shift-Left Cryptographic Guardrail (CI/CD Blocker)</span>
            </div>
            <p className="text-zinc-400 font-mono text-sm leading-relaxed">
              While you're mapping production debt, developers are writing new code with hardcoded RSA-2048. QuantumBlue integrates directly with GitHub and GitLab to block pull requests that introduce legacy cryptography — before it ever reaches production. Become the tool that prevents cryptographic debt from entering your codebase, not just the dashboard that reports on it after the fact.
            </p>
            <div className="bg-black border border-border-bright p-4 overflow-x-auto font-mono text-xs text-zinc-300">
              <pre className="text-xs text-zinc-300 font-mono">
{`Supported integrations:
  GitHub App — blocks PRs introducing RSA-2048, ECDSA, SHA-1, etc.
  GitLab MR integration — same gate for GitLab-based workflows
  CLI in CI — qb guardrail --source . for any pipeline
  Configurable policy — fail on legacy, warn on deprecated, allow PQC

Phased rollout: Phase 1 blocks PRs with legacy crypto.
Phase 2 adds auto-remediation suggestions via the AI Copilot.}`}
              </pre>
            </div>
            <div className="flex flex-wrap gap-2">
              {["GitHub integration", "GitLab integration", "CLI CI mode", "PR blocking", "Prevents new debt", "Phase 4: AI auto-remediation"].map(tag => (
                <span key={tag} className="text-[10px] font-bold text-zinc-500 border border-border-bright px-2 py-1 rounded uppercase tracking-widest">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 3. Automated Rollback */}
          <div className="glass p-8 border border-border-bright space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-yellow/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-accent-yellow/10"></div>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-accent-yellow text-black font-bold font-mono text-xs tracking-widest">CAPABILITY 3</span>
              <span className="text-white font-mono text-lg font-bold">Automated Rollback — Fearless, Reversible Migration</span>
            </div>
            <p className="text-zinc-400 font-mono text-sm leading-relaxed">
              The biggest fear enterprise IT has about PQC migration isn't algorithm strength — it's that ML-KEM or ML-DSA certificates (with massive key sizes) will break legacy load balancers, drop packets, or crash applications. QuantumBlue integrates with Envoy, Istio, and Kong to dynamically route traffic to PQC endpoints, then monitors error rates in real time. If error thresholds spike, one click reverts to ECDSA/RSA — instantly.
            </p>
            <div className="bg-black border border-border-bright p-4 overflow-x-auto font-mono text-xs text-zinc-300">
              <pre className="text-xs text-zinc-300 font-mono">
{`Supported gateways:
  Envoy Proxy — route PQC traffic, monitor 5xx/error rates
  Istio — service mesh PQC rollout with automatic rollback triggers
  Kong — API gateway PQC tunnel management

Rollback safety net:
  Real-time error rate monitoring
  One-click revert to classical algorithms
  Migration campaign audit trail
  Proof of Migration artifact for every completed migration

Positioning: "Fearless, reversible migration wins enterprise deals
faster than compliance checklists."`}</pre>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Envoy integration", "Istio integration", "Kong integration", "Real-time error monitoring", "One-click rollback", "Proof of Migration", "Phase 3: Migration campaigns"].map(tag => (
                <span key={tag} className="text-[10px] font-bold text-zinc-500 border border-border-bright px-2 py-1 rounded uppercase tracking-widest">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 4. DSPM */}
          <div className="glass p-8 border border-border-bright space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-red/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-accent-red/10"></div>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-accent-red text-black font-bold font-mono text-xs tracking-widest">CAPABILITY 4</span>
              <span className="text-white font-mono text-lg font-bold">DSPM Integration for Automated HNDL Prioritization</span>
            </div>
            <p className="text-zinc-400 font-mono text-sm leading-relaxed">
              HNDL prioritization is only as good as the data-sensitivity data behind it. QuantumBlue integrates with leading Data Security Posture Management (DSPM) tools via API. When the DSPM flags a database as containing "PII with 10-year compliance retention," QuantumBlue automatically ingests that tag, sees the database is using AES-128, and elevates it to a P0 HNDL risk. No manual tagging required.
            </p>
            <div className="bg-black border border-border-bright p-4 overflow-x-auto font-mono text-xs text-zinc-300">
              <pre className="text-xs text-zinc-300 font-mono">
{`How it works:
  1. DSPM flags asset: "PII, 10-year retention, regulated"
  2. QuantumBlue ingests the sensitivity tag via API
  3. QuantumBlue checks the encryption in use (e.g. AES-128)
  4. Risk score = Data Sensitivity × Retention × Weakness
  5. Asset is elevated to P0 HNDL priority in the dashboard

Why this matters:
  HNDL exposure = Data value × Time-to-quantum × Retention
  Manual tagging stalls. DSPM integration automates it.
  The result is a prioritized migration queue that reflects
  real business risk, not just cryptographic weakness.

Phase 4: AI Copilot enriches this with remediation guidance.}`}
              </pre>
            </div>
            <div className="flex flex-wrap gap-2">
              {["DSPM API integration", "PII auto-tagging", "Retention-aware risk", "HNDL prioritization", "P0 risk elevation", "Phase 4: AI Copilot"].map(tag => (
                <span key={tag} className="text-[10px] font-bold text-zinc-500 border border-border-bright px-2 py-1 rounded uppercase tracking-widest">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Features (existing, updated) */}
        <section className="space-y-12">
          <div className="border-b border-border-bright pb-4">
            <h2 className="text-2xl font-bold font-mono tracking-widest text-white uppercase">Core Platform</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass p-8 border border-border-bright space-y-3">
              <Cpu className="w-8 h-8 text-accent-blue" />
              <h3 className="text-lg font-bold font-mono text-white">Quantum-Safe Core</h3>
              <p className="text-zinc-400 font-mono text-sm">NIST-approved ML-DSA-65 (FIPS 204) and ML-KEM-768 (FIPS 203) for signatures, key encapsulation, and hybrid transitional architectures.</p>
            </div>
            <div className="glass p-8 border border-border-bright space-y-3">
              <FileText className="w-8 h-8 text-accent-green" />
              <h3 className="text-lg font-bold font-mono text-white">Immutable Audit Logs</h3>
              <p className="text-zinc-400 font-mono text-sm">Every cryptographic operation immutably logged. RFC 3161 trusted timestamping. Chain-of-custody continuity for compliance and evidentiary workflows.</p>
            </div>
            <div className="glass p-8 border border-border-bright space-y-3">
              <BarChart3 className="w-8 h-8 text-accent-red" />
              <h3 className="text-lg font-bold font-mono text-white">Cryptographic Asset Graph</h3>
              <p className="text-zinc-400 font-mono text-sm">eBPF runtime discovery builds an undeniable graph of what crypto is actually running in production — not what static analysis guesses is there.</p>
            </div>
            <div className="glass p-8 border border-border-bright space-y-3">
              <Cpu className="w-8 h-8 text-yellow-500" />
              <h3 className="text-lg font-bold font-mono text-white">CBOM Pipeline</h3>
              <p className="text-zinc-400 font-mono text-sm">Automated Cryptographic Bill of Materials generation. CycloneDX 1.6 schema. Source scanning plus runtime discovery for complete coverage.</p>
            </div>
            <div className="glass p-8 border border-border-bright space-y-3">
              <GitBranch className="w-8 h-8 text-accent-blue" />
              <h3 className="text-lg font-bold font-mono text-white">Shift-Left Guardrail</h3>
              <p className="text-zinc-400 font-mono text-sm">GitHub/GitLab integration blocks PRs that introduce legacy cryptography. Stop the bleeding before new debt reaches production.</p>
            </div>
            <div className="glass p-8 border border-border-bright space-y-3">
              <Router className="w-8 h-8 text-accent-green" />
              <h3 className="text-lg font-bold font-mono text-white">Migration Engine + Rollback</h3>
              <p className="text-zinc-400 font-mono text-sm">Orchestrate PQC migrations across Envoy, Istio, and Kong with real-time error monitoring and one-click rollback safety nets.</p>
            </div>
          </div>
        </section>

        {/* API Endpoints */}
        <section className="space-y-12">
          <div className="border-b border-border-bright pb-4">
            <h2 className="text-2xl font-bold font-mono tracking-widest text-white uppercase">API & CLI</h2>
          </div>

          <div className="grid gap-8">
            {/* PQC Keys */}
            <div className="glass p-8 border border-border-bright space-y-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-accent-blue/10"></div>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-accent-blue text-black font-bold font-mono text-xs tracking-widest">POST</span>
                <code className="text-white font-mono text-lg">/api/pqc-keys</code>
              </div>
              <p className="text-zinc-400 font-mono text-sm leading-relaxed">
                Generates a pure ML-DSA-65 (Kyber/Dilithium) public and private keypair. NIST FIPS 204 compliant.
              </p>
              <div className="bg-black border border-border-bright p-4 overflow-x-auto">
                <pre className="text-xs text-zinc-300 font-mono">
                  {`curl -X POST https://quantum-blue.in/api/pqc-keys \\
  -H "Authorization: Bearer ***" \\
  -H "Content-Type: application/json"`}
                </pre>
              </div>
            </div>

            {/* Sign */}
            <div className="glass p-8 border border-border-bright space-y-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-green/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-accent-green/10"></div>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-accent-green text-black font-bold font-mono text-xs tracking-widest">POST</span>
                <code className="text-white font-mono text-lg">/api/sign</code>
              </div>
              <p className="text-zinc-400 font-mono text-sm leading-relaxed">
                Cryptographically signs a payload using your ML-DSA-65 private key. Supports hybrid signatures (ML-DSA-65 + Ed25519) for classical verification compatibility.
              </p>
              <div className="bg-black border border-border-bright p-4 overflow-x-auto">
                <pre className="text-xs text-zinc-300 font-mono">
                  {`curl -X POST https://quantum-blue.in/api/sign \\
  -H "Authorization: Bearer ***" \\
  -H "Content-Type: application/json" \\
  -d '{"data": "base64_payload", "private_key": "your_private_key"}'`}
                </pre>
              </div>
            </div>

            {/* Verify */}
            <div className="glass p-8 border border-border-bright space-y-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-red/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-accent-red/10"></div>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-accent-red text-black font-bold font-mono text-xs tracking-widest">POST</span>
                <code className="text-white font-mono text-lg">/api/verify</code>
              </div>
              <p className="text-zinc-400 font-mono text-sm leading-relaxed">
                Verifies a digital signature against the original payload and public key. Supports both pure PQC and hybrid signature verification.
              </p>
              <div className="bg-black border border-border-bright p-4 overflow-x-auto">
                <pre className="text-xs text-zinc-300 font-mono">
                  {`curl -X POST https://quantum-blue.in/api/verify \\
  -H "Authorization: Bearer ***" \\
  -H "Content-Type: application/json" \\
  -d '{"payload": "original_data", "signature": "sig", "public_key": "pub"}'`}
                </pre>
              </div>
            </div>

            {/* CBOM */}
            <div className="glass p-8 border border-border-bright space-y-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-yellow-500/10"></div>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-yellow-500 text-black font-bold font-mono text-xs tracking-widest">POST</span>
                <code className="text-white font-mono text-lg">/api/cbom</code>
              </div>
              <p className="text-zinc-400 font-mono text-sm leading-relaxed">
                Generates a Cryptographic Bill of Materials (CBOM) by scanning source code for legacy primitives. Combines static analysis with eBPF runtime discovery data when available.
              </p>
              <div className="bg-black border border-border-bright p-4 overflow-x-auto">
                <pre className="text-xs text-zinc-300 font-mono">
                  {`curl -X POST https://quantum-blue.in/api/cbom \\
  -H "Authorization: Bearer ***" \\
  -H "Content-Type: application/json" \\
  -d '{"source": "/path/to/code", "runtime": true}'`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap Phases */}
        <section className="space-y-12">
          <div className="border-b border-border-bright pb-4">
            <h2 className="text-2xl font-bold font-mono tracking-widest text-white uppercase">Roadmap — CCPM Rollout Phases</h2>
          </div>

          <div className="space-y-6">
            {[
              {
                phase: "Phase 1",
                title: "External Attack Surface Scanner",
                status: "Live now",
                color: "text-accent-green",
                desc: "Lead-generation engine. Anyone types in a domain and gets a terrifyingly accurate TLS/Certificate posture report with HNDL risk grading. Free, no login required. This is the top of the funnel.",
                tags: ["Live", "Lead-gen", "TLS scanning", "HNDL grading"]
              },
              {
                phase: "Phase 2",
                title: "eBPF Runtime Discovery + Cryptographic Asset Graph",
                status: "In development",
                color: "text-accent-blue",
                desc: "Prove your tech is superior to legacy scanners. The eBPF sensor hooks into the Linux kernel to observe real cryptographic library calls in production — no agents, no code changes. Combined with the Cryptographic Asset Graph, this delivers undeniable ground truth that static tools can't match.",
                tags: ["eBPF", "Asset Graph", "Runtime discovery", "No instrumentation"]
              },
              {
                phase: "Phase 3",
                title: "Migration Engine + Proof of Migration + Automated Rollback",
                status: "Planned",
                color: "text-accent-yellow",
                desc: "Orchestrate PQC migrations across Envoy, Istio, and Kong with one-click rollback safety nets. Generate Proof of Migration artifacts for every completed migration — the evidence your auditors and CISOs need to close the loop.",
                tags: ["Migration", "Rollback", "Proof of Migration", "Envoy/Istio/Kong"]
              },
              {
                phase: "Phase 4",
                title: "AI Copilot + DSPM Integrations + Shift-Left CI/CD Blockers",
                status: "Planned",
                color: "text-accent-red",
                desc: "Expand into the AI Copilot for remediation guidance, DSPM API integrations for automated HNDL prioritization, and GitHub/GitLab shift-left blockers that prevent new cryptographic debt from entering production. The platform becomes an essential developer security tool, not just an auditing dashboard.",
                tags: ["AI Copilot", "DSPM", "GitHub/GitLab", "Shift-left", "CI/CD"]
              }
            ].map((item, i) => (
              <div key={item.phase} className="glass p-6 border border-border-bright space-y-3 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent-blue/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-accent-blue/10"></div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-bold ${item.color} bg-black/50 px-2 py-1 rounded border border-border-bright uppercase tracking-widest`}>
                    {item.phase}
                  </span>
                  <span className="text-white font-mono text-lg font-bold">{item.title}</span>
                  <span className="text-[10px] font-bold text-zinc-500 bg-zinc-800 px-2 py-1 rounded border border-border-bright uppercase tracking-widest">
                    {item.status}
                  </span>
                </div>
                <p className="text-zinc-400 font-mono text-sm leading-relaxed">{item.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold text-zinc-500 border border-border-bright px-2 py-1 rounded uppercase tracking-widest">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Link */}
        <section className="py-12 border-t border-border-bright text-center space-y-6">
          <h2 className="text-3xl font-bold font-mono text-white">Ready to map your cryptographic posture?</h2>
          <p className="text-zinc-400 font-mono text-sm max-w-lg mx-auto">
            Start with the free External Attack Surface Scanner. Then sign up for the full CCPM platform.
          </p>
          <div className="pt-4 flex gap-4 justify-center">
            <Link href="/scanner" className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest font-mono hover:bg-zinc-200 transition-all inline-block">
              Run a Free Scan
            </Link>
            <Link href="/sign-up" className="px-8 py-3 bg-accent-blue text-black font-bold uppercase tracking-widest font-mono hover:bg-blue-400 transition-all inline-block">
              Start Free Trial
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
