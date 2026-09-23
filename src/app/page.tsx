import { Hero } from "@/components/Hero";
import { BentoGrid } from "@/components/BentoGrid";
import { Stats } from "@/components/Stats";
import { TrustBanner } from "@/components/TrustBanner";
import { HowItWorks } from "@/components/HowItWorks";
import { CryptoTests } from "@/components/CryptoTests";
import { Pillars } from "@/components/Pillars";
import { EvidenceFunnel } from "@/components/EvidenceFunnel";
import { ComplianceSection } from "@/components/ComplianceSection";
import { VerificationSection } from "@/components/VerificationSection";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="relative">
      <Hero />
      <TrustBanner />
      <BentoGrid />
      <CryptoTests />
      <Pillars />
      <EvidenceFunnel />
      <HowItWorks />
      <ComplianceSection />
      <VerificationSection />
      <Stats />
    </div>
  );
}
