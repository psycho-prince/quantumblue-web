import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Fira_Code } from "next/font/google";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import "./globals.css";
import Link from "next/link";
import { Command, Github, ShieldCheck, Globe } from "lucide-react";
import clsx from "clsx";
import { ClerkProvider } from '@clerk/nextjs';
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-fira-code" });

export const metadata: Metadata = {
  title: "QuantumBlue | Achromatic Sovereign Architecture",
  description: "Secure your digital legacy with mathematical lattice armor. Built for the Quantum Epoch.",
  openGraph: {
    title: "QuantumBlue | Achromatic Sovereign Architecture",
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
    <html lang="en" className={clsx(inter.variable, jetbrainsMono.variable, firaCode.variable, "dark scroll-smooth")}>
      <body className="selection:bg-white/10">
        {/* Achromatic Background Layer */}
        <div className="lattice-bg" />
        
        <Navbar />

        <main className="min-h-screen">
          {children}
        </main>

        {/* Tactical Footer - Monochromatic */}
        <footer className="bg-[#0a0a0a] border-t border-white/5 pt-32 pb-16 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-10 relative z-10 grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-[#A0AAB5]" />
                </div>
                <span className="font-bold text-2xl tracking-tighter text-[#FAF7F2] uppercase font-['Plus_Jakarta_Sans']">QuantumBlue</span>
              </div>
              <p className="text-[#A0AAB5] text-sm font-medium leading-relaxed">
                Achromatic Sovereign Notary. <br />
                Museum-grade security for the digital epoch.
              </p>
              <div className="flex items-center gap-3 opacity-40">
                <Command className="w-4 h-4 text-[#A0AAB5]" />
                <p className="text-[#A0AAB5] text-[9px] font-bold uppercase tracking-[0.2em]">
                  &copy; 2026 QuantumBlue Inc.
                </p>
              </div>
            </div>
            
            <div className="space-y-8">
              <h4 className="text-[#FAF7F2] font-bold uppercase text-[10px] tracking-[0.3em]">Product</h4>
              <ul className="space-y-4 text-[#A0AAB5] text-[10px] font-bold uppercase tracking-widest">
                <li><Link href="/coming-soon" className="hover:text-white transition-colors">Quantum CLI</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Sovereign Workspace</Link></li>
                <li><Link href="/coming-soon" className="hover:text-white transition-colors">Sentinel Node</Link></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-[#FAF7F2] font-bold uppercase text-[10px] tracking-[0.3em]">Resources</h4>
              <ul className="space-y-4 text-[#A0AAB5] text-[10px] font-bold uppercase tracking-widest">
                <li><Link href="/coming-soon" className="hover:text-white transition-colors">Whitepapers</Link></li>
                <li><Link href="https://docs.quantum-blue.in" className="hover:text-white transition-colors">API Documentation</Link></li>
                <li><Link href="https://github.com/quantumblue" className="hover:text-white transition-colors">GitHub Repository</Link></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-[#FAF7F2] font-bold uppercase text-[10px] tracking-[0.3em]">Trust</h4>
              <ul className="space-y-4 text-[#A0AAB5] text-[10px] font-bold uppercase tracking-widest">
                <li><Link href="/coming-soon" className="hover:text-white transition-colors">Security Audits</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Architects</Link></li>
                <li><Link href="/coming-soon" className="hover:text-white transition-colors">PGP Key</Link></li>
              </ul>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-10 pt-16 mt-16 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] text-[#A0AAB5]">
               <div className="pulse-dot bg-[#A0AAB5]" />
               NIST FIPS-203 COMPLIANT
            </div>
            <div className="flex gap-6">
                 <Link href="#" aria-label="Github" className="text-[#A0AAB5] hover:text-[#FAF7F2] transition-all"><Github className="w-4 h-4" /></Link>
                 <Link href="#" aria-label="Global" className="text-[#A0AAB5] hover:text-[#FAF7F2] transition-all"><Globe className="w-4 h-4" /></Link>
            </div>
          </div>
        </footer>

      </body>
    </html>
    </ClerkProvider>
  );
}
