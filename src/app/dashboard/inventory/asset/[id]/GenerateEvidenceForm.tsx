"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  migrationEventId: string;
}

export default function GenerateEvidenceForm({ migrationEventId }: Props) {
  const router = useRouter();
  const [evidenceType, setEvidenceType] = useState("INTEGRITY_ATTESTATION");
  const [payloadRaw, setPayloadRaw] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdId, setCreatedId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setCreatedId(null);

    let parsed: Record<string, unknown> = {};
    try { parsed = payloadRaw ? JSON.parse(payloadRaw) : {}; } catch {
      setError("Invalid JSON payload — using empty object instead");
      parsed = {};
    }

    try {
      const res = await fetch("/api/evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          migrationEventId,
          evidenceType,
          payload: parsed,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create evidence artifact");
        setLoading(false);
        return;
      }

      setCreatedId(data.id);
      setTimeout(() => router.refresh(), 600);
    } catch {
      setError("Network error — could not reach the evidence API");
    } finally {
      setLoading(false);
    }
  };

  if (createdId) {
    return (
      <div className="glass p-6 border border-accent-blue/30 bg-accent-blue/5">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-accent-blue text-lg font-bold font-mono">✓</span>
          <span className="text-accent-blue font-bold text-sm font-mono uppercase tracking-widest">EVIDENCE_CREATED</span>
        </div>
        <p className="text-white text-sm font-mono mb-1">Evidence artifact generated</p>
        <p className="text-zinc-500 text-xs font-mono">ID: {createdId.slice(0, 8)}... · Type: {evidenceType}</p>
        <p className="text-zinc-500 text-xs font-mono mt-2">
          Verify independently: <a href={`/verify/${createdId}`} className="text-accent-blue hover:underline">/verify/{createdId.slice(0, 8)}...</a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass p-6 border border-border-bright space-y-4">
      <h3 className="text-sm font-bold text-white font-mono uppercase tracking-widest border-b border-border-bright pb-2">
        GENERATE_EVIDENCE
      </h3>

      <div>
        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono mb-1">
          EVIDENCE_TYPE
        </label>
        <select
          value={evidenceType}
          onChange={(e) => setEvidenceType(e.target.value)}
          className="w-full bg-zinc-900 text-white border border-border-bright px-3 py-2 text-xs font-mono rounded focus:outline-none focus:border-accent-blue"
        >
          <option value="INTEGRITY_ATTESTATION">INTEGRITY_ATTESTATION</option>
          <option value="MIGRATION_COMPLETED">MIGRATION_COMPLETED</option>
          <option value="TIMESTAMPED_ATTESTATION">TIMESTAMPED_ATTESTATION</option>
          <option value="SIGNATURE_VERIFICATION">SIGNATURE_VERIFICATION</option>
          <option value="CONFIG_SNAPSHOT">CONFIG_SNAPSHOT</option>
          <option value="CUSTOM">CUSTOM</option>
        </select>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono mb-1">
          PAYLOAD (JSON)
        </label>
        <textarea
          value={payloadRaw}
          onChange={(e) => setPayloadRaw(e.target.value)}
          placeholder='{"keyId": "tlpk-001", "algorithm": "ML-DSA-65", "keySize": 65, "curve": "unused"}'
          rows={4}
          className="w-full bg-zinc-900 text-white border border-border-bright px-3 py-2 text-xs font-mono rounded focus:outline-none focus:border-accent-blue resize-none"
        />
      </div>

      {error && (
        <div className="text-accent-red text-xs font-mono bg-accent-red/10 px-3 py-2 rounded">
          ERROR: {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-accent-blue text-black font-bold text-xs uppercase tracking-widest hover:bg-blue-400 disabled:bg-zinc-800 disabled:text-zinc-600 transition-colors font-mono rounded"
      >
        {loading ? "GENERATING..." : "GENERATE_EVIDENCE"}
      </button>

      <p className="text-[9px] text-zinc-600 font-mono leading-relaxed">
        Evidence is hash-locked at creation (SHA-256), timestamped, and recorded in a custody chain.
        Anyone can verify the artifact at <span className="text-accent-blue">/verify/&lt;id&gt;</span> without authentication.
      </p>
    </form>
  );
}
