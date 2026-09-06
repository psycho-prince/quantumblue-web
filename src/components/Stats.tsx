import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Stats() {
  return (
    <section id="security" className="py-60 px-6 bg-black border-t border-border-bright">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center space-y-24">
        <div className="space-y-6">
          <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none text-white font-mono">HARDENED <br />SECURITY.</h2>
          <p className="text-zinc-400 text-xl font-mono max-w-2xl mx-auto leading-relaxed">
            JOIN_THE_ELITE_TEAMS_SECURING_THEIR_DIGITAL_HERITAGE. BUILT_FOR_THE_QUANTUM_EPOCH.
          </p>
        </div>

        {/* Tactical Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {[
            { label: 'LATENCY', value: '<20MS' },
            { label: 'STANDARD', value: 'FIPS_203' },
            { label: 'INTEGRITY', value: 'SOVEREIGN' },
            { label: 'DEFENSE', value: 'LATTICE' }
          ].map((stat, i) => (
            <div key={i} className="border-l border-accent-blue p-8 bg-zinc-950 text-left">
              <p className="font-mono text-[9px] text-zinc-500 mb-4 uppercase tracking-widest">{stat.label}</p>
              <span className="font-mono text-3xl md:text-4xl font-black text-accent-blue tracking-tighter">{stat.value}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-10 mt-20">
          <Link href="/dashboard" className="px-16 py-4 bg-accent-blue text-black font-bold uppercase tracking-widest font-mono">ACCESS_WORKSPACE</Link>
          <Link href="/contact" className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-all font-mono">
            CONTACT_ARCHITECTS <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

