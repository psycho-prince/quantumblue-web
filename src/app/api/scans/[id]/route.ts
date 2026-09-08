import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const organizationId = req.headers.get("x-org-id") ?? "org-test-001";

  const { id } = await params;

  const scan = await prisma.scan.findFirst({
    where: { id, organizationId },
    include: { findings: true },
  });

  if (!scan) {
    return NextResponse.json({ error: "Scan not found" }, { status: 404 });
  }

  return NextResponse.json(scan);
}
