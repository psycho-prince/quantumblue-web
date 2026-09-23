/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";

export default async function AssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orgId = process.env.NEXT_PUBLIC_ORG_ID || "org-test-001";

  const asset = await (prisma as any).asset.findFirst({
    where: { id, organizationId: orgId },
    include: {
      cryptoUses: { orderBy: { detectedAt: "desc" } },
      certificates: true,
      outgoing: { include: { toAsset: { select: { id: true, kind: true, identifier: true, displayName: true } } } },
      incoming: { include: { fromAsset: { select: { id: true, kind: true, identifier: true, displayName: true } } } },
      migrationEvents: { orderBy: { createdAt: "desc" }, include: { evidence: true } },
    },
  });

  if (!asset) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white font-mono">ASSET_NOT_FOUND</h2>
          <p className="text-zinc-500 text-sm font-mono mt-2">This asset may have been removed or you may not have access.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <a href="/inventory" className="text-zinc-500 text-sm font-mono hover:text-white mb-8 inline-block">← BACK_TO_INVENTORY</a>

      <h1 className="text-3xl font-bold text-white font-mono mb-2">
        {asset.displayName || asset.identifier}
        <span className="text-[10px] font-mono text-zinc-600 ml-3 uppercase">{asset.kind}</span>
      </h1>
      <div className="text-zinc-500 text-xs font-mono mb-8">
        Source: {asset.source} · Criticality: {asset.criticality} · First seen: {new Date(asset.firstSeenAt).toLocaleDateString()} · Last seen: {new Date(asset.lastSeenAt).toLocaleDateString()}
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-bold text-white font-mono uppercase tracking-widest mb-4">CRYPTO_USAGE</h2>
        {(asset.cryptoUses as any[]).length === 0 ? (
          <p className="text-zinc-600 font-mono text-sm">No cryptographic usage detected.</p>
        ) : (
          <div className="space-y-2">
            {(asset.cryptoUses as any[]).map((use) => (
              <div key={use.id} className="glass p-4 border border-border-bright">
                <div className="flex items-center justify-between">
                  <span className="text-white font-mono font-bold">{use.primitive}</span>
                  {use.keyBits && <span className="text-zinc-600 text-xs font-mono">{use.keyBits} bits</span>}
                </div>
                <div className="text-zinc-500 text-xs font-mono mt-1">{use.role} · {use.location}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {(asset.certificates as any[]).length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white font-mono uppercase tracking-widest mb-4">CERTIFICATES</h2>
          <div className="space-y-2">
            {(asset.certificates as any[]).map((cert) => (
              <div key={cert.id} className="glass p-4 border border-border-bright">
                <div className="text-white font-mono text-sm">{cert.publicKeyAlgorithm}</div>
                <div className="text-zinc-600 text-xs font-mono">{cert.subject}</div>
                <div className="text-zinc-600 text-xs font-mono mt-1">
                  Valid: {new Date(cert.notBefore).toLocaleDateString()} → {new Date(cert.notAfter).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {((asset.outgoing as any[])?.length || 0) > 0 || ((asset.incoming as any[])?.length || 0) > 0 ? (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white font-mono uppercase tracking-widest mb-4">DEPENDENCY_GRAPH</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {((asset.outgoing as any[])?.length || 0) > 0 && (
              <div className="glass p-4 border border-border-bright">
                <h3 className="text-accent-blue text-xs font-bold font-mono uppercase tracking-widest mb-3">DEPENDS_ON ({(asset.outgoing as any[]).length})</h3>
                {(asset.outgoing as any[]).map((edge) => (
                  <div key={edge.id} className="text-zinc-400 text-xs font-mono mb-2">
                    {edge.toAsset.displayName || edge.toAsset.identifier}
                  </div>
                ))}
              </div>
            )}
            {((asset.incoming as any[])?.length || 0) > 0 && (
              <div className="glass p-4 border border-border-bright">
                <h3 className="text-accent-green text-xs font-bold font-mono uppercase tracking-widest mb-3">DEPENDED_ON_BY ({(asset.incoming as any[]).length})</h3>
                {(asset.incoming as any[]).map((edge) => (
                  <div key={edge.id} className="text-zinc-400 text-xs font-mono mb-2">
                    {edge.fromAsset.displayName || edge.fromAsset.identifier}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}

      <div>
        <h2 className="text-lg font-bold text-white font-mono uppercase tracking-widest mb-4">MIGRATION_HISTORY</h2>
        {((asset.migrationEvents as any[]))?.length === 0 ? (
          <p className="text-zinc-600 font-mono text-sm">No migrations recorded for this asset yet.</p>
        ) : (
          <div className="space-y-2">
            {(asset.migrationEvents as any[]).map((m) => (
              <div key={m.id} className="glass p-4 border border-border-bright">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-mono font-bold text-sm">{m.migrationType}</span>
                  <span className="text-zinc-600 text-[10px] font-mono uppercase">{m.status}</span>
                </div>
                {m.description && <div className="text-zinc-500 text-xs font-mono">{m.description}</div>}
                <div className="text-zinc-600 text-[10px] font-mono mt-1">
                  {new Date(m.createdAt).toLocaleDateString()}
                  {m.completedAt ? ` · done ${new Date(m.completedAt).toLocaleDateString()}` : ""}
                  {m.verifiedAt ? ` · verified ${new Date(m.verifiedAt).toLocaleDateString()}` : ""}
                </div>
                {(m.evidence as any[]).length > 0 && (
                  <div className="text-zinc-600 text-[10px] font-mono mt-1">
                    {(m.evidence as any[]).length} evidence artifact{(m.evidence as any[]).length !== 1 ? "s" : ""}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
