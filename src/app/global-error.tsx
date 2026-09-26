"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-200 font-mono min-h-screen flex items-center justify-center p-6">
        <div className="max-w-xl w-full text-center space-y-6 bg-slate-900/50 p-8 rounded-2xl border border-red-500/20 shadow-2xl">
          <div className="flex justify-center">
            <div className="p-4 bg-red-500/10 rounded-full">
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-100 tracking-tight">Critical System Failure</h1>
          <p className="text-slate-400">
            A fatal exception occurred in the core runtime. The application could not recover normally.
          </p>
          <div className="pt-4">
            <button
              onClick={() => reset()}
              className="px-6 py-3 bg-red-500/10 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/20 transition-all font-semibold flex items-center gap-2 mx-auto"
            >
              <RotateCcw className="w-4 h-4" /> Hard Reboot System
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
