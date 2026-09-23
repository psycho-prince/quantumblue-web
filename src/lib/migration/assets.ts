export type AssetWithRisk = {
  id: string;
  kind: string;
  identifier: string;
  displayName: string | null;
  source: string;
  criticality: string;
  firstSeenAt: Date;
  lastSeenAt: Date;
  active: boolean;
  metadata: Record<string, unknown>;
  cryptoUses: Array<{ id: string; primitive: string; role: string; keyBits: number | null; curve: string | null; parameterSet: string | null; quantumStatus: string; location: string }>;
  certificates: Array<{ id: string; serialNumber: string; subject: string; publicKeyAlgorithm: string; publicKeyBits: number | null; notBefore: Date; notAfter: Date }>;
  outgoing: Array<{ id: string; toAsset: { id: string; kind: string; identifier: string } }>;
  incoming: Array<{ id: string; fromAsset: { id: string; kind: string; identifier: string } }>;
  _riskScore: number;
  _riskLevel: "PQ-READY" | "HYBRID" | "VULNERABLE" | "UNKNOWN";
  _riskPriority: 1 | 2 | 3;
  _riskReasons: string[];
  _primaryAlgorithm: string;
  _dependencyCount: number;
};

import { prisma } from "@/lib/prisma";
import { computeQuantumRisk, type RiskFactors } from "@/lib/migration";

export async function getOrganizationAssets(orgId: string): Promise<AssetWithRisk[]> {
  const assets = await prisma.asset.findMany({
    where: { organizationId: orgId, active: true },
    include: {
      cryptoUses: { orderBy: { detectedAt: "desc" }, take: 5 },
      certificates: true,
      outgoing: { where: { confidence: { gte: 0.5 } }, include: { toAsset: { select: { id: true, kind: true, identifier: true } } } },
      incoming: { where: { confidence: { gte: 0.5 } }, include: { fromAsset: { select: { id: true, kind: true, identifier: true } } } },
    },
    orderBy: { lastSeenAt: "desc" },
  });

  return assets.map((asset) => {
    const primaryAlgo = asset.cryptoUses[0]?.primitive ?? asset.certificates[0]?.publicKeyAlgorithm ?? "unknown";
    const keyBits = asset.cryptoUses[0]?.keyBits ?? asset.certificates[0]?.publicKeyBits;

    const riskFactors: RiskFactors = {
      algorithm: primaryAlgo,
      keySize: keyBits ?? 0,
      dataSensitivity: mapCriticalityToSensitivity(asset.criticality),
      dataLifetimeYears: estimateDataLifetime(asset.kind),
      internetExposed: ["domain", "api", "service", "endpoint"].includes(asset.kind.toLowerCase()),
      dependencyCount: asset.outgoing.length + asset.incoming.length,
      migrationComplexity: estimateMigrationComplexity(asset.outgoing.length + asset.incoming.length),
      cryptoAgility: estimateCryptoAgility(asset.lastSeenAt, asset.cryptoUses.length),
    };

    const risk = computeQuantumRisk(riskFactors);

    return {
      id: asset.id,
      kind: asset.kind,
      identifier: asset.identifier,
      displayName: asset.displayName,
      source: asset.source,
      criticality: asset.criticality,
      firstSeenAt: asset.firstSeenAt,
      lastSeenAt: asset.lastSeenAt,
      active: asset.active,
      metadata: asset.metadata as Record<string, unknown>,
      cryptoUses: asset.cryptoUses as Array<{ id: string; primitive: string; role: string; keyBits: number | null; curve: string | null; parameterSet: string | null; quantumStatus: string; location: string }>,
      certificates: asset.certificates as Array<{ id: string; serialNumber: string; subject: string; publicKeyAlgorithm: string; publicKeyBits: number | null; notBefore: Date; notAfter: Date }>,
      outgoing: asset.outgoing as Array<{ id: string; toAsset: { id: string; kind: string; identifier: string } }>,
      incoming: asset.incoming as Array<{ id: string; fromAsset: { id: string; kind: string; identifier: string } }>,
      _riskScore: risk.score,
      _riskLevel: risk.level,
      _riskPriority: risk.priority,
      _riskReasons: risk.reasons,
      _primaryAlgorithm: primaryAlgo,
      _dependencyCount: asset.outgoing.length + asset.incoming.length,
    };
  });
}

function mapCriticalityToSensitivity(criticality: string): RiskFactors["dataSensitivity"] {
  const upper = criticality.toUpperCase();
  if (upper.includes("HIGH") || upper.includes("CRITICAL") || upper.includes("TOP")) return "critical";
  if (upper.includes("MEDIUM") || upper.includes("CONFIDENTIAL") || upper.includes("SENSITIVE")) return "confidential";
  if (upper.includes("LOW") || upper.includes("INTERNAL") || upper.includes("PRIVATE")) return "internal";
  return "public";
}

function estimateDataLifetime(kind: string): number {
  const k = kind.toLowerCase();
  if (k.includes("cert") || k.includes("certificate") || k.includes("domain")) return 2;
  if (k.includes("key") || k.includes("secret")) return 1;
  if (k.includes("code") || k.includes("sign")) return 5;
  if (k.includes("db") || k.includes("database")) return 7;
  return 3;
}

function estimateMigrationComplexity(depCount: number): "low" | "medium" | "high" {
  if (depCount > 10) return "high";
  if (depCount > 3) return "medium";
  return "low";
}

function estimateCryptoAgility(lastSeenAt: Date, cryptoUseCount: number): number {
  const ageDays = (Date.now() - lastSeenAt.getTime()) / (1000 * 60 * 60 * 24);
  const base = ageDays > 30 ? 2 : 4;
  return Math.min(5, base + cryptoUseCount);
}
