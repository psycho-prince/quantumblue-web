import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Fira_Code } from "next/font/google";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import "./globals.css";
import Link from "next/link";
import { Command, ShieldCheck, Globe, CreditCard, Lock, Activity } from "lucide-react";
import clsx from "clsx";
import { ClerkProvider } from '@clerk/nextjs';
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-fira-code" });

export const metadata: Metadata = {
  title: "Quantum Blue | The Quantum-Safe Infrastructure Platform",
  description: "Secure your enterprise against the quantum threat. Deploy future-proof encryption, identity, and data vaults across your entire stack.",
  openGraph: {
    title: "Quantum Blue | Post-Quantum Security Ecosystem",
    description: "Enterprise-grade quantum-resistant security infrastructure.",
    type: "website",
    url: "https://quantum-blue.io",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en" className={clsx(inter.variable, jetbrainsMono.variable, firaCode.variable, "dark scroll-smooth")}>
      <body className="selection:bg-blue-500/30 bg-[#000] text-white">
        {/* Subtle Background Glow */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full" />
        </div>

        <Navbar />

        <main className="min-h-screen pt-20">
          {children}
        </main>

        <footer className="border-t border-white/5 bg-black py-20">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                </div>
                <span className="font-bold text-xl tracking-tight text-white font-['Plus_Jakarta_Sans']">Quantum Blue</span>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
                The foundation for a quantum-safe world. Secure your data today, for the challenges of tomorrow.
              </p>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-white font-bold text-sm tracking-tight uppercase">Ecosystem</h4>
              <ul className="space-y-3 text-zinc-500 text-sm">
                <li><Link href="/platform" className="hover:text-blue-400 transition-colors">Encryption APIs</Link></li>
                <li><Link href="/platform" className="hover:text-blue-400 transition-colors">Vault Services</Link></li>
                <li><Link href="/platform" className="hover:text-blue-400 transition-colors">Identity Core</Link></li>
                <li><Link href="/dashboard" className="hover:text-blue-400 transition-colors">Quantum Blue CLI</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-white font-bold text-sm tracking-tight uppercase">Resources</h4>
              <ul className="space-y-3 text-zinc-500 text-sm">
                <li><Link href="/resources" className="hover:text-blue-400 transition-colors">Documentation</Link></li>
                <li><Link href="/resources" className="hover:text-blue-400 transition-colors">Technical Papers</Link></li>
                <li><Link href="/resources" className="hover:text-blue-400 transition-colors">Security Audit</Link></li>
                <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Expert Consultation</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-white font-bold text-sm tracking-tight uppercase">Company</h4>
              <ul className="space-y-3 text-zinc-500 text-sm">
                <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                <li><Link href="/press" className="hover:text-blue-400 transition-colors">Press Kit</Link></li>
                <li><Link href="/legal" className="hover:text-blue-400 transition-colors">Legal & Compliance</Link></li>
                <li><Link href="/pricing" className="hover:text-blue-400 transition-colors">Enterprise Plans</Link></li>
              </ul>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
              &copy; 2026 Quantum Blue Inc. &bull; Engineered for the future.
            </div>
            <div className="flex gap-4">
                 <Link href="#" className="p-2 text-zinc-500 hover:text-white transition-all"><Globe className="w-4 h-4" /></Link>
                 <Link href="#" className="p-2 text-zinc-500 hover:text-white transition-all"><Lock className="w-4 h-4" /></Link>
                 <Link href="#" className="p-2 text-zinc-500 hover:text-white transition-all"><Activity className="w-4 h-4" /></Link>
            </div>
          </div>
        </footer>

      </body>
    </html>
    </ClerkProvider>
  );
}
