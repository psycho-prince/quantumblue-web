/* eslint-disable @typescript-eslint/no-explicit-any */
export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";

interface MigrationRow {
  id: string;
  migrationType: string;
  status: string;
  description: string | null;
  createdAt: Date;
  completedAt: Date | null;
  verifiedAt: Date | null;
  asset: { id: string; kind: string; identifier: string; displayName: string | null } | null;
  evidence: Array<{ id: string; createdAt: Date; evidenceType: string }>;
}

interface MigrationSummary {
  status: string;
  _count: number;
}

export default async function MigrationDashboardPage() {
  const orgId = process.env.NEXT_PUBLIC_ORG_ID || "org-test-001";
  const months = parseInt(process.env.NEXT_PUBLIC_TIMELINE_MONTHS || "6", 10);

  const [summary, recentMigrations] = await Promise.all([
    (prisma as any).migrationEvent.groupBy({ by: ["status"], where: { organizationId: orgId }, _count: true }),
    (prisma as any).migrationEvent.findMany({
      where: { organizationId: orgId, createdAt: { gte: new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000) } }, // eslint-disable-line react-hooks/purity
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { asset: { select: { id: true, kind: true, identifier: true, displayName: true } }, evidence: { select: { id: true, createdAt: true, evidenceType: true } } },
    }),
  ]);

  const ms: Record<string, number> = (summary as MigrationSummary[]).reduce((acc, row) => { acc[row.status] = row._count; return acc; }, {} as Record<string, number>);

  const start = new Date();
  const end = new Date();
  start.setMonth(start.getMonth() - months);

  const migrations: MigrationRow[] = recentMigrations ?? [];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold font-mono mb-6 tracking-tight">Migration Dashboard</h1>
      <p className="text-zinc-500 text-sm font-mono mb-8 max-w-2xl">Track every cryptographic migration from initial assessment through verified completion.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total", value: migrations.length ?? 0, color: "text-white" },
          { label: "Completed", value: ms.complete ?? 0, color: "text-accent-green" },
          { label: "Verified", value: ms.verified ?? 0, color: "text-accent-blue" },
          { label: "Pending", value: ms.pending ?? 0, color: "text-accent-yellow" },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass p-6 border border-border-bright">
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">{label}</div>
            <div className={`text-3xl font-bold font-mono ${color}`}>{value}</div>
          </div>
        ))}
      </div>

      <div className="glass p-6 border border-border-bright">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-bold font-mono uppercase tracking-widest">Migration Timeline</h2>
          <span className="text-[10px] font-mono text-zinc-600">{months}-month view</span>
        </div>
        <TimelineChart data={[]} start={start} end={end} months={months} />
      </div>

      {migrations.length === 0 ? (
        <div className="glass p-12 border border-border-bright text-center">
          <p className="text-zinc-500 font-mono text-sm">No migrations yet. Begin your post-quantum migration journey.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {migrations.map((m) => (
            <div key={m.id} className="glass p-4 border border-border-bright">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-white font-mono font-bold text-sm">{m.migrationType}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ml-2 ${
                    m.status === "verified" ? "text-accent-blue bg-accent-blue/10 border-accent-blue/30" :
                    m.status === "complete" ? "text-accent-green bg-accent-green/10 border-accent-green/30" :
                    m.status === "in_progress" ? "text-accent-yellow bg-accent-yellow/10 border-accent-yellow/30" :
                    "text-zinc-500 bg-zinc-800 border-zinc-700"
                  }`}>{m.status}</span>
                </div>
                <span className="text-[9px] text-zinc-600 font-mono">{new Date(m.createdAt).toLocaleDateString()}</span>
              </div>
              {m.description && <p className="text-xs text-zinc-500 font-mono mb-2">{m.description}</p>}
              {m.asset && (
                <div className="text-zinc-600 text-[10px] font-mono mb-1">Asset: {m.asset.displayName || m.asset.identifier}</div>
              )}
              {m.evidence.length > 0 && (
                <div className="text-zinc-600 text-[10px] font-mono">
                  {m.evidence.length} evidence artifact{m.evidence.length !== 1 ? "s" : ""}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TimelineChart({ data, start, end, months }: { data: unknown[]; start: Date; end: Date; months: number }) {
  const weeks = Math.ceil(months * 4.33);

  return (
    <div className="relative h-[200px]">
      {Array.from({ length: weeks + 1 }).map((_, i) => (
        <div key={i} className="absolute bottom-0 top-0 border-l border-border-subtle" style={{ left: `${(i / weeks) * 100}%` }} />
      ))}
      {Array.from({ length: months }).map((_, i) => {
        const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
        return (
          <div key={i} className="absolute bottom-1 text-[9px] font-mono text-zinc-600" style={{ left: `${(i / months) * 100 + 1}%` }}>
            {d.toLocaleDateString("en-US", { month: "short", year: "2-digit" })}
          </div>
        );
      })}
    </div>
  );
}
