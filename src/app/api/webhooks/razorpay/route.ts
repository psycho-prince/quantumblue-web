import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyWebhookSignature } from '@/lib/razorpay';

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
        }
      });
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
            email: payment.email
          },
          update: {
            status: 'captured'
          }
        });
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
