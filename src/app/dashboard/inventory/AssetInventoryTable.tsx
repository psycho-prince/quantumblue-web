import { type AssetWithRisk } from "@/lib/migration/assets";

interface Props {
  assets: AssetWithRisk[];
}

const LEVEL_COLORS: Record<string, string> = {
  "PQ-READY": "text-accent-green bg-accent-green/10 border-accent-green/30",
  HYBRID: "text-accent-yellow bg-accent-yellow/10 border-accent-yellow/30",
  VULNERABLE: "text-accent-red bg-accent-red/10 border-accent-red/30",
  UNKNOWN: "text-zinc-500 bg-zinc-800 border-zinc-700",
};

const PRIORITY_COLORS: Record<number, string> = {
  1: "text-accent-red",
  2: "text-accent-yellow",
  3: "text-zinc-500",
};

export function AssetInventoryTable({ assets }: Props) {
  if (assets.length === 0) {
    return (
      <div className="glass p-12 border border-border-bright">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-white font-mono mb-2">NO_ASSETS_DISCOVERED</h3>
          <p className="text-zinc-500 text-sm font-mono">Run a scan via the CLI to populate your cryptographic inventory.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass p-6 border border-border-bright overflow-hidden">
      <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-zinc-900/50 border-b border-border-bright text-[10px] font-bold text-zinc-500 uppercase tracking-widest sticky top-0">
        <div className="col-span-3">ASSET</div>
        <div className="col-span-2">ALGORITHM</div>
        <div className="col-span-1">RISK</div>
        <div className="col-span-1">PRIORITY</div>
        <div className="col-span-2">DEPENDENCIES</div>
        <div className="col-span-3 text-right">LAST SEEN</div>
      </div>

      <div className="divide-y divide-border-bright/30">
        {assets.map((asset) => (
          <div key={asset.id} className="grid grid-cols-12 gap-4 px-4 py-4 hover:bg-zinc-900/50 transition-colors items-center">
            <div className="col-span-3 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white font-mono truncate">{asset.displayName || asset.identifier}</span>
                <span className="text-[9px] font-mono text-zinc-600 bg-zinc-800 px-1.5 py-0.5 rounded uppercase">{asset.kind}</span>
              </div>
              <div className="text-[9px] text-zinc-600 font-mono mt-0.5 truncate">{asset.source} · {asset.criticality}</div>
            </div>

            <div className="col-span-2">
              <div className="text-xs font-mono text-white font-medium">{asset._primaryAlgorithm}</div>
              {asset.cryptoUses.length > 0 && (
                <div className="text-[9px] text-zinc-600 font-mono">{asset.cryptoUses.length} usage{asset.cryptoUses.length > 1 ? "s" : ""}</div>
              )}
            </div>

            <div className="col-span-1">
              <span className={`inline-block px-2 py-1 rounded text-[9px] font-bold uppercase border ${LEVEL_COLORS[asset._riskLevel] || LEVEL_COLORS.UNKNOWN}`}>
                {asset._riskLevel}
              </span>
            </div>

            <div className="col-span-1">
              <span className={`text-xs font-bold font-mono ${PRIORITY_COLORS[asset._riskPriority]}`}>P{asset._riskPriority}</span>
            </div>

            <div className="col-span-2">
              <div className="text-xs font-mono text-white">{asset._dependencyCount}</div>
              <div className="text-[9px] text-zinc-600 font-mono">{asset.outgoing.length} out · {asset.incoming.length} in</div>
            </div>

            <div className="col-span-3 text-right">
              <div className="text-xs font-mono text-white">{new Date(asset.lastSeenAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
              <div className="text-[9px] text-zinc-600 font-mono">{new Date(asset.lastSeenAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 bg-zinc-900/30 border-t border-border-bright text-[10px] text-zinc-600 font-mono">
        {assets.length} asset{assets.length !== 1 ? "s" : ""} · showing all
      </div>
    </div>
  );
}
