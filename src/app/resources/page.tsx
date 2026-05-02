"use client";

import { motion } from "framer-motion";
import { FileText, BookOpen, ShieldAlert, Download, ExternalLink, ArrowRight, Library } from "lucide-react";
import Link from "next/link";

const RESOURCES = [
  {
    category: "Documentation",
    title: "Platform Integration Guide",
    description: "Detailed instructions on how to integrate Quantum Blue APIs and CLI into your existing CI/CD pipelines.",
    icon: BookOpen,
    links: [
      { label: "Getting Started", href: "/coming-soon" },
      { label: "API Reference", href: "/coming-soon" },
      { label: "CLI Usage", href: "/coming-soon" }
    ]
  },
  {
    category: "Technical Papers",
    title: "Mathematical Lattice Security",
    description: "Deep dive into the ML-KEM and ML-DSA implementations used by Quantum Blue. Proven immunity to Shor's algorithm.",
    icon: FileText,
    links: [
      { label: "Whitepaper v2.0 (PDF)", href: "/coming-soon" },
      { label: "Protocol Specification", href: "/coming-soon" }
    ]
  },
  {
    category: "Security Audit",
    title: "NIST Compliance Report 2026",
    description: "Results of our latest third-party security audit verifying our post-quantum cryptographic standards and zero-trust architecture.",
    icon: ShieldAlert,
    links: [
      { label: "Full Audit Report", href: "/coming-soon" },
      { label: "Compliance Certificate", href: "/coming-soon" }
    ]
  }
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-24 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-blue-500 font-bold text-[10px] uppercase tracking-[0.2em]"
          >
            <Library className="w-4 h-4" />
            Knowledge Base
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white tracking-tight"
          >
            Engineering <br /> Resources.
          </motion.h1>
          <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="text-zinc-500 text-xl font-medium max-w-2xl leading-relaxed"
          >
            Access technical specifications, research papers, and implementation guides to master post-quantum security.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {RESOURCES.map((res, i) => (
            <motion.div 
              key={res.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-10 rounded-[3rem] flex flex-col justify-between group hover:border-white/10 transition-all"
            >
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-blue-500/30 transition-colors">
                  <res.icon className="w-6 h-6 text-zinc-500 group-hover:text-blue-500" />
                </div>
                <div className="space-y-2">
                   <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{res.category}</span>
                   <h3 className="text-xl font-bold text-white tracking-tight">{res.title}</h3>
                   <p className="text-zinc-500 text-sm font-medium leading-relaxed">{res.description}</p>
                </div>
              </div>

              <div className="mt-10 space-y-3 pt-10 border-t border-white/5">
                 {res.links.map(link => (
                    <Link key={link.label} href={link.href} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl text-[10px] font-bold text-zinc-400 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest group/link">
                       {link.label}
                       <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                    </Link>
                 ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="mt-20 glass p-12 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-12 bg-blue-500/[0.02]"
        >
           <div className="space-y-4">
              <h3 className="text-2xl font-bold">Custom Architecture Briefing</h3>
              <p className="text-zinc-500 text-lg font-medium leading-relaxed max-w-xl">
                 Our lead engineers are available for technical consultations regarding enterprise transitions to post-quantum standards.
              </p>
           </div>
           <Link href="/contact" className="btn-saas-primary px-10">
              Schedule Consultation
           </Link>
        </motion.div>
      </div>
    </div>
  );
}
