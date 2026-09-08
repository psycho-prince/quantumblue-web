"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ShieldCheck, AlertTriangle, ArrowRight, Clock, Hash } from "lucide-react";
import { motion } from "framer-motion";

type Anomaly = {
  id: string;
  scanId: string;
  baselineScanId: string;
  kind: string;
  description: string;
  severity: string;
  createdAt: string;
  scan: { targetName: string };
};

export default function AnomaliesList() {
  const { user } = useUser();
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnomalies = async () => {
      const res = await fetch("/api/anomalies");
      if (res.ok) {
        const data = await res.json();
        setAnomalies(data);
      }
      setLoading(false);
    };
    fetchAnomalies();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border border-accent-blue flex items-center justify-center animate-pulse">
            <ShieldCheck className="w-8 h-8 text-accent-blue" />
          </div>
          <span className="text-sm font-semibold tracking-wider text-accent-blue">LOADING_ANOMALIES...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border-bright">
          <div className="space-y-1">
            <span className="text-accent-blue font-bold text-[10px] uppercase tracking-[0.2em]">ANOMALY_DETECTION</span>
            <h1 className="text-3xl font-bold tracking-tight">ANOMALIES</h1>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-border-bright text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
            {anomalies.length} DETECTED
          </div>
        </div>

        <div className="glass p-6 border border-border-bright">
          <h3 className="text-sm font-bold text-zinc-400 mb-2">DETECTION_COVERAGE</h3>
          <p className="text-[10px] text-zinc-500 leading-relaxed">
            Currently detecting: <span className="text-accent-blue font-bold">new-vulnerable-algorithm</span> — a quantum-vulnerable primitive (NIST level 0) appearing at a location that had no such primitive in the previous scan of the same target.
            Additional detection types (cipher-suite downgrade, unknown-spike) will be added after validating this one against real repeated scans.
          </p>
        </div>

        <div className="space-y-4">
          {anomalies.map((anomaly) => (
            <motion.div
              key={anomaly.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-6 border border-red-500/20 hover:border-red-500/40 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/30 text-[10px] font-bold uppercase tracking-wider">
                        {anomaly.severity}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">{anomaly.kind}</span>
                    </div>
                    <p className="text-sm text-zinc-200 leading-relaxed">{anomaly.description}</p>
                    <div className="flex items-center gap-6 text-[10px] text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Hash className="w-3 h-3" /> Scan: {anomaly.scanId.slice(0, 8)}...
                      </span>
                      <span className="flex items-center gap-1">
                        <ArrowRight className="w-3 h-3" /> Baseline: {anomaly.baselineScanId.slice(0, 8)}...
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {new Date(anomaly.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {anomalies.length === 0 && (
            <div className="text-center py-20">
              <AlertTriangle className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
              <p className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest">NO_ANOMALIES_DETECTED</p>
              <p className="text-zinc-700 text-xs mt-2">Anomalies appear when a new quantum-vulnerable primitive is found at a new location compared to the previous scan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
