"use client";

import { Check, Shield } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PricingPage() {
  const tiers = [
    {
      name: "Developer",
      price: "$0",
      description: "Everything you need to build quantum-safe applications for personal projects.",
      features: [
        "Access to Quantum Blue CLI",
        "Local Lattice Encryption",
        "Community Documentation",
        "Standard API Rate Limits"
      ],
      button: "Get Started",
      href: "/dashboard",
      highlight: false
    },
    {
      name: "Professional",
      price: "$29",
      description: "Advanced infrastructure and higher limits for growing teams and startups.",
      features: [
        "Centralized Key Management",
        "High-Scale PQC Endpoints",
        "Team Workspace & RBAC",
        "Standard Architecture Support",
        "Custom Metadata Sealing"
      ],
      button: "Start 14-Day Free Trial",
      href: "/dashboard",
      highlight: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Dedicated security infrastructure and support for global organizations.",
      features: [
        "Dedicated Sentinel Nodes",
        "On-Premise Deployment Options",
        "Compliance & Security Audits",
        "24/7 Strategic Support",
        "Custom Integration Engineering"
      ],
      button: "Talk to Sales",
      href: "/contact",
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-blue-500 font-bold text-[10px] uppercase tracking-[0.2em]"
          >
            <Shield className="w-4 h-4" />
            Pricing Plans
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white tracking-tight"
          >
            Sovereign Security <br /> for Every Team.
          </motion.h1>
          <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="text-zinc-500 text-xl font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Future-proof your infrastructure with predictable, transparent pricing designed for scale.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              key={tier.name} 
              className={`glass p-10 rounded-[3rem] flex flex-col justify-between relative overflow-hidden group ${tier.highlight ? 'border-blue-500/50 shadow-[0_0_50px_rgba(0,112,243,0.15)]' : ''}`}
            >
              <div className="space-y-10">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">{tier.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-white tracking-tight">{tier.price}</span>
                    {tier.price !== "Custom" && <span className="text-zinc-600 text-sm font-medium">/ month</span>}
                  </div>
                  <p className="text-zinc-500 font-medium text-sm leading-relaxed">{tier.description}</p>
                </div>

                <ul className="space-y-4">
                  {tier.features.map(feature => (
                    <li key={feature} className="flex items-center gap-3 text-sm font-medium text-zinc-300">
                      <Check className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Link 
                href={tier.href} 
                className={`mt-10 w-full btn-saas ${tier.highlight ? 'bg-white text-black hover:bg-zinc-200' : 'bg-white/5 text-white hover:bg-white/10'}`}
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
