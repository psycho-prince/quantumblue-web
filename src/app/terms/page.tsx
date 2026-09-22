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

        <h2>2. Age Requirement (COPPA Compliance)</h2>
        <p>
          You must be at least 18 years of age to use this service. By registering an account, you represent and warrant that you are 18 or older. We do not knowingly collect personal information from anyone under 13.
        </p>

        <h2>3. Description of Service</h2>
        <p>
          Quantum Blue provides a SaaS platform and API for Post-Quantum Cryptography (PQC) signatures, CBOM generation, and RFC 3161 compliant timestamping intended for legal evidentiary purposes (e.g., Bharatiya Sakshya Adhiniyam, 2023 — Section 63).
        </p>

        <h2>4. License and Permissions</h2>
        <p>
          Quantum Blue grants you a limited, non-exclusive, non-transferable license to access and use the platform for your internal business purposes. The platform and its source code are proprietary. You may not reverse-engineer, decompile, or illegally distribute any part of the service.
        </p>

        <h2>5. User Responsibilities</h2>
        <p>
          You are responsible for safeguarding your API keys and Clerk authentication credentials. Quantum Blue relies on the integrity of the data you submit for timestamping. We are not liable for any fraudulent data submitted by users that is subsequently cryptographically signed.
        </p>

        <h2>6. DMCA / Copyright Policy</h2>
        <p>
          Quantum Blue respects the intellectual property rights of others. In accordance with the Digital Millennium Copyright Act (DMCA), we have a designated agent to receive notices of claimed infringement. If you believe your copyright has been violated on our platform, please send a written notice to our DMCA Agent at legal@quantum-blue.in including:
          (a) An electronic or physical signature of the authorized person;
          (b) A description of the copyrighted work;
          (c) The location of the material on our site;
          (d) Your contact information;
          (e) A good-faith statement of unauthorized use; and
          (f) A statement under penalty of perjury that the information is accurate.
        </p>

        <h2>7. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by applicable law, Quantum Blue and Prince T. Philip shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
        </p>

        <h2>8. Legal Admissibility</h2>
        <p>
          While Quantum Blue structures its outputs to comply with technical requirements for legal admissibility (including FIPS 204/203 and RFC 3161), the ultimate admissibility of any evidence in a court of law depends on the jurisdiction and presiding legal authority. Quantum Blue does not provide legal advice.
        </p>
      </div>
    </div>
  );
}
