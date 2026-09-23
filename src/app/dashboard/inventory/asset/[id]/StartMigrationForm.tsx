"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  assetId: string;
  assetName: string;
  assetKind: string;
}

type MigrationType = "PQC_KEY_REPLACE" | "ALGORITHM_UPGRADE" | "HYBRID_DEPLOY" | "KEY_ROTATION" | "CONFIG_CHANGE" | "CUSTOM";

const MIGRATION_TYPES: { value: MigrationType; label: string }[] = [
  { value: "PQC_KEY_REPLACE", label: "PQC_KEY_REPLACE" },
  { value: "ALGORITHM_UPGRADE", label: "ALGORITHM_UPGRADE" },
  { value: "HYBRID_DEPLOY", label: "HYBRID_DEPLOY" },
  { value: "KEY_ROTATION", label: "KEY_ROTATION" },
  { value: "CONFIG_CHANGE", label: "CONFIG_CHANGE" },
  { value: "CUSTOM", label: "CUSTOM" },
];

export default function StartMigrationForm({ assetId, assetName, assetKind }: Props) {
  const router = useRouter();
  const [type, setType] = useState<MigrationType>("PQC_KEY_REPLACE");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successId, setSuccessId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessId(null);

    try {
      const res = await fetch("/api/migrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId,
          migrationType: type,
          description: description || undefined,
          status: "pending",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to start migration");
        setLoading(false);
        return;
      }

      setSuccessId(data.migrationId);
      // Brief delay so user sees the success state, then navigate to the asset page
      setTimeout(() => {
        router.refresh();
      }, 600);
    } catch {
      setError("Network error — could not reach the migration API");
    } finally {
      setLoading(false);
    }
  };

  if (successId) {
    return (
      <div className="glass p-6 border border-accent-green/30 bg-accent-green/5">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-accent-green text-lg font-bold font-mono">✓</span>
          <span className="text-accent-green font-bold text-sm font-mono uppercase tracking-widest">MIGRATION_STARTED</span>
        </div>
        <p className="text-white text-sm font-mono mb-1">Migration event created</p>
        <p className="text-zinc-500 text-xs font-mono">ID: {successId.slice(0, 8)}...</p>
        <p className="text-zinc-500 text-xs font-mono mt-2">Next: generate evidence artifacts and verify.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass p-6 border border-border-bright space-y-4">
      <h3 className="text-sm font-bold text-white font-mono uppercase tracking-widest border-b border-border-bright pb-2">
        START_MIGRATION
      </h3>

      <div>
        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono mb-1">
          MIGRATION_TYPE
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as MigrationType)}
          className="w-full bg-zinc-900 text-white border border-border-bright px-3 py-2 text-xs font-mono rounded focus:outline-none focus:border-accent-blue"
        >
          {MIGRATION_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono mb-1">
          DESCRIPTION (OPTIONAL)
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Replace ECDSA-256 with ML-DSA-65 on API gateway TLS"
          className="w-full bg-zinc-900 text-white border border-border-bright px-3 py-2 text-xs font-mono rounded focus:outline-none focus:border-accent-blue"
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
        {loading ? "SUBMITTING..." : "START_MIGRATION"}
      </button>
    </form>
  );
}
