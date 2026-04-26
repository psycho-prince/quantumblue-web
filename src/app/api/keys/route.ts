import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import crypto from 'crypto';

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const keys = await prisma.apiKey.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(keys);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { name } = await req.json();

  if (!name) {
    return new NextResponse('Name is required', { status: 400 });
  }

  const keyString = 'qb_' + crypto.randomBytes(32).toString('hex');

  const key = await prisma.apiKey.create({
    data: {
      userId,
      name,
      key: keyString,
    },
  });

  return NextResponse.json(key);
}

export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { id } = await req.json();

  if (!id) {
    return new NextResponse('Key ID is required', { status: 400 });
  }

  // Verify ownership before deleting
  const existingKey = await prisma.apiKey.findUnique({ where: { id } });
  if (!existingKey || existingKey.userId !== userId) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  await prisma.apiKey.delete({
    where: { id },
  });

  return new NextResponse('Deleted', { status: 200 });
}
