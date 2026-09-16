import React from 'react';

export default function CancellationPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-slate-300">
      <h1 className="text-4xl font-bold text-white mb-8">Cancellation & Refund Policy</h1>
      
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-100">1. Subscription Cancellation</h2>
        <p>
          You may cancel your QuantumBlue subscription at any time from your Billing Dashboard. 
          When you cancel, your subscription will remain active until the end of your current billing period.
        </p>

        <h2 className="text-2xl font-semibold text-slate-100">2. Refund Policy</h2>
        <p>
          Because QuantumBlue provides immediate access to digital infrastructure and cryptographic toolkits, 
          all charges are generally non-refundable. We do not provide refunds or credits for partially used 
          billing periods unless required by applicable law in your jurisdiction.
        </p>

        <h2 className="text-2xl font-semibold text-slate-100">3. Exceptions</h2>
        <p>
          If you believe you were charged in error, please contact us at info@quantum-blue.in within 7 days.
        </p>
      </section>
    </div>
  );
}
