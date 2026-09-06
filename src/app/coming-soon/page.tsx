"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Terminal, ArrowLeft, Check } from "lucide-react";
import Link from "next/link";

export default function ComingSoon() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Simulate submission
    setSubmitted(true);
    console.log("Email submitted:", email);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-black relative overflow-hidden font-mono">
      {/* Subtle Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-accent-blue/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass border border-border-bright p-12 text-center relative z-10 rounded-none"
      >
        <div className="w-16 h-16 border border-accent-blue/50 flex items-center justify-center mx-auto mb-8">
          <Terminal className="w-8 h-8 text-accent-blue" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight text-white mb-4">MODULE_INITIALIZING</h1>
        <p className="text-zinc-400 text-sm font-mono mb-10 leading-relaxed">
          {submitted 
            ? "ACCESS_REQUESTED_SUCCESSFULLY. SYSTEM_WILL_NOTIFY_ON_BETA_DEPLOYMENT."
            : "THE_REQUESTED_INFRASTRUCTURE_COMPONENT_IS_CURRENTLY_UNDER_DEVELOPMENT. JOIN_OUR_PRIORITY_LIST_FOR_EARLY_ACCESS_TO_THE_BETA_RELEASE."
          }
        </p>

        {!submitted && (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input 
              type="email" 
              placeholder="WORK_EMAIL_ADDRESS" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-border-bright py-4 px-6 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent-blue transition-all font-mono"
            />
            <button className="w-full py-4 bg-accent-blue text-black font-bold uppercase tracking-widest font-mono hover:bg-white transition-all flex items-center justify-center gap-2">
              REQUEST_EARLY_ACCESS
            </button>
          </form>
        )}

        {submitted && (
          <div className="py-4 bg-accent-green/10 border border-accent-green/30 text-accent-green font-bold uppercase tracking-widest font-mono flex items-center justify-center gap-2">
            <Check className="w-4 h-4" /> REQUEST_SUCCESSFUL
          </div>
        )}

        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest mt-10 font-mono">
           <ArrowLeft className="w-3 h-3" /> BACK_TO_SAFETY
        </Link>
      </motion.div>
    </div>
  );
}
