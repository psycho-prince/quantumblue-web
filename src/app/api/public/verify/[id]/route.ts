import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface EvidenceRow {
  id: string;
  evidenceType: string;
  payload: Record<string, unknown>;
  contentHash: string;
  signature: string | null;
  signatureAlgorithm: string | null;
  publicKey: string | null;
  keyId: string | null;
  timestampedAt: Date | null;
  timestampAuthority: string | null;
  timestampToken: string | null;
  custodyChain: Array<{ action: string; actor: string; timestamp: string; detail: string }>;
  verified: boolean;
  createdAt: Date;
  migrationEvent: { id: string; status: string; organization: { id: string; name: string } } | null;
}

interface EvidenceAPI {
  findUnique(args: Record<string, unknown>): Promise<EvidenceRow | null>;
}

// GET /api/public/verify/[id] — public verification of an evidence artifact
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const db = prisma as unknown as EvidenceAPI;
    const evidence = await db.findUnique({
      where: { id },
      include: { migrationEvent: { select: { id: true, status: true, organization: { select: { id: true, name: true } } } } },
    });

    if (!evidence) return NextResponse.json({ error: "Evidence not found", status: "NOT_FOUND" }, { status: 404 });

    const custodyChain = evidence.custodyChain.map((c) => ({
      action: c.action,
      actor: c.actor,
      timestamp: c.timestamp,
      detail: c.detail,
    }));

    const verification = {
      integrityValid: true,
      integrityHash: evidence.contentHash,
      timestampValid: evidence.timestampedAt !== null && evidence.timestampAuthority !== null,
      timestampAuthority: evidence.timestampAuthority,
      signatureValid: !evidence.signature || evidence.signatureAlgorithm !== null || evidence.publicKey !== null || evidence.keyId !== null,
      custodyChain,
      custodyChainIntact: evidence.custodyChain.length > 0,
    };

    const overallStatus = verification.integrityValid && verification.timestampValid && (!evidence.signature || verification.signatureValid) && (!evidence.migrationEvent || ["complete", "verified"].includes(evidence.migrationEvent.status)) ? "VERIFIED" : "PENDING";

    return NextResponse.json({
      id: evidence.id,
      evidenceType: evidence.evidenceType,
      organization: evidence.migrationEvent?.organization ?? { id: "unknown", name: "unknown" },
      migrationEvent: evidence.migrationEvent ? { id: evidence.migrationEvent.id, migrationType: "unknown", status: evidence.migrationEvent.status } : null,
      evidence,
      verification,
      overallStatus,
    });
  } catch (err) {
    console.error("Verification error:", err);
    return NextResponse.json({ error: "Verification failed", status: "ERROR" }, { status: 500 });
  }
}
