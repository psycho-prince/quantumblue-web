import { ShieldAlert, Layers, FileCheck, Scale, Terminal } from "lucide-react";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { BentoGrid } from "@/components/BentoGrid";
import { BriefingShield } from "@/components/BriefingShield";
import { Stats } from "@/components/Stats";
import { TrustBanner } from "@/components/TrustBanner";
import { HowItWorks } from "@/components/HowItWorks";
import { CryptoTests } from "@/components/CryptoTests";

export default function HomePage() {
  return (
    <div className="relative">
      <Hero />
      <TrustBanner />
      <BentoGrid />
      <CryptoTests />
      <HowItWorks />

      {/* Legal Admissibility Context */}
      <section id="legal-context" className="py-32 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <div className="space-y-4">
              <span className="font-bold text-[10px] text-blue-500 uppercase tracking-[0.2em]">Legal Framework</span>
              <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Evidence Act<br/>§65B(4).</h2>
            </div>
            <blockquote className="text-zinc-500 text-xl font-medium leading-relaxed max-w-lg italic border-l-2 border-blue-500 pl-8">
              &quot;Electronic records are admissible in Indian courts only when accompanied by a certificate under Section 65B(4) of the Indian Evidence Act. QuantumBlue CLI structures its output to satisfy these requirements.&quot;
            </blockquote>
            <div className="flex flex-wrap gap-4">
               <div className="flex items-center gap-3 px-4 py-2 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                 <FileCheck className="w-4 h-4 text-blue-500" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500/80">RFC 3161 Timestamps</span>
               </div>
               <div className="flex items-center gap-3 px-4 py-2 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                 <Scale className="w-4 h-4 text-blue-500" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500/80">CBOM Audit Trail</span>
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

      {/* SaaS Sales / Demo CTA & NPM Install */}
      <section id="demo-install" className="py-24 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Sales / Demo CTA */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="font-bold text-[10px] text-blue-500 uppercase tracking-[0.2em] block font-mono">ENTERPRISE SAAS</span>
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight font-mono">
                FUTURE-PROOF YOUR <br />INFRASTRUCTURE.
              </h2>
            </div>
            <p className="text-zinc-400 text-sm font-mono leading-relaxed max-w-md">
              Secure your organization's digital assets against classical and quantum threats. Quantum Blue offers an end-to-end SaaS platform for hybrid PQC signatures, compliant timestamping, and seamless key management.
            </p>
            <div className="flex gap-4">
              <Link href="/sign-up" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs uppercase tracking-widest font-bold transition-all rounded-sm border border-blue-500">
                Start Free Trial
              </Link>
              <Link href="/contact" className="px-6 py-3 bg-transparent hover:bg-white/5 text-white font-mono text-xs uppercase tracking-widest font-bold transition-all rounded-sm border border-white/20">
                Book a Demo
              </Link>
            </div>
          </div>

          {/* Right: Install via NPM */}
          <div className="bg-[#0a0a0a] p-8 border border-white/10 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Terminal className="w-24 h-24 text-blue-500" />
            </div>
            <h3 className="text-white font-mono font-bold mb-4">Install the CLI Toolkit via NPM</h3>
            <p className="text-zinc-500 text-xs font-mono mb-6">
              Developers can instantly provision keys and generate CBOMs using our Node wrapper:
            </p>
            <div className="bg-black border border-white/10 p-4 rounded-md font-mono text-sm flex justify-between items-center">
              <code className="text-blue-400">npm install -g quantumblue-cli</code>
            </div>
            <div className="mt-4 text-[10px] text-zinc-600 font-mono space-y-2">
              <p>✓ Requires Node.js 18+</p>
              <p>✓ Downloads pre-compiled Go binaries for your OS</p>
            </div>
          </div>
        </div>
      </section>

      <Stats />
    </div>
  );
}
