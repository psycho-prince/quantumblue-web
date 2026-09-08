import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Stats() {
  return (
    <section id="security" className="py-60 px-6 bg-black border-t border-border-bright">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center space-y-24">
        <div className="space-y-6">
          <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none text-white font-mono">OPEN-SOURCE <br />SECURITY.</h2>
          <p className="text-zinc-400 text-xl font-mono max-w-2xl mx-auto leading-relaxed">
            BUILT FOR CRYPTOGRAPHERS, SECURITY RESEARCHERS, AND LEGAL COMPLIANCE WORKFLOWS.
          </p>
        </div>

        {/* Tactical Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {[
            { label: 'SIGNATURE', value: 'ML-DSA-65' },
            { label: 'STANDARD', value: 'FIPS_204' },
            { label: 'TIMESTAMP', value: 'RFC_3161' },
            { label: 'EVIDENCE', value: '§65B' }
          ].map((stat, i) => (
            <div key={i} className="border-l border-accent-blue p-8 bg-zinc-950 text-left">
              <p className="font-mono text-[9px] text-zinc-500 mb-4 uppercase tracking-widest">{stat.label}</p>
              <span className="font-mono text-3xl md:text-4xl font-black text-accent-blue tracking-tighter">{stat.value}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-10 mt-20">
          <Link href="https://github.com/psycho-prince/quantumblue-cli" target="_blank" rel="noopener" className="px-16 py-4 bg-accent-blue text-black font-bold uppercase tracking-widest font-mono">INSTALL CLI</Link>
          <Link href="/contact" className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-all font-mono">
            VIEW DOCUMENTATION <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

