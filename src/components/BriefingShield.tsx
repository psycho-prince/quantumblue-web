"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export function BriefingShield() {
  return (
    <div className="relative group perspective-1000">
      <motion.div 
         animate={{ rotateY: [0, 5, -5, 0], rotateX: [0, -3, 3, 0] }}
         transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
         className="glass-vault p-20 rounded-[5rem] flex items-center justify-center aspect-square relative z-10"
      >
         <ShieldCheck className="w-48 h-48 text-cyan-400 group-hover:scale-110 transition-all duration-700" />
         <div className="absolute inset-0 bg-cyan-400/5 rounded-[5rem] group-hover:bg-cyan-400/10 transition-all blur-[80px]" />
      </motion.div>
      {/* Visual background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/[0.03] rounded-full -z-0" />
    </div>
  );
}
