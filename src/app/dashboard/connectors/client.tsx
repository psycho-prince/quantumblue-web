"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Workflow, Database, ShieldCheck } from "lucide-react";

export function ConnectorsClient({ hasGithub }: { hasGithub: boolean }) {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<unknown>(null);
  const { getToken } = useAuth();

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasGithub) {
      alert("Please upgrade your plan to access the GitHub connector.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const authToken = await getToken();
      // Proxy through Next.js to avoid CORS with Go daemon
      const res = await fetch("/api/connectors/github/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify({ owner, repo, token })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Scan failed");
      }
      setResult(data);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleScan} className="space-y-4 mt-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Owner / Organization</label>
          <input 
            type="text" 
            value={owner}
            onChange={e => setOwner(e.target.value)}
            disabled={!hasGithub || loading}
            placeholder="e.g. psycho-prince"
            className="w-full bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Repository Name</label>
          <input 
            type="text" 
            value={repo}
            onChange={e => setRepo(e.target.value)}
            disabled={!hasGithub || loading}
            placeholder="e.g. quantumblue-cli"
            className="w-full bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-white"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Personal Access Token (Optional)</label>
        <input 
          type="password" 
          value={token}
          onChange={e => setToken(e.target.value)}
          disabled={!hasGithub || loading}
          placeholder="ghp_..."
          className="w-full bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-white"
        />
        <p className="text-xs text-gray-500 mt-1">Required only for private repositories.</p>
      </div>
      <button 
        type="submit" 
        disabled={!hasGithub || loading}
        className="bg-white text-black px-4 py-2 rounded font-medium disabled:opacity-50"
      >
        {loading ? "Scanning..." : "Run GitHub Discovery"}
      </button>

      {(result && (
        <div className="mt-4 p-4 bg-green-900/20 border border-green-800 rounded text-sm text-green-200">
          <p>Scan complete!</p>
          <p>Discovered {(result as unknown as { assets?: unknown[]; edges?: unknown[] }).assets?.length || 0} assets and {(result as unknown as { assets?: unknown[]; edges?: unknown[] }).edges?.length || 0} relationships.</p>
        </div>
      )) as React.ReactNode}
    </form>
  );
}

