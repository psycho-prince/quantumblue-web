import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new NextResponse('Unauthorized: Missing or invalid token', { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const keyHash = crypto.createHash('sha256').update(token).digest('hex');

  const apiKey = await prisma.apiKey.findUnique({
    where: { keyHash },
  });

  if (!apiKey || apiKey.revokedAt) {
    return new NextResponse('Unauthorized: Invalid or revoked token', { status: 401 });
  }

  try {
    const { filename, signatureHash } = await req.json();

    if (!filename || !signatureHash) {
      return new NextResponse('Bad Request: filename and signatureHash are required', { status: 400 });
    }

    return NextResponse.json({
      success: false,
      message: 'Asset sync is now handled through the scan system. Use POST /api/scans instead.',
      deprecated: true,
    }, { status: 410 });

  } catch (error: unknown) {
    console.error('Error syncing asset:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
