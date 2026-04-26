"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";

const COMMANDS = [
  { text: "➜  ~ quantumblue seal /assets/legacy_contract.pdf", delay: 1000 },
  { text: "[+] Initializing Lattice Shielding...", delay: 500, type: "output", color: "text-emerald-500" },
  { text: "[+] Applying ML-KEM & ML-DSA protocols...", delay: 800, type: "output", color: "text-emerald-500" },
  { text: "✔ Asset Sealed Successfully.", delay: 500, type: "output", color: "text-blue-500" },
  { text: "qb_sig_7k2x_...9f3a", delay: 200, type: "hash", color: "text-zinc-500" },
];

export function TerminalWidget() {
  const [lines, setLines] = useState<typeof COMMANDS>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (currentIndex < COMMANDS.length) {
      const timer = setTimeout(() => {
        setLines((prev) => [...prev, COMMANDS[currentIndex]]);
        setCurrentIndex((prev) => prev + 1);
      }, COMMANDS[currentIndex].delay);
      return () => clearTimeout(timer);
    } else {
      // Loop sequence after a pause
      const loopTimer = setTimeout(() => {
        setLines([]);
        setCurrentIndex(0);
      }, 5000);
      return () => clearTimeout(loopTimer);
    }
  }, [currentIndex]);

  const copyHash = () => {
    navigator.clipboard.writeText("qb_sig_7k2x_lattice_armor_9f3a");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl font-mono text-[11px] sm:text-xs">
      <div className="bg-[#050505] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-cyan-500/5">
        {/* Terminal Header */}
        <div className="bg-white/5 border-b border-white/5 px-4 py-3 flex items-center justify-between">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
          </div>
          <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">zsh — 80x24</div>
        </div>

        {/* Terminal Body */}
        <div className="p-6 min-h-[240px] space-y-2">
          <AnimatePresence>
            {lines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between group"
              >
                <span className={`${line.color || "text-zinc-300"}`}>
                  {line.text}
                </span>
                {line.type === "hash" && (
                  <button 
                    onClick={copyHash}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/5 rounded"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-zinc-600" />}
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {currentIndex < COMMANDS.length && (
            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-2 h-4 bg-cyan-500/50 inline-block"
            />
          )}
        </div>
      </div>
    </div>
  );
}