export function AWSConnectorsClient({ hasAws }: { hasAws: boolean }) {
  const [accounts, setAccounts] = useState<Array<{ id: string; accountId: string; roleArn: string }>>([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [newAccountId, setNewAccountId] = useState("");
  const [newRoleArn, setNewRoleArn] = useState("");
  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  // Fetch registered accounts on mount
  useState(() => {
    fetch("/api/connectors/aws/scan")
      .then(r => r.json())
      .then(setAccounts)
      .catch(() => {});
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAws) return;
    if (!newAccountId || !newRoleArn) {
      setError("Account ID and Role ARN are required.");
      return;
    }
    setError(null);
    setRegistering(true);
    try {
      const authToken = await getToken();
      const res = await fetch("/api/connectors/aws/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify({ accountId: newAccountId, roleArn: newRoleArn }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }
      // Refresh account list
      const accountsRes = await fetch("/api/connectors/aws/scan");
      const accountsData = await accountsRes.json();
      setAccounts(accountsData);
      setSelectedAccountId(newAccountId);
      setNewAccountId("");
      setNewRoleArn("");
      setResult({ message: `Account ${newAccountId} registered. External ID: ${data.externalId}` });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setRegistering(false);
    }
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAws) {
      alert("Please upgrade to the Business plan to access the AWS connector.");
      return;
    }
    if (!selectedAccountId) {
      setError("Please select or register an AWS account first.");
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const authToken = await getToken();
      const res = await fetch("/api/connectors/aws/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify({ accountId: selectedAccountId, regions: ["ap-south-1"] }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Scan failed");
      }
      setResult(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Registered accounts */}
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-2">Registered AWS Accounts</h3>
        {accounts.length === 0 && (
          <p className="text-xs text-gray-600 mb-3">No accounts registered yet. Add one below.</p>
        )}
        <div className="flex flex-wrap gap-2 mb-4">
          {accounts.map((a) => (
            <label
              key={a.id}
              className={`px-3 py-2 rounded-md text-sm border cursor-pointer transition-colors ${
                selectedAccountId === a.accountId
                  ? "bg-amber-900/30 border-amber-700 text-amber-200"
                  : "bg-[#0a0a0a] border-[#333] text-gray-400 hover:border-[#555]"
              }`}
            >
              <input
                type="radio"
                name="aws-account"
                checked={selectedAccountId === a.accountId}
                onChange={() => setSelectedAccountId(a.accountId)}
                disabled={!hasAws || loading}
                className="sr-only"
              />
              {a.accountId}
            </label>
          ))}
        </div>
      </div>

      {/* Register new account */}
      {hasAws && (
        <form onSubmit={handleRegister} className="space-y-3 p-4 bg-[#0a0a0a] border border-[#333] rounded-lg">
          <h3 className="text-sm font-medium text-gray-400">Register AWS Account</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Account ID (12 digits)</label>
              <input
                type="text"
                value={newAccountId}
                onChange={e => setNewAccountId(e.target.value.replace(/\D/g, "").slice(0, 12))}
                disabled={!hasAws || registering}
                placeholder="123456789012"
                className="w-full bg-[#111] border border-[#333] rounded px-3 py-2 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">IAM Role ARN</label>
              <input
                type="text"
                value={newRoleArn}
                onChange={e => setNewRoleArn(e.target.value)}
                disabled={!hasAws || registering}
                placeholder="arn:aws:iam::123456789012:role/QuantumBlueAudit"
                className="w-full bg-[#111] border border-[#333] rounded px-3 py-2 text-white text-sm"
              />
            </div>
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={!hasAws || registering}
            className="text-sm bg-[#f90] text-black px-4 py-2 rounded font-medium disabled:opacity-50"
          >
            {registering ? "Registering..." : "Register Account"}
          </button>
        </form>
      )}

      {/* Scan form */}
      <form onSubmit={handleScan} className="space-y-4 mt-4 p-4 bg-[#0a0a0a] border border-[#333] rounded-lg">
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={!hasAws || !selectedAccountId || loading}
          className="bg-[#f90] text-black px-4 py-2 rounded font-medium disabled:opacity-50 w-full"
        >
          {loading ? "Scanning..." : "Run AWS Discovery"}
        </button>

        {typeof result === "object" && result !== null && (result as unknown as { message?: string }).message ? (
          <div className="p-3 bg-green-900/20 border border-green-800 rounded text-sm text-green-200">
            {(result as unknown as { message?: string }).message}
          </div>
        ) : typeof result === "object" && result !== null ? (
          <div className="p-3 bg-green-900/20 border border-green-800 rounded text-sm text-green-200">
            <p>Scan complete!</p>
            <p>Discovered {(result as unknown as { assets?: unknown[]; edges?: unknown[] }).assets?.length || 0} assets and {(result as unknown as { assets?: unknown[]; edges?: unknown[] }).edges?.length || 0} relationships.</p>
          </div>
        ) : null}
      </form>

      {/* eBPF Runtime Discovery */}
      <div className="bg-[#111] border border-[#222] p-6 rounded-xl mt-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Workflow className="w-6 h-6 text-blue-500" />
              eBPF Runtime Discovery
              <span className="text-xs bg-green-900/50 text-green-200 px-2 py-1 rounded-full border border-green-800">
                Phase 2
              </span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Attach the eBPF sensor to your Linux hosts to observe real cryptographic library calls in production -- OpenSSL, BoringSSL, Java Crypto -- without agents or code changes.
            </p>
          </div>
        </div>
        <p className="text-xs text-blue-300 font-mono leading-relaxed">
          The eBPF sensor builds the Cryptographic Asset Graph from production ground truth. No static guessing. No language-specific agents. Just kernel-level observation of what crypto is actually running. Deploy via DaemonSet on Kubernetes or systemd on bare metal.
        </p>
      </div>

      {/* DSPM Integration */}
      <div className="bg-[#111] border border-[#222] p-6 rounded-xl mt-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Database className="w-6 h-6 text-yellow-500" />
              DSPM Integration
              <span className="text-xs bg-yellow-900/50 text-yellow-200 px-2 py-1 rounded-full border border-yellow-800">
                Phase 4
              </span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Connect QuantumBlue to your Data Security Posture Management tool to automatically ingest data-sensitivity tags and power HNDL prioritization.
            </p>
          </div>
        </div>
        <p className="text-xs text-yellow-300 font-mono leading-relaxed">
          When your DSPM flags a database as containing PII with 10-year compliance retention, QuantumBlue auto-ingests that tag, checks the encryption in use (e.g. AES-128), and elevates the asset to P0 HNDL risk. No manual data classification needed. Risk = Data Sensitivity x Retention x Cryptographic Weakness.
        </p>
      </div>

      {/* Shift-Left CI/CD Guardrail */}
      <div className="bg-[#111] border border-[#222] p-6 rounded-xl mt-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ShieldCheck className="w-6 h-6" />
              Shift-Left CI/CD Guardrail
              <span className="text-xs bg-red-900/50 text-red-200 px-2 py-1 rounded-full border border-red-800">
                Phase 4
              </span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Block pull requests that introduce legacy cryptography -- RSA-2048, ECDSA, SHA-1 -- before they reach production. Available as a GitHub App, GitLab MR integration, and CLI for any CI pipeline.
            </p>
          </div>
        </div>
        <p className="text-xs text-red-300 font-mono leading-relaxed">
          While you're mapping production debt, developers are committing new RSA-2048. The shift-left guardrail stops the bleeding at the source. Phase 4 adds AI Copilot auto-remediation suggestions for flagged PRs. Prevents new cryptographic debt from entering your codebase.
        </p>
      </div>
    </div>
  );
}
