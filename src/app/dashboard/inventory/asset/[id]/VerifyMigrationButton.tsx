"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  migrationId: string;
}

export default function VerifyMigrationButton({ migrationId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error" | "waiting"; text: string } | null>(null);

  const handleVerify = async () => {
    setLoading(true);
    setMessage(null);

    try {
      // 1. Fetch evidence for this migration
      const evRes = await fetch(`/api/evidence?migrationEventId=${migrationId}&limit=100`);
      const evData = await evRes.json();
      const evidence = evData.evidence || [];

      if (evidence.length === 0) {
        setMessage({ kind: "error", text: "No evidence artifacts found for this migration. Generate evidence before verifying." });
        setLoading(false);
        return;
      }

      // 2. Verify each evidence artifact via the public endpoint
      const results = await Promise.all(
        evidence.map(async (e: { id: string; verified: boolean }) => {
          if (e.verified) return { id: e.id, status: "already_verified" };
          const vRes = await fetch(`/api/public/verify/${e.id}`);
          if (!vRes.ok) return { id: e.id, status: "failed", error: await vRes.text() };
          const vData = await vRes.json();
          return { id: e.id, status: vData.overallStatus === "VERIFIED" ? "verified" : "failed", detail: vData };
        })
      );

      const failed = results.filter((r) => r.status === "failed");
      const verified = results.filter((r) => r.status === "verified" || r.status === "already_verified");

      if (failed.length > 0 && verified.length === 0) {
        setMessage({ kind: "error", text: `Verification failed for ${failed.length} evidence artifact(s). Check each at /verify/&lt;id&gt;.` });
        setLoading(false);
        return;
      }

      setMessage({
        kind: "ok",
        text: `Verification complete: ${verified.length} artifact(s) verified${failed.length > 0 ? `, ${failed.length} failed` : ""}.`,
      });
      router.refresh();
    } catch {
      setMessage({ kind: "error", text: "Network error during verification — could not reach the verification endpoint." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {message && (
        <div className={`text-xs font-mono mb-3 px-3 py-2 rounded border ${
          message.kind === "ok" ? "text-accent-green bg-accent-green/10 border-accent-green/30" :
          message.kind === "error" ? "text-accent-red bg-accent-red/10 border-accent-red/30" :
          "text-zinc-500 bg-zinc-800 border-zinc-700"
        }`}>
          {message.text}
        </div>
      )}
      <button
        onClick={handleVerify}
        disabled={loading}
        className="px-6 py-3 bg-accent-green text-black font-bold text-xs uppercase tracking-widest hover:bg-green-400 disabled:bg-zinc-800 disabled:text-zinc-600 transition-colors font-mono rounded"
      >
        {loading ? "VERIFYING..." : "VERIFY_MIGRATION"}
      </button>
      <p className="text-[9px] text-zinc-600 font-mono mt-2 leading-relaxed">
        Calls the public verification endpoint for each evidence artifact attached to this migration.
        No authentication required — anyone can verify independently.
      </p>
    </div>
  );
}
