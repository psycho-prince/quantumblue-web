"use client";

import { Send, Mail, MapPin, Globe, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
        <div className="space-y-12">
          <div className="space-y-4">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="flex items-center gap-2 text-blue-500 font-bold text-[10px] uppercase tracking-[0.2em]"
            >
              <Shield className="w-4 h-4" />
              Sovereign Channel
            </motion.div>
            <motion.h1 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="text-5xl md:text-7xl font-bold text-white tracking-tight"
            >
              Contact <br /> Architects.
            </motion.h1>
            <motion.p 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="text-zinc-500 text-xl font-medium max-lg leading-relaxed"
            >
              Schedule a briefing with our lead engineers to discuss enterprise quantum-safe transitions and custom infrastructure needs.
            </motion.p>
          </div>

          <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.3 }}
             className="space-y-8 border-t border-white/5 pt-12"
          >
            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-blue-500/30 transition-colors">
                <Mail className="w-5 h-5 text-zinc-500 group-hover:text-blue-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Email Engineering</p>
                <p className="text-white font-bold tracking-tight">architects@quantum-blue.io</p>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-blue-500/30 transition-colors">
                <MapPin className="w-5 h-5 text-zinc-500 group-hover:text-blue-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Infrastructure</p>
                <p className="text-white font-bold tracking-tight">Decentralized / Remote-First</p>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-blue-500/30 transition-colors">
                <Globe className="w-5 h-5 text-zinc-500 group-hover:text-blue-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Global Service</p>
                <p className="text-white font-bold tracking-tight">Available Worldwide</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="glass p-8 md:p-12 rounded-[3rem] relative overflow-hidden"
        >
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-2">Full Identity</label>
              <input 
                type="text" 
                placeholder="Full Name" 
                className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium text-white placeholder:text-zinc-700 focus:outline-none focus:border-blue-500/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-2">Work Email</label>
              <input 
                type="email" 
                placeholder="architect@enterprise.com" 
                className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium text-white placeholder:text-zinc-700 focus:outline-none focus:border-blue-500/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-2">Organization</label>
              <input 
                type="text" 
                placeholder="Company Name" 
                className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium text-white placeholder:text-zinc-700 focus:outline-none focus:border-blue-500/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-2">Briefing Intent</label>
              <textarea 
                rows={4}
                placeholder="Describe your sovereign infrastructure requirements..." 
                className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium text-white placeholder:text-zinc-700 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
              />
            </div>

            <button className="w-full btn-saas-primary py-4 gap-3 mt-4">
              Establish Connection <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
