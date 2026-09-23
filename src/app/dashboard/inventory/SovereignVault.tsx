"use client";

import { useState } from "react";

interface Props {
  vault: {
    items: Array<{
      id: string;
      label: string;
      fingerprint: string;
      status: "verified" | "pending" | "migration_required";
    }>;
  };
}

export function SovereignVault({ vault }: Props) {
  const [filter, setFilter] = useState<"all" | "verified" | "pending" | "migration_required">("all");

  const items = vault.items.filter((item) => filter === "all" || item.status === filter);

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">FILTER</span>
        {(["all", "verified", "pending", "migration_required"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-[9px] font-mono uppercase px-3 py-1 rounded transition-colors ${
              filter === f
                ? "bg-accent-blue/20 text-accent-blue border border-accent-blue/50"
                : "text-zinc-600 hover:text-zinc-400 border border-transparent"
            }`}
          >
            {f.replace("_", "_")}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono">
          <thead>
            <tr className="border-b border-border-bright text-zinc-600 text-[10px] uppercase tracking-widest font-bold">
              <th className="px-4 py-3">ASSET</th>
              <th className="px-4 py-3">FINGERPRINT</th>
              <th className="px-4 py-3">STATUS</th>
              <th className="px-4 py-3 text-right">VERIFIED</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {items.map((item) => (
              <tr key={item.id} className="group border-b border-border-bright hover:bg-zinc-900/50 transition-colors">
                <td className="px-4 py-4">
                  <div className="font-bold text-zinc-200 text-sm">{item.label}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="font-mono text-zinc-500 text-[10px] truncate max-w-[200px]">
                    {item.fingerprint.slice(0, 16)}...
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded ${
                    item.status === "verified"
                      ? "text-accent-green bg-accent-green/10"
                      : item.status === "pending"
                      ? "text-accent-yellow bg-accent-yellow/10"
                      : "text-accent-red bg-accent-red/10"
                  }`}>
                    {item.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  {item.status === "verified" ? (
                    <a href={`/verify/${item.id}`} className="text-accent-blue text-[10px] font-mono hover:underline">
                      VERIFY →
                    </a>
                  ) : (
                    <span className="text-zinc-600 text-[10px] font-mono">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {items.length === 0 && (
        <div className="text-center py-8 text-zinc-600 text-sm font-mono">
          No items match the selected filter.
        </div>
      )}
    </div>
  );
}
