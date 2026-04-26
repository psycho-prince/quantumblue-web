import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  // Extract API key from headers
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new NextResponse('Unauthorized: Missing or invalid token', { status: 401 });
  }

  const token = authHeader.split(' ')[1];

  // Validate API key
  const apiKey = await prisma.apiKey.findUnique({
    where: { key: token },
  });

  if (!apiKey) {
    return new NextResponse('Unauthorized: Invalid token', { status: 401 });
  }

  try {
    const { filename, signatureHash } = await req.json();

    if (!filename || !signatureHash) {
      return new NextResponse('Bad Request: filename and signatureHash are required', { status: 400 });
    }

    // Store notarization log
    const asset = await prisma.notarizedAsset.create({
      data: {
        userId: apiKey.userId,
        apiKeyId: apiKey.id,
        filename,
        signatureHash,
      },
    });

    return NextResponse.json({ success: true, asset });
  } catch (error: unknown) {
    console.error('Error syncing asset:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
