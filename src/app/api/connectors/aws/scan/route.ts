import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const authResult = await auth();
    if (!authResult?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orgId } = authResult;
    const internalOrgId = orgId || authResult.userId;

    // Check entitlement
    const entitlement = await prisma.entitlement.findUnique({
      where: { organizationId: internalOrgId },
    });
    const features = entitlement?.features as Record<string, unknown> | null;
    if (!entitlement || !features?.aws_connector) {
      return NextResponse.json({ error: 'Forbidden: Business plan required' }, { status: 403 });
    }

    const body = await req.json();
    const { accountId, regions } = body;

    if (!accountId) {
      return NextResponse.json({ error: 'accountId is required' }, { status: 400 });
    }

    // Validate account ID format (12 digits)
    if (!/^\d{12}$/.test(accountId)) {
      return NextResponse.json({ error: 'accountId format not allowed' }, { status: 400 });
    }

    // Look up registered account from DB — never trust caller-supplied roleArn/externalId
    const account = await prisma.orgAWSAccount.findUnique({
      where: {
        organizationId_accountId: {
          organizationId: internalOrgId,
          accountId,
        },
      },
    });

    if (!account || !account.enabled) {
      return NextResponse.json({ error: 'Forbidden: account not registered for this organization' }, { status: 403 });
    }

    // Forward to Go daemon with account-scoped config
    const authHeader = req.headers.get('authorization') || '';
    const daemonUrl = process.env.DAEMON_URL || 'http://localhost:8080';

    const res = await fetch(`${daemonUrl}/v1/connectors/aws/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({ accountId, regions: regions || ['ap-south-1'] }),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('AWS scan proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const authResult = await auth();
    if (!authResult?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orgId } = authResult;
    const internalOrgId = orgId || authResult.userId;

    const accounts = await prisma.orgAWSAccount.findMany({
      where: { organizationId: internalOrgId, enabled: true },
      select: {
        id: true,
        accountId: true,
        roleArn: true,
        externalId: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(accounts);
  } catch (error) {
    console.error('AWS accounts fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
