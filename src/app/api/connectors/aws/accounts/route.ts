import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const authResult = await auth().catch(e => ({ error: e.message }));
    if ('error' in authResult) {
      return NextResponse.json({ error: 'Auth failed' }, { status: 401 });
    }

    const { userId, orgId } = authResult;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const internalOrgId = orgId || userId;

    const body = await req.json();
    const { accountId, roleArn } = body;

    if (!accountId || !roleArn) {
      return NextResponse.json({ error: 'accountId and roleArn are required' }, { status: 400 });
    }

    // Validate account ID format (12 digits)
    if (!/^\d{12}$/.test(accountId)) {
      return NextResponse.json({ error: 'accountId format not allowed' }, { status: 400 });
    }

    // Validate role ARN format: arn:aws:iam::<12-digit-account>:role/<name>
    const arnMatch = roleArn.match(/^arn:aws:iam::(\d{12}):role\/([a-zA-Z0-9_+=,.@\-]+)$/);
    if (!arnMatch) {
      return NextResponse.json({ error: 'roleArn format not allowed' }, { status: 400 });
    }
    if (arnMatch[1] !== accountId) {
      return NextResponse.json({ error: 'accountId does not match roleArn' }, { status: 400 });
    }

    // Check entitlement — fail closed
    const entitlement = await prisma.entitlement.findUnique({
      where: { organizationId: internalOrgId },
    });
    if (!entitlement) {
      return NextResponse.json({ error: 'Forbidden: entitlement not found' }, { status: 403 });
    }
    const features = entitlement.features as Record<string, unknown> | null;
    if (!features?.aws_connector) {
      return NextResponse.json({ error: 'Forbidden: Organization is not entitled to aws_connector' }, { status: 403 });
    }

    // Generate a server-side ExternalID — caller never supplies it
    const externalId = 'qb-' + crypto.randomUUID();

    const account = await prisma.orgAWSAccount.upsert({
      where: {
        organizationId_accountId: {
          organizationId: internalOrgId,
          accountId,
        },
      },
      update: {
        roleArn: roleArn,
        externalId,
        enabled: true,
      },
      create: {
        organizationId: internalOrgId,
        accountId,
        roleArn,
        externalId,
        enabled: true,
      },
    });

    // Audit log
    await prisma.auditEvent.create({
      data: {
        organizationId: internalOrgId,
        action: 'AWS_ACCOUNT_REGISTERED',
        details: { accountId, roleArn },
      },
    });

    return NextResponse.json({
      id: account.id,
      accountId: account.accountId,
      roleArn: account.roleArn,
      externalId: account.externalId,
      enabled: account.enabled,
    }, { status: 201 });
  } catch (error) {
    console.error('AWS account registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const authResult = await auth().catch(e => ({ error: e.message }));
    if ('error' in authResult) {
      return NextResponse.json({ error: 'Auth failed' }, { status: 401 });
    }

    const { userId, orgId } = authResult;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const internalOrgId = orgId || userId;

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
