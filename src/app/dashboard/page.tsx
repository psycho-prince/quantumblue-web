"use client";

import { useState, useEffect, useRef } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
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
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center animate-pulse">
          <ShieldCheck className="w-8 h-8 text-sky-400" />
        </div>
        <span className="text-sm font-semibold tracking-wider text-slate-400">Loading Secure Workspace...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 flex flex-col md:flex-row relative selection:bg-sky-500/30">
      
      {/* Sidebar - Executive Navigation */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-[#020617] border-r border-white/5 transition-transform duration-300 md:relative md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-8">
          <div className="flex items-center justify-between mb-12">
            <span className="text-xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">QuantumBlue</span>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {[
              { id: "overview", label: "Overview", icon: Activity },
              { id: "notary", label: "Digital Notary", icon: FileText },
              { id: "keys", label: "Access Keys", icon: Key },
              { id: "intelligence", label: "Intelligence", icon: Cpu },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                  activeTab === item.id 
                    ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="pt-8 border-t border-white/5 flex items-center gap-4">
            <UserButton />
            <div className="flex flex-col overflow-hidden">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Authorized Account</span>
              <span className="text-xs font-semibold truncate text-slate-300">{user.emailAddresses[0].emailAddress}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-[#020617]/80 backdrop-blur-xl z-40">
          <span className="text-lg font-bold tracking-tight">QuantumBlue</span>
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-400">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full space-y-10">
          
          {/* Executive Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
            <div className="space-y-2">
              <div className="flex items-center gap-2 label-fintech">
                <div className="pulse-dot" />
                NETWORK STATUS: OPTIMAL
              </div>
              <h1 className="text-fluid-h2 font-bold tracking-tight">
                Enterprise <span className="text-sky-400 italic font-semibold">Intelligence.</span>
              </h1>
            </div>
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-slate-500 tracking-wider">
              LAST UPDATED: {new Date().toLocaleTimeString()}
            </div>
          </div>

          {/* Fintech Bento Grid */}
          <div className="bento-grid">
            
            {/* Main Visualizer - Span 8 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="md:col-span-8 card-fintech relative overflow-hidden flex flex-col"
            >
              <div className="mb-8">
                <span className="label-fintech mb-1 block">Global Network Monitoring</span>
                <h3 className="text-2xl font-bold tracking-tight">Security Flow Analysis</h3>
              </div>
              
              <div className="flex-1 min-h-[300px] flex items-center justify-center relative">
                <div className="absolute inset-0 opacity-10 blur-[1px]">
                  <Globe />
                </div>
                <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                   <div className="w-16 h-16 rounded-full bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
                      <ShieldAlert className="w-8 h-8 text-sky-400" />
                   </div>
                   <p className="text-sm font-semibold text-slate-400 max-w-xs uppercase tracking-widest">
                      Live visualization of cryptographic traffic across secured endpoints.
                   </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/5">
                 {[
                   { label: "Secured Nodes", value: "1,248" },
                   { label: "Active Latency", value: "12ms" },
                   { label: "Data Integrity", value: "100%" }
                 ].map(stat => (
                   <div key={stat.label} className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <p className="label-fintech text-[9px] mb-1">{stat.label}</p>
                      <p className="text-lg font-bold text-white">{stat.value}</p>
                   </div>
                 ))}
              </div>
            </motion.div>

            {/* AI Assistant - Span 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="md:col-span-4 card-fintech flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-sky-400" /> Executive Assistant
                </h3>
              </div>

              <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto pr-2 text-sm leading-relaxed mb-6">
                <AnimatePresence>
                  {messages.map((m, i) => (
                    <motion.div 
                      key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      className={cn("p-4 rounded-2xl", m.role === "assistant" ? "bg-white/5 text-slate-300 mr-8" : "bg-sky-500/10 text-white ml-8 border border-sky-500/20")}
                    >
                      {m.content}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isTyping && (
                  <div className="flex gap-1.5 ml-4">
                     <div className="w-1.5 h-1.5 rounded-full bg-sky-400/50 animate-bounce" />
                     <div className="w-1.5 h-1.5 rounded-full bg-sky-400/50 animate-bounce [animation-delay:0.2s]" />
                     <div className="w-1.5 h-1.5 rounded-full bg-sky-400/50 animate-bounce [animation-delay:0.4s]" />
                  </div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="relative">
                <input 
                  type="text" placeholder="Inquire about security..." value={input} onChange={(e) => setInput(e.target.value)}
                  className="w-full bg-[#020617] border border-white/10 rounded-xl py-3 px-5 text-sm focus:outline-none focus:border-sky-500/50 transition-all"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-sky-400 hover:text-sky-300">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>

            {/* Access Management - Span 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="md:col-span-4 card-fintech flex flex-col gap-6"
            >
               <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Key className="w-5 h-5 text-sky-400" /> Access Keys
                  </h3>
               </div>

               <form onSubmit={handleCreateKey} className="space-y-4">
                  <input
                    type="text" placeholder="Access ID label..." value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)}
                    className="w-full bg-[#020617] border border-white/10 rounded-xl py-4 px-5 text-sm focus:outline-none focus:border-sky-500/50"
                  />
                  <button 
                    type="submit" disabled={!newKeyName}
                    className="btn-primary w-full text-xs uppercase tracking-widest"
                  >
                    Generate Security Token
                  </button>
               </form>

               <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                  {keys.map(k => (
                    <div key={k.id} className="p-4 rounded-xl bg-white/5 border border-white/5 group hover:border-white/10 transition-all">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-white uppercase tracking-wider">{k.name}</span>
                        <button onClick={() => handleDeleteKey(k.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="bg-[#020617] rounded-lg p-2.5 flex items-center justify-between border border-white/10">
                         <code className="text-[10px] font-mono text-slate-400 truncate mr-4">{k.key}</code>
                         <button onClick={() => navigator.clipboard.writeText(k.key)} className="text-slate-500 hover:text-white">
                           <Copy className="w-3.5 h-3.5" />
                         </button>
                      </div>
                    </div>
                  ))}
               </div>
            </motion.div>

            {/* Asset Ledger - Span 8 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="md:col-span-8 card-fintech flex flex-col gap-6"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <FileText className="w-6 h-6 text-sky-400" /> Asset Notary
                  </h3>
                  <p className="label-fintech mt-1">Verified Document Registry</p>
                </div>
                <button 
                  onClick={fetchAssets}
                  className="p-2 text-slate-500 hover:text-white transition-all"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 bg-[#020617] rounded-xl border border-white/5 overflow-hidden">
                {assets.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-white/5 text-slate-400 text-[10px] uppercase tracking-wider font-bold border-b border-white/10">
                          <th className="px-8 py-5">Asset Identifier</th>
                          <th className="px-8 py-5">Security Hash</th>
                          <th className="px-8 py-5">Verification</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10 text-sm">
                        {assets.map((a) => (
                          <tr key={a.id} className="group hover:bg-white/5 transition-colors">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                <FileText className="w-4 h-4 text-slate-500" />
                                <span className="font-semibold">{a.filename}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="text-slate-500 group-hover:text-slate-400 transition-colors">
                                <EncryptedText text={a.signatureHash.slice(0, 32) + "..."} />
                              </div>
                            </td>
                            <td className="px-8 py-6">
                               <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                  <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest">Authorized</span>
                               </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-slate-700">
                     <ShieldCheck className="w-12 h-12 mb-4 opacity-10" />
                     <span className="label-fintech">Registry Empty</span>
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
