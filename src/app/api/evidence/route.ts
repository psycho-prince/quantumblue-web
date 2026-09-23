import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createHash } from "crypto";
import { auth } from "@clerk/nextjs/server";

type PrismaClientWithMigrationEvent = {
  migrationEvent: {
    findFirst: (args: { where: { id: string; organizationId: string }; select: { id: true } }) => Promise<{ id: string } | null>;
  };
  evidenceArtifact: {
    create: (args: {
      data: {
        organizationId: string;
        migrationEventId: string | null;
        evidenceType: string;
        payload: Record<string, unknown>;
        contentHash: string;
        publicKey?: string;
        keyId?: string;
        signatureAlgorithm?: string;
        signature?: string;
        timestampedAt: Date;
        timestampAuthority: string;
        custodyChain: Array<Record<string, unknown>>;
        verified: boolean;
      }
    }) => Promise<{ id: string; evidenceType: string; contentHash: string; timestampedAt: Date; createdAt: Date }>;
    findMany: (args: {
      where: { organizationId: string; evidenceType?: string; migrationEventId?: string; verified?: boolean };
      orderBy: { createdAt: "desc" };
      take: number;
      include: { migrationEvent: { select: { id: true; migrationType: true; status: true; createdAt: true; asset: { select: { id: true; kind: true; identifier: true; displayName: true } } } } };
    }) => Promise<Array<{ id: string; evidenceType: string; contentHash: string; verified: boolean; createdAt: Date; migrationEvent: { id: string; migrationType: string; status: string; createdAt: Date; asset: { id: string; kind: string; identifier: string; displayName: string | null } } }>>;
  };
};

// POST /api/evidence — create an evidence artifact
export async function POST(req: NextRequest) {
  try {
    const authResult = await auth().catch((e: unknown) => ({ error: String(e) })) as { orgId?: string; userId?: string; error?: string };
    const orgId = authResult?.orgId || authResult?.userId;
    if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({})) as {
      migrationEventId?: string;
      evidenceType?: string;
      payload?: Record<string, unknown>;
      publicKey?: string;
      keyId?: string;
      signatureAlgorithm?: string;
      signature?: string;
      timestampAuthority?: string;
      attachToAssetId?: string;
    };

    const safePayload = body.payload && typeof body.payload === "object" ? body.payload : {};

    if (body.migrationEventId) {
      const p = prisma as unknown as PrismaClientWithMigrationEvent;
      const evt = await p.migrationEvent.findFirst({ where: { id: body.migrationEventId, organizationId: orgId }, select: { id: true } });
      if (!evt) return NextResponse.json({ error: "Migration event not found" }, { status: 404 });
    }
    if (body.attachToAssetId) {
      const asset = await prisma.asset.findFirst({ where: { id: body.attachToAssetId, organizationId: orgId }, select: { id: true } });
      if (!asset) return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const serialized = JSON.stringify(safePayload);
    const contentHash = createHash("sha256").update(serialized).digest("hex");

    const p = prisma as unknown as PrismaClientWithMigrationEvent;
    const evidence = await p.evidenceArtifact.create({
      data: {
        organizationId: orgId,
        migrationEventId: body.migrationEventId ?? null,
        evidenceType: body.evidenceType ?? "INTEGRITY_ATTESTATION",
        payload: safePayload,
        contentHash,
        publicKey: body.publicKey ?? undefined,
        keyId: body.keyId ?? undefined,
        signatureAlgorithm: body.signatureAlgorithm ?? undefined,
        signature: body.signature ?? undefined,
        timestampedAt: new Date(),
        timestampAuthority: body.timestampAuthority ?? "QUANTUMBLUE",
        custodyChain: [{ action: "CREATED", actor: "quantumblue-api", timestamp: new Date().toISOString(), detail: "Evidence artifact created" }],
        verified: false,
      },
    });

    return NextResponse.json({ id: evidence.id, evidenceType: evidence.evidenceType, contentHash: evidence.contentHash, timestampedAt: evidence.timestampedAt, createdAt: evidence.createdAt }, { status: 201 });
  } catch (err) {
    console.error("Evidence API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET /api/evidence — list evidence artifacts for the org
export async function GET(req: NextRequest) {
  try {
    const authResult = await auth().catch((e: unknown) => ({ error: String(e) })) as { orgId?: string; userId?: string; error?: string };
    const orgId = authResult?.orgId || authResult?.userId;
    if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const verified = searchParams.get("verified");
    const migrationEventId = searchParams.get("migrationEventId");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const p = prisma as unknown as PrismaClientWithMigrationEvent;
    const evidence = await p.evidenceArtifact.findMany({
      where: { organizationId: orgId, ...(type ? { evidenceType: type } : {}), ...(migrationEventId ? { migrationEventId } : {}), ...(verified === "true" ? { verified: true } : verified === "false" ? { verified: false } : {}) },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { migrationEvent: { select: { id: true, migrationType: true, status: true, createdAt: true, asset: { select: { id: true, kind: true, identifier: true, displayName: true } } } } },
    });

    return NextResponse.json({ evidence, count: evidence.length });
  } catch (err) {
    console.error("Evidence list error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
