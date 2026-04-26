"use client";

import { useState, useEffect, useRef } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { ShieldCheck, Key, Trash, RefreshCw, FileText, Copy, Terminal, Send, Sparkles, Globe as GlobeIcon, Zap, Menu, X, ArrowRight } from "lucide-react";
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
    { role: "assistant", content: "Achromatic Intelligence Active. Sovereign Protocol operations are nominal." }
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
      let response = "Lattice geometry analysis complete. Asset integrity verified at 100%.";
      if (userMsg.toLowerCase().includes("risk")) {
        response = "Sector Intelligence: Predictive risk models suggest stable volatility. Institutional exposure remains within sovereign thresholds.";
      } else if (userMsg.toLowerCase().includes("seal")) {
        response = "Sealing protocol initiated. ML-DSA-87 notarization in progress.";
      }
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  if (!user || loading) return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center animate-pulse">
          <ShieldCheck className="w-8 h-8 text-[#A0AAB5]" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#A0AAB5]">Synchronizing Hub...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#121212] text-[#FAF7F2] flex flex-col md:flex-row relative">
      
      {/* Sidebar - Desktop Fixed, Mobile Hidden */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-[#121212] border-r border-white/5 transition-transform duration-300 transform md:relative md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-8">
          <div className="flex items-center justify-between mb-16">
            <span className="text-xl font-bold tracking-tighter uppercase font-['Plus_Jakarta_Sans']">Sovereign Hub</span>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden touch-target text-[#A0AAB5]">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-6">
            {["overview", "notary", "keys", "intelligence"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActiveTab(item);
                  setSidebarOpen(false);
                }}
                className={cn(
                  "w-full text-left py-2 text-sm font-bold uppercase tracking-[0.2em] transition-all border-l-2 pl-4",
                  activeTab === item ? "border-[#A0AAB5] text-[#FAF7F2]" : "border-transparent text-[#A0AAB5] hover:text-[#FAF7F2]"
                )}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="pt-8 border-t border-white/5 flex items-center gap-4">
            <UserButton />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#A0AAB5] uppercase tracking-widest">Active Operator</span>
              <span className="text-xs font-bold truncate max-w-[150px]">{user.emailAddresses[0].emailAddress}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto custom-scrollbar">
        
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-[#121212]/80 backdrop-blur-md z-40">
          <span className="text-lg font-bold tracking-tighter uppercase font-['Plus_Jakarta_Sans']">QuantumBlue</span>
          <button onClick={() => setSidebarOpen(true)} className="touch-target text-[#FAF7F2]">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full space-y-12">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-white/5">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[#A0AAB5] text-[10px] font-bold uppercase tracking-[0.3em]">
                <div className="pulse-dot bg-emerald-500" />
                Network Status: Optimal
              </div>
              <h1 className="text-fluid-h1 font-bold">
                Achromatic <span className="text-[#A0AAB5] italic">Intelligence.</span>
              </h1>
            </div>
            <div className="hidden md:flex items-center gap-4 text-[10px] font-bold text-[#A0AAB5] uppercase tracking-widest">
              v2.6.4 / Sovereign Protocol
            </div>
          </div>

          {/* Fluid Bento Grid */}
          <div className="bento-grid">
            
            {/* Real-time Flow - Span 8 */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="md:col-span-8 card-stone relative overflow-hidden group"
            >
              <div className="relative z-20 mb-12">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#A0AAB5] mb-2 block">Global Traffic Matrix</span>
                <h3 className="text-2xl font-bold uppercase tracking-tighter">Real-time Geospatial Flow</h3>
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                <Globe className="translate-y-20 scale-125" />
              </div>

              <div className="relative z-20 grid grid-cols-1 sm:grid-cols-3 gap-6 mt-40">
                 {[
                   { label: "Active Nodes", value: "1,248" },
                   { label: "Latency", value: "12ms" },
                   { label: "Integrity", value: "100%" }
                 ].map(stat => (
                   <div key={stat.label} className="bg-white/5 border border-white/5 rounded-2xl p-6 backdrop-blur-md">
                      <p className="text-[9px] font-bold text-[#A0AAB5] uppercase tracking-widest">{stat.label}</p>
                      <p className="text-xl font-bold">{stat.value}</p>
                   </div>
                 ))}
              </div>
            </motion.div>

            {/* AI Analyst - Span 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="md:col-span-4 card-stone flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold uppercase tracking-tighter flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-[#A0AAB5]" /> Analyst Agent
                </h3>
                <div className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[8px] font-bold uppercase tracking-widest text-[#A0AAB5]">
                  Gemini 3.1
                </div>
              </div>

              <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar text-[11px] leading-relaxed">
                <AnimatePresence>
                  {messages.map((m, i) => (
                    <motion.div 
                      key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className={cn("p-4 rounded-2xl", m.role === "assistant" ? "bg-white/5 text-[#A0AAB5] mr-8" : "bg-white/10 text-[#FAF7F2] ml-8")}
                    >
                      {m.content}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isTyping && (
                  <div className="flex gap-1 ml-2">
                     <div className="w-1 h-1 rounded-full bg-[#A0AAB5] animate-bounce" />
                     <div className="w-1 h-1 rounded-full bg-[#A0AAB5] animate-bounce [animation-delay:0.2s]" />
                     <div className="w-1 h-1 rounded-full bg-[#A0AAB5] animate-bounce [animation-delay:0.4s]" />
                  </div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="relative">
                <input 
                  type="text" placeholder="PROMPT..." value={input} onChange={(e) => setInput(e.target.value)}
                  className="w-full bg-[#121212] border border-white/5 rounded-xl py-3 px-5 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-[#A0AAB5]/40 transition-all"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#A0AAB5] hover:text-[#FAF7F2] touch-target">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>

            {/* Sovereign Keys - Span 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="md:col-span-4 card-stone flex flex-col gap-8"
            >
               <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold uppercase tracking-tighter flex items-center gap-3">
                    <Key className="w-5 h-5 text-[#A0AAB5]" /> Sovereign Keys
                  </h3>
                  <div className="pulse-dot bg-emerald-500" />
               </div>

               <form onSubmit={handleCreateKey} className="space-y-3">
                  <input
                    type="text" placeholder="NEW IDENTITY..." value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-xl py-4 px-5 text-[10px] font-mono text-[#A0AAB5] focus:outline-none"
                  />
                  <button 
                    type="submit" disabled={!newKeyName}
                    className="w-full bg-[#FAF7F2] text-[#121212] py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#A0AAB5] transition-all disabled:opacity-20 touch-target"
                  >
                    Issue Notary Token
                  </button>
               </form>

               <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-1">
                  {keys.map(k => (
                    <div key={k.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 group hover:border-white/10 transition-all">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold text-[#FAF7F2] uppercase tracking-widest">{k.name}</span>
                        <button onClick={() => handleDeleteKey(k.id)} className="text-[#A0AAB5]/40 hover:text-white transition-colors touch-target">
                          <Trash className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="bg-[#121212] rounded-lg p-2 flex items-center justify-between border border-white/5">
                         <code className="text-[9px] font-mono text-[#A0AAB5] truncate mr-4">{k.key}</code>
                         <button onClick={() => navigator.clipboard.writeText(k.key)} className="text-[#A0AAB5]/40 hover:text-white touch-target">
                           <Copy className="w-3 h-3" />
                         </button>
                      </div>
                    </div>
                  ))}
               </div>
            </motion.div>

            {/* Asset Ledger - Span 8 */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="md:col-span-8 card-stone flex flex-col gap-8"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-tighter flex items-center gap-4">
                    <FileText className="w-6 h-6 text-[#A0AAB5]" /> Cryptographic Ledger
                  </h3>
                  <p className="text-[9px] font-bold text-[#A0AAB5] mt-1 uppercase tracking-[0.2em]">Validated Notarization Stream</p>
                </div>
                <button 
                  onClick={fetchAssets}
                  className="touch-target text-[#A0AAB5] hover:text-[#FAF7F2] transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 bg-[#121212] rounded-2xl border border-white/5 overflow-hidden">
                {assets.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-white/5 text-[#A0AAB5] text-[9px] uppercase tracking-[0.3em] font-bold border-b border-white/5">
                          <th className="px-8 py-5">Artifact</th>
                          <th className="px-8 py-5">Signature (ML-DSA-87)</th>
                          <th className="px-8 py-5">Verification</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {assets.map((a) => (
                          <tr key={a.id} className="group hover:bg-white/5 transition-colors">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <Zap className="w-4 h-4 text-[#A0AAB5]" />
                                <span className="font-mono text-xs font-bold">{a.filename}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="font-mono text-[#A0AAB5]/40 text-[9px] truncate max-w-[200px] bg-black/20 px-3 py-1.5 rounded border border-white/5">
                                <EncryptedText text={a.signatureHash} />
                              </div>
                            </td>
                            <td className="px-8 py-6">
                               <div className="flex items-center gap-3">
                                  <div className="pulse-dot bg-emerald-500" />
                                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Validated</span>
                               </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full min-h-[300px] opacity-20">
                     <Terminal className="w-12 h-12 mb-4" />
                     <span className="text-[9px] font-bold uppercase tracking-[0.4em]">No Live Stream</span>
                  </div>
                )}
              </div>
            </motion.div>

          </div>
        </main>

        {/* Floating Action Button - Mobile Only */}
        <button className="md:hidden fixed bottom-8 right-8 w-14 h-14 bg-[#FAF7F2] text-[#121212] rounded-full shadow-2xl flex items-center justify-center z-50 hover:scale-110 transition-transform">
          <ArrowRight className="w-6 h-6" />
        </button>

      </div>
    </div>
  );
}
