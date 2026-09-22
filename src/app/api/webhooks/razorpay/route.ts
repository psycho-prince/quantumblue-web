import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyWebhookSignature } from '@/lib/razorpay';

// Plan entitlement configuration matching roadmap pricing
const PLAN_ENTITLEMENTS: Record<string, {
  maxDomains: number;
  maxAssets: number;
  scansPerMonth: number;
  features: Record<string, boolean | number>;
  validMonths: number;
}> = {
  'STARTER': {
    maxDomains: 1,
    maxAssets: 50,
    scansPerMonth: 10,
    features: { pqc_scan: true, cbom_export: true, pdf_report: true, basic_support: true },
    validMonths: 12,
  },
  'PRO': {
    maxDomains: 10,
    maxAssets: 500,
    scansPerMonth: 50,
    features: {
      pqc_scan: true, cbom_export: true, pdf_report: true,
      api_access: true, priority_support: true, team_seats: 3,
    },
    validMonths: 1,
  },
  'BUSINESS': {
    maxDomains: 100,
    maxAssets: 5000,
    scansPerMonth: 500,
    features: {
      pqc_scan: true, cbom_export: true, pdf_report: true,
      api_access: true, priority_support: true, team_seats: 20,
      custom_connectors: true, sla: true,
    },
    validMonths: 1,
  },
};

async function syncEntitlement(orgId: string, planKey: string) {
  const config = PLAN_ENTITLEMENTS[planKey];
  if (!config) return;

  const validUntil = new Date();
  validUntil.setMonth(validUntil.getMonth() + config.validMonths);

  await prisma.entitlement.upsert({
    where: { organizationId: orgId },
    create: {
      organizationId: orgId,
      planCode: planKey,
      source: 'razorpay_webhook',
      maxDomains: config.maxDomains,
      maxAssets: config.maxAssets,
      scansPerMonth: config.scansPerMonth,
      features: config.features,
      validFrom: new Date(),
      validUntil,
    },
    update: {
      planCode: planKey,
      maxDomains: config.maxDomains,
      maxAssets: config.maxAssets,
      scansPerMonth: config.scansPerMonth,
      features: config.features,
      validUntil,
      source: 'razorpay_webhook',
    },
  });
}

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature || !verifyWebhookSignature(bodyText, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(bodyText);

    // Idempotency check
    const existingEvent = await prisma.webhookEvent.findUnique({
      where: { eventId: event.event_id || event.id }, // Note: razorpay uses 'event_id' but some payloads have 'id'
    });

    if (existingEvent) {
      return NextResponse.json({ success: true, message: 'Already processed' });
    }

    // Log the event for idempotency
    const webhookEvent = await prisma.webhookEvent.create({
      data: {
        provider: 'razorpay',
        eventId: event.event_id || event.id || String(Date.now()),
        eventType: event.event,
        processed: false
      }
    });

    const payload = event.payload;

    if (event.event === 'subscription.activated' || event.event === 'subscription.authenticated') {
      const sub = payload.subscription.entity;

      await prisma.subscription.updateMany({
        where: { razorpaySubscriptionId: sub.id },
        data: {
          status: 'active',
          currentPeriodStart: new Date(sub.current_start * 1000),
          currentPeriodEnd: new Date(sub.current_end * 1000),
        },
      });

      // Sync entitlement so customer gets features immediately on activation
      const notes = sub.notes || {};
      const orgId = notes.clerkOrgId || sub.customer_notes?.clerkOrgId;
      const planKey = notes.plan || 'PRO'; // Default to PRO if plan not in notes
      if (orgId) {
        await syncEntitlement(orgId, planKey);
      }
    }

    if (event.event === 'payment.captured') {
      const payment = payload.payment.entity;
      const orgIdNotes = payment.notes?.orgId;

      if (orgIdNotes) {
        await prisma.paymentTransaction.upsert({
          where: { razorpayPaymentId: payment.id },
          create: {
            clerkOrgId: orgIdNotes,
            razorpayPaymentId: payment.id,
            razorpayOrderId: payment.order_id,
            amount: payment.amount,
            currency: payment.currency,
            status: 'captured',
            method: payment.method,
            email: payment.email,
          },
          update: {
            status: 'captured',
          },
        });

        // For one-time Starter payments, sync entitlement on payment capture
        const notePlan = payment.notes?.plan;
        if (notePlan) {
          await syncEntitlement(orgIdNotes, notePlan);
        }
      }
    }

    // Mark as processed
    await prisma.webhookEvent.update({
      where: { id: webhookEvent.id },
      data: { processed: true, processedAt: new Date() }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
