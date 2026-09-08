import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import crypto from 'crypto';

export async function GET() {
  const { userId, orgId } = await auth();
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const organizationId = orgId ?? userId;

  const keys = await prisma.apiKey.findMany({
    where: { organizationId, revokedAt: null },
    orderBy: { createdAt: 'desc' },
    select: { id: true, label: true, createdAt: true },
  });

  return NextResponse.json(keys);
}

export async function POST(req: Request) {
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
  return NextResponse.json({ id: key.id, name: key.label, key: rawKey, createdAt: key.createdAt });
}

export async function DELETE(req: Request) {
  const { userId, orgId } = await auth();
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { id } = await req.json();
  if (!id) {
    return new NextResponse('Key ID is required', { status: 400 });
  }

  const organizationId = orgId ?? userId;

  // Verify ownership before deleting
  const existingKey = await prisma.apiKey.findFirst({ where: { id, organizationId } });
  if (!existingKey) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Soft delete by setting revokedAt
  await prisma.apiKey.update({
    where: { id },
    data: { revokedAt: new Date() },
  });

  return new NextResponse('Deleted', { status: 200 });
}
