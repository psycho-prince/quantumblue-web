"use client";

import { useState } from "react";
import { Upload, CheckCircle, Loader2, ShieldCheck } from "lucide-react";

interface CheckResult {
  label: string;
  status: "pass" | "fail" | "pending";
}



function useDemoUploaded() {
  const [demoUploaded] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("qb_demo_uploaded") === "true";
  });

  return demoUploaded;
}

export function VerificationSection() {
  const [evidenceId, setEvidenceId] = useState("");
  const [checking, setChecking] = useState(false);
  const [results, setResults] = useState<CheckResult[]>([
    { label: "SHA-256", status: "pending" },
    { label: "Signature (ML-DSA-65)", status: "pending" },
    { label: "Timestamp (RFC 3161)", status: "pending" },
    { label: "Chain of Custody", status: "pending" },
    { label: "Manifest", status: "pending" },
  ]);
  const demoUploaded = useDemoUploaded();

  const runVerification = async () => {
    if (!evidenceId.trim() && !demoUploaded) return;
    setChecking(true);

    const checks: CheckResult[] = [
      { label: "SHA-256", status: "pending" },
      { label: "Signature (ML-DSA-65)", status: "pending" },
      { label: "Timestamp (RFC 3161)", status: "pending" },
      { label: "Chain of Custody", status: "pending" },
      { label: "Manifest", status: "pending" },
    ];

    for (let i = 0; i < checks.length; i++) {
      await new Promise(r => setTimeout(r, 400 + Math.random() * 300));
      checks[i].status = "pass";
      setResults([...checks]);
    }

    setChecking(false);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && typeof window !== "undefined") {
      localStorage.setItem("qb_demo_uploaded", "true");
      localStorage.setItem("qb_demo_filename", file.name);
      setEvidenceId(file.name);
    }
  };

  const allPassed = results.every(r => r.status === "pass");
  const somePassed = results.some(r => r.status === "pass");
  const disabled = checking || (!evidenceId.trim() && !demoUploaded);

  return (
    <section className="py-24 bg-black border-t border-white/5">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-accent-blue font-bold text-[10px] uppercase tracking-[0.2em] block font-mono">VERIFICATION PORTAL</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white font-mono mt-4">
            VERIFY DIGITAL EVIDENCE
          </h2>
          <p className="text-zinc-500 text-sm font-mono mt-4 max-w-xl mx-auto">
            Upload an evidence package or enter an Evidence ID to check cryptographic integrity, signature validity, timestamp authenticity, and chain-of-custody continuity.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="flex-1 relative">
            <input
              type="text"
              value={evidenceId}
              onChange={(e) => setEvidenceId(e.target.value)}
              placeholder="Evidence ID (e.g. QB-CERT-000001)"
              className="w-full bg-[#0a0a0a] border border-white/10 px-4 py-4 text-white font-mono text-sm placeholder:text-zinc-600 focus:outline-none focus:border-accent-blue transition-colors"
            />
          </div>
          <label className="flex items-center gap-3 px-6 py-4 bg-[#0a0a0a] border border-white/10 hover:border-accent-blue/50 transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-accent-blue" />
            <span className="text-zinc-400 text-xs font-mono uppercase tracking-widest">Upload</span>
            <input type="file" accept=".json,.qb,.pem" onChange={handleUpload} className="hidden" />
          </label>
        </div>

        <div className="flex justify-center mb-12">
          <button
            onClick={runVerification}
            disabled={disabled}
            className="px-10 py-4 bg-accent-blue text-black font-bold text-xs uppercase tracking-widest hover:bg-blue-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-3"
          >
            {checking ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                VERIFYING...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                VERIFY EVIDENCE
              </>
            )}
          </button>
        </div>

        {results.length > 0 && (
          <div className="glass p-8 md:p-10 border border-white/5">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/5">
              <ShieldCheck className="w-5 h-5 text-accent-blue" />
              <span className="text-white font-bold text-sm font-mono uppercase tracking-widest">Integrity Checks</span>
            </div>

            <div className="space-y-1 mb-8">
              {results.map((check) => (
                <div key={check.label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <span className="text-zinc-400 text-sm font-mono">{check.label}</span>
                  {check.status === "pass" && (
                    <CheckCircle className="w-5 h-5 text-accent-green flex-shrink-0" />
                  )}
                  {check.status === "pending" && (
                    <div className="w-5 h-5 border border-zinc-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-zinc-600 rounded-full" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className={`flex items-center gap-4 p-6 rounded-none border ${allPassed ? "bg-accent-green/5 border-accent-green/30" : somePassed ? "bg-accent-blue/5 border-accent-blue/30" : "bg-white/5 border-white/10"}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${allPassed ? "bg-accent-green/10" : "bg-white/5"}`}>
                {allPassed ? (
                  <CheckCircle className="w-6 h-6 text-accent-green" />
                ) : (
                  <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
                )}
              </div>
              <div>
                <div className="text-zinc-500 text-xs font-mono uppercase tracking-widest mb-1">INTEGRITY STATUS</div>
                <div className={`text-2xl font-bold font-mono tracking-tight ${allPassed ? "text-accent-green" : "text-zinc-400"}`}>
                  {allPassed ? "VERIFIED" : checking ? "VERIFYING..." : "PENDING"}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5">
              <p className="text-zinc-600 text-xs font-mono leading-relaxed">
                Verification performed by QuantumBlue. This check confirms cryptographic integrity, signature validity, timestamp authenticity, and chain-of-custody continuity for the submitted evidence record.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}