import { Metadata } from "next";
import Link from "next/link";
import { FileCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Compliance & Controls | Quantum Blue",
  description: "QuantumBlue's control mapping across BSA §63, IT Act, and DPDP framework — technical controls supporting legal and evidentiary requirements.",
};

const FRAMEWORKS = [
  {
    framework: "BSA §63",
    fullName: "Bharatiya Sakshya Adhiniyam, 2023 — Section 63",
    capability: "Electronic evidence + certificate workflow",
    details: "SHA-256 evidence hashing, device metadata capture, chain-of-custody records, and BSA §63 certificate generation with production method, device particulars, and operating conditions.",
  },
  {
    framework: "IT Act §43",
    fullName: "Information Technology Act, 2000 — Section 43",
    capability: "Access and data-integrity controls",
    details: "Unauthorized access monitoring, data integrity verification, and tamper-evident logging. Cryptographic controls that support defenses against unauthorized access to computer systems and data.",
  },
  {
    framework: "IT Act §66",
    fullName: "Information Technology Act, 2000 — Section 66",
    capability: "Security incident evidence",
    details: "Computer-related offence evidence capture with cryptographic signatures, chain-of-custody integrity, and audit trails supporting incident response and investigation workflows.",
  },
  {
    framework: "IT Act §66C",
    fullName: "Information Technology Act, 2000 — Section 66C",
    capability: "Authentication and identity controls",
    details: "Identity verification, MFA enrollment, session management, and credential security controls. Role-based access control (RBAC) with audited permission enforcement.",
  },
  {
    framework: "IT Act §66E",
    fullName: "Information Technology Act, 2000 — Section 66E",
    capability: "Sensitive-data protection",
    details: "Privacy controls for personal and sensitive information — encryption at rest (AES-256-GCM), data classification, access logging, and restricted export capabilities for confidential data.",
  },
  {
    framework: "IT Act §72 / 72A",
    fullName: "Information Technology Act, 2000 — Sections 72 & 72A",
    capability: "Confidentiality and information controls",
    details: "Confidentiality protections for personal information, breach notification support, and controlled data handling with encryption and access controls aligned with information privacy obligations.",
  },
  {
    framework: "DPDP Framework",
    fullName: "Digital Personal Data Protection Act, 2023 + Rules, 2025",
    capability: "Personal-data governance",
    details: "Data classification, encryption at rest, retention enforcement, soft-delete and controlled deletion workflows, and access logging — designed to support personal-data governance obligations under the DPDP framework.",
  },
];

export default function CompliancePage() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto space-y-24">
        <div className="space-y-6">
          <span className="text-accent-blue font-bold text-[10px] uppercase tracking-[0.2em] block font-mono">COMPLIANCE & CONTROLS</span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white font-mono">
            INDIAN LEGAL <br />& REGULATORY FRAMEWORK
          </h1>
          <p className="text-zinc-500 text-sm font-mono uppercase tracking-widest">
            Control mapping — not a representation of guaranteed compliance
          </p>
        </div>

        <div className="p-6 bg-accent-blue/5 border border-accent-blue/20 rounded-none">
          <p className="text-zinc-400 text-sm font-mono leading-relaxed">
            The mapping below describes technical controls implemented by QuantumBlue that <span className="text-white font-bold">support</span> the listed legal and regulatory frameworks.
            It is not a representation that QuantumBlue itself guarantees statutory compliance or legal admissibility.
            QuantumBlue provides cryptographic integrity, provenance, metadata capture, access controls, and certificate-generation capabilities —
            the applicability and sufficiency of these controls for any specific legal purpose is a matter for qualified legal counsel.
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white font-mono tracking-widest border-b border-border-bright pb-4">
            Framework → Capability Mapping
          </h2>

          {FRAMEWORKS.map((fw, i) => (
            <div key={i} className="glass p-8 rounded-none border border-border-bright hover:border-accent-blue/50 transition-colors">
              <div className="flex items-start justify-between gap-8">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-5 h-5 text-accent-blue flex-shrink-0" />
                    <h3 className="text-xl font-bold text-white font-mono">{fw.framework}</h3>
                  </div>
                  <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">{fw.fullName}</p>
                  <p className="text-zinc-300 text-sm font-mono leading-relaxed">{fw.capability}</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-border-bright">
                <p className="text-zinc-500 text-xs font-mono leading-relaxed">{fw.details}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white font-mono tracking-widest border-b border-border-bright pb-4">
            Technical Standards
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: "FIPS 204", desc: "ML-DSA-65 (Dilithium3) — digital signatures" },
              { name: "FIPS 203", desc: "ML-KEM-768 (Kyber768) — key encapsulation" },
              { name: "RFC 3161", desc: "Trusted timestamping — proof of existence" },
              { name: "Hybrid Signatures", desc: "ML-DSA-65 + Ed25519 — PQC migration with classical verification" },
              { name: "SHA-256", desc: "Cryptographic hashing for evidence integrity" },
              { name: "AES-256-GCM", desc: "Encryption at rest for classified data" },
            ].map((std, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-zinc-950 border border-border-bright">
                <div className="w-8 h-8 bg-accent-blue/10 border border-accent-blue/30 rounded flex items-center justify-center flex-shrink-0">
                  <FileCheck className="w-4 h-4 text-accent-blue" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm font-mono">{std.name}</div>
                  <div className="text-zinc-500 text-xs font-mono">{std.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-12 border-t border-border-bright text-center space-y-6">
          <p className="text-zinc-500 text-sm font-mono">
            QuantumBlue is a B2B SaaS platform and CLI for post-quantum cryptography and digital evidence integrity.
            The technical specification and API reference are available at <Link href="/docs" className="text-accent-blue hover:underline">/docs</Link>.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/docs"
              className="px-8 py-4 bg-accent-blue text-black font-bold text-xs uppercase tracking-widest hover:bg-blue-400 transition-colors"
            >
              TECHNICAL SPECIFICATION
            </Link>
            <Link
              href="/"
              className="px-8 py-4 border border-accent-blue/50 text-accent-blue font-bold text-xs uppercase tracking-widest hover:bg-accent-blue/10 transition-colors"
            >
              BACK TO HOME
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
