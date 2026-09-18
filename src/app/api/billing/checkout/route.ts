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

    
    const planIds: Record<string, string> = {
      'STARTER': process.env.RAZORPAY_PLAN_STARTER || 'plan_TdcxSyaILWtAMM',
      'PRO': process.env.RAZORPAY_PLAN_PRO || 'plan_Tdcy69p7jtVQie',
      'BUSINESS': process.env.RAZORPAY_PLAN_BUSINESS || 'plan_TdcyjggCpTwsDa'
    };
    
    if (!planIds[plan]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Create a Razorpay Subscription
    const subscription = await razorpay.subscriptions.create({
      plan_id: planIds[plan],
      customer_notify: 1,
      total_count: plan === 'STARTER' ? 10 : 120, // 10 years duration (yearly vs monthly)
      notes: { clerkOrgId: internalOrgId, plan }
    });

    await prisma.subscription.create({
      data: {
        clerkOrgId: internalOrgId,
        razorpayCustomerId: billingCustomer.razorpayCustomerId,
        razorpaySubscriptionId: subscription.id,
        razorpayPlanId: planIds[plan],
        planKey: plan,
        status: 'created',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date()
      }
    });

    return NextResponse.json({ 
      subscriptionId: subscription.id,
      keyId: process.env.RAZORPAY_KEY_ID
    });

  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + (error.message || String(error)) }, { status: 500 });
  }
}
