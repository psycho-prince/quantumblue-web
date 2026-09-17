const fs = require('fs');
let code = fs.readFileSync('src/app/api/billing/checkout/route.ts', 'utf8');

const newOrgProvisioning = `
    const internalOrgId = orgId || userId;

    let org = await prisma.organization.findUnique({ where: { id: internalOrgId } });
    if (!org) {
      org = await prisma.organization.create({
        data: { id: internalOrgId, name: orgId ? "Clerk Org" : "Personal Workspace" }
      });
    }

    let billingCustomer = await prisma.billingCustomer.findUnique({
`;

code = code.replace(/const internalOrgId = orgId \|\| userId;\s*let billingCustomer = await prisma\.billingCustomer\.findUnique\(\{/g, newOrgProvisioning);

const newOrderLogic = `
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
      receipt: \`rcpt_\${internalOrgId.substring(0,8)}_\${Date.now().toString().slice(-4)}\`,
      notes: { clerkOrgId: internalOrgId, plan }
    });

    return NextResponse.json({ 
      orderId: order.id,
      keyId: process.env.RAZORPAY_KEY_ID
    });
`;

code = code.replace(/let planId = '';[\s\S]*return NextResponse\.json\(\{\s*subscriptionId: subscription\.id,\s*keyId: process\.env\.RAZORPAY_KEY_ID\s*\}\);/g, newOrderLogic);

fs.writeFileSync('src/app/api/billing/checkout/route.ts', code);
console.log('Done patching checkout/route.ts');
