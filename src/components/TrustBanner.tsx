import { ShieldCheck, Cpu, Fingerprint, ArrowRight } from "lucide-react";
import Link from "next/link";

export function TrustBanner() {
  const standards = [
    { name: "NIST FIPS-203 Compliant", icon: ShieldCheck },
    { name: "Kyber-768 Integrated", icon: Cpu },
    { name: "Dilithium3 Signatures", icon: Fingerprint },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full border-y border-white/5 bg-white/[0.01] py-12">
        <div className="max-w-7xl mx-auto px-10 flex flex-wrap items-center justify-between gap-12">
          <div className="flex flex-col gap-1">
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Verification & Standards</span>
             <div className="w-12 h-0.5 bg-[#00FFCC]/40" />
          </div>
          <div className="flex flex-wrap items-center gap-16">
            {standards.map((std) => (
              <div key={std.name} className="flex items-center gap-4 group">
                <std.icon className="w-5 h-5 text-zinc-500 group-hover:text-[#00FFCC] transition-colors" />
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">{std.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Link 
        href="/coming-soon" 
        className="mt-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#00FFCC] hover:opacity-70 transition-opacity"
      >
        Architecture Whitepaper <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}

