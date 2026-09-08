import { prisma } from "@/lib/prisma";

export async function detectAnomalies(currentScanId: string, organizationId: string) {
  const current = await prisma.scan.findUnique({
    where: { id: currentScanId },
    include: { findings: true },
  });
  if (!current) return [];

  // Baseline = the most recent PRIOR scan for the same target.
  // No baseline, no anomaly detection — this is Rule 4, enforced in code.
  const baseline = await prisma.scan.findFirst({
    where: {
      organizationId,
      targetName: current.targetName,
      id: { not: currentScanId },
      createdAt: { lt: current.createdAt },
    },
    orderBy: { createdAt: "desc" },
    include: { findings: true },
  });
  if (!baseline) return [];

  const anomalies = [];
  const baselineLocations = new Set(baseline.findings.map(f => f.location));

  for (const finding of current.findings) {
    // Anomaly type 1: a new finding at a location that previously
    // had no cryptographic asset at all, or had a different one,
    // AND it's classified quantum-vulnerable (level 0)
    const isNew = !baselineLocations.has(finding.location);
    const isVulnerable = finding.nistQuantumSecurityLevel === 0;

    if (isNew && isVulnerable) {
      anomalies.push({
        scanId: currentScanId,
        baselineScanId: baseline.id,
        kind: "new-vulnerable-algorithm",
        description: `${finding.primitive} (${finding.name}) newly detected at ${finding.location}, ` +
                      `not present in baseline scan ${baseline.id} from ${baseline.createdAt.toISOString()}`,
        severity: "high",
      });
    }
  }

  if (anomalies.length > 0) {
    await prisma.anomaly.createMany({ data: anomalies });
  }
  return anomalies;
}
