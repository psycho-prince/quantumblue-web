"use client";

import Link from "next/link";
import { ShieldCheck, Menu } from "lucide-react";
import { SignInButton, Show, UserButton } from '@clerk/nextjs';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/50 backdrop-blur-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center transition-all group-hover:border-blue-500/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <ShieldCheck className="w-6 h-6 text-blue-500" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tighter text-slate-100 uppercase leading-none">QuantumBlue</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Sovereign Notary</span>
          </div>
        </Link>

        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex gap-12">
          {[
            { label: 'Platform', href: '/#platform' },
            { label: 'Security', href: '/#security' },
            { label: 'Resources', href: '/coming-soon' },
            { label: 'Pricing', href: '/pricing' }
          ].map((nav) => (
            <Link 
              key={nav.label} 
              href={nav.href}
              className="text-[10px] font-bold text-slate-400 hover:text-blue-500 uppercase tracking-[0.2em] transition-colors"
            >
              {nav.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-8">
          <Link 
            href="https://docs.quantum-blue.in" 
            className="hidden sm:block text-[10px] font-bold text-slate-500 hover:text-slate-100 uppercase tracking-[0.2em] transition-colors"
          >
            Documentation
          </Link>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="btn-sovereign !py-2.5 !px-6 !rounded-lg text-[9px] glow-pulse">
                Access Workspace
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-100 transition-all"
            >
              Workspace
            </Link>
            <div className="p-1 bg-slate-900 rounded-lg border border-slate-800">
              <UserButton />
            </div>
          </Show>
          <button className="lg:hidden p-2 text-slate-400 hover:text-slate-100">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}
