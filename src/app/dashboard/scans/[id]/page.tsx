"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, MapPin, Hash, Layers, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

type Finding = {
  id: string;
  bomRef: string;
  name: string;
  primitive: string;
  parameterSetIdentifier: string | null;
  nistQuantumSecurityLevel: number | null;
  location: string;
};

type ScanDetail = {
  id: string;
  targetName: string;
  bomSerialNumber: string;
  createdAt: string;
  findings: Finding[];
};

export default function ScanDetail() {
  const { user } = useUser();
  const params = useParams();
  const scanId = params?.id as string;
  const [scan, setScan] = useState<ScanDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScan = async () => {
      const res = await fetch(`/api/scans/${scanId}`);
      if (res.ok) {
        const data = await res.json();
        setScan(data);
      }
      setLoading(false);
    };
    if (scanId) fetchScan();
  }, [scanId]);

  if (loading || !scan) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border border-accent-blue flex items-center justify-center animate-pulse">
            <ShieldCheck className="w-8 h-8 text-accent-blue" />
          </div>
          <span className="text-sm font-semibold tracking-wider text-accent-blue">LOADING_SCAN_DATA...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/scans" className="p-2 border border-border-bright hover:border-accent-blue transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="space-y-1">
            <span className="text-accent-blue font-bold text-[10px] uppercase tracking-[0.2em]">SCAN_DETAIL</span>
            <h1 className="text-3xl font-bold tracking-tight">{scan.targetName}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass p-6 border border-border-bright">
            <div className="flex items-center gap-3 mb-2">
              <Hash className="w-4 h-4 text-accent-blue" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">SCAN_ID</span>
            </div>
            <p className="text-xs text-zinc-300 truncate">{scan.id}</p>
          </div>
          <div className="glass p-6 border border-border-bright">
            <div className="flex items-center gap-3 mb-2">
              <Layers className="w-4 h-4 text-accent-green" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">BOM_SERIAL</span>
            </div>
            <p className="text-xs text-zinc-300 truncate">{scan.bomSerialNumber}</p>
          </div>
          <div className="glass p-6 border border-border-bright">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">FINDINGS</span>
            </div>
            <p className="text-xs text-zinc-300">{scan.findings.length} total</p>
          </div>
        </div>

        <div className="glass border border-border-bright overflow-hidden">
          <div className="p-6 border-b border-border-bright">
            <h3 className="text-lg font-bold">FINDINGS_TABLE</h3>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">
              Every row shows evidence location — click through to verify, don&apos;t trust the verdict alone.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border-bright text-zinc-600 text-[10px] uppercase tracking-widest font-bold">
                  <th className="px-6 py-4">NAME</th>
                  <th className="px-6 py-4">PRIMITIVE</th>
                  <th className="px-6 py-4">PARAMETER_SET</th>
                  <th className="px-6 py-4">NIST_LEVEL</th>
                  <th className="px-6 py-4">LOCATION</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {scan.findings.map((f) => (
                  <tr key={f.id} className="border-b border-border-bright hover:bg-zinc-900/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-zinc-200">{f.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider border ${
                        f.primitive === "unknown"
                          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                          : "bg-zinc-800 text-zinc-300 border-zinc-700"
                      }`}>
                        {f.primitive}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-400 text-xs">{f.parameterSetIdentifier ?? "—"}</td>
                    <td className="px-6 py-4">
                      {f.nistQuantumSecurityLevel !== null ? (
                        <span className={`px-2 py-1 text-[10px] font-bold border ${
                          f.nistQuantumSecurityLevel === 0
                            ? "bg-red-500/10 text-red-400 border-red-500/30"
                            : "bg-green-500/10 text-green-400 border-green-500/30"
                        }`}>
                          Level {f.nistQuantumSecurityLevel}
                        </span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-accent-blue text-xs">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate max-w-[200px]" title={f.location}>{f.location}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {scan.findings.length === 0 && (
              <div className="text-center py-20">
                <ShieldCheck className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                <p className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest">NO_CRYPTOGRAPHIC_ASSETS_FOUND</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
