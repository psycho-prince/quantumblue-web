import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Quantum Blue",
  description: "Get in touch with Quantum Blue.",
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white font-mono">
          CONTACT US.
        </h1>
        <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">
          Get in touch with our team
        </p>
      </div>

      <div className="prose prose-invert prose-zinc max-w-none font-mono text-sm leading-relaxed">
        <p>
          We are currently scaling the Quantum Blue SaaS platform. If you have inquiries regarding enterprise deployment, custom integration, or compliance details, please reach out to our team.
        </p>
        
        <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <h2 className="mt-0 text-white font-bold">General & HR Inquiries</h2>
          <p className="mb-0 text-zinc-400">
            For recruitment, partnerships, or general information, email us at:
            <br />
            <a href="mailto:hr@quantum-blue.in" className="text-blue-400 font-bold hover:underline">
              hr@quantum-blue.in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
