import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getOrganizationEntitlements } from '@/lib/entitlements';

export async function GET(req: Request) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const internalOrgId = orgId || userId;
    const entitlements = await getOrganizationEntitlements(internalOrgId);

    return NextResponse.json(entitlements);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
