import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const organizationId = req.headers.get("x-org-id") ?? "org-test-001";

  const anomalies = await prisma.anomaly.findMany({
    where: { scan: { organizationId } },
    orderBy: { createdAt: "desc" },
    include: { scan: { select: { targetName: true } } },
  });

  return NextResponse.json(anomalies);
}
