"use client";

import { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { ShieldCheck, Key, Trash, RefreshCw, FileText, Copy, Terminal, Plus, Clock, Activity } from "lucide-react";
import { motion } from "framer-motion";

type ApiKey = {
  id: string;
  name: string;
  key: string;
  createdAt: string;
};

type Asset = {
  id: string;
  filename: string;
  signatureHash: string;
  createdAt: string;
};

export default function Dashboard() {
  const { user } = useUser();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchKeys = async () => {
    const res = await fetch("/api/keys");
    if (res.ok) {
      const data = await res.json();
      setKeys(data);
    }
  };

  const fetchAssets = async () => {
    const res = await fetch("/api/assets");
    if (res.ok) {
      const data = await res.json();
      setAssets(data);
    }
  };

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchKeys();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchAssets();
      setLoading(false);
    }
  }, [user]);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName) return;
    const res = await fetch("/api/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newKeyName }),
    });
    if (res.ok) {
      setNewKeyName("");
      fetchKeys();
    }
  };

  const handleDeleteKey = async (id: string) => {
    const res = await fetch("/api/keys", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      fetchKeys();
      fetchAssets();
    }
  };

  if (!user || loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-3xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center animate-bounce">
          <ShieldCheck className="w-8 h-8 text-blue-500" />
        </div>
        <span className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Initializing Workspace...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white pt-40 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* Spatial Header */}
        <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-10 border-b border-white/5 pb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-blue-500 font-black text-[10px] uppercase tracking-[0.3em]">
              <Activity className="w-4 h-4" />
              Real-time Notary Active
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase leading-none">Workspace.</h1>
            <p className="text-zinc-500 font-medium max-w-xl text-lg">Manage your cryptographic keys and monitor the ledger of post-quantum sealed assets.</p>
          </div>
          <div className="flex items-center gap-4 bg-white/[0.03] border border-white/10 py-3 px-6 rounded-[2rem] backdrop-blur-3xl">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            <span className="text-zinc-400 font-bold text-xs uppercase tracking-widest">{user.emailAddresses[0].emailAddress}</span>
          </div>
        </header>

        <main className="grid lg:grid-cols-3 gap-8">
          {/* API Keys Portal */}
          <div className="lg:col-span-1 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="liquid-glass p-10 rounded-[3rem] space-y-10"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white flex items-center gap-4">
                  <Key className="w-6 h-6 text-amber-500" /> Auth Tokens
                </h2>
                <span className="text-[10px] font-black text-zinc-600 bg-white/5 px-3 py-1 rounded-full border border-white/10">{keys.length}</span>
              </div>
              
              <form onSubmit={handleCreateKey} className="space-y-4">
                <div className="relative">
                  <Terminal className="w-4 h-4 text-zinc-700 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="TOKEN NAME..."
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-blue-500/50 transition-all text-white placeholder:text-zinc-800"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={!newKeyName}
                  className="w-full bg-white text-black py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all disabled:opacity-20 flex items-center justify-center gap-3"
                >
                  <Plus className="w-4 h-4" /> Issue Token
                </button>
              </form>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {keys.map((k) => (
                  <motion.div 
                    layout
                    key={k.id} 
                    className="group p-6 rounded-[2rem] border border-white/5 bg-black/40 hover:bg-white/[0.02] transition-all relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <span className="font-black text-xs text-white uppercase tracking-widest">{k.name}</span>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-600 mt-2 font-black uppercase tracking-widest">
                          <Clock className="w-3 h-3" /> {new Date(k.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <button onClick={() => handleDeleteKey(k.id)} className="text-zinc-700 hover:text-red-500 transition-colors p-2">
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4 bg-black/60 border border-white/5 rounded-2xl p-2 pl-4">
                      <code className="text-[10px] text-blue-400/80 flex-1 truncate font-mono">{k.key}</code>
                      <button 
                        onClick={() => navigator.clipboard.writeText(k.key)} 
                        className="bg-white/5 hover:bg-white/10 text-zinc-500 hover:text-white p-2.5 rounded-xl transition-all"
                      >
                         <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Asset Registry Portal */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="liquid-glass p-10 rounded-[3rem] min-h-[700px] flex flex-col"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter text-white flex items-center gap-4">
                    <FileText className="w-8 h-8 text-blue-500" /> Asset Registry
                  </h2>
                  <p className="text-sm font-medium text-zinc-500 mt-2 uppercase tracking-widest">Immutable Cryptographic Ledger</p>
                </div>
                <button 
                  onClick={fetchAssets} 
                  className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white bg-white/5 hover:bg-white/10 px-6 py-3 rounded-2xl transition-all border border-white/10"
                >
                  <RefreshCw className="w-4 h-4" /> Sync Registry
                </button>
              </div>

              <div className="flex-1 bg-black/40 rounded-[2.5rem] border border-white/5 overflow-hidden backdrop-blur-3xl">
                {assets.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-white/[0.02] border-b border-white/5 text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-black">
                          <th className="px-8 py-6">Artifact</th>
                          <th className="px-8 py-6">ML-DSA Signature</th>
                          <th className="px-8 py-6">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {assets.map((a) => (
                          <tr key={a.id} className="group hover:bg-white/[0.01] transition-colors">
                            <td className="px-8 py-8">
                              <div className="flex items-center gap-5">
                                <div className="w-10 h-10 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <ShieldCheck className="w-5 h-5 text-blue-500" />
                                </div>
                                <span className="font-mono text-zinc-200 text-sm font-bold">{a.filename}</span>
                              </div>
                            </td>
                            <td className="px-8 py-8">
                              <div className="font-mono text-zinc-600 text-[10px] truncate max-w-[200px] bg-black/40 px-3 py-1 rounded-lg border border-white/5">
                                {a.signatureHash}
                              </div>
                            </td>
                            <td className="px-8 py-8">
                               <div className="flex flex-col gap-1">
                                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Sealed
                                  </span>
                                  <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-tighter">
                                    {new Date(a.createdAt).toLocaleDateString()}
                                  </span>
                               </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-center px-10">
                    <div className="w-24 h-24 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-3xl">
                      <FileText className="w-10 h-10 text-zinc-700" />
                    </div>
                    <h3 className="text-2xl text-white font-black uppercase tracking-tight mb-4">No Sealed Artifacts</h3>
                    <p className="text-zinc-600 font-medium max-w-sm leading-relaxed mb-12">
                      Your decentralized ledger is empty. Authenticate your CLI instance and seal a file to initiate notarization.
                    </p>
                    <div className="bg-black/60 border border-white/10 rounded-2xl p-6 shadow-inner">
                      <code className="text-blue-500 text-xs font-mono font-bold">
                        quantumblue seal --file &lt;target&gt;
                      </code>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
