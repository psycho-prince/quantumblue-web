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
  title: "QuantumBlue | Advanced Security Architecture",
  description: "Enterprise-grade digital asset protection and risk analytics. Built for the modern financial landscape.",
  openGraph: {
    title: "QuantumBlue | Advanced Security Architecture",
    description: "Enterprise-grade digital asset protection.",
    type: "website",
    url: "https://quantum-blue.in",
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
      <body className="selection:bg-sky-500/30">
        <Navbar />

        <main className="min-h-screen">
          {children}
        </main>

        <footer className="bg-[#020617] border-t border-white/5 pt-24 pb-12 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-sky-400" />
                </div>
                <span className="font-bold text-xl tracking-tight text-white font-['Plus_Jakarta_Sans']">QuantumBlue</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Sophisticated security infrastructure for the global financial ecosystem.
              </p>
              <div className="flex items-center gap-2 opacity-50">
                <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider">
                  &copy; 2026 QuantumBlue Inc. All rights reserved.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-white font-bold text-sm tracking-tight">Platform</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><Link href="/dashboard" className="hover:text-sky-400 transition-colors">Workspace</Link></li>
                <li><Link href="/pricing" className="hover:text-sky-400 transition-colors">Pricing Plans</Link></li>
                <li><Link href="/coming-soon" className="hover:text-sky-400 transition-colors">Risk Analytics</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-white font-bold text-sm tracking-tight">Company</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><Link href="/coming-soon" className="hover:text-sky-400 transition-colors">About Us</Link></li>
                <li><Link href="/coming-soon" className="hover:text-sky-400 transition-colors">Compliance</Link></li>
                <li><Link href="/contact" className="hover:text-sky-400 transition-colors">Contact Support</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-white font-bold text-sm tracking-tight">Support</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><Link href="/coming-soon" className="hover:text-sky-400 transition-colors">Documentation</Link></li>
                <li><Link href="/coming-soon" className="hover:text-sky-400 transition-colors">Security Portal</Link></li>
                <li><Link href="/coming-soon" className="hover:text-sky-400 transition-colors">Status Board</Link></li>
              </ul>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-semibold tracking-wider text-slate-400">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
               SYSTEMS OPERATIONAL
            </div>
            <div className="flex gap-4">
                 <div className="p-2 text-slate-500 hover:text-white transition-all cursor-pointer"><Globe className="w-4 h-4" /></div>
                 <div className="p-2 text-slate-500 hover:text-white transition-all cursor-pointer"><Lock className="w-4 h-4" /></div>
                 <div className="p-2 text-slate-500 hover:text-white transition-all cursor-pointer"><Activity className="w-4 h-4" /></div>
            </div>
          </div>
        </footer>

      </body>
    </html>
    </ClerkProvider>
  );
}
