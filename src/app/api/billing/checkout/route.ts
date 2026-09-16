import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { razorpay } from '@/lib/razorpay';

export async function POST(req: Request) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan } = await req.json();
    const internalOrgId = orgId || userId;

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

    let planId = '';
    if (plan === 'STARTER') planId = process.env.RAZORPAY_STARTER_PLAN_ID || '';
    if (plan === 'PRO') planId = process.env.RAZORPAY_PRO_PLAN_ID || '';
    if (plan === 'BUSINESS') planId = process.env.RAZORPAY_BUSINESS_PLAN_ID || '';

    if (!planId) {
      return NextResponse.json({ error: 'Invalid plan or missing config' }, { status: 400 });
    }

    // Create a Razorpay Subscription (for UPI AutoPay / Recurring)
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_id: billingCustomer.razorpayCustomerId,
      total_count: 120, // 10 years
      customer_notify: 1,
      notes: { clerkOrgId: internalOrgId }
    } as any);

    await prisma.subscription.create({
      data: {
        clerkOrgId: internalOrgId,
        razorpayCustomerId: billingCustomer.razorpayCustomerId,
        razorpaySubscriptionId: subscription.id,
        razorpayPlanId: planId,
        planKey: plan,
        status: subscription.status,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // approx
      }
    });

    return NextResponse.json({ 
      subscriptionId: subscription.id,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
