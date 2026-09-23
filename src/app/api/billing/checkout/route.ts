import { NextResponse } from 'next/server';
import { auth, verifyToken } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { razorpay } from '@/lib/razorpay';

export async function POST(req: Request) {
  try {
    const authResult = await auth().catch(e => ({ error: String(e) }));
    let userId: string | null = null;
    let orgId: string | null = null;
    if ('userId' in authResult) {
      userId = authResult.userId;
      orgId = authResult.orgId ?? null;
    }

    if (!userId) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.replace('Bearer ', '');
        try {
          if (!process.env.CLERK_SECRET_KEY) {
             return NextResponse.json({ error: 'CLERK_SECRET_KEY is missing on server' }, { status: 500 });
          }
          const verified = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
          userId = verified.sub as string;
          orgId = (verified as Record<string, unknown>).org_id as string || null;
        } catch (err) {
          return NextResponse.json({
            error: 'Manual token verification failed: ' + String((err as Error).message || err),
            debug: { tokenPrefix: token.substring(0, 15) }
          }, { status: 401 });
        }
      } else {
        return NextResponse.json({ error: 'Unauthorized and no Bearer token provided' }, { status: 401 });
      }
    }

    const { plan } = await req.json();

    if (!plan || !['STARTER', 'PRO', 'BUSINESS'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const internalOrgId = orgId || userId!;
    if (!internalOrgId) {
      return NextResponse.json({ error: 'Missing organization' }, { status: 400 });
    }

    let billingCustomer: { id: string; razorpayCustomerId: string } | null = null;

    // Check if billing customer exists for this org
    const existingCustomer = await prisma.billingCustomer.findFirst({
      where: { clerkOrgId: internalOrgId }
    });

    if (existingCustomer) {
      billingCustomer = existingCustomer;
    } else {
      // Create Razorpay customer
      const rzpCustomer = await razorpay.customers.create({
        name: `Org ${internalOrgId}`,
        email: `billing-${internalOrgId}@quantum-blue.in`,
        notes: { clerkOrgId: internalOrgId }
      });

      billingCustomer = await prisma.billingCustomer.create({
        data: {
          clerkOrgId: internalOrgId,
          clerkUserId: userId,
          razorpayCustomerId: rzpCustomer.id,
          name: rzpCustomer.name || '',
          email: rzpCustomer.email || ''
        }
      });
    }

    // Plan configuration matching roadmap pricing:
    const PLANS: Record<string, { price: number; interval: 'year' | 'month'; total_count?: number }> = {
      'STARTER':   { price: 4999, interval: 'year', total_count: 10 },
      'PRO':       { price: 4999, interval: 'month', total_count: 120 },
      'BUSINESS':  { price: 24999, interval: 'month', total_count: 120 },
    };

    const planConfig = PLANS[plan];

    const planIds: Record<string, string> = {
      'STARTER': process.env.RAZORPAY_PLAN_STARTER || 'plan_TdcxSyaILWtAMM',
      'PRO': process.env.RAZORPAY_PLAN_PRO || 'plan_Tdcy69p7jtVQie',
      'BUSINESS': process.env.RAZORPAY_PLAN_BUSINESS || 'plan_TdcyjggCpTwsDa',
    };

    if (!['STARTER', 'PRO', 'BUSINESS'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Recurring subscription for Pro/Business
    const subscription = await razorpay.subscriptions.create({
      plan_id: planIds[plan],
      customer_notify: 1,
      total_count: planConfig.total_count ?? 120,
      notes: { clerkOrgId: internalOrgId, plan },
    }) as { id: string };

    await prisma.subscription.create({
      data: {
        organization: { connect: { id: internalOrgId } },
        razorpayCustomerId: billingCustomer.razorpayCustomerId,
        razorpaySubscriptionId: subscription.id,
        razorpayPlanId: planIds[plan],
        planKey: plan,
        status: 'created',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
      },
    });

    return NextResponse.json({
      subscriptionId: subscription.id,
      keyId: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + String((error as Error).message || error) }, { status: 500 });
  }
}

export async function GET(_req: Request) {
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
    const subscriptions = await prisma.subscription.findMany({
      where: { clerkOrgId: internalOrgId },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    const customers = await prisma.billingCustomer.findMany({
      where: { clerkOrgId: internalOrgId },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    return NextResponse.json({ subscriptions, customers });

  } catch (error) {
    console.error('Billing history error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
