import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Stats() {
  return (
    <section id="security" className="py-60 px-6 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center space-y-24">
        <div className="space-y-6">
          <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none text-slate-900">Hardened <br />Security.</h2>
          <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Join the elite teams securing their digital heritage. Built for the Quantum Epoch.
          </p>
        </div>

        {/* Tactical Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full">
          {[
            { label: 'Latency', value: '< 20ms' },
            { label: 'Standard', value: 'FIPS-203' },
            { label: 'Integrity', value: 'Sovereign' },
            { label: 'Defense', value: 'Lattice' }
          ].map((stat, i) => (
            <div key={i} className="border-l-2 border-[#2563EB] p-8 bg-slate-50 text-left">
              <p className="font-mono text-[9px] text-slate-400 mb-4 uppercase tracking-widest">{stat.label}</p>
              <span className="font-mono text-4xl md:text-5xl font-black text-[#2563EB] tracking-tighter">{stat.value}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-10 mt-20">
          <Link href="/dashboard" className="btn-sovereign active:scale-95 px-16">Access Workspace</Link>
          <Link href="/contact" className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-slate-500 hover:text-slate-900 transition-all">
            Contact Architects <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

