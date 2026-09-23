"use client";

import { useState, useEffect } from "react";

export default function PublicVerifyPage({ params }: { params: Promise<{ id: string }> }) {
  const [queryId, setQueryId] = useState("");
  const [result, setResult] = useState<{
    id: string;
    evidenceType: string;
    organization: { name: string };
    contentHash: string;
    computedHash: string;
    integrityOk: boolean;
    signature: { present: boolean; algorithm: string | null } | null;
    timestampedAt: string | null;
    timestampAuthority: string | null;
    timestampOk: boolean;
    custodyOk: boolean;
    verified: boolean;
    overallStatus: string;
    verifiedAt: string | null;
    custodyChain: Array<{ action: string; actor: string; timestamp: string; detail?: string }>;
    beforeState: Record<string, unknown> | null;
    afterState: Record<string, unknown> | null;
    migrationType: string;
    migrationStatus: string;
    bsaCertificateNumber: string | null;
  } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const fetchResult = async (id: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "https://app.quantum-blue.in"}/api/public/verify/${encodeURIComponent(id)}`);
      if (!res.ok) {
        setError(`Evidence not found (HTTP ${res.status}).`);
      } else {
        const data = await res.json();
        setResult({
          id: data.id as string,
          evidenceType: data.evidenceType as string,
          organization: { name: (data.organization as { name: string }).name },
          contentHash: data.contentHash as string,
          computedHash: data.computedHash as string,
          integrityOk: data.integrityOk as boolean,
          signature: data.signature as { present: boolean; algorithm: string | null } | null,
          timestampedAt: data.timestampedAt as string | null,
          timestampAuthority: data.timestampAuthority as string | null,
          timestampOk: data.timestampOk as boolean,
          custodyOk: data.custodyOk as boolean,
          verified: data.verified as boolean,
          overallStatus: data.overallStatus as string,
          verifiedAt: data.verifiedAt as string | null,
          custodyChain: (data.custodyChain as Array<{ action: string; actor: string; timestamp: string; detail?: string }>) || [],
          beforeState: (data.migrationEvent as { beforeState: Record<string, unknown> } | null)?.beforeState || null,
          afterState: (data.migrationEvent as { afterState: Record<string, unknown> } | null)?.afterState || null,
          migrationType: (data.migrationEvent as { migrationType: string } | null)?.migrationType || "",
          migrationStatus: (data.migrationEvent as { status: string } | null)?.status || "",
          bsaCertificateNumber: data.bsaCertificateNumber as string | null,
        });
      }
    } catch {
      setError("Unable to reach verification service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    params.then((p) => {
      if (p.id) {
        setQueryId(p.id);
        fetchResult(p.id);
      }
    });
  }, [params]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (queryId.trim()) fetchResult(queryId.trim());
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <span className="text-accent-blue font-bold text-[10px] uppercase tracking-[0.2em] block font-mono">PUBLIC_VERIFICATION</span>
          <h1 className="text-3xl font-bold font-mono tracking-tight text-white mt-4">Verify Evidence Integrity</h1>
          <p className="text-zinc-500 text-sm font-mono mt-3 max-w-xl mx-auto">
            Enter an Evidence ID to independently verify cryptographic integrity, signature validity, timestamp authenticity, and chain-of-custody continuity.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-3 px-4 py-3 bg-zinc-900 border border-border-bright rounded-full max-w-lg mx-auto mb-8">
          <span className="text-zinc-500 text-xs font-mono">Evidence ID:</span>
          <input
            type="text"
            value={queryId}
            onChange={(e) => setQueryId(e.target.value)}
            placeholder="qb-ev-01HZ..."
            className="bg-transparent border-none text-white font-mono text-sm placeholder:text-zinc-600 outline-none flex-1 text-center"
          />
          <button
            type="submit"
            disabled={loading || !queryId.trim()}
            className="px-4 py-2 bg-accent-blue text-black font-bold text-xs uppercase tracking-widest hover:bg-blue-400 transition-colors font-mono rounded-full disabled:opacity-40"
          >
            {loading ? "VERIFYING..." : "VERIFY"}
          </button>
        </form>

        {error && (
          <div className="p-4 bg-accent-red/10 border border-accent-red/30 rounded-lg mb-8 text-center">
            <div className="text-accent-red text-sm font-mono">{error}</div>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <div className={`p-8 rounded-lg border text-center ${
              result.overallStatus === "VERIFIED" ? "bg-accent-green/5 border-accent-green/30" :
              result.overallStatus === "FAILED" ? "bg-accent-red/5 border-accent-red/30" : "bg-zinc-900/50 border-border-bright"
            }`}>
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">OVERALL_STATUS</div>
              <div className={`text-4xl font-bold font-mono tracking-wider ${
                result.overallStatus === "VERIFIED" ? "text-accent-green" :
                result.overallStatus === "FAILED" ? "text-accent-red" : "text-zinc-400"
              }`}>
                {result.overallStatus}
              </div>
              <div className="text-zinc-500 text-xs font-mono mt-2">Evidence {result.id}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-black border border-border-bright">
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">EVIDENCE_TYPE</div>
                <div className="text-white font-mono">{result.evidenceType}</div>
              </div>
              <div className="p-6 bg-black border border-border-bright">
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">ORGANIZATION</div>
                <div className="text-white font-mono">{result.organization.name}</div>
              </div>
              <div className="p-6 bg-black border border-border-bright">
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">CONTENT_HASH</div>
                <pre className="text-xs font-mono text-zinc-400 break-all mt-1">{result.contentHash}</pre>
              </div>
              <div className="p-6 bg-black border border-border-bright">
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">COMPUTED_HASH</div>
                <pre className="text-xs font-mono text-zinc-400 break-all mt-1">{result.computedHash}</pre>
              </div>
            </div>

            <div className="glass p-6 border border-border-bright">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-widest mb-4">INTEGRITY_CHECKS</h3>
              <div className="space-y-3">
                {[
                  { label: "Content Integrity", ok: result.integrityOk, detail: result.integrityOk ? "Hash matches — payload unmodified" : "Hash mismatch — evidence may have been tampered with" },
                  { label: "Signature", ok: result.signature?.present ? (result.signature.algorithm ? true : false) : null, detail: result.signature ? (result.signature.algorithm ? `Present (${result.signature.algorithm})` : "Present, algorithm unknown") : "No signature attached" },
                  { label: "Timestamp", ok: result.timestampOk, detail: result.timestampOk ? `Trusted time: ${result.timestampAuthority || "unknown"}` : "No timestamp" },
                  { label: "Chain of Custody", ok: result.custodyOk, detail: result.custodyOk ? `${result.custodyChain.length} custody events recorded` : "No custody chain" },
                  { label: "BSA §63 Certificate", ok: result.bsaCertificateNumber ? true : false, detail: result.bsaCertificateNumber ? `Certificate #${result.bsaCertificateNumber}` : "No certificate attached" },
                ].map((check) => (
                  <div key={check.label} className="flex items-start gap-3 pb-3 border-b border-border-bright/30 last:border-0">
                    <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                      check.ok === true ? "bg-accent-green/20" : check.ok === false ? "bg-accent-red/20" : "bg-zinc-800"
                    }`}>
                      {check.ok === true ? (
                        <svg className="w-3 h-3 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      ) : check.ok === false ? (
                        <svg className="w-3 h-3 text-accent-red" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                      ) : (
                        <div className="w-2 h-2 bg-zinc-600 rounded-full" />
                      )}
                    </div>
                    <div>
                      <div className={`text-sm font-mono ${check.ok === true ? "text-white" : check.ok === false ? "text-accent-red" : "text-zinc-500"}`}>{check.label}</div>
                      <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{check.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {result.custodyChain.length > 0 && (
              <div className="glass p-6 border border-border-bright">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-widest mb-4">CHAIN_OF_CUSTODY</h3>
                <div className="space-y-2">
                  {result.custodyChain.slice().reverse().map((entry, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-zinc-900/30 rounded border border-border-bright/30">
                      <div className="text-accent-blue text-xs font-bold font-mono mt-0.5">{entry.action}</div>
                      <div>
                        <div className="text-xs text-zinc-400 font-mono">{entry.actor}</div>
                        <div className="text-[9px] text-zinc-600 font-mono">{entry.timestamp}</div>
                        {entry.detail && <div className="text-[9px] text-zinc-600 font-mono mt-0.5">{entry.detail}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(result.beforeState || result.afterState) && (
              <div className="glass p-6 border border-border-bright">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-widest mb-4">MIGRATION_EVENT</h3>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between"><span className="text-zinc-500">Type</span><span className="text-white">{result.migrationType || "—"}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Status</span><span className="text-white">{result.migrationStatus || "—"}</span></div>
                  {result.beforeState && (
                    <div className="pt-2 border-t border-border-bright/30">
                      <div className="text-zinc-500 uppercase tracking-widest text-[10px] mb-1">BEFORE</div>
                      <pre className="text-[9px] text-zinc-400 font-mono whitespace-pre-wrap">{JSON.stringify(result.beforeState, null, 2)}</pre>
                    </div>
                  )}
                  {result.afterState && (
                    <div className="pt-2 border-t border-border-bright/30">
                      <div className="text-zinc-500 uppercase tracking-widest text-[10px] mb-1">AFTER</div>
                      <pre className="text-[9px] text-zinc-400 font-mono whitespace-pre-wrap">{JSON.stringify(result.afterState, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {result.verifiedAt && (
              <div className="text-center text-xs text-zinc-500 font-mono">
                Verified on {new Date(result.verifiedAt).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </div>
            )}
          </div>
        )}

        <p className="text-[9px] text-zinc-700 font-mono mt-8 text-center">
          Evidence IDs are shared by the organization that created them. Contact the evidence owner for the ID.
        </p>
      </div>
    </div>
  );
}
