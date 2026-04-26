"use client";

import { Send, Mail, MapPin, Globe, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black pt-48 pb-20 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-32">
        <div className="space-y-12">
          <div className="space-y-6">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="flex items-center gap-3 text-cyan-400 font-black text-[10px] uppercase tracking-[0.4em]"
            >
              <Shield className="w-4 h-4" />
              Intelligence Channel
            </motion.div>
            <motion.h1 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter"
            >
              Contact <br /> Architects.
            </motion.h1>
            <motion.p 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="text-zinc-500 text-xl font-medium max-w-lg leading-relaxed"
            >
              Secure a briefing with our lead cryptography engineers to discuss your sovereign infrastructure needs.
            </motion.p>
          </div>

          <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.3 }}
             className="space-y-10 border-t border-white/5 pt-12"
          >
            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-cyan-500/50 transition-colors">
                <Mail className="w-5 h-5 text-zinc-400 group-hover:text-cyan-400" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Email Architecture</p>
                <p className="text-white font-bold tracking-tight">info@quantum-blue.in</p>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-cyan-500/50 transition-colors">
                <MapPin className="w-5 h-5 text-zinc-400 group-hover:text-cyan-400" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Digital Presence</p>
                <p className="text-white font-bold tracking-tight">Decentralized / Remote First</p>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-cyan-500/50 transition-colors">
                <Globe className="w-5 h-5 text-zinc-400 group-hover:text-cyan-400" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Global Reach</p>
                <p className="text-white font-bold tracking-tight">Available Across All Epochs</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="glass-vault p-12 rounded-[4rem] relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Full Identity</label>
              <input 
                type="text" 
                placeholder="NAME / ALIAS..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold tracking-tight text-white placeholder:text-zinc-700 focus:outline-none focus:border-cyan-500/50 transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Secure Channel</label>
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold tracking-tight text-white placeholder:text-zinc-700 focus:outline-none focus:border-cyan-500/50 transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Organization / Project</label>
              <input 
                type="text" 
                placeholder="DOMAIN NAME..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold tracking-tight text-white placeholder:text-zinc-700 focus:outline-none focus:border-cyan-500/50 transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Briefing Details</label>
              <textarea 
                rows={5}
                placeholder="DESCRIBE YOUR INFRASTRUCTURE NEEDS..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold tracking-tight text-white placeholder:text-zinc-700 focus:outline-none focus:border-cyan-500/50 transition-all resize-none"
              />
            </div>

            <button className="w-full bg-white text-black py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:scale-[1.02] transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)]">
              Establish Connection <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
