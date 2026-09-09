import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    let { userId, orgId } = await auth().catch(() => ({ userId: null, orgId: null }));
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure user has an organization in our DB
    const internalOrgId = orgId || userId;
    let org = await prisma.organization.findUnique({ where: { id: internalOrgId } });
    
    if (!org) {
      org = await prisma.organization.create({
        data: {
          id: internalOrgId,
          name: orgId ? "Clerk Org" : "Personal Workspace",
        }
      });
    }

    // Rate Limiting Logic (Free Tier Limit)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dailyUsage = await prisma.auditEvent.count({
      where: {
        organizationId: org.id,
        createdAt: { gte: today }
      }
    });

    if (dailyUsage >= 50) {
      return NextResponse.json({ 
        error: 'Rate Limited: Free trial allows up to 50 PQC operations per day. Please upgrade to a paid tier.' 
      }, { status: 429 });
    }

    // Ensure an API Key exists to talk to the Go Daemon
    let apiKeyRecord = await prisma.apiKey.findFirst({
      where: { organizationId: org.id, revokedAt: null }
    });

    const rawApiKey = "qb_internal_key_" + crypto.randomBytes(16).toString('hex');
    
    if (!apiKeyRecord) {
      const hashedKey = crypto.createHash('sha256').update(rawApiKey).digest('hex');
      apiKeyRecord = await prisma.apiKey.create({
        data: {
          organizationId: org.id,
          keyHash: hashedKey,
          label: "Internal BFF Key",
        }
      });
    } else {
      // In a real app we'd retrieve the raw key securely or use a permanent internal service token.
      // For now, since we only store the hash, if we don't know the raw key, we must mint a new temporary one.
      const hashedKey = crypto.createHash('sha256').update(rawApiKey).digest('hex');
      await prisma.apiKey.create({
        data: {
          organizationId: org.id,
          keyHash: hashedKey,
          label: "Internal Temporary Token",
        }
      });
    }

    const daemonUrl = process.env.DAEMON_URL || 'https://quantumblue-cli.onrender.com';
    const response = await fetch(`${daemonUrl}/v1/keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${rawApiKey}`
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Daemon returned error:", response.status, errText);
      return NextResponse.json({ error: `Daemon error: ${response.status} - ${errText}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    console.error('Error proxying keys request:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
  }
}
