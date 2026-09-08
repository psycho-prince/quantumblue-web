import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Permission Agreement | Quantum Blue",
  description: "Terms of Service and User Permission Agreement for Quantum Blue.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white font-mono">
          USER PERMISSION AGREEMENT.
        </h1>
        <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">
          Last Updated: September 2026
        </p>
      </div>

      <div className="prose prose-invert prose-zinc max-w-none font-mono text-sm leading-relaxed">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using the Quantum Blue platform, you agree to be bound by this User Permission Agreement and our Privacy Policy. If you do not agree, do not use the services.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          Quantum Blue provides a SaaS platform and API for Post-Quantum Cryptography (PQC) signatures, CBOM generation, and RFC 3161 compliant timestamping intended for legal evidentiary purposes (e.g., Indian Evidence Act §65B(4)).
        </p>

        <h2>3. License and Permissions</h2>
        <p>
          Quantum Blue grants you a limited, non-exclusive, non-transferable license to access and use the platform for your internal business purposes. The platform and its source code are proprietary. You may not reverse-engineer, decompile, or illegally distribute any part of the service.
        </p>

        <h2>4. User Responsibilities</h2>
        <p>
          You are responsible for safeguarding your API keys and Clerk authentication credentials. Quantum Blue relies on the integrity of the data you submit for timestamping. We are not liable for any fraudulent data submitted by users that is subsequently cryptographically signed.
        </p>

        <h2>5. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by applicable law, Quantum Blue and Prince T. Philip shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
        </p>

        <h2>6. Legal Admissibility</h2>
        <p>
          While Quantum Blue structures its outputs to comply with technical requirements for legal admissibility (including FIPS 204/203 and RFC 3161), the ultimate admissibility of any evidence in a court of law depends on the jurisdiction and presiding legal authority. Quantum Blue does not provide legal advice.
        </p>
      </div>
    </div>
  );
}
