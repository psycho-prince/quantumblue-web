import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Globe, Command, Github, ShieldCheck } from "lucide-react";
import clsx from "clsx";
import { ClerkProvider } from '@clerk/nextjs';
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-fira-code" });

export const metadata: Metadata = {
  title: "QuantumBlue | Sovereign Post-Quantum Notary",
  description: "Secure your digital legacy with mathematical lattice armor. Built for the Quantum Epoch.",
  openGraph: {
    title: "QuantumBlue | Sovereign Post-Quantum Notary",
    description: "Secure your digital legacy with mathematical lattice armor.",
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
    <html lang="en" className={clsx(inter.variable, firaCode.variable, "light scroll-smooth")}>
      <body className="selection:bg-blue-500/30">
        {/* Persistent Background Layer */}
        <div className="quantum-gradient" />
        <div className="quantum-noise" />
        <div className="fixed inset-0 cyber-grid -z-10 opacity-30" />

        <Navbar />

        {children}

        {/* Tactical Footer */}
        <footer className="bg-slate-50 border-t border-slate-200 pt-32 pb-16 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-10 relative z-10 grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                </div>
                <span className="font-black text-2xl tracking-tighter text-slate-900 uppercase">QuantumBlue</span>
              </div>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Sovereign Post-Quantum Notary. <br />
                Built to survive the epoch.
              </p>
              <div className="flex items-center gap-3 opacity-40">
                <Command className="w-4 h-4 text-slate-500" />
                <p className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em]">
                  &copy; 2026 QuantumBlue Inc.
                </p>
              </div>
            </div>
            
            <div className="space-y-8">
              <h4 className="text-slate-900 font-bold uppercase text-[10px] tracking-[0.3em]">Product</h4>
              <ul className="space-y-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                <li><Link href="/coming-soon" className="hover:text-blue-600 transition-colors">Quantum CLI</Link></li>
                <li><Link href="/dashboard" className="hover:text-blue-600 transition-colors">Sovereign Workspace</Link></li>
                <li><Link href="/coming-soon" className="hover:text-blue-600 transition-colors">Sentinel Node</Link></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-slate-900 font-bold uppercase text-[10px] tracking-[0.3em]">Resources</h4>
              <ul className="space-y-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                <li><Link href="/coming-soon" className="hover:text-blue-600 transition-colors">Whitepapers</Link></li>
                <li><Link href="https://docs.quantum-blue.in" className="hover:text-blue-600 transition-colors">API Documentation</Link></li>
                <li><Link href="https://github.com/quantumblue" className="hover:text-blue-600 transition-colors">GitHub Repository</Link></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-slate-900 font-bold uppercase text-[10px] tracking-[0.3em]">Trust</h4>
              <ul className="space-y-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                <li><Link href="/coming-soon" className="hover:text-blue-600 transition-colors">Security Audits</Link></li>
                <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contact Architects</Link></li>
                <li><Link href="/coming-soon" className="hover:text-blue-600 transition-colors">PGP Key</Link></li>
              </ul>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-10 pt-16 mt-16 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4 px-6 py-2 bg-slate-200/50 border border-slate-200 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
               NIST FIPS-203 COMPLIANT
            </div>
            <div className="flex gap-6">
                 <Link href="#" aria-label="Github" className="text-slate-400 hover:text-slate-900 transition-all"><Github className="w-4 h-4" /></Link>
                 <Link href="#" aria-label="Global" className="text-slate-400 hover:text-slate-900 transition-all"><Globe className="w-4 h-4" /></Link>
            </div>
          </div>

          {/* Background Gradient Decoration */}
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#8A2BE2]/5 rounded-full blur-[120px] -z-10" />
        </footer>

      </body>
    </html>
    </ClerkProvider>
  );
}
