"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

export function ConnectorsClient({ hasGithub }: { hasGithub: boolean }) {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
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
    } catch (err: any) {
      alert(err.message);
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

      {result && (
        <div className="mt-4 p-4 bg-green-900/20 border border-green-800 rounded text-sm text-green-200">
          <p>Scan complete!</p>
          <p>Discovered {result.assets?.length || 0} assets and {result.edges?.length || 0} relationships.</p>
        </div>
      )}
    </form>
  );
}

export function AWSConnectorsClient({ hasAws }: { hasAws: boolean }) {
  const [roleArn, setRoleArn] = useState("");
  const [externalId, setExternalId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { getToken } = useAuth();

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAws) {
      alert("Please upgrade to the Business plan to access the AWS connector.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const authToken = await getToken();
      const res = await fetch("/api/connectors/aws/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify({ roleArn, externalId, regions: ["ap-south-1"] })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Scan failed");
      }
      setResult(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleScan} className="space-y-4 mt-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">IAM Role ARN</label>
          <input 
            type="text" 
            value={roleArn}
            onChange={e => setRoleArn(e.target.value)}
            disabled={!hasAws || loading}
            placeholder="arn:aws:iam::123456789012:role/QuantumBlueAudit"
            className="w-full bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">External ID</label>
          <input 
            type="text" 
            value={externalId}
            onChange={e => setExternalId(e.target.value)}
            disabled={!hasAws || loading}
            placeholder="e.g. org-123"
            className="w-full bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-white"
            required
          />
        </div>
      </div>
      <button 
        type="submit" 
        disabled={!hasAws || loading}
        className="bg-[#f90] text-black px-4 py-2 rounded font-medium disabled:opacity-50"
      >
        {loading ? "Assuming Role..." : "Run AWS Discovery"}
      </button>

      {result && (
        <div className="mt-4 p-4 bg-green-900/20 border border-green-800 rounded text-sm text-green-200">
          <p>Scan complete!</p>
          <p>Discovered {result.assets?.length || 0} assets and {result.edges?.length || 0} relationships.</p>
        </div>
      )}
    </form>
  );
}
