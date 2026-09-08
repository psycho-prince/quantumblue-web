import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  const { userId, orgId } = await auth();
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // In the new schema, assets are stored as findings within scans
  // This endpoint is deprecated — use /api/scans instead
  return NextResponse.json([]);
}
