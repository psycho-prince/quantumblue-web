import { Terminal, Cpu, Layout } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      title: "1. INSTALL",
      description: "INSTALL THE QUANTUMBLUE CLI VIA GO INSTALL OR DOWNLOAD A SIGNED BINARY FROM GITHUB RELEASES.",
      icon: Terminal,
    },
    {
      title: "2. SIGN",
      description: "GENERATE HYBRID ML-DSA-65 + ED25519 KEYPAIRS AND SIGN FILES WITH RFC 3161 TIMESTAMPS FOR LEGAL ADMISSIBILITY.",
      icon: Cpu,
    },
    {
      title: "3. VERIFY",
      description: "VERIFY SIGNATURES, VALIDATE TIMESTAMP CHAINS, AND EXPORT CBOM MANIFESTS FOR §65B(4) COMPLIANCE AUDITS.",
      icon: Layout,
    }
  ];

  return (
    <section className="py-32 bg-black border-t border-border-bright">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <span className="text-accent-blue font-bold text-[10px] uppercase tracking-[0.2em] mb-4 block font-mono">HOW_IT_WORKS</span>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-none font-mono">INSTALL. SIGN. <br />VERIFY.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="glass p-10 rounded-none space-y-8 group border border-border-bright hover:border-accent-blue transition-all">
              <div className="w-14 h-14 bg-black border border-accent-blue/50 flex items-center justify-center group-hover:bg-accent-blue transition-colors">
                <step.icon className="w-6 h-6 text-accent-blue group-hover:text-black transition-colors" />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white tracking-tight leading-none font-mono">{step.title}</h3>
                <p className="text-zinc-400 font-mono leading-relaxed text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

