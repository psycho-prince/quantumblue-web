"use client";

import { Check, Shield } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PricingPage() {
  const tiers = [
    {
      name: "Startup / Scale",
      price: "$999",
      description: "For high-growth startups requiring military-grade cryptographic infrastructure.",
      features: [
        "Up to 1M PQC Operations / mo",
        "Centralized Key Management",
        "Cloud-Hosted PQC Endpoints",
        "Immutable Audit Logs",
        "Standard SLA & Support"
      ],
      button: "Start Free Trial",
      href: "/sign-up",
      highlight: false
    },
    {
      name: "Enterprise",
      price: "$4,999",
      description: "Dedicated infrastructure for financial institutions and large-scale tech companies.",
      features: [
        "Unlimited PQC Operations",
        "Dedicated Sentinel Nodes",
        "Hardware Security Module (HSM) Integrations",
        "Continuous CBOM Scanning",
        "24/7 Priority Engineering Support"
      ],
      button: "Deploy Now",
      href: "/contact",
      highlight: true
    },
    {
      name: "Sovereign / Defense",
      price: "Custom",
      description: "Air-gapped and strictly regulated deployments for nation-states and defense contractors.",
      features: [
        "100% On-Premise / Sovereign Cloud",
        "FIPS 140-3 Level 3 Hardware Provisioning",
        "Custom Lattice Parameter Sets",
        "White-glove Regulatory Compliance",
        "Dedicated Cryptography Engineers"
      ],
      button: "Contact Executive Team",
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
