import { Lock, Award, Activity, Terminal } from "lucide-react";

export function BentoGrid() {
  return (
    <section id="platform" className="py-40 max-w-7xl mx-auto px-10">
      <div className="mb-24 flex flex-col md:flex-row items-end justify-between gap-12">
        <div className="space-y-6">
          <span className="text-[#2563EB] font-black text-xs uppercase tracking-[0.3em] block">Defensive Architecture</span>
          <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none text-slate-900">Mathematical <br />Immunity.</h2>
        </div>
        <p className="text-slate-500 text-xl font-medium max-w-xs leading-relaxed">
          Eliminate complexity with the first platform built for the Post-Quantum transition.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Card 1: Confidentiality */}
        <div className="md:col-span-8 glass-vault rounded-[2.5rem] p-12 min-h-[500px] flex flex-col justify-between group overflow-hidden relative">
          <div className="relative z-10">
            <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center mb-10 group-hover:border-[#2563EB]/30 transition-colors">
              <Lock className="w-8 h-8 text-slate-400 group-hover:text-[#2563EB] transition-colors" />
            </div>
            <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-8 leading-none">ML-KEM <br/>Confidentiality</h3>
            <p className="text-slate-600 text-lg font-medium leading-relaxed max-w-xl">
              Hybrid encapsulation fusing classical X25519 with <b>Kyber-768</b>. Provable forward secrecy against future Shor-capable supercomputers.
            </p>
          </div>
          <div className="flex gap-4 relative z-10">
            <span className="px-5 py-2 bg-slate-100 border border-slate-200 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-500">NIST FIPS-203</span>
            <span className="px-5 py-2 bg-blue-600/10 border border-blue-600/20 rounded-full text-[9px] font-black uppercase tracking-widest text-blue-600">Post-Quantum</span>
          </div>
          {/* Visual Decoration */}
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#2563EB]/5 rounded-full blur-[100px] group-hover:bg-[#2563EB]/10 transition-all duration-700" />
        </div>

        {/* Card 2: Authenticity */}
        <div className="md:col-span-4 glass-vault rounded-[2.5rem] p-12 flex flex-col justify-between group relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center mb-10 group-hover:border-[#2563EB]/30 transition-colors">
              <Award className="w-8 h-8 text-slate-400 group-hover:text-[#2563EB] transition-colors" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">ML-DSA <br />Authenticity</h3>
            <p className="text-slate-600 text-sm font-medium leading-relaxed">
              Irrefutable authorship signed with Dilithium3 lattice structure. Verified identity for critical assets.
            </p>
          </div>
          <div className="font-mono text-[9px] text-slate-400 relative z-10">Protocol 0xFA4B</div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/5 rounded-full blur-[50px] group-hover:bg-blue-600/10 transition-all duration-700" />
        </div>

        {/* Card 3: Sentinel */}
        <div className="md:col-span-4 glass-vault rounded-[2.5rem] p-12 flex flex-col justify-between group relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center mb-10 group-hover:border-[#2563EB]/30 transition-colors">
              <Activity className="w-8 h-8 text-slate-400 group-hover:text-[#2563EB] transition-colors" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">Sovereign <br />Sentinel</h3>
            <p className="text-slate-600 text-sm font-medium leading-relaxed">
              Background daemon monitoring workspace for real-time artifact notarization and autonomous sealing.
            </p>
          </div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
            <span className="font-mono text-[9px] text-[#2563EB] uppercase tracking-widest">Live Status</span>
          </div>
        </div>

        {/* Card 4: Seamless CLI */}
        <div className="md:col-span-8 glass-vault rounded-[2.5rem] p-12 relative overflow-hidden group">
          <div className="flex flex-col md:flex-row justify-between gap-12 h-full">
            <div className="flex flex-col justify-between relative z-10">
              <div>
                <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center mb-10 group-hover:border-[#2563EB]/30 transition-colors">
                  <Terminal className="w-8 h-8 text-slate-400 group-hover:text-[#2563EB] transition-colors" />
                </div>
                <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-6 leading-none">Seamless CLI</h3>
                <p className="text-slate-600 text-lg font-medium max-w-xs leading-relaxed">
                  Zero friction. One command for absolute mathematical protection.
                </p>
              </div>
              <div className="font-mono text-[9px] text-slate-400">v2.0.0 Stable</div>
            </div>

            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-8 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#2563EB]/20 to-transparent" />
               <div className="space-y-6 font-mono text-[11px] sm:text-xs">
                  <p className="flex gap-4"><span className="text-slate-600">➜</span> <span className="text-slate-400">quantumblue seal contract.sol</span></p>
                  <p className="text-[#2563EB] font-bold ml-8">🔒 Sealed & Synced</p>
                  <p className="text-slate-500 text-[10px] ml-8 italic">Signature: 0x8a2f...1e0b</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

