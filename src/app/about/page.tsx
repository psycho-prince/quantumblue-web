"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Target, Users, Zap, Globe } from "lucide-react";
import Link from "next/link";

const VALUES = [
  {
    title: "Mathematical Sovereignty",
    description: "We believe that security is a fundamental human right. Our mission is to provide the mathematical tools necessary to maintain digital sovereignty in a post-quantum world.",
    icon: ShieldCheck
  },
  {
    title: "Radical Transparency",
    description: "Encryption should never be a 'black box'. We advocate for open standards and verifiable security protocols that can be audited by anyone, anywhere.",
    icon: Target
  },
  {
    title: "Developer First",
    description: "Security is only effective if it's usable. We focus on building tools that developers love, making complex cryptography accessible through intuitive APIs and CLIs.",
    icon: Zap
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-24 space-y-4 max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-blue-500 font-bold text-[10px] uppercase tracking-[0.2em]"
          >
            <Users className="w-4 h-4" />
            Our Mission
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white tracking-tight"
          >
            Securing the <br /> Digital Future.
          </motion.h1>
          <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="text-zinc-500 text-xl font-medium leading-relaxed"
          >
            Quantum Blue was founded by a team of cryptographers and engineers dedicated to solving the most significant threat to digital security: the advent of quantum computing.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass p-10 md:p-12 rounded-[3rem] space-y-8"
          >
             <h2 className="text-3xl font-bold text-white tracking-tight">The Quantum Threat is Real.</h2>
             <p className="text-zinc-400 text-lg leading-relaxed font-medium">
               Current encryption standards (RSA, ECC) will be rendered obsolete by quantum computers. This isn't a theory; it's a mathematical certainty. At Quantum Blue, we are building the infrastructure to bridge the gap between classical and post-quantum security.
             </p>
             <p className="text-zinc-400 text-lg leading-relaxed font-medium">
               Our decentralized team works across three continents, collaborating with NIST and leading research institutions to implement lattice-based cryptography at scale.
             </p>
          </motion.div>
          <div className="relative aspect-square glass rounded-[3rem] overflow-hidden flex items-center justify-center bg-blue-500/5 border-white/5">
             <Globe className="w-48 h-48 text-blue-500/20 animate-pulse" />
             <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {VALUES.map((val, i) => (
            <motion.div 
              key={val.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-10 rounded-[2.5rem] space-y-6 hover:border-white/10 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                <val.icon className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white tracking-tight">{val.title}</h3>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed">{val.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="mt-32 glass p-12 rounded-[3rem] flex flex-col items-center text-center space-y-8 bg-blue-500/[0.02]"
        >
           <h3 className="text-3xl font-bold text-white">Join the Vanguard.</h3>
           <p className="text-zinc-500 text-lg font-medium leading-relaxed max-w-2xl">
              We are always looking for visionary engineers and researchers to join our mission in building a quantum-safe world.
           </p>
           <Link href="/contact" className="btn-saas-primary px-12">
              View Open Roles
           </Link>
        </motion.div>
      </div>
    </div>
  );
}
