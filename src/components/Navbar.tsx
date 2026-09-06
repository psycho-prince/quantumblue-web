"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Menu, X, Cpu } from "lucide-react";
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
      <nav className="fixed top-0 z-50 w-full glass border-b border-border-bright">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-accent-blue/50 flex items-center justify-center transition-all group-hover:bg-blue-500/20">
              <Cpu className="w-5 h-5 text-accent-blue" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white font-mono leading-none neon-text-blue">QUANTUM_BLUE</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex gap-8">
            {NAV_LINKS.map((nav) => (
              <Link 
                key={nav.label} 
                href={nav.href}
                className="text-xs font-mono text-zinc-400 hover:text-white hover:neon-text-blue transition-colors uppercase tracking-widest"
              >
                {nav.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="px-4 py-1.5 text-xs font-mono text-white hover:text-accent-blue transition-colors">
                    LOG_IN
                  </button>
                </SignInButton>
                <SignInButton mode="modal">
                  <button className="px-4 py-1.5 text-xs font-mono bg-accent-blue/10 border border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-black transition-all">
                    SIGN_UP
                  </button>
                </SignInButton>
              </Show>
              <Show when="signed-in">
                <Link
                  href="/dashboard"
                  className="px-4 py-1.5 text-xs font-mono bg-accent-blue/10 border border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-black transition-all"
                >
                  WORKSPACE
                </Link>
                <div className="flex items-center justify-center p-0.5 border border-accent-blue/30 rounded-full">
                  <UserButton appearance={{ elements: { userButtonAvatarBox: 'w-7 h-7' } }} />
                </div>
              </Show>
            </div>
            
            <button 
              className="lg:hidden p-2 text-accent-blue"
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
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-xs bg-black border-l border-accent-blue/50 z-[70] lg:hidden p-8 shadow-[0_0_30px_rgba(59,130,246,0.2)]"
            >
              <div className="flex flex-col h-full font-mono">
                <div className="flex items-center justify-between mb-12">
                  <span className="font-bold text-lg text-white">MENU</span>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-accent-red"
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
                      className="block text-2xl font-bold text-zinc-400 hover:text-accent-blue transition-colors"
                    >
                      {nav.label}
                    </Link>
                  ))}
                </nav>

                <div className="pt-8 border-t border-accent-blue/30 space-y-4">
                  <Show when="signed-out">
                    <SignInButton mode="modal">
                      <button className="w-full py-4 bg-accent-blue text-black font-bold uppercase tracking-widest">SIGN_UP</button>
                    </SignInButton>
                    <SignInButton mode="modal">
                      <button className="w-full py-4 border border-accent-blue text-accent-blue font-bold uppercase tracking-widest">LOG_IN</button>
                    </SignInButton>
                  </Show>
                  <Show when="signed-in">
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full py-4 bg-accent-blue text-black font-bold uppercase tracking-widest text-center"
                    >
                      WORKSPACE
                    </Link>
                    <div className="flex items-center gap-4 p-4 glass rounded-none border border-accent-blue/30">
                       <UserButton appearance={{ elements: { userButtonAvatarBox: 'w-10 h-10' } }} />
                       <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-bold text-white">ACCOUNT</span>
                          <span className="text-[10px] text-accent-green uppercase tracking-widest">AUTHORIZED_ACCESS</span>
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
