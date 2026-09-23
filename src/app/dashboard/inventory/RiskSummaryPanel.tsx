export function RiskSummaryPanel({
  priorityCounts,
  totalAssets,
  verifiedEvidence,
  unverifiedEvidence,
  migrations,
}: {
  priorityCounts: { 1: number; 2: number; 3: number };
  totalAssets: number;
  verifiedEvidence: number;
  unverifiedEvidence: number;
  migrations: Record<string, number>;
}) {
  const totalVulnerable = priorityCounts[1] + priorityCounts[2];

  return (
    <div className="glass p-6 border border-border-bright h-full">
      <h3 className="text-sm font-bold text-white font-mono uppercase tracking-widest mb-6">RISK_SUMMARY</h3>

      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Priority 1</span>
            <span className="text-xs font-bold text-accent-red font-mono">{priorityCounts[1]}</span>
          </div>
          <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
            <div className="h-full bg-accent-red transition-all duration-500" style={{ width: `${totalAssets > 0 ? (priorityCounts[1] / totalAssets) * 100 : 0}%` }} />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Priority 2</span>
            <span className="text-xs font-bold text-accent-yellow font-mono">{priorityCounts[2]}</span>
          </div>
          <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
            <div className="h-full bg-accent-yellow transition-all duration-500" style={{ width: `${totalAssets > 0 ? (priorityCounts[2] / totalAssets) * 100 : 0}%` }} />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Priority 3</span>
            <span className="text-xs font-bold text-zinc-500 font-mono">{priorityCounts[3]}</span>
          </div>
          <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
            <div className="h-full bg-zinc-600 transition-all duration-500" style={{ width: `${totalAssets > 0 ? (priorityCounts[3] / totalAssets) * 100 : 0}%` }} />
          </div>
        </div>

        <div className="pt-4 border-t border-border-bright">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">MIGRATION_STATUS</div>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between"><span className="text-zinc-500">Completed</span><span className="text-accent-green font-bold">{migrations.complete || 0}</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">In Progress</span><span className="text-accent-yellow font-bold">{migrations.in_progress || 0}</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Pending</span><span className="text-zinc-400 font-bold">{migrations.pending || 0}</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Verified</span><span className="text-accent-blue font-bold">{migrations.verified || 0}</span></div>
          </div>
        </div>

        <div className="pt-4 border-t border-border-bright">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">EVIDENCE</div>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between"><span className="text-zinc-500">Verified</span><span className="text-accent-green font-bold">{verifiedEvidence}</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Unverified</span><span className="text-accent-yellow font-bold">{unverifiedEvidence}</span></div>
          </div>
        </div>

        {totalVulnerable > 0 && (
          <div className="pt-4 border-t border-accent-red/30">
            <div className="flex items-center gap-2 text-accent-red text-[10px] font-bold uppercase tracking-widest mb-2">
              <span className="w-2 h-2 bg-accent-red rounded-full animate-pulse" />
              ACTION_REQUIRED
            </div>
            <p className="text-zinc-400 text-xs font-mono leading-relaxed">
              {totalVulnerable} asset{totalVulnerable !== 1 ? "s" : ""} require migration planning.
              {priorityCounts[1] > 0 && <span className="text-accent-red font-bold"> {priorityCounts[1]} are Priority 1.</span>}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
