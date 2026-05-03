"use client";

import { ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SignIn } from "@clerk/nextjs";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-4">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-blue-500" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-white font-['Plus_Jakarta_Sans']">Quantum Blue</span>
          </Link>
          <h1 className="text-3xl font-bold text-white">Reset Password</h1>
          <p className="text-zinc-500 text-sm">
            Enter your email address and we&apos;ll send you a link to reset your password.
            Actually, we use Clerk for secure authentication. Please use the &quot;Forgot password?&quot; link on the sign-in form below.
          </p>
        </div>

        <div className="glass p-1 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <SignIn 
            routing="hash"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none border-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "bg-white/5 border-white/10 text-white hover:bg-white/10",
                formButtonPrimary: "bg-blue-500 hover:bg-blue-600 text-white",
                footerAction: "hidden",
                formFieldLabel: "text-zinc-400 text-xs font-bold uppercase tracking-widest",
                formFieldInput: "bg-white/5 border-white/10 text-white focus:border-blue-500 focus:ring-blue-500",
                dividerLine: "bg-white/5",
                dividerText: "text-zinc-500",
              }
            }}
          />
        </div>

        <div className="text-center">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
