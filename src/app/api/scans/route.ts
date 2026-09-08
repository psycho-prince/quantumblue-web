import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { detectAnomalies } from "@/lib/anomaly-detection";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "missing API key" }, { status: 401 });
  }
  const rawKey = authHeader.slice(7);
  const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex");

  const apiKey = await prisma.apiKey.findUnique({
    where: { keyHash },
    include: { organization: true },
  });
  if (!apiKey || apiKey.revokedAt) {
    return NextResponse.json({ error: "invalid or revoked key" }, { status: 401 });
  }

  const bom = await req.json();

  // Validate it's actually a CycloneDX document before trusting it —
  // don't store garbage just because it was POSTed with a valid key
  if (bom.bomFormat !== "CycloneDX" || bom.specVersion !== "1.6") {
    return NextResponse.json({ error: "not a valid CycloneDX 1.6 document" }, { status: 400 });
  }

  const scan = await prisma.scan.create({
    data: {
      organizationId: apiKey.organizationId,
      targetName: bom.metadata?.component?.name ?? "unknown target",
      bomSerialNumber: bom.serialNumber,
      rawBom: bom,
      findings: {
        create: (bom.components ?? [])
          .filter((c: any) => c.type === "cryptographic-asset")
          .map((c: any) => ({
            bomRef: c["bom-ref"],
            name: c.name,
            primitive: c.cryptoProperties?.algorithmProperties?.primitive ?? "unknown",
            parameterSetIdentifier: c.cryptoProperties?.algorithmProperties?.parameterSetIdentifier,
            nistQuantumSecurityLevel: c.cryptoProperties?.algorithmProperties?.nistQuantumSecurityLevel,
            location: c.evidence?.occurrences?.[0]?.location ?? "unknown",
          })),
      },
    },
  });

  // Anomaly detection runs here — see Section 4. Skip if this is the
  // organization's first scan; there's no baseline to compare against
  // and firing anomalies against nothing is exactly the kind of
  // credibility-losing move Rule 4 above exists to prevent.
  const anomalies = await detectAnomalies(scan.id, apiKey.organizationId);

  return NextResponse.json({ scanId: scan.id, anomalies }, { status: 201 });
}
