"use client";

import Link from "next/link";
import { ShieldCheck, Menu } from "lucide-react";
import { SignInButton, Show, UserButton } from '@clerk/nextjs';
import { motion, useScroll, useTransform } from "framer-motion";

export function Navbar() {
  const { scrollY } = useScroll();
  const navBg = useTransform(scrollY, [0, 100], ["rgba(255,255,255,0)", "rgba(255,255,255,0.8)"]);
  const navBorder = useTransform(scrollY, [0, 100], ["rgba(226,232,240,0)", "rgba(226,232,240,1)"]);
  const navLift = useTransform(scrollY, [0, 100], [0, -4]);

  return (
    <div className="fixed top-8 left-0 w-full z-50 flex justify-center px-6 pointer-events-none">
      <motion.nav 
        style={{ backgroundColor: navBg, borderColor: navBorder, y: navLift }}
        className="backdrop-blur-2xl border rounded-[1.5rem] py-3 px-8 flex items-center justify-between w-full max-w-7xl shadow-xl pointer-events-auto transition-colors duration-500"
      >
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-blue-600/5 border border-blue-600/10 flex items-center justify-center transition-all group-hover:border-[#2563EB]/50 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.2)]">
            <ShieldCheck className="w-6 h-6 text-[#2563EB]" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tighter text-slate-900 uppercase leading-none">QuantumBlue</span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Sovereign Notary</span>
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
              className="text-[10px] font-bold text-slate-500 hover:text-[#2563EB] uppercase tracking-[0.2em] transition-colors"
            >
              {nav.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-8">
          <Link 
            href="https://docs.quantum-blue.in" 
            className="hidden sm:block text-[10px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-[0.2em] transition-colors"
          >
            Documentation
          </Link>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="btn-sovereign !py-2.5 !px-6 !rounded-lg text-[9px]">
                Access Workspace
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="bg-slate-100 hover:bg-slate-200 border border-slate-200 px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-900 transition-all"
            >
              Workspace
            </Link>
            <div className="p-1 bg-slate-100 rounded-lg border border-slate-200">
              <UserButton />
            </div>
          </Show>
          <button className="lg:hidden p-2 text-slate-500 hover:text-slate-900">
            <Menu className="w-6 h-6" />
          </button>
        </div>

      </motion.nav>
    </div>
  );
}
