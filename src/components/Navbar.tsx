"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Menu, X } from "lucide-react";
import { SignInButton, Show, UserButton } from '@clerk/nextjs';
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NAV_LINKS = [
    { label: 'Platform', href: '/platform' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Resources', href: '/resources' },
    { label: 'Contact', href: '/contact' }
  ];

  return (
    <>
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
            {NAV_LINKS.map((nav) => (
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
            <div className="hidden sm:flex items-center gap-4">
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
            </div>
            
            <button 
              className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-xs bg-zinc-950 border-l border-white/5 z-[70] lg:hidden p-8 shadow-2xl"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-12">
                  <span className="font-bold text-lg text-white">Menu</span>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-zinc-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <nav className="flex-1 space-y-6">
                  {NAV_LINKS.map((nav) => (
                    <Link 
                      key={nav.label} 
                      href={nav.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-2xl font-bold text-zinc-400 hover:text-blue-500 transition-colors"
                    >
                      {nav.label}
                    </Link>
                  ))}
                </nav>

                <div className="pt-8 border-t border-white/5 space-y-4">
                  <Show when="signed-out">
                    <SignInButton mode="modal">
                      <button className="w-full btn-saas-primary py-4">Sign Up</button>
                    </SignInButton>
                    <SignInButton mode="modal">
                      <button className="w-full btn-saas-secondary py-4">Log In</button>
                    </SignInButton>
                  </Show>
                  <Show when="signed-in">
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full btn-saas-primary py-4 text-center"
                    >
                      Workspace
                    </Link>
                    <div className="flex items-center gap-4 p-4 glass rounded-2xl">
                       <UserButton appearance={{ elements: { userButtonAvatarBox: 'w-10 h-10' } }} />
                       <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-bold text-white">Account</span>
                          <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Authorized Access</span>
                       </div>
                    </div>
                  </Show>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
