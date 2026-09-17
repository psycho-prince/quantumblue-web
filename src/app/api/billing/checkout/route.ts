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

    
    const planAmounts: Record<string, number> = {
      'STARTER': 999,
      'PRO': 1999,
      'BUSINESS': 4999
    };
    
    if (!planAmounts[plan]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Create a Razorpay Order instead of a Subscription to allow UPI and all payment methods
    const order = await razorpay.orders.create({
      amount: planAmounts[plan] * 100, // paise
      currency: "INR",
      receipt: `rcpt_${internalOrgId.substring(0,8)}_${Date.now().toString().slice(-4)}`,
      notes: { clerkOrgId: internalOrgId, plan }
    });

    return NextResponse.json({ 
      orderId: order.id,
      keyId: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
