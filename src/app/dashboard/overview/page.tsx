"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ShieldCheck, Activity, AlertTriangle, ScanLine, TrendingUp, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type OrgStats = {
  totalScans: number;
  findingsByLevel: Record<number, number>;
  unknownCount: number;
  totalFindings: number;
  recentScans: Array<{
    id: string;
    targetName: string;
    createdAt: string;
    findingCount: number;
  }>;
};

export default function OrgOverview() {
  const { user } = useUser();
  const [stats, setStats] = useState<OrgStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch("/api/dashboard/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border border-accent-blue flex items-center justify-center animate-pulse">
            <ShieldCheck className="w-8 h-8 text-accent-blue" />
          </div>
          <span className="text-sm font-semibold tracking-wider text-accent-blue">LOADING_ORG_DATA...</span>
        </div>
      </div>
    );
  }

  const levelColors: Record<number, string> = {
    0: "bg-red-500/20 text-red-400 border-red-500/30",
    1: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    2: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    3: "bg-green-500/20 text-green-400 border-green-500/30",
    4: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    5: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border-bright">
          <div className="space-y-1">
            <span className="text-accent-blue font-bold text-[10px] uppercase tracking-[0.2em]">ORGANIZATION_OVERVIEW</span>
            <h1 className="text-3xl font-bold tracking-tight">DASHBOARD</h1>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-border-bright text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-green" />
            LIVE_DATA
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass p-6 border border-border-bright">
            <div className="flex items-center gap-3 mb-4">
              <ScanLine className="w-5 h-5 text-accent-blue" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">TOTAL_SCANS</span>
            </div>
            <p className="text-3xl font-bold">{stats.totalScans}</p>
          </div>
          <div className="glass p-6 border border-border-bright">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-5 h-5 text-accent-green" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">TOTAL_FINDINGS</span>
            </div>
            <p className="text-3xl font-bold">{stats.totalFindings}</p>
          </div>
          <div className="glass p-6 border border-border-bright">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">QUANTUM_VULNERABLE</span>
            </div>
            <p className="text-3xl font-bold text-red-400">{stats.findingsByLevel[0] ?? 0}</p>
          </div>
          <div className="glass p-6 border border-border-bright">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">UNKNOWN_CLASS</span>
            </div>
            <p className="text-3xl font-bold text-yellow-400">{stats.unknownCount}</p>
          </div>
        </div>

        {/* Findings by NIST Level */}
        <div className="glass p-8 border border-border-bright">
          <h3 className="text-lg font-bold mb-6">FINDINGS_BY_NIST_QUANTUM_SECURITY_LEVEL</h3>
          <div className="space-y-3">
            {[0, 1, 2, 3, 4, 5].map((level) => {
              const count = stats.findingsByLevel[level] ?? 0;
              const pct = stats.totalFindings > 0 ? (count / stats.totalFindings) * 100 : 0;
              return (
                <div key={level} className="flex items-center gap-4">
                  <span className="text-xs font-bold text-zinc-400 w-8">L{level}</span>
                  <div className="flex-1 h-6 bg-zinc-900 border border-border-bright relative overflow-hidden">
                    <div
                      className={cn("h-full transition-all", levelColors[level]?.split(" ")[0] ?? "bg-zinc-700")}
                      style={{ width: `${Math.max(pct, 2)}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-zinc-300 w-16 text-right">{count} ({pct.toFixed(1)}%)</span>
                </div>
              );
            })}
            <div className="flex items-center gap-4 pt-2 border-t border-border-bright">
              <span className="text-xs font-bold text-yellow-400 w-8">UNK</span>
              <div className="flex-1 h-6 bg-zinc-900 border border-border-bright relative overflow-hidden">
                <div
                  className="h-full bg-yellow-500/20 transition-all"
                  style={{ width: `${Math.max((stats.unknownCount / Math.max(stats.totalFindings, 1)) * 100, 2)}%` }}
                />
              </div>
              <span className="text-xs font-bold text-yellow-400 w-16 text-right">
                {stats.unknownCount} ({(stats.totalFindings > 0 ? (stats.unknownCount / stats.totalFindings) * 100 : 0).toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Recent Scans */}
        <div className="glass p-8 border border-border-bright">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">RECENT_SCANS</h3>
            <Link href="/dashboard/scans" className="text-[10px] font-bold text-accent-blue uppercase tracking-widest hover:underline">
              VIEW_ALL →
            </Link>
          </div>
          {stats.recentScans.length === 0 ? (
            <div className="text-center py-12">
              <ScanLine className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
              <p className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest">NO_SCANS_INGESTED</p>
            </div>
          ) : (
            <div className="space-y-2">
              {stats.recentScans.map((scan) => (
                <Link
                  key={scan.id}
                  href={`/dashboard/scans/${scan.id}`}
                  className="flex items-center justify-between p-4 border border-border-bright hover:border-accent-blue transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-accent-blue" />
                    <div>
                      <span className="text-sm font-bold text-white">{scan.targetName}</span>
                      <p className="text-[10px] text-zinc-500">{scan.findingCount} findings</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Clock className="w-3 h-3" />
                    <span className="text-[10px]">{new Date(scan.createdAt).toLocaleDateString()}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
