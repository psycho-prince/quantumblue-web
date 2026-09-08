"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie_consent")) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/90 backdrop-blur-md border-t border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-zinc-400 text-xs text-center sm:text-left leading-relaxed">
          By using Quantum Blue, you agree to our <Link href="/terms" className="text-white underline hover:text-blue-400">User Permission Agreement</Link>, <Link href="/privacy" className="text-white underline hover:text-blue-400">Privacy Policy</Link>, and our compliance with <Link href="/it-regulations" className="text-white underline hover:text-blue-400">IT Regulations</Link>. We use essential cookies to provide our SaaS platform.
        </p>
        <button 
          onClick={handleAccept}
          className="whitespace-nowrap px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-full transition-colors"
        >
          Accept & Continue
        </button>
      </div>
    </div>
  );
}
