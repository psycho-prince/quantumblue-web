import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  try {
    const authResult: any = await auth().catch(e => ({ error: String(e) }));
    const orgId = authResult?.orgId || authResult?.userId;

    if (!orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const keys = await prisma.apiKey.findMany({
      where: { organizationId: orgId, revokedAt: null },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        label: true,
        keyHash: true,
        createdAt: true,
      }
    });

    // Return keys with a masked key preview (first 8 chars of hash)
    const keysWithPreview = keys.map(k => ({
      id: k.id,
      name: k.label,
      label: k.label,
      key: `qb_${k.keyHash.slice(0, 8)}...`,
      createdAt: k.createdAt.toISOString(),
      findingCount: 0,
    }));

    return NextResponse.json(keysWithPreview);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { name } = await req.json();
    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    const organizationId = orgId ?? userId;

    // Generate a raw key, store only the hash
    const rawKey = 'qb_' + crypto.randomBytes(32).toString('hex');
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

    const key = await prisma.apiKey.create({
      data: {
        organizationId,
        keyHash,
        label: name,
      },
    });

    // Return the raw key once — it cannot be retrieved again
    return NextResponse.json({ id: key.id, name: key.label, label: key.label, key: rawKey, createdAt: key.createdAt.toISOString() });
  } catch (err: any) {
    return new NextResponse(err.message, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return new NextResponse('Key ID is required', { status: 400 });
    }

    const organizationId = orgId ?? userId;

    const existingKey = await prisma.apiKey.findFirst({ where: { id, organizationId } });
    if (!existingKey) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    await prisma.apiKey.update({
      where: { id },
      data: { revokedAt: new Date() },
    });

    return NextResponse.json({ success: true, message: "Key revoked" });
  } catch (err: any) {
    return new NextResponse(err.message, { status: 500 });
  }
}
