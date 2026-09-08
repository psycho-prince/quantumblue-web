"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Menu, X, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NAV_LINKS = [
    { label: 'Features', href: '/#platform' },
    { label: 'CLI Examples', href: '/#platform' },
    { label: 'Specs', href: '/#security' },
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
              <a 
                href="https://github.com/psycho-prince/quantumblue-cli" 
                target="_blank" 
                rel="noopener"
                className="px-4 py-1.5 text-xs font-mono bg-accent-blue/10 border border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-black transition-all flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                GITHUB
              </a>
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
                  <a 
                    href="https://github.com/psycho-prince/quantumblue-cli" 
                    target="_blank" 
                    rel="noopener"
                    className="block w-full py-4 bg-accent-blue text-black font-bold uppercase tracking-widest text-center"
                  >
                    VIEW ON GITHUB
                  </a>
                  <a 
                    href="https://github.com/psycho-prince/quantumblue-cli#readme" 
                    target="_blank" 
                    rel="noopener"
                    className="block w-full py-4 border border-accent-blue text-accent-blue font-bold uppercase tracking-widest text-center"
                  >
                    README
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
