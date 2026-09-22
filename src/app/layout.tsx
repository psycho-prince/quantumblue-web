import { Metadata } from "next";
import { ShieldCheck, Globe, Lock, Activity } from "lucide-react";
import Link from "next/link";
import { ClerkProvider } from '@clerk/nextjs';
import { Navbar } from "@/components/Navbar";
import { CookieBanner } from "@/components/CookieBanner";
import { Inter, JetBrains_Mono, Fira_Code, Plus_Jakarta_Sans } from "next/font/google";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-fira-code" });
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-plus-jakarta-sans" });

export const metadata: Metadata = {
  title: "Quantum Blue — Quantum-Safe Evidence & Security Platform",
  description: "Open-source Go CLI for hybrid post-quantum signing (ML-DSA-65 + Ed25519), RFC 3161 trusted timestamping, BSA §63 electronic evidence workflows, cryptographic evidence integrity and chain-of-custody verification, CBOM generation, and PQC risk scanning. Designed for security researchers, compliance teams, and organizations in India.",
  keywords: ["post-quantum cryptography", "ML-DSA-65", "ML-KEM-768", "FIPS 204", "FIPS 203", "RFC 3161", "BSA §63", "Bharatiya Sakshya Adhiniyam", "electronic evidence", "chain of custody", "CBOM", "cryptographic bill of materials", "PQC", "quantum-safe", "Ed25519", "hybrid signatures", "India", "Go CLI", "evidence verification"],
  authors: [{ name: "Prince T. Philip" }],
  creator: "Prince T. Philip",
  publisher: "Quantum Blue",
  metadataBase: new URL("https://quantum-blue.in"),
  openGraph: {
    title: "Quantum Blue — Quantum-Safe Evidence & Security Platform",
    description: "Hybrid PQC signing (ML-DSA-65 + Ed25519), RFC 3161 timestamping, BSA §63 evidence workflows, chain-of-custody verification and CBOM generation.",
    type: "website",
    url: "https://quantum-blue.in",
    siteName: "Quantum Blue",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Quantum Blue — Post-Quantum Cryptography, Digital Evidence Integrity and Security Platform",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@quantumblue",
    creator: "@quantumblue",
    title: "Quantum Blue — Quantum-Safe Evidence & Security Platform",
    description: "ML-DSA-65 + Ed25519 hybrid signatures, RFC 3161 timestamping, BSA §63 evidence workflows & CBOM generation.",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    google: "quantum-blue-in-verification-token",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemaOrg = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Quantum Blue CLI",
        applicationCategory: "Security",
        applicationSubCategory: "Cryptography",
        operatingSystem: "Linux, macOS, Windows",
        description: "Open-source Go CLI for post-quantum cryptography (ML-DSA-65, ML-KEM-768), RFC 3161 trusted timestamping, BSA §63 electronic evidence workflows, cryptographic evidence integrity, chain-of-custody verification, and CBOM generation.",
        url: "https://quantum-blue.in",
        downloadUrl: "https://github.com/psycho-prince/quantumblue-cli",
        installUrl: "https://github.com/psycho-prince/quantumblue-cli#installation",
        softwareSuite: "Quantum Blue",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
        },
        license: "https://www.apache.org/licenses/LICENSE-2.0",
        processorRequirements: "x86_64, ARM64",
        provider: {
          "@type": "Organization",
          name: "Quantum Blue",
          url: "https://quantum-blue.in",
          founder: {
            "@type": "Person",
            name: "Prince T. Philip",
            jobTitle: "Founder",
          },
        },
      },
      {
        "@type": "WebSite",
        name: "Quantum Blue",
        alternateName: "Quantum Blue — Quantum-Safe Evidence & Security Platform",
        url: "https://quantum-blue.in",
        description: "Open-source Go CLI and SaaS platform for post-quantum cryptography, digital evidence integrity (BSA §63), security controls, and privacy governance in India.",
        publisher: {
          "@type": "Organization",
          name: "Quantum Blue",
          url: "https://quantum-blue.in",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://quantum-blue.in/search?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebPage",
        "@id": "https://quantum-blue.in/#webpage",
        url: "https://quantum-blue.in/",
        name: "Quantum Blue — Home",
        isPartOf: {
          "@id": "https://quantum-blue.in/#website",
        },
        about: {
          "@id": "https://quantum-blue.in/#softwareapplication",
        },
      },
      {
        "@type": "Organization",
        "@id": "https://quantum-blue.in/#organization",
        name: "Quantum Blue",
        url: "https://quantum-blue.in",
        logo: {
          "@type": "ImageObject",
          url: "https://quantum-blue.in/og-image.png",
        },
        sameAs: [
          "https://github.com/psycho-prince/quantumblue-cli",
          "https://github.com/psycho-prince/quantumblue-web",
        ],
        founder: {
          "@type": "Person",
          name: "Prince T. Philip",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://quantum-blue.in/#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://quantum-blue.in/",
          },
        ],
      },
    ],
  });

  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      <html lang="en" className={clsx(inter.variable, jetbrainsMono.variable, firaCode.variable, plusJakartaSans.variable, "dark scroll-smooth")}>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: schemaOrg }}
          />
        </head>
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
                  <span className="font-bold text-xl tracking-tight text-white font-[family-name:var(--font-plus-jakarta-sans)]">Quantum Blue</span>
                </div>
                <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
                  Open-source Go CLI for hybrid post-quantum signing, trusted timestamping, cryptographic evidence integrity and CBOM generation. Designed for electronic-evidence and security workflows in India.
                </p>
              </div>

              <div className="space-y-6">
                <h4 className="text-white font-bold text-sm tracking-tight uppercase">CLI Tool & Specs</h4>
                <ul className="space-y-3 text-zinc-500 text-sm">
                  <li><a href="https://github.com/psycho-prince/quantumblue-cli" target="_blank" rel="noopener" className="hover:text-blue-400 transition-colors">GitHub Repository</a></li>
                  <li><Link href="/compliance" className="hover:text-blue-400 transition-colors">Compliance & Controls</Link></li>
                  <li><a href="https://github.com/psycho-prince/quantumblue-web" target="_blank" rel="noopener" className="hover:text-blue-400 transition-colors">Web Platform Repo</a></li>
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="text-white font-bold text-sm tracking-tight uppercase">Legal & Regulatory</h4>
                <ul className="space-y-3 text-zinc-500 text-sm">
                  <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-blue-400 transition-colors">User Permission Agreement</Link></li>
                  <li><Link href="/compliance" className="hover:text-blue-400 transition-colors">Compliance & Controls</Link></li>
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="text-white font-bold text-sm tracking-tight uppercase">Project</h4>
                <ul className="space-y-3 text-zinc-500 text-sm">
                  <li><a href="https://github.com/psycho-prince/quantumblue-cli" target="_blank" rel="noopener" className="hover:text-blue-400 transition-colors">License (Apache-2.0)</a></li>
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
                <a href="https://quantum-blue.in" target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-500 hover:text-white transition-all"><Globe className="w-4 h-4" /></a>
                <a href="https://github.com/psycho-prince/quantumblue-cli" target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-500 hover:text-white transition-all"><Lock className="w-4 h-4" /></a>
                <a href="https://github.com/psycho-prince/quantumblue-web" target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-500 hover:text-white transition-all"><Activity className="w-4 h-4" /></a>
              </div>
            </div>
          </footer>

          <CookieBanner />

        </body>
      </html>
    </ClerkProvider>
  );
}
