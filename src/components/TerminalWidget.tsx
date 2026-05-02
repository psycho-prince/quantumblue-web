"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";

const COMMANDS = [
  { text: "$ qb init --project quantum-vault", delay: 1000 },
  { text: "[+] Initializing post-quantum security layer...", delay: 500, type: "output", color: "text-zinc-500" },
  { text: "[+] Deploying ML-KEM & ML-DSA infrastructure...", delay: 800, type: "output", color: "text-zinc-500" },
  { text: "✓ Enterprise environment ready.", delay: 500, type: "output", color: "text-blue-500 font-bold" },
  { text: "$ qb deploy", delay: 1200 },
  { text: "[+] Synchronizing keys with identity core...", delay: 600, type: "output", color: "text-zinc-500" },
  { text: "✓ Infrastructure Live at https://vault.qb.io", delay: 400, type: "output", color: "text-emerald-500 font-bold" },
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
      }, 8000);
      return () => clearTimeout(loopTimer);
    }
  }, [currentIndex]);

  const copyUrl = () => {
    navigator.clipboard.writeText("https://vault.qb.io");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl font-mono text-[10px] sm:text-xs">
      <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        {/* Terminal Header */}
        <div className="bg-white/[0.02] border-b border-white/5 px-4 py-3 flex items-center justify-between">
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
          </div>
          <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">quantum-blue-cli — 80x24</div>
        </div>

        {/* Terminal Body */}
        <div className="p-6 min-h-[260px] space-y-2">
          <AnimatePresence>
            {lines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between group"
              >
                <span className={`${line.color || "text-zinc-300"} tracking-tight`}>
                  {line.text}
                </span>
                {line.text.includes("https") && (
                  <button 
                    onClick={copyUrl}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/5 rounded"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-zinc-700" />}
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {currentIndex < COMMANDS.length && (
            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-1.5 h-4 bg-blue-500/50 inline-block align-middle"
            />
          )}
        </div>
      </div>
    </div>
  );
}
