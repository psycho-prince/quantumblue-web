import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const organizationId = req.headers.get("x-org-id") ?? "org-test-001";

  const scans = await prisma.scan.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      targetName: true,
      bomSerialNumber: true,
      createdAt: true,
      _count: { select: { findings: true, anomalies: true } },
    },
  });

  return NextResponse.json(scans);
}
