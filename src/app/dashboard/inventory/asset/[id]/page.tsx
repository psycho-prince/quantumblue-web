/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { AssetDetailCard } from "@/app/dashboard/inventory/AssetDetailCard";
import { RiskGauge } from "@/app/dashboard/inventory/RiskGauge";
import StartMigrationForm from "./StartMigrationForm";
import GenerateEvidenceForm from "./GenerateEvidenceForm";
import VerifyMigrationButton from "./VerifyMigrationButton";

export const metadata = { title: "Asset Detail | QuantumBlue" };

interface MigrationRow {
  id: string;
  migrationType: string;
  status: string;
  description: string | null;
  createdAt: Date;
  completedAt: Date | null;
  verifiedAt: Date | null;
  evidence: Array<{ id: string; evidenceType: string }>;
}

export default async function AssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orgId = process.env.NEXT_PUBLIC_ORG_ID || "org-test-001";

  const [asset, migrations] = await Promise.all([
    prisma.asset.findFirst({
      where: { id, organizationId: orgId },
      include: {
        cryptoUses: { orderBy: { detectedAt: "desc" } },
        certificates: true,
        outgoing: { include: { toAsset: { select: { id: true, kind: true, identifier: true, displayName: true } } }, where: { confidence: { gte: 0.5 } } },
        incoming: { include: { fromAsset: { select: { id: true, kind: true, identifier: true, displayName: true } } }, where: { confidence: { gte: 0.5 } } },
      },
    }),
    (prisma as any).migrationEvent.findMany({
      where: { assetId: id, organizationId: orgId },
      orderBy: { createdAt: "desc" },
      include: { evidence: true },
    }),
  ]);

  if (!asset) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-white font-mono">ASSET_NOT_FOUND</h2>
          <p className="text-zinc-500 text-sm font-mono mt-2">This asset may have been removed or you may not have access.</p>
        </div>
      </div>
    );
  }

  const migrationRows: MigrationRow[] = migrations ?? [];

  const primaryAlgo = asset.cryptoUses[0]?.primitive || "unknown";
  const riskFactors = {
    algorithm: primaryAlgo,
    keySize: asset.cryptoUses[0]?.keyBits ?? null,
    dataSensitivity: asset.criticality as "critical" | "confidential" | "internal" | "public",
    dataLifetimeYears: estimateLifetime(asset.kind),
    internetExposed: ["domain", "api", "service", "endpoint"].includes(asset.kind.toLowerCase()),
    dependencyCount: asset.outgoing.length + asset.incoming.length,
    migrationComplexity: estimateComplexity(asset.outgoing.length + asset.incoming.length),
    cryptoAgility: estimateAgility(asset.lastSeenAt),
  };
  const risk = computeRisk(riskFactors);

  const activeMigration = migrationRows[0] ?? null;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <a href="/dashboard/inventory" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-8 font-mono">← BACK_TO_INVENTORY</a>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${
              risk.level === "VULNERABLE" ? "text-accent-red bg-accent-red/10 border-accent-red/30" :
              risk.level === "HYBRID" ? "text-accent-yellow bg-accent-yellow/10 border-accent-yellow/30" :
              risk.level === "PQ-READY" ? "text-accent-green bg-accent-green/10 border-accent-green/30" :
              "text-zinc-500 bg-zinc-800 border-zinc-700"
            }`}>{risk.level}</span>
            <span className="text-[9px] font-mono text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded uppercase">{asset.kind}</span>
            <span className="text-[9px] font-mono text-zinc-600">source: {asset.source}</span>
          </div>
          <h1 className="text-3xl font-bold text-white font-mono tracking-tight">{asset.displayName || asset.identifier}</h1>
          <div className="flex items-center gap-4 mt-3 text-xs font-mono text-zinc-500">
            <span>ID: {asset.id.slice(0, 8)}...</span>
            <span>first seen: {new Date(asset.firstSeenAt).toLocaleDateString()}</span>
            <span>last seen: {new Date(asset.lastSeenAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-1"><RiskGauge risk={risk} asset={asset} /></div>
          <div className="lg:col-span-2"><AssetDetailCard asset={asset} risk={risk} /></div>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-bold text-white font-mono uppercase tracking-widest mb-6">MIGRATION_FLOW</h2>

          {migrationRows.length === 0 ? (
            <div className="glass p-6 border border-border-bright">
              <p className="text-zinc-500 text-sm font-mono mb-4">No migrations recorded for this asset yet. Start by registering a migration event.</p>
              <StartMigrationForm assetId={asset.id} assetName={asset.displayName || asset.identifier} assetKind={asset.kind} />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-3">
                {migrationRows.map((m) => {
                  const latestEvidence = m.evidence[0] ?? null;
                  return (
                    <div key={m.id} className="glass p-5 border border-border-bright">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-white font-mono">{m.migrationType}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                            m.status === "verified" ? "text-accent-blue bg-accent-blue/10 border-accent-blue/30" :
                            m.status === "complete" ? "text-accent-green bg-accent-green/10 border-accent-green/30" :
                            m.status === "in_progress" ? "text-accent-yellow bg-accent-yellow/10 border-accent-yellow/30" :
                            "text-zinc-500 bg-zinc-800 border-zinc-700"
                          }`}>{m.status}</span>
                          {latestEvidence && (
                            <a href={`/verify/${latestEvidence.id}`} className="text-[9px] font-mono text-accent-blue hover:underline">view latest evidence →</a>
                          )}
                        </div>
                        <div className="text-[9px] text-zinc-600 font-mono text-right">
                          {new Date(m.createdAt).toLocaleDateString()}
                          {m.completedAt ? ` · done ${new Date(m.completedAt).toLocaleDateString()}` : ""}
                          {m.verifiedAt ? ` · verified ${new Date(m.verifiedAt).toLocaleDateString()}` : ""}
                        </div>
                      </div>
                      {m.description && <p className="text-xs text-zinc-500 font-mono mb-2">{m.description}</p>}
                      {m.evidence.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {m.evidence.map((e) => (
                            <a key={e.id} href={`/verify/${e.id}`} className="text-[9px] font-mono text-accent-blue hover:underline">evidence: {e.evidenceType}</a>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {activeMigration && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border-bright">
                  {activeMigration.status === "pending" && (
                    <div className="md:col-span-3">
                      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-mono mb-3">STEP_1: MARK_IN_PROGRESS</h3>
                      <VerifyMigrationButton migrationId={activeMigration.id} />
                    </div>
                  )}
                  {(activeMigration.status === "in_progress" || activeMigration.status === "complete") && (
                    <div className="md:col-span-3">
                      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-mono mb-3">STEP_2: GENERATE_EVIDENCE — {activeMigration.evidence.length} artifact(s) attached</h3>
                      <GenerateEvidenceForm migrationEventId={activeMigration.id} />
                    </div>
                  )}
                  {activeMigration.status === "complete" && activeMigration.evidence.length > 0 && (
                    <div className="md:col-span-3">
                      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-mono mb-3">STEP_3: VERIFY_MIGRATION</h3>
                      <VerifyMigrationButton migrationId={activeMigration.id} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {(asset.outgoing.length > 0 || asset.incoming.length > 0) && (
          <div>
            <h2 className="text-xl font-bold text-white font-mono uppercase tracking-widest mb-6">DEPENDENCY_GRAPH</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {asset.outgoing.length > 0 && (
                <div className="glass p-6 border border-border-bright">
                  <h3 className="text-sm font-bold text-accent-blue font-mono uppercase tracking-widest mb-4">DEPENDS_ON ({asset.outgoing.length})</h3>
                  <div className="space-y-2">
                    {asset.outgoing.map((edge) => (
                      <a key={edge.id} href={`/dashboard/inventory/asset/${edge.toAsset.id}`} className="flex items-center justify-between p-3 bg-zinc-900/30 rounded border border-border-bright hover:border-accent-blue/50 transition-colors">
                        <span className="text-xs font-mono text-white">{edge.toAsset.displayName || edge.toAsset.identifier}</span>
                        <span className="text-[9px] text-zinc-600 font-mono">{edge.toAsset.kind}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {asset.incoming.length > 0 && (
                <div className="glass p-6 border border-border-bright">
                  <h3 className="text-sm font-bold text-accent-green font-mono uppercase tracking-widest mb-4">DEPENDED_ON_BY ({asset.incoming.length})</h3>
                  <div className="space-y-2">
                    {asset.incoming.map((edge) => (
                      <a key={edge.id} href={`/dashboard/inventory/asset/${edge.fromAsset.id}`} className="flex items-center justify-between p-3 bg-zinc-900/30 rounded border border-border-bright hover:border-accent-green/50 transition-colors">
                        <span className="text-xs font-mono text-white">{edge.fromAsset.displayName || edge.fromAsset.identifier}</span>
                        <span className="text-[9px] text-zinc-600 font-mono">{edge.fromAsset.kind}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function estimateLifetime(kind: string): number {
  const k = kind.toLowerCase();
  if (k.includes("cert") || k.includes("certificate") || k.includes("domain")) return 2;
  if (k.includes("key") || k.includes("secret")) return 1;
  if (k.includes("code") || k.includes("sign")) return 5;
  if (k.includes("db") || k.includes("database")) return 7;
  return 3;
}

function estimateComplexity(count: number): "low" | "medium" | "high" {
  if (count > 10) return "high";
  if (count > 3) return "medium";
  return "low";
}

function estimateAgility(lastSeen: Date): number {
  const days = (Date.now() - lastSeen.getTime()) / 86400000;
  return days > 30 ? 2 : 4;
}

function computeRisk(factors: {
  algorithm: string;
  dataSensitivity: "critical" | "confidential" | "internal" | "public";
  dataLifetimeYears: number;
  internetExposed: boolean;
  dependencyCount: number;
  migrationComplexity: "low" | "medium" | "high";
  cryptoAgility: number;
}) {
  let score = 0;
  const reasons: string[] = [];
  const algoUpper = factors.algorithm.toUpperCase();
  const isPQC = algoUpper.includes("ML-KEM") || algoUpper.includes("ML-DSA") || algoUpper.includes("DILITHIUM") || algoUpper.includes("FALCON");
  const isVuln = !isPQC && (algoUpper.includes("RSA") || algoUpper.includes("ECC") || algoUpper.includes("ECDSA"));

  if (isPQC) { score += 0; reasons.push("PQ algorithm in use"); }
  else if (isVuln) { score += 40; reasons.push(`Vulnerable algorithm: ${factors.algorithm}`); }
  else { score += 15; reasons.push("Algorithm status unclear"); }

  const sensWeight = { critical: 3, confidential: 2, internal: 1, public: 0 };
  score += Math.min((sensWeight[factors.dataSensitivity] || 0) * Math.min(factors.dataLifetimeYears, 10), 25);
  if (factors.dataSensitivity === "critical" && factors.dataLifetimeYears > 5) reasons.push("Long-lived critical data");
  if (factors.internetExposed) { score += 15; reasons.push("Internet-facing"); }
  if (factors.dependencyCount > 10) { score += 10; reasons.push(`High blast radius (${factors.dependencyCount} deps)`); }
  else if (factors.dependencyCount > 3) { score += 5; }

  score = Math.max(0, Math.min(100, score));

  let level: "PQ-READY" | "HYBRID" | "VULNERABLE" | "UNKNOWN" = "VULNERABLE";
  if (isPQC) level = "PQ-READY";
  else if (score >= 20 && !isVuln) level = "HYBRID";
  else if (score < 20) level = "UNKNOWN";

  let priority: 1 | 2 | 3 = 3;
  if (score >= 50) priority = 1;
  else if (score >= 25) priority = 2;

  return { score, level, priority, reasons };
}
