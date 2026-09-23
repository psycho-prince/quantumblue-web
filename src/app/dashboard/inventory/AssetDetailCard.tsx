import type { AssetWithRisk } from "@/lib/migration/assets";

interface Props {
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
  risk: {
    score: number;
    level: "PQ-READY" | "HYBRID" | "VULNERABLE" | "UNKNOWN";
    priority: 1 | 2 | 3;
    reasons: string[];
  };
}

export function AssetDetailCard({ asset, risk }: Props) {
  return (
    <div className="glass p-6 border border-border-bright">
      <h3 className="text-sm font-bold text-white font-mono uppercase tracking-widest mb-6">ASSET_DETAILS</h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Identifier</div>
          <div className="text-white font-mono text-sm break-all">{asset.identifier}</div>
        </div>
        <div>
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Source</div>
          <div className="text-white font-mono text-sm">{asset.source}</div>
        </div>
        <div>
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Criticality</div>
          <div className="text-white font-mono text-sm uppercase">{asset.criticality}</div>
        </div>
        <div>
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">First Seen</div>
          <div className="text-white font-mono text-sm">{new Date(asset.firstSeenAt).toLocaleDateString()}</div>
        </div>
        <div>
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Last Seen</div>
          <div className="text-white font-mono text-sm">{new Date(asset.lastSeenAt).toLocaleDateString()}</div>
        </div>
        <div>
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Dependencies</div>
          <div className="text-white font-mono text-sm">{asset.outgoing.length} out · {asset.incoming.length} in</div>
        </div>
      </div>

      {/* Crypto usage */}
      <div className="mb-6">
        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">CRYPTO_USAGE</h4>
        {asset.cryptoUses.length === 0 ? (
          <div className="text-zinc-600 text-xs font-mono">No cryptographic usage detected</div>
        ) : (
          <div className="space-y-2">
            {asset.cryptoUses.map((use) => (
              <div key={use.primitive + use.location} className="flex items-center justify-between p-3 bg-zinc-900/30 rounded border border-border-bright/30">
                <div>
                  <div className="text-xs font-mono text-white font-medium">{use.primitive}</div>
                  <div className="text-[9px] text-zinc-600 font-mono">{use.role} · {use.location}</div>
                </div>
                {use.keyBits && (
                  <div className="text-[9px] text-zinc-600 font-mono">{use.keyBits} bits</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Certificates */}
      {asset.certificates.length > 0 && (
        <div className="mb-6">
          <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">CERTIFICATES</h4>
          <div className="space-y-2">
            {asset.certificates.map((cert) => (
              <div key={cert.serialNumber} className="p-3 bg-zinc-900/30 rounded border border-border-bright/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-white">{cert.publicKeyAlgorithm}</span>
                  {cert.publicKeyBits && <span className="text-[9px] text-zinc-600 font-mono">{cert.publicKeyBits}-bit</span>}
                </div>
                <div className="text-[9px] text-zinc-600 font-mono truncate">{cert.subject}</div>
                <div className="text-[9px] text-zinc-600 font-mono mt-1">
                  valid {new Date(cert.notBefore).toLocaleDateString()} → {new Date(cert.notAfter).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="pt-4 border-t border-border-bright">
        <div className="flex gap-3">
          <a
            href={`/dashboard/migrations?asset=${asset.id}`}
            className="flex-1 px-4 py-3 bg-accent-blue text-black font-bold text-xs uppercase tracking-widest hover:bg-blue-400 transition-colors font-mono rounded"
          >
            START_MIGRATION
          </a>
          <a
            href={`/verify/new?asset=${asset.id}`}
            className="flex-1 px-4 py-3 border border-border-bright text-zinc-400 font-bold text-xs uppercase tracking-widest hover:border-accent-blue/50 hover:text-white transition-colors font-mono rounded"
          >
            GENERATE_EVIDENCE
          </a>
        </div>
      </div>
    </div>
  );
}
