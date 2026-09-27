import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyWebhookSignature } from '@/lib/razorpay';

// Plan entitlement limits — mirrors checkout/route.ts PLANS config
const PLAN_LIMITS: Record<string, {
  maxDomains: number;
  maxAssets: number;
  scansPerMonth: number;
  features: Record<string, boolean | number>;
}> = {
  'STARTER': {
    maxDomains: 1,
    maxAssets: 50,
    scansPerMonth: 10,
    features: { pqc_scan: true, cbom_export: true, pdf_report: true, basic_support: true },
  },
  'PRO': {
    maxDomains: 10,
    maxAssets: 500,
    scansPerMonth: 50,
    features: {
      pqc_scan: true, cbom_export: true, pdf_report: true,
      api_access: true, priority_support: true, team_seats: 3,
    },
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
  },
};

// Revoke entitlement: set validUntil to now so checks fail immediately
async function revokeEntitlement(orgId: string) {
  await prisma.entitlement.updateMany({
    where: { organizationId: orgId },
    data: { validUntil: new Date() },
  });
}

async function syncEntitlement(orgId: string, planKey: string, validUntil: Date) {
  const config = PLAN_LIMITS[planKey];
  if (!config) return;

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

    // Idempotency: skip if already processed
    const eventId = event.event_id || event.id || String(Date.now());
    const existingEvent = await prisma.webhookEvent.findUnique({
      where: { eventId },
    });
    if (existingEvent) {
      return NextResponse.json({ success: true, message: 'Already processed' });
    }

    await prisma.webhookEvent.create({
      data: {
        provider: 'razorpay',
        eventId,
        eventType: event.event,
        processed: false,
      },
    });

    const payload = event.payload;

    // --- subscription.activated: enable entitlement ---
    if (event.event === 'subscription.activated' || event.event === 'subscription.authenticated') {
      const sub = (payload.subscription && payload.subscription.entity)
        ? payload.subscription.entity
        : payload.subscription;

      if (!sub || !sub.id) {
        console.error('Webhook: missing subscription entity');
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
      }

      // Update subscription status in DB
      await prisma.subscription.updateMany({
        where: { razorpaySubscriptionId: sub.id },
        data: {
          status: 'active',
          currentPeriodStart: sub.current_start ? new Date(sub.current_start * 1000) : new Date(),
          currentPeriodEnd: sub.current_end ? new Date(sub.current_end * 1000) : new Date(),
        },
      });

      // Sync entitlement using RZP current_end as validUntil (industry standard)
      const notes = (sub.notes || payload.subscription?.notes || {}) as Record<string, string>;
      const orgId = notes.clerkOrgId || (payload.subscription?.customer_notes as Record<string, string>)?.clerkOrgId;
      const planKey = notes.plan || (payload.subscription?.customer_notes as Record<string, string>)?.plan || 'PRO';

      // Use RZP's current_end for validUntil; fallback to now + 1 month if missing
      const validUntil = sub.current_end
        ? new Date(sub.current_end * 1000)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      if (orgId) {
        await syncEntitlement(orgId, planKey, validUntil);
      }
    }

    // --- subscription.expired: revoke entitlement ---
    if (event.event === 'subscription.expired') {
      const sub = (payload.subscription && payload.subscription.entity)
        ? payload.subscription.entity
        : payload.subscription;

      if (sub && sub.id) {
        await prisma.subscription.updateMany({
          where: { razorpaySubscriptionId: sub.id },
          data: { status: 'expired' },
        });

        const notes = (sub.notes || {}) as Record<string, string>;
        const orgId = notes.clerkOrgId;
        if (orgId) {
          await revokeEntitlement(orgId);
        }
      }
    }

    // --- subscription.cancelled: revoke entitlement ---
    if (event.event === 'subscription.cancelled') {
      const sub = (payload.subscription && payload.subscription.entity)
        ? payload.subscription.entity
        : payload.subscription;

      if (sub && sub.id) {
        await prisma.subscription.updateMany({
          where: { razorpaySubscriptionId: sub.id },
          data: { status: 'cancelled' },
        });

        const notes = (sub.notes || {}) as Record<string, string>;
        const orgId = notes.clerkOrgId;
        if (orgId) {
          await revokeEntitlement(orgId);
        }
      }
    }

    // --- subscription.updated: sync status + re-sync entitlement if plan changed ---
    if (event.event === 'subscription.updated') {
      const sub = (payload.subscription && payload.subscription.entity)
        ? payload.subscription.entity
        : payload.subscription;

      if (sub && sub.id) {
        await prisma.subscription.updateMany({
          where: { razorpaySubscriptionId: sub.id },
          data: {
          status: sub.status === 'active' ? 'active' : sub.status,
          currentPeriodStart: sub.current_start ? new Date(sub.current_start * 1000) : undefined,
          currentPeriodEnd: sub.current_end ? new Date(sub.current_end * 1000) : undefined,
        },
      });

        // If plan changed, re-sync entitlement
        const notes = (sub.notes || {}) as Record<string, string>;
        const orgId = notes.clerkOrgId;
        const planKey = notes.plan || 'PRO';
        if (orgId && sub.status === 'active') {
          const validUntil = sub.current_end
            ? new Date(sub.current_end * 1000)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          await syncEntitlement(orgId, planKey, validUntil);
        }
      }
    }

    // --- payment.captured: record transaction + one-time entitlement ---
    if (event.event === 'payment.captured') {
      const payment = payload.payment?.entity || payload.payment;
      const orgIdNotes = (payment.notes || {})?.orgId;

      if (orgIdNotes && payment.id) {
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
          update: { status: 'captured' },
        });

        // One-time entitlement for STARTER annual payments
        const notePlan = (payment.notes || {})?.plan;
        if (notePlan) {
          const validUntil = payment.subscription_id
            ? new Date((payment.subscription_current_end || Date.now() + 365 * 24 * 60 * 60 * 1000))
            : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
          await syncEntitlement(orgIdNotes, notePlan, validUntil);
        }
      }
    }

    // Mark processed
    await prisma.webhookEvent.update({
      where: { id: eventId },
      data: { processed: true, processedAt: new Date() },
    }).catch(() => {}); // eventId might be same as create key

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
