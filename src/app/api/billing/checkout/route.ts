import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { razorpay } from '@/lib/razorpay';

export async function POST(req: Request) {
  try {
    const authResult: any = await auth().catch(e => ({ error: String(e) }));
    let userId: string | null = authResult?.userId || null;
    let orgId: string | null = authResult?.orgId || null;
    
    if (!userId) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.replace('Bearer ', '');
        try {
          const { verifyToken } = require('@clerk/nextjs/server');
          if (!process.env.CLERK_SECRET_KEY) {
             return NextResponse.json({ error: 'CLERK_SECRET_KEY is missing on server' }, { status: 500 });
          }
          const verified = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
          userId = verified.sub as string;
          orgId = (verified as any).org_id as string || null;
        } catch (err: any) {
          return NextResponse.json({ 
            error: 'Manual token verification failed: ' + String(err.message || err),
            debug: { tokenPrefix: token.substring(0, 15) }
          }, { status: 401 });
        }
      } else {
        return NextResponse.json({ error: 'Unauthorized and no Bearer token provided' }, { status: 401 });
      }
    }

    const { plan } = await req.json();
    
    const internalOrgId = orgId || userId;

    let org = await prisma.organization.findUnique({ where: { id: internalOrgId } });
    if (!org) {
      org = await prisma.organization.create({
        data: { id: internalOrgId, name: orgId ? "Clerk Org" : "Personal Workspace" }
      });
    }

    let billingCustomer = await prisma.billingCustomer.findUnique({

      where: { clerkOrgId: internalOrgId }
    });

    if (!billingCustomer) {
      // Create Razorpay customer
      const rzpCustomer = await razorpay.customers.create({
        name: `Org ${internalOrgId}`,
        email: `billing-${internalOrgId}@quantum-blue.in`, // Fallback email
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
    // STARTER: ₹4,999/year (annual, one-time UPI friendly)
    // PRO: ₹4,999/month (recurring subscription)
    // BUSINESS: ₹24,999/month (recurring subscription)
    const PLANS: Record<string, { price: number; interval: 'year' | 'month'; total_count?: number }> = {
      'STARTER':   { price: 4999, interval: 'year', total_count: 10 },
      'PRO':       { price: 4999, interval: 'month', total_count: 120 },
      'BUSINESS':  { price: 24999, interval: 'month', total_count: 120 },
    };

    const planConfig = PLANS[plan];
    if (!planConfig) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const planIds: Record<string, string> = {
      'STARTER': process.env.RAZORPAY_PLAN_STARTER || 'plan_TdcxSyaILWtAMM',
      'PRO': process.env.RAZORPAY_PLAN_PRO || 'plan_Tdcy69p7jtVQie',
      'BUSINESS': process.env.RAZORPAY_PLAN_BUSINESS || 'plan_TdcyjggCpTwsDa',
    };

    // For Starter (annual), create a one-time order for UPI/card convenience.
    // For Pro/Business (monthly), create a recurring subscription.
    if (plan === 'STARTER') {
      // One-time order for annual starter plan
      const order = await razorpay.orders.create({
        amount: planConfig.price,
        currency: 'INR',
        receipt: `qb-starter-${internalOrgId}-${Date.now()}`,
        notes: { clerkOrgId: internalOrgId, plan: 'STARTER' },
      });

      await prisma.subscription.create({
        data: {
          organization: { connect: { id: internalOrgId } },
          razorpayCustomerId: billingCustomer.razorpayCustomerId,
          razorpayPlanId: planIds[plan],
          planKey: plan,
          status: 'created',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(),
        },
      });

      return NextResponse.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      });
    }

    // Recurring subscription for Pro/Business
    const subscription = await razorpay.subscriptions.create({
      plan_id: planIds[plan],
      customer_notify: 1,
      total_count: planConfig.total_count,
      notes: { clerkOrgId: internalOrgId, plan },
    });

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

  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + (error.message || String(error)) }, { status: 500 });
  }
}
