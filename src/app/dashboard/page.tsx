"use client";

import { useState, useEffect, useRef } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ShieldCheck, Key, Trash, RefreshCw, FileText, Copy, Terminal, Send, Sparkles, Globe as GlobeIcon, Zap, Menu, X, ArrowRight, Activity, Cpu, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe } from "@/components/Globe";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  // AI Agent State
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Executive Intelligence active. How can I assist with your security posture today?" }
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
      fetchKeys();
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

    setTimeout(() => {
      let response = "Security audit complete. Asset integrity verified at 100%. No vulnerabilities detected.";
      if (userMsg.toLowerCase().includes("risk")) {
        response = "Market Analysis: Predictive models show stable asset performance. Institutional exposure is within secure thresholds.";
      } else if (userMsg.toLowerCase().includes("seal")) {
        response = "Advanced protection protocol initiated. Notarizing asset registry.";
      }
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  if (!user || loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center animate-pulse">
          <ShieldCheck className="w-8 h-8 text-blue-400" />
        </div>
        <span className="text-sm font-semibold tracking-wider text-zinc-400">Initializing Command Center...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row relative selection:bg-blue-500/30">
      
      {/* Sidebar - SaaS Navigation */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-black border-r border-white/5 transition-transform duration-300 md:relative md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-10">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center transition-all group-hover:bg-blue-500/30">
                <ShieldCheck className="w-5 h-5 text-blue-500" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white font-['Plus_Jakarta_Sans']">Quantum Blue</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-zinc-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1">
            {[
              { id: "overview", label: "Dashboard", icon: Activity },
              { id: "quickstart", label: "Quick Start", icon: Zap },
              { id: "keys", label: "Access Keys", icon: Key },
              { id: "notary", label: "Registry", icon: FileText },
              { id: "intelligence", label: "Security AI", icon: Cpu },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                  activeTab === item.id 
                    ? "bg-white/5 text-white border border-white/10" 
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="pt-6 border-t border-white/5 space-y-4">
             {/* Current Plan Card */}
             <div className="glass p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                   <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Active Plan</span>
                   <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded">Free</span>
                </div>
                <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">Upgrade to Professional for enterprise PQC features.</p>
                <Link href="/pricing" className="block text-[10px] font-bold text-white hover:text-blue-400 transition-colors uppercase tracking-widest">Upgrade Now →</Link>
             </div>

            <div className="flex items-center gap-3 pl-1">
              <UserButton appearance={{ elements: { userButtonAvatarBox: 'w-7 h-7' } }} />
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-semibold truncate text-zinc-300">{user.emailAddresses[0].emailAddress}</span>
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Infrastructure Admin</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-black/80 backdrop-blur-xl z-40">
           <Link href="/" className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-500" />
            <span className="font-bold tracking-tight">Quantum Blue</span>
          </Link>
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-zinc-400">
            <Menu className="w-5 h-5" />
          </button>
        </header>

        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full space-y-10">
          
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div 
                key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
                  <div className="space-y-1">
                    <span className="text-blue-500 font-bold text-[10px] uppercase tracking-[0.2em] block">System Status</span>
                    <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Nodes Healthy
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-8 glass p-8 rounded-[2.5rem] min-h-[400px] flex flex-col relative overflow-hidden group">
                     <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-3xl pointer-events-none" />
                     <div className="relative z-10 flex-1 flex flex-col">
                        <div className="mb-8">
                          <h3 className="text-xl font-bold text-white mb-2">Platform Network</h3>
                          <p className="text-zinc-500 text-sm font-medium">Real-time visualization of quantum-safe node activity.</p>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                           <Globe />
                        </div>
                        <div className="grid grid-cols-3 gap-8 mt-8">
                           <div>
                              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Global Nodes</p>
                              <p className="text-2xl font-bold text-white">1,248</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Mean Latency</p>
                              <p className="text-2xl font-bold text-white">12ms</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">PQC Entropy</p>
                              <p className="text-2xl font-bold text-white">99.9%</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="md:col-span-4 glass p-8 rounded-[2.5rem] space-y-6">
                     <h3 className="text-lg font-bold">Quick Integration</h3>
                     <div className="space-y-4">
                        <div className="p-4 bg-black border border-white/5 rounded-2xl space-y-3">
                           <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Install CLI</span>
                              <Copy className="w-3 h-3 text-zinc-700 cursor-pointer hover:text-white" />
                           </div>
                           <code className="text-[11px] font-mono text-blue-400 block truncate">npm install -g quantumblue-cli</code>
                        </div>
                        <div className="p-4 bg-black border border-white/5 rounded-2xl space-y-3">
                           <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Initialize Project</span>
                              <Copy className="w-3 h-3 text-zinc-700 cursor-pointer hover:text-white" />
                           </div>
                           <code className="text-[11px] font-mono text-blue-400 block truncate">qb init --key {keys[0]?.key.slice(0, 12)}...</code>
                        </div>
                     </div>
                     <button onClick={() => setActiveTab("quickstart")} className="w-full btn-saas-secondary text-xs mt-4">
                        View Documentation
                     </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "quickstart" && (
              <motion.div 
                key="quickstart" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="pb-6 border-b border-white/5">
                   <span className="text-blue-500 font-bold text-[10px] uppercase tracking-[0.2em] block">Onboarding</span>
                   <h1 className="text-3xl font-bold tracking-tight">Quick Start Guide</h1>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                   <div className="glass p-8 rounded-[2.5rem] space-y-6">
                      <h3 className="text-xl font-bold">What is Quantum Blue?</h3>
                      <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                        Quantum Blue is a complete ecosystem designed to future-proof your data against quantum computers. 
                        Our platform provides **Lattice-based encryption (ML-KEM/ML-DSA)** which is mathematically proven to be resistant to Shor's algorithm.
                      </p>
                      <div className="space-y-4 pt-4">
                         <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-500 font-bold text-xs">1</div>
                            <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Generate Access Keys</span>
                         </div>
                         <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-500 font-bold text-xs">2</div>
                            <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Install CLI Tool</span>
                         </div>
                         <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-500 font-bold text-xs">3</div>
                            <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Seal & Deploy Assets</span>
                         </div>
                      </div>
                   </div>

                   <div className="glass p-8 rounded-[2.5rem] space-y-6">
                      <h3 className="text-xl font-bold">CLI Reference</h3>
                      <div className="space-y-4">
                         {[
                           { cmd: "qb init", desc: "Link your local machine to the ecosystem." },
                           { cmd: "qb seal [file]", desc: "Apply lattice-based encryption to a file." },
                           { cmd: "qb verify [hash]", desc: "Check asset integrity against registry." },
                           { cmd: "qb keys", desc: "Manage your active PQC keypairs." }
                         ].map(item => (
                           <div key={item.cmd} className="p-4 bg-black border border-white/5 rounded-xl space-y-1">
                              <code className="text-[11px] font-mono text-blue-400 font-bold">{item.cmd}</code>
                              <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">{item.desc}</p>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="glass p-8 rounded-[2.5rem] bg-blue-500/[0.02] border-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-8">
                   <div className="space-y-2">
                      <h3 className="text-lg font-bold">Need higher throughput?</h3>
                      <p className="text-zinc-500 text-sm font-medium">The Professional plan offers dedicated Sentinel Nodes and 24/7 technical assistance.</p>
                   </div>
                   <Link href="/pricing" className="btn-saas-primary w-full md:w-auto text-xs px-10">
                      View Pricing Plans
                   </Link>
                </div>
              </motion.div>
            )}

            {activeTab === "keys" && (
              <motion.div 
                key="keys" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="pb-6 border-b border-white/5">
                   <span className="text-blue-500 font-bold text-[10px] uppercase tracking-[0.2em] block">Identity Core</span>
                   <h1 className="text-3xl font-bold tracking-tight">Access Keys</h1>
                </div>

                <div className="grid md:grid-cols-12 gap-8">
                   <div className="md:col-span-4 glass p-8 rounded-[2.5rem] h-fit space-y-6">
                      <h3 className="text-lg font-bold">Generate New Key</h3>
                      <form onSubmit={handleCreateKey} className="space-y-4">
                        <input
                          type="text" placeholder="Identity Label (e.g. My MacBook)" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500/50"
                        />
                        <button 
                          type="submit" disabled={!newKeyName}
                          className="btn-saas-primary w-full text-xs"
                        >
                          Generate Identity Token
                        </button>
                      </form>
                      <p className="text-[10px] text-zinc-600 font-medium italic">Tokens are used to authorize CLI sessions and API requests.</p>
                   </div>

                   <div className="md:col-span-8 glass p-8 rounded-[3rem] space-y-6">
                      <div className="flex justify-between items-center border-b border-white/5 pb-4">
                         <h3 className="text-lg font-bold">Active Identifiers</h3>
                         <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{keys.length} Active</span>
                      </div>
                      <div className="space-y-3">
                         {keys.map(k => (
                           <div key={k.id} className="p-5 bg-black border border-white/5 rounded-2xl group hover:border-white/10 transition-all flex items-center justify-between gap-4">
                             <div className="space-y-1 overflow-hidden">
                                <span className="text-xs font-bold text-white uppercase tracking-wider block">{k.name}</span>
                                <code className="text-[10px] font-mono text-zinc-500 truncate block">{k.key}</code>
                             </div>
                             <div className="flex items-center gap-2">
                                <button onClick={() => navigator.clipboard.writeText(k.key)} className="p-2 glass rounded-lg text-zinc-500 hover:text-white transition-all">
                                   <Copy className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDeleteKey(k.id)} className="p-2 glass rounded-lg text-zinc-500 hover:text-red-500 transition-all">
                                   <Trash className="w-4 h-4" />
                                </button>
                             </div>
                           </div>
                         ))}
                         {keys.length === 0 && <div className="text-center py-10 text-zinc-600 font-bold uppercase text-[10px] tracking-widest">No keys generated yet.</div>}
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === "notary" && (
              <motion.div 
                key="notary" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="pb-6 border-b border-white/5">
                   <span className="text-blue-500 font-bold text-[10px] uppercase tracking-[0.2em] block">Data Vault</span>
                   <h1 className="text-3xl font-bold tracking-tight">Sovereign Registry</h1>
                </div>

                <div className="glass p-8 rounded-[3rem] overflow-hidden">
                   <div className="flex justify-between items-center mb-8">
                      <h3 className="text-xl font-bold">Verified Assets</h3>
                      <button onClick={fetchAssets} className="btn-saas-secondary py-2 px-4 gap-2 text-[10px]">
                         <RefreshCw className="w-3 h-3" /> Sync Registry
                      </button>
                   </div>

                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                         <thead>
                            <tr className="border-b border-white/5 text-zinc-600 text-[10px] uppercase tracking-widest font-bold">
                               <th className="px-6 py-4">Asset Label</th>
                               <th className="px-6 py-4">Security Fingerprint</th>
                               <th className="px-6 py-4">Status</th>
                            </tr>
                         </thead>
                         <tbody className="text-sm">
                            {assets.map((a) => (
                              <tr key={a.id} className="group border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-6 font-bold text-zinc-200">{a.filename}</td>
                                <td className="px-6 py-6 font-mono text-zinc-500 text-[10px]">
                                   <EncryptedText text={a.signatureHash.slice(0, 32) + "..."} />
                                </td>
                                <td className="px-6 py-6">
                                   <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest">Verified</span>
                                </td>
                              </tr>
                            ))}
                         </tbody>
                      </table>
                      {assets.length === 0 && (
                        <div className="text-center py-20">
                           <FileText className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                           <p className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest">No assets notarized in this registry.</p>
                        </div>
                      )}
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === "intelligence" && (
              <motion.div 
                key="intelligence" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="max-w-4xl mx-auto h-[70vh] flex flex-col glass rounded-[3rem] overflow-hidden"
              >
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                   <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
                      <div>
                         <h3 className="text-lg font-bold">Security AI</h3>
                         <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Executive Engine Active</p>
                      </div>
                   </div>
                   <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                      NIST-Compliant Models
                   </div>
                </div>

                <div ref={scrollRef} className="flex-1 p-8 space-y-6 overflow-y-auto custom-scrollbar">
                   {messages.map((m, i) => (
                     <motion.div 
                       key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                       className={cn(
                         "p-5 rounded-[2rem] text-sm font-medium leading-relaxed max-w-[80%]",
                         m.role === "assistant" ? "bg-white/5 text-zinc-300 self-start" : "bg-blue-500 text-white self-end shadow-[0_0_30px_rgba(59,130,246,0.3)] ml-auto"
                       )}
                     >
                       {m.content}
                     </motion.div>
                   ))}
                   {isTyping && (
                     <div className="flex gap-1.5 ml-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 animate-bounce" />
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 animate-bounce [animation-delay:0.4s]" />
                     </div>
                   )}
                </div>

                <div className="p-8 bg-black/50 border-t border-white/5 backdrop-blur-xl">
                   <form onSubmit={handleSendMessage} className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl opacity-0 group-focus-within:opacity-20 transition-opacity blur" />
                      <input 
                        type="text" placeholder="Analyze security posture or inquire about PQC protocols..." value={input} onChange={(e) => setInput(e.target.value)}
                        className="relative w-full bg-zinc-900 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-600"
                      />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20">
                        <Send className="w-4 h-4" />
                      </button>
                   </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </main>
      </div>
    </div>
  );
}
