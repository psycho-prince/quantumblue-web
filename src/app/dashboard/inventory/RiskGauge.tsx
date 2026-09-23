import type { AssetWithRisk } from "@/lib/migration/assets";

interface Props {
  risk: {
    score: number;
    level: "PQ-READY" | "HYBRID" | "VULNERABLE" | "UNKNOWN";
    priority: 1 | 2 | 3;
    reasons: string[];
  };
  asset: {
    id: string;
    kind: string;
    identifier: string;
    displayName: string | null;
    source: string;
    criticality: string;
    firstSeenAt: Date;
    lastSeenAt: Date;
    cryptoUses: Array<{ primitive: string; role: string; keyBits: number | null; parameterSet: string | null; location: string }>;
    certificates: Array<{ serialNumber: string; subject: string; publicKeyAlgorithm: string; publicKeyBits: number | null; notBefore: Date; notAfter: Date }>;
    outgoing: Array<{ toAsset: { id: string; identifier: string; kind: string } }>;
    incoming: Array<{ fromAsset: { id: string; identifier: string; kind: string } }>;
  };
}

export function RiskGauge({ risk, asset }: Props) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (risk.score / 100) * circumference;

  const barColor = risk.level === "VULNERABLE" ? "text-accent-red" : risk.level === "HYBRID" ? "text-accent-yellow" : "text-accent-green";

  return (
    <div className="glass p-6 border border-border-bright h-full">
      <h3 className="text-sm font-bold text-white font-mono uppercase tracking-widest mb-6">RISK_GAUGE</h3>

      <div className="flex flex-col items-center">
        {/* Circular gauge */}
        <svg viewBox="0 0 120 120" className="w-28 h-28 mb-4">
          <circle cx="60" cy="60" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-zinc-800" />
          <circle
            cx="60" cy="60" r="45"
            fill="none"
            stroke={risk.level === "VULNERABLE" ? "#ef4444" : risk.level === "HYBRID" ? "#eab308" : "#22c55e"}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 60 60)"
            className="transition-all duration-500"
          />
          <text x="60" y="55" textAnchor="middle" className="text-2xl font-bold fill-white font-mono">{risk.score}</text>
          <text x="60" y="72" textAnchor="middle" className="text-[9px] fill-zinc-500 font-mono">/ 100</text>
        </svg>

        <div className="text-center">
          <div className={`text-sm font-bold font-mono ${barColor}`}>
            Priority {risk.priority}
          </div>
          <div className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest mt-1">
            {risk.level.replace("-", "_").replace("_", " ")}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border-bright">
        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">TOP_RISK_FACTORS</h4>
        <ul className="space-y-2">
          {risk.reasons.slice(0, 4).map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-[10px] text-zinc-400 font-mono">
              <span className="text-accent-red mt-0.5">•</span>
              {r}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 pt-4 border-t border-border-bright">
        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">ALGORITHM</h4>
        <div className="text-white font-mono text-sm">{asset.cryptoUses[0]?.primitive || "unknown"}</div>
        {asset.cryptoUses[0]?.keyBits && (
          <div className="text-[9px] text-zinc-600 font-mono mt-1">{asset.cryptoUses[0].keyBits} bits</div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-border-bright">
        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">CERTIFICATES</h4>
        {asset.certificates.length === 0 ? (
          <div className="text-[10px] text-zinc-600 font-mono">No certificates</div>
        ) : (
          <div className="space-y-2">
            {asset.certificates.map((c) => (
              <div key={c.serialNumber} className="text-[10px] text-zinc-400 font-mono">
                <span className="text-zinc-500">{c.publicKeyAlgorithm}</span>
                {" "}
                {c.publicKeyBits ? `${c.publicKeyBits}-bit` : ""}
                <span className="text-zinc-600">·</span>
                <span className="text-zinc-600">{c.subject}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
