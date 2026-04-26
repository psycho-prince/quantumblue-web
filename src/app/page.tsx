import { ShieldAlert, Layers } from "lucide-react";
import { Hero } from "@/components/Hero";
import { BentoGrid } from "@/components/BentoGrid";
import { BriefingShield } from "@/components/BriefingShield";
import { Stats } from "@/components/Stats";
import { TrustBanner } from "@/components/TrustBanner";
import { HowItWorks } from "@/components/HowItWorks";

export default function HomePage() {
  return (
    <div className="relative">
      <Hero />
      <TrustBanner />
      <BentoGrid />
      <HowItWorks />

      {/* Intelligence Briefing - Split Perspective */}
      <section id="briefing" className="py-40 bg-white/[0.01] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-10 grid md:grid-cols-2 gap-32 items-center">
          <div className="space-y-16">
            <div className="space-y-6">
              <span className="font-mono text-[10px] text-[#00FFCC] uppercase tracking-[0.3em]">Intelligence Briefing</span>
              <h2 className="text-6xl md:text-[7rem] font-black uppercase tracking-tighter leading-none">Harvest Now, <br/>Decrypt Later.</h2>
            </div>
            <blockquote className="text-zinc-500 text-2xl font-medium leading-relaxed max-w-lg italic border-l-4 border-[#00FFCC] pl-10 shadow-[inset_10px_0_20px_-10px_rgba(0,255,204,0.2)]">
              &quot;The data you encrypt today with RSA will be cracked the moment Q-Day arrives. You aren&apos;t securing your data; you are just delaying the breach.&quot;
            </blockquote>
            <div className="flex flex-wrap gap-10">
               <div className="flex items-center gap-4 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
                 <ShieldAlert className="w-5 h-5 text-red-500" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-red-500/80">RSA: Obsolete</span>
               </div>
               <div className="flex items-center gap-4 p-4 bg-[#00FFCC]/5 border border-[#00FFCC]/10 rounded-2xl">
                 <Layers className="w-5 h-5 text-[#00FFCC]" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#00FFCC]/80">Lattice: Immune</span>
               </div>
            </div>
          </div>
          
          <BriefingShield />
        </div>
      </section>


      <Stats />
    </div>
  );
}
