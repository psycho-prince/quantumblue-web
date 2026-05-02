"use client";

import { motion } from "framer-motion";
import { Download, Image as ImageIcon, FileText, Camera, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";

const ASSETS = [
  {
    title: "Brand Identity",
    description: "Official logos, wordmarks, and color palette specifications in high-resolution formats.",
    icon: ImageIcon,
    format: "ZIP (PNG, SVG, AI)",
    size: "24.5 MB"
  },
  {
    title: "Executive Profiles",
    description: "Professional headshots and biographies for our leadership and engineering teams.",
    icon: Camera,
    format: "PDF & JPG",
    size: "12.8 MB"
  },
  {
    title: "Product Showcases",
    description: "Interface screenshots, terminal demonstrations, and architectural diagrams.",
    icon: FileText,
    format: "ZIP (4K PNG)",
    size: "45.2 MB"
  }
];

export default function PressKitPage() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-24 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-blue-500 font-bold text-[10px] uppercase tracking-[0.2em]"
          >
            <Shield className="w-4 h-4" />
            Media Resources
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white tracking-tight"
          >
            Press Kit.
          </motion.h1>
          <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="text-zinc-500 text-xl font-medium max-w-2xl leading-relaxed"
          >
            Everything you need to accurately represent Quantum Blue in your publications and research papers.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {ASSETS.map((asset, i) => (
            <motion.div 
              key={asset.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-10 rounded-[3rem] flex flex-col justify-between group hover:border-white/10 transition-all"
            >
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-blue-500/30 transition-colors text-zinc-500 group-hover:text-blue-500">
                  <asset.icon className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-xl font-bold text-white tracking-tight">{asset.title}</h3>
                   <p className="text-zinc-500 text-sm font-medium leading-relaxed">{asset.description}</p>
                </div>
              </div>

              <div className="mt-10 space-y-4 pt-10 border-t border-white/5">
                 <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                    <span>{asset.format}</span>
                    <span>{asset.size}</span>
                 </div>
                 <button className="w-full btn-saas-secondary py-3 text-[10px] font-bold uppercase tracking-widest gap-2">
                    <Download className="w-3 h-3" /> Download Assets
                 </button>
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
           <div className="space-y-4 text-center md:text-left">
              <h3 className="text-2xl font-bold">Media Inquiries</h3>
              <p className="text-zinc-500 text-lg font-medium leading-relaxed max-w-xl">
                 For interview requests or specialized technical commentary, please contact our global communications team.
              </p>
           </div>
           <Link href="/contact" className="btn-saas-primary px-10 gap-2 whitespace-nowrap">
              Contact Media Relations <ArrowRight className="w-4 h-4" />
           </Link>
        </motion.div>
      </div>
    </div>
  );
}
