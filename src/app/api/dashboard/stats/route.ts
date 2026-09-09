import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const organizationId = req.headers.get("x-org-id") ?? "org-test-001";

  const scans = await prisma.scan.findMany({
    where: { organizationId },
    include: { findings: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const totalScans = await prisma.scan.count({ where: { organizationId } });
  const totalFindings = await prisma.finding.count({
    where: { scan: { organizationId } },
  });

  const findingsByLevel: Record<number, number> = {};
  for (let level = 0; level <= 5; level++) {
    findingsByLevel[level] = await prisma.finding.count({
      where: { scan: { organizationId }, nistQuantumSecurityLevel: level },
    });
  }

  const unknownCount = await prisma.finding.count({
    where: { scan: { organizationId }, primitive: "unknown" },
  });

  // PQC Operations over the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const auditEvents = await prisma.auditEvent.findMany({
    where: {
      organizationId,
      action: { in: ['SIGN_ENVELOPE', 'VERIFY_ENVELOPE', 'GENERATE_CBOM'] },
      createdAt: { gte: sevenDaysAgo }
    },
    select: { createdAt: true }
  });

  const dailyOps: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dailyOps[d.toISOString().split('T')[0]] = 0;
  }

  auditEvents.forEach(e => {
    const dateStr = e.createdAt.toISOString().split('T')[0];
    if (dailyOps[dateStr] !== undefined) {
      dailyOps[dateStr]++;
    }
  });

  return NextResponse.json({
    totalScans,
    totalFindings,
    findingsByLevel,
    unknownCount,
    dailyOps,
    recentScans: scans.map((s) => ({
      id: s.id,
      targetName: s.targetName,
      createdAt: s.createdAt,
      findingCount: s.findings.length,
    })),
  });
}
