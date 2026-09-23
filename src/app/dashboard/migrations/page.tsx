/* eslint-disable @typescript-eslint/no-explicit-any */
export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";

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

  const raw: any[] = recentMigrations ?? [];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold font-mono mb-6 tracking-tight">Migration Dashboard</h1>
      <div className="flex items-center gap-3 mb-1">
        <div className="h-px flex-1 bg-gradient-to-r from-accent-blue/30 via-accent-green/30 to-accent-yellow/30" />
        <p className="text-zinc-500 text-sm font-mono max-w-2xl text-right">Track every cryptographic migration from assessment through verified completion.</p>
        <div className="h-px flex-1 bg-gradient-to-r from-accent-yellow/30 via-accent-green/30 to-accent-blue/30" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Migrations", value: raw.length ?? 0, color: "text-white", icon: "◈" },
          { label: "Completed", value: ms.complete ?? 0, color: "text-accent-green", icon: "▣" },
          { label: "Verified", value: ms.verified ?? 0, color: "text-accent-blue", icon: "◇" },
          { label: "Pending", value: ms.pending ?? 0, color: "text-accent-yellow", icon: "◉" },
        ].map(({ label, value, color, icon }) => (
          <div key={label} className="glass p-6 border border-border-bright hover:border-border-bright/50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{label}</span>
              <span className={`text-lg font-mono ${color}`}>{icon}</span>
            </div>
            <div className={`text-4xl font-bold font-mono tracking-tight ${color}`}>{value}</div>
          </div>
        ))}
      </div>

      <div className="glass p-6 border border-border-bright mb-8">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm font-bold font-mono uppercase tracking-widest text-accent-blue">Timeline</span>
          <span className="text-[10px] font-mono text-zinc-600">{months}-month overview</span>
        </div>
        <TimelineChart data={[]} start={start} end={end} months={months} />
      </div>

      {raw.length === 0 ? (
        <div className="glass p-16 border border-border-bright text-center">
          <div className="text-4xl font-mono text-accent-blue/50 mb-4">◈</div>
          <p className="text-zinc-500 font-mono text-sm">No migrations yet.</p>
          <p className="text-zinc-600 text-xs font-mono mt-1">Begin your post-quantum migration journey through the asset inventory.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {raw.map((m) => (
            <div key={m.id} className="glass p-5 border border-border-bright hover:border-border-bright/60 transition-colors">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                    m.status === "verified" ? "text-accent-blue bg-accent-blue/10 border-accent-blue/30" :
                    m.status === "complete" ? "text-accent-green bg-accent-green/10 border-accent-green/30" :
                    m.status === "in_progress" ? "text-accent-yellow bg-accent-yellow/10 border-accent-yellow/30" :
                    "text-zinc-500 bg-zinc-800 border-zinc-700"
                  }`}>{m.status}</span>
                  <span className="text-white font-mono font-bold text-sm">{m.migrationType}</span>
                </div>
                <span className="text-[9px] text-zinc-600 font-mono whitespace-nowrap">{new Date(m.createdAt).toLocaleDateString()}</span>
              </div>
              {m.description && <p className="text-xs text-zinc-500 font-mono mb-2">{m.description}</p>}
              <div className="flex items-center gap-4 text-[9px] text-zinc-600 font-mono">
                {m.asset && <span>Asset: {m.asset.displayName || m.asset.identifier}</span>}
                {m.evidence.length > 0 && (
                  <a href={`/verify/${m.evidence[0].id}`} className="text-accent-blue hover:underline">
                    {m.evidence.length} evidence artifact{m.evidence.length !== 1 ? "s" : ""} →
                  </a>
                )}
              </div>
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
    <div className="relative h-[180px]">
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-blue/20 via-accent-green/20 to-accent-yellow/20 rounded-full" />
      {Array.from({ length: weeks + 1 }).map((_, i) => (
        <div key={i} className="absolute bottom-2 top-2 border-l border-border-subtle/50" style={{ left: `${(i / weeks) * 100}%` }} />
      ))}
      {Array.from({ length: months }).map((_, i) => {
        const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
        const isActive = i === months - 1;
        return (
          <div key={i} className="relative" style={{ left: `${(i / months) * 100}%` }}>
            <div className="absolute -top-5 text-[9px] font-mono text-zinc-600">{d.toLocaleDateString("en-US", { month: "short" })}</div>
            {isActive && <div className="absolute -top-6 left-0 right-0 h-px bg-accent-green/50" />}
          </div>
        );
      })}
    </div>
  );
}
