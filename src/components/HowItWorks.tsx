import { Upload, Zap, Shield } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      title: "Input & Analyze",
      description: "Upload your digital assets or connect your workspace via our CLI. Our system identifies vulnerabilities against future quantum threats.",
      icon: Upload,
    },
    {
      title: "Lattice Shielding",
      description: "We wrap your data in mathematical lattice structures (ML-KEM & ML-DSA) that are proven to be immune to Shor's algorithm.",
      icon: Zap,
    },
    {
      title: "Sovereign Proof",
      description: "Receive an irrefutable, post-quantum signature. Your legacy is now sealed with the most advanced security standard available.",
      icon: Shield,
    }
  ];

  return (
    <section className="py-40 bg-black/20">
      <div className="max-w-7xl mx-auto px-10">
        <div className="text-center mb-24">
          <span className="text-[#00FFCC] font-mono text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Strategic Onboarding</span>
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">How it Works.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, i) => (
            <div key={i} className="glass-vault p-12 rounded-[2.5rem] space-y-8 group">
              <div className="w-16 h-16 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center group-hover:border-[#00FFCC]/30 transition-colors">
                <step.icon className="w-8 h-8 text-zinc-500 group-hover:text-[#00FFCC] transition-colors" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-none">{step.title}</h3>
                <p className="text-zinc-500 font-medium leading-relaxed text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

