"use client";

import { useState, useEffect, useRef } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { ShieldCheck, Key, Trash, RefreshCw, FileText, Copy, Terminal, Send, Sparkles, Globe as GlobeIcon, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe } from "@/components/Globe";
import { BackgroundBeams } from "@/components/BackgroundBeams";
import { EncryptedText } from "@/components/EncryptedText";
import { cn } from "@/lib/utils";

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
  
  // AI Agent State
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Agentic Intelligence Active. How can I assist with your Sovereign Protocol operations?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setIsTyping(true);

    // Mock AI Response
    setTimeout(() => {
      let response = "I've analyzed the request. Based on current lattice geometry, your assets are 100% quantum-secure.";
      if (userMsg.toLowerCase().includes("risk")) {
        response = "Credit Risk Analysis: NBFC sector exposure is currently balanced. Predictive models suggest a 2.4% shift in PD for automotive portfolios next quarter.";
      } else if (userMsg.toLowerCase().includes("seal")) {
        response = "Initializing remote sealing protocol. Assets in the registry will be notarized with ML-DSA-87 signatures momentarily.";
      }
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  if (!user || loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-3xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center animate-bounce">
          <ShieldCheck className="w-8 h-8 text-blue-500" />
        </div>
        <span className="text-xs font-black uppercase tracking-[0.4em] text-blue-500/50">Initializing Quantum Workspace...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white pt-32 pb-20 px-6 relative overflow-hidden">
      <BackgroundBeams />
      
      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Spatial Header */}
        <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-10 border-b border-white/5 pb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-blue-400 font-black text-[10px] uppercase tracking-[0.3em]">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Sovereign Protocol v2.6.4 Active
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase leading-none">
              Intelligence <span className="text-blue-500 italic">Hub.</span>
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
               <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Operator</span>
               <span className="text-sm font-bold text-white">{user.emailAddresses[0].emailAddress}</span>
            </div>
            <div className="p-1 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl">
              <UserButton />
            </div>
          </div>
        </header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(300px,auto)]">
          
          {/* Main Analytics Globe - Span 8 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-8 glass-vault rounded-[2.5rem] p-8 overflow-hidden relative flex flex-col justify-between"
          >
            <div className="relative z-20">
              <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-blue-400 mb-2">
                 <GlobeIcon className="w-4 h-4" /> Global Traffic Matrix
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tighter">Real-time <br />Geospatial Flow</h3>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
              <Globe className="translate-y-20 scale-125" />
            </div>

            <div className="relative z-20 grid grid-cols-3 gap-4 pt-40">
               {[
                 { label: "Active Nodes", value: "1,248" },
                 { label: "Latency", value: "12ms" },
                 { label: "Integrity", value: "100%" }
               ].map(stat => (
                 <div key={stat.label} className="bg-white/5 border border-white/5 rounded-2xl p-4 backdrop-blur-md">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-xl font-black text-white">{stat.value}</p>
                 </div>
               ))}
            </div>
          </motion.div>

          {/* AI Agent Interface - Span 4 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-4 glass-vault rounded-[2.5rem] p-8 flex flex-col gap-6 relative overflow-hidden"
          >
            <div className="flex items-center justify-between relative z-10">
              <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-blue-400" /> Analyst Agent
              </h3>
              <div className="px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-[8px] font-black text-blue-400 uppercase tracking-widest">
                Gemini 3.1 Pro
              </div>
            </div>

            <div 
              ref={scrollRef}
              className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar relative z-10"
            >
              <AnimatePresence>
                {messages.map((m, i) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={i} 
                    className={cn(
                      "p-4 rounded-2xl text-[11px] leading-relaxed",
                      m.role === "assistant" 
                        ? "bg-white/5 border border-white/5 text-zinc-300 mr-8" 
                        : "bg-blue-600/10 border border-blue-600/20 text-blue-100 ml-8"
                    )}
                  >
                    {m.content}
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping && (
                <div className="flex gap-1 ml-2">
                   <div className="w-1 h-1 rounded-full bg-blue-500 animate-bounce" />
                   <div className="w-1 h-1 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                   <div className="w-1 h-1 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="relative z-10">
              <input 
                type="text"
                placeholder="PROMPT AGENT..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-2xl py-3 px-5 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-blue-500/40 transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-zinc-600 hover:text-blue-400">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>

          {/* Token Management - Span 4 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-4 glass-vault rounded-[2.5rem] p-8 flex flex-col gap-8"
          >
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                  <Key className="w-5 h-5 text-amber-500" /> Sovereign Keys
                </h3>
                <span className="text-[9px] font-black text-zinc-500 bg-white/5 border border-white/5 px-3 py-1 rounded-full">
                  FIPS 203 COMPLIANT
                </span>
             </div>

             <form onSubmit={handleCreateKey} className="space-y-3">
                <input
                  type="text"
                  placeholder="NEW TOKEN IDENTITY..."
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 px-5 text-[10px] font-mono text-blue-400 placeholder:text-zinc-800 focus:outline-none"
                />
                <button 
                  type="submit"
                  disabled={!newKeyName}
                  className="w-full bg-white text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all disabled:opacity-10"
                >
                  Issue Notary Token
                </button>
             </form>

             <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar">
                {keys.map(k => (
                  <div key={k.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-white/10 transition-all">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">{k.name}</span>
                      <button onClick={() => handleDeleteKey(k.id)} className="text-zinc-700 hover:text-red-500 transition-colors">
                        <Trash className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="bg-black/40 rounded-xl p-2 flex items-center justify-between">
                       <code className="text-[9px] font-mono text-blue-400/60 truncate mr-4">{k.key}</code>
                       <button onClick={() => navigator.clipboard.writeText(k.key)} className="text-zinc-600 hover:text-white">
                         <Copy className="w-3 h-3" />
                       </button>
                    </div>
                  </div>
                ))}
             </div>
          </motion.div>

          {/* Asset Registry - Span 8 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-8 glass-vault rounded-[2.5rem] p-8 flex flex-col gap-8 relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-4">
                  <FileText className="w-7 h-7 text-blue-500" /> Cryptographic Ledger
                </h3>
                <p className="text-[10px] font-bold text-zinc-500 mt-1 uppercase tracking-[0.2em]">Post-Quantum Notarization Stream</p>
              </div>
              <button 
                onClick={fetchAssets}
                className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white bg-white/5 px-5 py-3 rounded-2xl border border-white/5 transition-all"
              >
                <RefreshCw className="w-3 h-3" /> Re-sync
              </button>
            </div>

            <div className="flex-1 bg-black/40 rounded-[2rem] border border-white/5 overflow-hidden backdrop-blur-3xl relative z-10">
              {assets.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-white/[0.02] border-b border-white/5 text-zinc-600 text-[9px] uppercase tracking-[0.3em] font-black">
                        <th className="px-8 py-5">Asset Artifact</th>
                        <th className="px-8 py-5">ML-DSA-87 Signature (3,309 Bytes)</th>
                        <th className="px-8 py-5">Verification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {assets.map((a) => (
                        <tr key={a.id} className="group hover:bg-white/[0.01] transition-colors">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center">
                                <Zap className="w-4 h-4 text-blue-500" />
                              </div>
                              <span className="font-mono text-zinc-200 text-xs font-bold">{a.filename}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="font-mono text-blue-400/40 text-[9px] truncate max-w-[250px] bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                              <EncryptedText text={a.signatureHash} />
                            </div>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Validated</span>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] opacity-20">
                   <Terminal className="w-12 h-12 text-zinc-700 mb-6" />
                   <span className="text-[10px] font-black uppercase tracking-[0.4em]">No Live Stream</span>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

