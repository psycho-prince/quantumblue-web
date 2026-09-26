"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertOctagon, Terminal, Home, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.error("Quantum Blue System Error:", error);
    setMounted(true);
  }, [error]);

  const quotes = [
    { text: "It's hardware that makes a machine fast. It's software that makes a fast machine slow.", author: "Craig Bruce" },
    { text: "There are two ways to write error-free programs; only the third one works.", author: "Alan J. Perlis" },
    { text: "If debugging is the process of removing software bugs, then programming must be the process of putting them in.", author: "Edsger Dijkstra" },
    { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
    { text: "The most disastrous thing that you can ever learn is your first programming language.", author: "Alan Kay" }
  ];

  const randomQuote = quotes[mounted ? Math.floor(Math.random() * quotes.length) : 0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center justify-center p-6 font-mono relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="z-10 max-w-3xl w-full flex flex-col items-center space-y-10 text-center">
        <div className="flex justify-center">
          <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
            <AlertOctagon className="w-16 h-16 text-red-500 animate-pulse" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-red-400 to-rose-600 bg-clip-text text-transparent tracking-tighter">
            500 Error
          </h1>
          <h2 className="text-2xl font-semibold text-slate-100">
            System Entropy Exceeded
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto leading-relaxed">
            A critical fault occurred in the quantum matrix. Our engineering team has been notified of the anomaly. 
          </p>
        </div>

        <div className="w-full max-w-xl bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-left relative overflow-hidden backdrop-blur-sm shadow-2xl">
          <Terminal className="absolute top-4 right-4 w-5 h-5 text-slate-700" />
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Debug Log // {new Date().toISOString().split('T')[0]}</h3>
          
          <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-800/50">
            <p className="text-slate-300 italic mb-3 border-l-2 border-red-500/50 pl-4 py-1 leading-relaxed">
              "{randomQuote.text}"
            </p>
            <p className="text-slate-500 text-sm ml-4 font-semibold">— {randomQuote.author}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center pt-4">
          <button 
            onClick={() => reset()}
            className="px-6 py-3 bg-red-500/10 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/20 transition-all font-semibold flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.15)] hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
          >
            <RefreshCcw className="w-4 h-4" /> Reinitialize Protocol
          </button>
          <Link href="/" className="px-6 py-3 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg hover:bg-slate-700 transition-all font-semibold flex items-center gap-2">
            <Home className="w-4 h-4" /> Return to Base
          </Link>
        </div>
      </div>
    </div>
  );
}
