"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, ScanLine, AlertTriangle, Activity, Cpu } from "lucide-react";

type Scan = {
  id: string;
  targetName: string;
  bomSerialNumber: string;
  createdAt: string;
  _count: { findings: number; anomalies: number };
};

type Anomaly = {
  id: string;
  kind: string;
  description: string;
  severity: string;
  createdAt: string;
  scan: { targetName: string };
};

type Stats = {
  totalScans: number;
  totalFindings: number;
  findingsByLevel: Record<number, number>;
  unknownCount: number;
  recentScans: { id: string; targetName: string; createdAt: string; findingCount: number }[];
};

export default function LocalDashboard() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchData = async () => {
    const headers = { "x-org-id": "org-test-001" };
    const [scansRes, anomaliesRes, statsRes] = await Promise.all([
      fetch("/api/scans/index", { headers }),
      fetch("/api/anomalies", { headers }),
      fetch("/api/dashboard/stats", { headers }),
    ]);
    if (scansRes.ok) setScans(await scansRes.json());
    if (anomaliesRes.ok) setAnomalies(await anomaliesRes.json());
    if (statsRes.ok) setStats(await statsRes.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <header className="border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-blue-500" />
            <span className="font-bold text-xl tracking-tight">QUANTUM_BLUE</span>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-2">LOCAL_TEST_MODE</span>
          </div>
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            ORG: org-test-001
          </div>
        </div>
      </header>

      <nav className="border-b border-white/10 px-6">
        <div className="max-w-7xl mx-auto flex gap-1">
          {[
            { id: "overview", label: "OVERVIEW", icon: Activity },
            { id: "scans", label: "SCANS", icon: ScanLine },
            { id: "anomalies", label: "ANOMALIES", icon: AlertTriangle },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
                activeTab === item.id
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent text-zinc-500 hover:text-white"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {activeTab === "overview" && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="border border-white/10 p-6">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">TOTAL_SCANS</p>
                <p className="text-3xl font-bold">{stats.totalScans}</p>
              </div>
              <div className="border border-white/10 p-6">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">TOTAL_FINDINGS</p>
                <p className="text-3xl font-bold">{stats.totalFindings}</p>
              </div>
              <div className="border border-white/10 p-6">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">ANOMALIES</p>
                <p className="text-3xl font-bold text-red-500">{anomalies.length}</p>
              </div>
              <div className="border border-white/10 p-6">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">UNKNOWN_CLASS</p>
                <p className="text-3xl font-bold text-yellow-500">{stats.unknownCount}</p>
              </div>
            </div>

            <div className="border border-white/10 p-6">
              <h3 className="text-lg font-bold mb-4">FINDINGS_BY_NIST_LEVEL</h3>
              <div className="grid grid-cols-6 gap-4">
                {[0, 1, 2, 3, 4, 5].map((level) => (
                  <div key={level} className="text-center">
                    <div className={`text-2xl font-bold ${level === 0 ? "text-red-500" : level === 5 ? "text-green-500" : "text-white"}`}>
                      {stats.findingsByLevel[level] ?? 0}
                    </div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">LEVEL_{level}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-white/10 p-6">
              <h3 className="text-lg font-bold mb-4">RECENT_SCANS</h3>
              <div className="space-y-2">
                {stats.recentScans.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-3 border border-white/5 hover:border-white/20 transition-all">
                    <div>
                      <span className="text-sm font-bold">{s.targetName}</span>
                      <span className="text-[10px] text-zinc-500 ml-2">{s.id}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] text-zinc-500">{s.findingCount} findings</span>
                      <span className="text-[10px] text-zinc-500">{new Date(s.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "scans" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">SCANS ({scans.length})</h2>
            <div className="space-y-2">
              {scans.map((s) => (
                <div key={s.id} className="p-4 border border-white/10 hover:border-white/20 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold">{s.targetName}</span>
                      <span className="text-[10px] text-zinc-500 ml-2 font-mono">{s.id}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] text-zinc-500">{s._count.findings} findings</span>
                      <span className={`text-[10px] font-bold ${s._count.anomalies > 0 ? "text-red-500" : "text-zinc-500"}`}>
                        {s._count.anomalies} anomalies
                      </span>
                      <span className="text-[10px] text-zinc-500">{new Date(s.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "anomalies" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">ANOMALIES ({anomalies.length})</h2>
            <div className="space-y-2">
              {anomalies.map((a) => (
                <div key={a.id} className="p-4 border border-red-500/30 bg-red-500/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{a.kind}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 ${
                      a.severity === "high" ? "bg-red-500/20 text-red-500" : "bg-yellow-500/20 text-yellow-500"
                    }`}>
                      {a.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300">{a.description}</p>
                  <p className="text-[10px] text-zinc-500 mt-2">{new Date(a.createdAt).toLocaleString()}</p>
                </div>
              ))}
              {anomalies.length === 0 && (
                <div className="text-center py-10 text-zinc-500 uppercase text-sm tracking-widest">No anomalies detected</div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
