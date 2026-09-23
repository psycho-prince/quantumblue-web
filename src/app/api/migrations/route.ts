import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

interface MigrationRow {
  id: string;
  migrationType: string;
  status: string;
  description?: string;
  createdAt: Date;
  completedAt?: Date;
  verifiedAt?: Date;
  asset: { id: string; kind: string; identifier: string; displayName: string | null } | null;
  evidence: Array<{ id: string; evidenceType: string; contentHash: string; signatureAlgorithm: string | null; timestampedAt: Date | null; timestampAuthority: string | null; verified: boolean; createdAt: Date }>;
}

interface MigrationCreateUpdateAPI {
  create(args: { data: Record<string, unknown> }): Promise<{ id: string; status: string; createdAt: Date }>;
  findFirst(args: { where: { id: string; organizationId: string }; select: { id: true } }): Promise<{ id: string } | null>;
  update(args: { where: { id: string }; data: Record<string, unknown>; include: Record<string, unknown> }): Promise<MigrationRow>;
  findMany(args: { where: Record<string, unknown>; orderBy: { createdAt: "desc" }; take: number; include: Record<string, unknown> }): Promise<MigrationRow[]>;
  groupBy(args: { by: string[]; where: { organizationId: string }; _count: true }): Promise<Array<{ status: string; _count: number }>>;
}

// GET /api/migrations — list migration events
export async function GET(req: NextRequest) {
  try {
    const authResult = await auth().catch((e: unknown) => ({ error: String(e) })) as { orgId?: string; userId?: string; error?: string };
    const orgId = authResult?.orgId || authResult?.userId;
    if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const assetId = searchParams.get("assetId");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const db = prisma as unknown as MigrationCreateUpdateAPI;
    const where: Record<string, unknown> = { organizationId: orgId };
    if (assetId) where.assetId = assetId;
    if (status) where.status = status;

    const migrations = await db.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        asset: { select: { id: true, kind: true, identifier: true, displayName: true } },
        evidence: { select: { id: true, evidenceType: true, contentHash: true, signatureAlgorithm: true, timestampedAt: true, timestampAuthority: true, verified: true, createdAt: true } },
      },
    });

    const summaryRows = await db.groupBy({ by: ["status"], where: { organizationId: orgId }, _count: true });
    const summary = summaryRows.reduce((acc: Record<string, number>, row) => { acc[row.status] = row._count; return acc; }, {} as Record<string, number>);

    return NextResponse.json({ migrations, summary });
  } catch (err) {
    console.error("Migrations list error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/migrations — create a migration event
export async function POST(req: NextRequest) {
  try {
    const authResult = await auth().catch((e: unknown) => ({ error: String(e) })) as { orgId?: string; userId?: string; error?: string };
    const orgId = authResult?.orgId || authResult?.userId;
    if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({})) as {
      assetId?: string;
      migrationType?: string;
      beforeState?: Record<string, unknown>;
      afterState?: Record<string, unknown>;
      status?: string;
      description?: string;
      initiatedBy?: string;
    };

    if (body.assetId) {
      const asset = await prisma.asset.findFirst({ where: { id: body.assetId, organizationId: orgId }, select: { id: true } });
      if (!asset) return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const db = prisma as unknown as MigrationCreateUpdateAPI;
    const migration = await db.create({
      data: {
        organizationId: orgId,
        assetId: body.assetId || null,
        migrationType: body.migrationType || "CUSTOM",
        beforeState: {},
        afterState: {},
        status: body.status || "pending",
        description: body.description || undefined,
        initiatedBy: body.initiatedBy || "api",
        startedAt: body.status !== "pending" ? new Date() : undefined,
        completedAt: body.status === "complete" ? new Date() : undefined,
      },
    });

    return NextResponse.json({ migrationId: migration.id, status: migration.status, createdAt: migration.createdAt }, { status: 201 });
  } catch (err) {
    console.error("Migration create error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH /api/migrations — update a migration event
export async function PATCH(req: NextRequest) {
  try {
    const authResult = await auth().catch((e: unknown) => ({ error: String(e) })) as { orgId?: string; userId?: string; error?: string };
    const orgId = authResult?.orgId || authResult?.userId;
    if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({})) as { migrationId?: string; status?: string; description?: string };

    if (!body.migrationId) return NextResponse.json({ error: "migrationId required" }, { status: 400 });

    const db = prisma as unknown as MigrationCreateUpdateAPI;
    const existing = await db.findFirst({ where: { id: body.migrationId, organizationId: orgId }, select: { id: true } });
    if (!existing) return NextResponse.json({ error: "Migration not found" }, { status: 404 });

    const updateData: Record<string, unknown> = {};
    if (body.status !== undefined) {
      updateData.status = body.status;
      if (body.status === "complete") updateData.completedAt = new Date();
      if (body.status === "verified") updateData.verifiedAt = new Date();
      if (body.status === "pending") { updateData.completedAt = null; updateData.verifiedAt = null; }
    }
    if (body.description !== undefined) updateData.description = body.description;

    const updated = await db.update({
      where: { id: body.migrationId },
      data: updateData,
      include: {
        asset: { select: { id: true, kind: true, identifier: true, displayName: true } },
        evidence: { select: { id: true, evidenceType: true, contentHash: true, verified: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Migration update error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
