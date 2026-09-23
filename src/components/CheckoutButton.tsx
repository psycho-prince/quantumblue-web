"use client";

import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function CheckoutButton({ plan, buttonText, className }: { plan: string, buttonText: string, className?: string }) {
  const [loading, setLoading] = useState(false);
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Dynamically load the Razorpay checkout script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  }, []);

  const handleCheckout = async () => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in?redirect_url=/pricing");
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ plan })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        alert(`Checkout failed: ${data.error || "Unknown error"}\nDebug: ${JSON.stringify(data.debug || {})}`);
        setLoading(false);
        return;
      }

      const options = {
        key: data.keyId,
        subscription_id: data.subscriptionId,
        name: "QuantumBlue",
        description: `${plan} Plan`,
        image: "/icon.svg",
        prefill: {
          email: user?.primaryEmailAddress?.emailAddress || "",
          name: user?.fullName || ""
        },
        handler: function (response: { razorpay_payment_id?: string }) {
          alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
          // You can redirect to billing dashboard here
          window.location.href = "/dashboard/settings/billing";
        },
        theme: {
          color: "#6c47ff"
        }
      };

      const rzp = new (window as unknown as { Razorpay: new (opts: Record<string, unknown>) => { open: () => void; on: (event: string, cb: (response: { error: { description: string } }) => void) => void; } }).Razorpay(options);
      rzp.on("payment.failed", function (response: { error: { description: string } }) {
        alert(`Payment failed: ${response.error.description}`);
      });
      rzp.open();

    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleCheckout} disabled={loading} className={className}>
      {loading ? "Processing..." : buttonText}
    </button>
  );
}
