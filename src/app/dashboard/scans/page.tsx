"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ShieldCheck, ScanLine, Clock, MapPin, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

type Scan = {
  id: string;
  targetName: string;
  bomSerialNumber: string;
  createdAt: string;
  _count: { findings: number; anomalies: number };
};

export default function ScansList() {
  const { user } = useUser();
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScans = async () => {
      const res = await fetch("/api/scans");
      if (res.ok) {
        const data = await res.json();
        setScans(data);
      }
      setLoading(false);
    };
    fetchScans();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border border-accent-blue flex items-center justify-center animate-pulse">
            <ShieldCheck className="w-8 h-8 text-accent-blue" />
          </div>
          <span className="text-sm font-semibold tracking-wider text-accent-blue">LOADING_SCANS...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border-bright">
          <div className="space-y-1">
            <span className="text-accent-blue font-bold text-[10px] uppercase tracking-[0.2em]">ALL_SCANS</span>
            <h1 className="text-3xl font-bold tracking-tight">SCAN_HISTORY</h1>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-border-bright text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-green" />
            {scans.length} SCANS
          </div>
        </div>

        <div className="space-y-3">
          {scans.map((scan) => (
            <Link
              key={scan.id}
              href={`/dashboard/scans/${scan.id}`}
              className="block glass p-6 border border-border-bright hover:border-accent-blue transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-accent-blue/30 flex items-center justify-center">
                    <ScanLine className="w-5 h-5 text-accent-blue" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{scan.targetName}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {scan._count.findings} findings
                      </span>
                      <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {new Date(scan.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {scan._count.anomalies > 0 && (
                    <span className="px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/30 text-[10px] font-bold uppercase tracking-wider">
                      {scan._count.anomalies} anomalies
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-accent-blue transition-colors" />
                </div>
              </div>
            </Link>
          ))}
          {scans.length === 0 && (
            <div className="text-center py-20">
              <ScanLine className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
              <p className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest">NO_SCANS_INGESTED</p>
              <p className="text-zinc-700 text-xs mt-2">Run a scan with --push to see results here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
