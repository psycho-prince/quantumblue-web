import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Fira_Code } from "next/font/google";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import "./globals.css";
import Link from "next/link";
import { ShieldCheck, Globe, Lock, Activity } from "lucide-react";
import clsx from "clsx";
import { ClerkProvider } from '@clerk/nextjs';
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-fira-code" });

export const metadata: Metadata = {
  title: "Quantum Blue — Post-Quantum Cryptography & Legal Timestamping CLI",
  description: "Open-source Go CLI implementing ML-DSA-65 / ML-KEM-768 hybrid signatures, RFC 3161 timestamping, and CBOM generation for Indian Evidence Act §65B(4) admissibility.",
  openGraph: {
    title: "Quantum Blue — Open-Source PQC Signing & Legal Timestamping CLI",
    description: "Hybrid PQC signing (ML-DSA-65), RFC 3161 timestamping & CBOM generation for legal evidence admissibility.",
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
    <ClerkProvider 
      domain="quantum-blue.in" 
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
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
                Open-source Go CLI for hybrid post-quantum signing, RFC 3161 timestamping, and CBOM generation. Built for Indian Evidence Act §65B(4) admissibility.
              </p>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-white font-bold text-sm tracking-tight uppercase">CLI Tool</h4>
              <ul className="space-y-3 text-zinc-500 text-sm">
                <li><a href="https://github.com/psycho-prince/quantumblue-cli" target="_blank" rel="noopener" className="hover:text-blue-400 transition-colors">GitHub Repository</a></li>
                <li><a href="https://github.com/psycho-prince/quantumblue-cli/blob/main/docs/TECH_SPEC_HYBRID_PQC_TSA.md" target="_blank" rel="noopener" className="hover:text-blue-400 transition-colors">Technical Spec</a></li>
                <li><a href="https://github.com/psycho-prince/quantumblue-cli/blob/main/docs/LEGAL_COMPLIANCE_CHECKLIST.md" target="_blank" rel="noopener" className="hover:text-blue-400 transition-colors">§65B Compliance</a></li>
                <li><a href="https://github.com/psycho-prince/quantumblue-cli/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener" className="hover:text-blue-400 transition-colors">Contributing</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-white font-bold text-sm tracking-tight uppercase">Specifications</h4>
              <ul className="space-y-3 text-zinc-500 text-sm">
                <li><span className="hover:text-blue-400 transition-colors">NIST FIPS 204 (ML-DSA-65)</span></li>
                <li><span className="hover:text-blue-400 transition-colors">NIST FIPS 203 (ML-KEM-768)</span></li>
                <li><span className="hover:text-blue-400 transition-colors">IETF RFC 3161 Timestamping</span></li>
                <li><span className="hover:text-blue-400 transition-colors">Indian Evidence Act §65B(4)</span></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-white font-bold text-sm tracking-tight uppercase">Project</h4>
              <ul className="space-y-3 text-zinc-500 text-sm">
                <li><a href="https://github.com/psycho-prince/quantumblue-cli/blob/main/LICENSE" target="_blank" rel="noopener" className="hover:text-blue-400 transition-colors">License (MIT)</a></li>
                <li><a href="https://github.com/psycho-prince/quantumblue-cli/blob/main/SECURITY.md" target="_blank" rel="noopener" className="hover:text-blue-400 transition-colors">Security Policy</a></li>
                <li><a href="https://github.com/psycho-prince/quantumblue-cli/blob/main/CHANGELOG.md" target="_blank" rel="noopener" className="hover:text-blue-400 transition-colors">Changelog</a></li>
                <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
              &copy; 2026 Quantum Blue &mdash; a project by Prince T. Philip
            </div>
            <div className="flex gap-4 items-center">
                 <div className="opacity-[0.02] hover:opacity-10 transition-opacity cursor-default select-none" title="Novus Ordo Seclorum">
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M12 3L2 21h20L12 3z" />
                     <circle cx="12" cy="13" r="3" />
                     <circle cx="12" cy="13" r="0.5" fill="currentColor" />
                   </svg>
                 </div>
                 <span className="p-2 text-zinc-600 hover:text-blue-400 transition-all cursor-default select-none text-xs" title="Protected: Hamsa Hand & Star of David">🪬 ✡</span>
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
