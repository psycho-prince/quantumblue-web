import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getOrganizationEntitlements } from '@/lib/entitlements';

export async function GET() {
  try {
    const authResult = await auth().catch(e => ({ error: String(e) }));
    let userId: string | null = null;
    let orgId: string | null = null;

    if ('userId' in authResult) {
      userId = authResult.userId;
      orgId = authResult.orgId ?? null;
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const internalOrgId = orgId || userId;
    const entitlements = await getOrganizationEntitlements(internalOrgId);

    return NextResponse.json(entitlements);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
