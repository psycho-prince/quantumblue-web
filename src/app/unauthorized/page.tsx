"use client";

import Link from "next/link";
import { ShieldAlert, Key, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 font-mono text-center">
      <div className="relative group">
        <div className="absolute inset-0 bg-yellow-500/20 blur-[50px] rounded-full group-hover:bg-yellow-500/30 transition-all duration-500" />
        <div className="relative p-6 bg-slate-900/80 backdrop-blur-xl border border-yellow-500/30 rounded-2xl shadow-2xl">
          <ShieldAlert className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
          
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4">
            401 Unauthorized
          </h1>
          
          <h2 className="text-xl font-semibold text-slate-200 mb-2">
            Clearance Level Insufficient
          </h2>
          
          <p className="text-slate-400 max-w-md mx-auto mb-8">
            You are attempting to access a secure sector without proper cryptographic credentials. Please authenticate to proceed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/sign-in" 
              className="px-6 py-3 bg-yellow-500/10 text-yellow-400 border border-yellow-500/50 rounded-lg hover:bg-yellow-500/20 transition-all font-semibold flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4" /> Authenticate (Sign In)
            </Link>
            <Link 
              href="/" 
              className="px-6 py-3 bg-slate-800 text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-700 transition-all font-semibold flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Retreat
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
