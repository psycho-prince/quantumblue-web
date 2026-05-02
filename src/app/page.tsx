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

      {/* Strategic Briefing - Ecosystem Perspective */}
      <section id="briefing" className="py-32 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <div className="space-y-4">
              <span className="font-bold text-[10px] text-blue-500 uppercase tracking-[0.2em]">The Quantum Threat</span>
              <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Harvest Now, <br/>Decrypt Later.</h2>
            </div>
            <blockquote className="text-zinc-500 text-xl font-medium leading-relaxed max-w-lg italic border-l-2 border-blue-500 pl-8">
              &quot;The data you encrypt today with RSA will be cracked the moment Q-Day arrives. You aren&apos;t just securing your data; you are preparing for a new era of digital sovereignty.&quot;
            </blockquote>
            <div className="flex flex-wrap gap-4">
               <div className="flex items-center gap-3 px-4 py-2 bg-red-500/5 border border-red-500/10 rounded-xl">
                 <ShieldAlert className="w-4 h-4 text-red-500" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-red-500/80">RSA: Deprecated</span>
               </div>
               <div className="flex items-center gap-3 px-4 py-2 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                 <Layers className="w-4 h-4 text-blue-500" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500/80">Lattice: Immune</span>
               </div>
            </div>
          </div>
          
          <div className="relative">
            {/* Subtle glow behind the shield */}
            <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full" />
            <BriefingShield />
          </div>
        </div>
      </section>

      <Stats />
    </div>
  );
}
