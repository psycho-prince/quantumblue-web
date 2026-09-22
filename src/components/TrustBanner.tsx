import Link from "next/link";
import { ArrowRight, Shield, Fingerprint, Lock, Database, Clock } from "lucide-react";

const FRAMEWORKS = [
  { name: "BSA §63", desc: "Electronic Evidence", icon: Fingerprint },
  { name: "IT Act", desc: "Security Controls", icon: Shield },
  { name: "DPDP", desc: "Data Governance", icon: Database },
  { name: "RFC 3161", desc: "Trusted Timestamping", icon: Clock },
  { name: "FIPS 203/204", desc: "Post-Quantum Crypto", icon: Lock },
];

export function TrustBanner() {
  return (
    <div className="w-full flex flex-col items-center bg-black">
      <div className="w-full border-y border-border-bright bg-zinc-950 py-12">
        <div className="max-w-7xl mx-auto px-10 flex flex-wrap items-center justify-between gap-12">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 font-mono">VERIFICATION_STANDARDS</span>
            <div className="w-12 h-0.5 bg-accent-blue" />
          </div>
          <div className="flex flex-wrap items-center gap-16">
            {FRAMEWORKS.map((std) => (
              <div key={std.name} className="flex items-center gap-4 group">
                <std.icon className="w-5 h-5 text-zinc-600 group-hover:text-accent-blue transition-colors" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors font-mono">
                  {std.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Link
        href="/compliance"
        target="_blank"
        rel="noopener"
        className="mt-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-accent-blue hover:text-white transition-colors font-mono"
      >
        COMPLIANCE & CONTROLS <ArrowRight className="w-3 h-3" />
      </Link>

      <Link
        href="https://github.com/psycho-prince/quantumblue-cli/blob/main/docs"
        target="_blank"
        rel="noopener"
        className="mt-4 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-white transition-colors font-mono"
      >
        TECHNICAL SPECIFICATION <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}
