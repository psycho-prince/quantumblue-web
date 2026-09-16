import React from 'react';

export default function ShippingPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-slate-300">
      <h1 className="text-4xl font-bold text-white mb-8">Shipping & Exchange Policy</h1>
      
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-100">1. Delivery of Digital Services</h2>
        <p>
          QuantumBlue is a Software as a Service (SaaS) and API platform. We do not ship any physical goods.
          Upon successful payment and subscription activation, access to the QuantumBlue platform and associated
          cryptographic toolkits is granted instantly.
        </p>

        <h2 className="text-2xl font-semibold text-slate-100">2. Service Access</h2>
        <p>
          Your account provisioning and API key generation will be available immediately in your dashboard.
          If you experience delays in provisioning, please contact our support team.
        </p>

        <h2 className="text-2xl font-semibold text-slate-100">3. Exchanges</h2>
        <p>
          As we deal strictly in digital access and API licenses, exchanges are not applicable. 
          However, you may upgrade or downgrade your subscription plan at any time through the Billing Dashboard.
        </p>
      </section>
    </div>
  );
}
