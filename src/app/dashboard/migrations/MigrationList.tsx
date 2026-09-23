/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MigrationEvent, EvidenceArtifact } from "@/lib/migration/types";

interface Props {
  migrations: (MigrationEvent & {
    asset: { id: string; kind: string; identifier: string; displayName: string | null; criticality: string } | null;
    evidence: EvidenceArtifact[];
  })[];
}

const STATUS_LABELS: Record<string, string> = {
  pending: "PENDING",
  in_progress: "IN_PROGRESS",
  complete: "COMPLETE",
  verified: "VERIFIED",
  failed: "FAILED",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "text-zinc-500 bg-zinc-800 border-zinc-700",
  in_progress: "text-accent-yellow bg-accent-yellow/10 border-accent-yellow/30",
  complete: "text-accent-green bg-accent-green/10 border-accent-green/30",
  verified: "text-accent-blue bg-accent-blue/10 border-accent-blue/30",
  failed: "text-accent-red bg-accent-red/10 border-accent-red/30",
};

export function MigrationList({ migrations }: Props) {
  return (
    <div className="glass p-6 border border-border-bright">
      <div className="space-y-3">
        {(migrations as any[]).map((m) => (
          <div key={m.id} className="p-4 bg-zinc-900/30 border border-border-bright hover:border-accent-blue/50 transition-colors">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${STATUS_COLORS[m.status] || STATUS_COLORS.pending}`}>
                    {STATUS_LABELS[m.status] || m.status}
                  </span>
                  <span className="text-xs font-bold text-white font-mono">{m.migrationType}</span>
                </div>
                <div className="text-xs text-zinc-400 font-mono">
                  {m.description || m.migrationType} · initiated {new Date(m.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs text-zinc-500 font-mono">{new Date(m.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                {m.completedAt && (
                  <div className="text-[9px] text-accent-green font-mono">completed {new Date(m.completedAt).toLocaleDateString()}</div>
                )}
                {m.verifiedAt && (
                  <div className="text-[9px] text-accent-blue font-mono">verified {new Date(m.verifiedAt).toLocaleDateString()}</div>
                )}
              </div>
            </div>

            {(m as any).asset && (
              <div className="text-[10px] text-zinc-600 font-mono mb-2">
                Asset: <span className="text-zinc-400">{(m as any).asset.displayName || (m as any).asset.identifier}</span> ({(m as any).asset.kind})
              </div>
            )}

            {((m as any).evidence as any[]) && ((m as any).evidence as any[]).length > 0 && (
              <div className="flex items-center gap-3 mt-2 pt-2 border-t border-border-bright/50">
                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">EVIDENCE</span>
                {((m as any).evidence as any[]).map((e: any) => (
                  <span key={e.id} className={`inline-block px-2 py-0.5 rounded text-[9px] font-mono border ${e.verified ? "text-accent-green bg-accent-green/10 border-accent-green/30" : "text-zinc-500 bg-zinc-800 border-zinc-700"}`}>
                    {e.verified ? "✓ VERIFIED" : "○ " + e.evidenceType}
                  </span>
                ))}
              </div>
            )}

            {m.status === "pending" && (
              <button className="mt-3 text-[10px] font-mono text-accent-blue hover:text-white transition-colors">
                → Start migration
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
