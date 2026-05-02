"use client";

import Link from "next/link";
import { ShieldCheck, Menu } from "lucide-react";
import { SignInButton, Show, UserButton } from '@clerk/nextjs';

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full glass border-b border-white/5 bg-black/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center transition-all group-hover:bg-blue-500/30">
            <ShieldCheck className="w-5 h-5 text-blue-500" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-white font-['Plus_Jakarta_Sans'] leading-none">Quantum Blue</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex gap-8">
          {[
            { label: 'Platform', href: '/#platform' },
            { label: 'Ecosystem', href: '/#briefing' },
            { label: 'Pricing', href: '/pricing' },
            { label: 'Docs', href: '/coming-soon' }
          ].map((nav) => (
            <Link 
              key={nav.label} 
              href={nav.href}
              className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
            >
              {nav.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="btn-saas-secondary py-1.5 px-4 text-xs">
                Log In
              </button>
            </SignInButton>
            <SignInButton mode="modal">
              <button className="btn-saas-primary py-1.5 px-4 text-xs">
                Sign Up
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="btn-saas-secondary py-1.5 px-4 text-xs"
            >
              Workspace
            </Link>
            <div className="flex items-center justify-center p-0.5 glass rounded-full">
              <UserButton appearance={{ elements: { userButtonAvatarBox: 'w-7 h-7' } }} />
            </div>
          </Show>
          <button className="lg:hidden p-2 text-zinc-400 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
