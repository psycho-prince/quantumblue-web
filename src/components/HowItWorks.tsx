import { Terminal, Cpu, Layout } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      title: "1. Integrate",
      description: "Connect your existing infrastructure via our Quantum Blue CLI or high-performance APIs. Seamlessly bridge your legacy systems.",
      icon: Terminal,
    },
    {
      title: "2. Encrypt",
      description: "Deploy NIST-standard ML-KEM and ML-DSA encryption across your data layer. Protect assets with mathematical lattice immunity.",
      icon: Cpu,
    },
    {
      title: "3. Scale",
      description: "Monitor, audit, and scale your quantum-safe infrastructure globally. Maintain full sovereign control over your enterprise security.",
      icon: Layout,
    }
  ];

  return (
    <section className="py-32 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <span className="text-blue-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-4 block">The Process</span>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-none">Simple Integration. <br />Universal Protection.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="glass p-10 rounded-[2.5rem] space-y-8 group hover:border-white/10 transition-all">
              <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:border-blue-500/30 transition-colors">
                <step.icon className="w-6 h-6 text-zinc-500 group-hover:text-blue-400 transition-colors" />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white tracking-tight leading-none">{step.title}</h3>
                <p className="text-zinc-500 font-medium leading-relaxed text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

