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

  return NextResponse.json({
    totalScans,
    totalFindings,
    findingsByLevel,
    unknownCount,
    recentScans: scans.map((s) => ({
      id: s.id,
      targetName: s.targetName,
      createdAt: s.createdAt,
      findingCount: s.findings.length,
    })),
  });
}
