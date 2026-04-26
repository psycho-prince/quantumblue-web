"use client";

import { Check, Shield } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PricingPage() {
  const tiers = [
    {
      name: "Open Source Core",
      price: "$0",
      description: "Mathematical immunity for individual researchers and open protocols.",
      features: [
        "Local Lattice Sealing (ML-KEM)",
        "Standard CLI Interface",
        "Community Support",
        "Unlimited Local Notarization"
      ],
      button: "Download CLI",
      href: "/#platform",
      highlight: false
    },
    {
      name: "Pro Workspace",
      price: "$49",
      description: "Hardened security for professional teams and high-value digital assets.",
      features: [
        "Cloud Artifact Sync",
        "Team Collaboration",
        "ML-DSA Signing Portal",
        "Priority Architecture Support",
        "Custom Metadata Sealing"
      ],
      button: "Initiate Workspace",
      href: "/dashboard",
      highlight: true
    },
    {
      name: "Enterprise Infra",
      price: "Custom",
      description: "Full-scale post-quantum transition for sovereign organizations.",
      features: [
        "Dedicated Sentinel Node",
        "On-Premise Deployment",
        "Compliance Audit Reports",
        "24/7 Tactical Response",
        "Custom Protocol Fusing"
      ],
      button: "Contact Architects",
      href: "/contact",
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen bg-black pt-48 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 text-cyan-400 font-black text-[10px] uppercase tracking-[0.4em]"
          >
            <Shield className="w-4 h-4" />
            Post-Quantum Tiers
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter"
          >
            Transparent <br /> Security.
          </motion.h1>
          <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="text-zinc-500 text-xl font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Choose the level of defense required for your digital heritage. No hidden complexity.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              key={tier.name} 
              className={`glass-vault p-12 rounded-[3.5rem] flex flex-col justify-between relative overflow-hidden group ${tier.highlight ? 'border-cyan-500/30 bg-cyan-500/[0.02]' : ''}`}
            >
              {tier.highlight && (
                <div className="absolute top-10 right-[-35px] bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest px-10 py-1 rotate-45 shadow-2xl">
                  Popular
                </div>
              )}
              
              <div className="space-y-10">
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">{tier.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white tracking-tighter">{tier.price}</span>
                    {tier.price !== "Custom" && <span className="text-zinc-600 text-sm font-bold uppercase tracking-widest">/ month</span>}
                  </div>
                  <p className="text-zinc-400 font-medium text-sm leading-relaxed">{tier.description}</p>
                </div>

                <ul className="space-y-5">
                  {tier.features.map(feature => (
                    <li key={feature} className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-zinc-300">
                      <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-cyan-500/30 transition-colors">
                        <Check className="w-3 h-3 text-cyan-400" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Link 
                href={tier.href} 
                className={`mt-12 w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-center transition-all ${tier.highlight ? 'bg-white text-black hover:scale-[1.02] shadow-[0_0_40px_rgba(255,255,255,0.1)]' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'}`}
              >
                {tier.button}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
