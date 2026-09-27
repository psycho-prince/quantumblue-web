import { NextResponse } from 'next/server';
import { auth, verifyToken } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { razorpay } from '@/lib/razorpay';

// Industry-standard plan config: price (INR paise), interval, RZP total_count
// STARTER: annual one-time (total_count=1). PRO/BUSINESS: recurring monthly.
const PLANS: Record<string, { price: number; interval: 'year' | 'month'; total_count: number }> = {
  'STARTER':   { price: 499900, interval: 'year',  total_count: 1  }, // ₹4,999/year, one-time annual
  'PRO':       { price: 499900, interval: 'month', total_count: 120 }, // ₹4,999/month, 10yr max
  'BUSINESS':  { price: 2499900, interval: 'month', total_count: 120 }, // ₹24,999/month, 10yr max
};

const PLAN_IDS: Record<string, string> = {
  'STARTER':   process.env.RAZORPAY_PLAN_STARTER   || 'plan_TdcxSyaILWtAMM',
  'PRO':       process.env.RAZORPAY_PLAN_PRO       || 'plan_Tdcy69p7jtVQie',
  'BUSINESS':  process.env.RAZORPAY_PLAN_BUSINESS  || 'plan_TdcyjggCpTwsDa',
};

export async function POST(req: Request) {
  try {
    // --- Auth: Clerk session token or manual Bearer token ---
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
            return NextResponse.json({ error: 'Service not configured' }, { status: 503 });
          }
          // Fast-fail: JWT must have 3 dot-separated parts
          const parts = token.split('.');
          if (parts.length !== 3 || parts[0].length === 0) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
          }
          const verified = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY }).catch(() => null);
          if (!verified) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
          }
          userId = verified.sub as string;
          orgId = (verified as Record<string, unknown>).org_id as string || null;
        } catch {
          return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }
      } else {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const internalOrgId = orgId || userId!;
    if (!internalOrgId) {
      return NextResponse.json({ error: 'Missing organization' }, { status: 400 });
    }

    // --- Idempotency: prevent duplicate subscription creation on retry ---
    const idempotencyKey = req.headers.get('Idempotency-Key') || '';
    if (idempotencyKey) {
      const existing = await prisma.subscription.findFirst({
        where: { idempotencyKey },
      });
      if (existing) {
        const customer = await prisma.billingCustomer.findUnique({
          where: { clerkOrgId: existing.clerkOrgId },
        });
        return NextResponse.json({
          subscriptionId: existing.razorpaySubscriptionId,
          keyId: process.env.RAZORPAY_KEY_ID,
          alreadyExists: true,
          message: 'Subscription already created for this request',
          razorpayCustomerId: customer?.razorpayCustomerId,
        });
      }
    }

    // --- Parse request ---
    const { plan, idempotencyKey: bodyIdem } = await req.json().catch(() => ({}));
    const effectiveIdemKey = idempotencyKey || bodyIdem || '';
    if (effectiveIdemKey) {
      const existing = await prisma.subscription.findFirst({
        where: { idempotencyKey: effectiveIdemKey },
      });
      if (existing) {
        return NextResponse.json({
          subscriptionId: existing.razorpaySubscriptionId,
          keyId: process.env.RAZORPAY_KEY_ID,
          alreadyExists: true,
        });
      }
    }

    if (!plan || !['STARTER', 'PRO', 'BUSINESS'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // --- Already subscribed check: prevent duplicate active subscriptions per org+plan ---
    const existingActive = await prisma.subscription.findFirst({
      where: {
        clerkOrgId: internalOrgId,
        planKey: plan,
        status: 'active',
      },
    });
    if (existingActive) {
      return NextResponse.json({
        subscriptionId: existingActive.razorpaySubscriptionId,
        keyId: process.env.RAZORPAY_KEY_ID,
        alreadySubscribed: true,
        message: 'Organization already has an active subscription for this plan',
      }, { status: 200 });
    }

    // --- Validate payment provider ---
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: 'Payment service not configured' }, { status: 503 });
    }

    // --- Ensure Organization record exists ---
    await prisma.organization.upsert({
      where: { id: internalOrgId },
      update: {},
      create: { id: internalOrgId, name: `Org ${internalOrgId}` },
    });

    // --- Billing customer: upsert pattern (recover existing RZP customer) ---
    let billingCustomer = await prisma.billingCustomer.findUnique({
      where: { clerkOrgId: internalOrgId },
    });

    if (!billingCustomer) {
      // Create new RZP customer (rare: "already exists" means previous failed DB write)
      let rzpCustomer;
      try {
        rzpCustomer = await razorpay.customers.create({
          name: `Org ${internalOrgId}`,
          email: `billing-${internalOrgId}@quantum-blue.in`,
          notes: { clerkOrgId: internalOrgId },
        });
      } catch (rerr) {
        const rzperr = rerr as { error?: { description?: string; code?: string } } | undefined;
        const desc = rzperr?.error?.description || '';
        if (desc.includes('Customer already exists for the merchant')) {
          return NextResponse.json({
            error: 'Billing customer already exists. Please contact support to link your account.',
          }, { status: 409 });
        }
        throw rerr;
      }

      billingCustomer = await prisma.billingCustomer.create({
        data: {
          clerkOrgId: internalOrgId,
          clerkUserId: userId,
          razorpayCustomerId: rzpCustomer.id,
          name: rzpCustomer.name || `Org ${internalOrgId}`,
          email: rzpCustomer.email || `billing-${internalOrgId}@quantum-blue.in`,
        },
      });
    }

    // --- Create Razorpay subscription ---
    const planConfig = PLANS[plan];
    const planId = PLAN_IDS[plan];

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_id: billingCustomer.razorpayCustomerId,
      customer_notify: 1,
      total_count: planConfig.total_count,
      notes: { clerkOrgId: internalOrgId, plan },
    } as Parameters<typeof razorpay.subscriptions.create>[0]) as unknown as { id: string };

    // --- Record in DB ---
    await prisma.subscription.create({
      data: {
        clerkOrgId: internalOrgId,
        razorpayCustomerId: billingCustomer.razorpayCustomerId,
        razorpaySubscriptionId: subscription.id,
        razorpayPlanId: planId,
        planKey: plan,
        status: 'created',
        idempotencyKey: effectiveIdemKey || null,
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
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('RAZORPAY') || msg.includes('payment') || msg.includes('subscription')) {
      return NextResponse.json({ error: 'Payment service unavailable' }, { status: 503 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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
    const subscriptions = await prisma.subscription.findMany({
      where: { clerkOrgId: internalOrgId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const customers = await prisma.billingCustomer.findMany({
      where: { clerkOrgId: internalOrgId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return NextResponse.json({ subscriptions, customers });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
