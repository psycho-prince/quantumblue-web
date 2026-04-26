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
    { role: "assistant", content: "SYSTEM_ID: SOVEREIGN. STATUS: STARK. OPS: NOMINAL." }
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
      let response = "LATTICE_GEOMETRY_ANALYSIS_COMPLETE. INTEGRITY: 1.0. VERIFIED.";
      if (userMsg.toLowerCase().includes("risk")) {
        response = "THREAT_INTEL: SECTOR_STABLE. VOLATILITY_THRESHOLD: MINIMAL. EXPOSURE: NOMINAL.";
      } else if (userMsg.toLowerCase().includes("seal")) {
        response = "INITIALIZING_SEAL_PROTOCOL. ML_DSA_87_NOTARIZATION_IN_PROGRESS.";
      }
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  if (!user || loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center border-t border-l border-[#333]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border border-white flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <span className="label-mono">SYNCHRONIZING_CORE</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row relative selection:bg-white selection:text-black">
      
      {/* Sidebar - Stark Wireframe */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-black border-r border-[#333] transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-8 border-b border-[#333] flex items-center justify-between">
            <span className="text-xl font-black tracking-tighter uppercase font-['Plus_Jakarta_Sans']">SOVEREIGN</span>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1">
            {["overview", "notary", "keys", "intelligence"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActiveTab(item);
                  setSidebarOpen(false);
                }}
                className={cn(
                  "w-full text-left p-8 text-[10px] font-bold uppercase tracking-[0.4em] transition-all border-b border-[#333] font-mono",
                  activeTab === item ? "bg-white text-black" : "text-[#888] hover:text-white"
                )}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="p-8 border-t border-[#333] flex items-center gap-4">
            <UserButton />
            <div className="flex flex-col overflow-hidden">
              <span className="label-mono text-[8px] tracking-[0.2em]">OPERATOR_ID</span>
              <span className="text-[10px] font-bold truncate font-mono">{user.emailAddresses[0].emailAddress}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto scrollbar-hide">
        
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-6 border-b border-[#333] sticky top-0 bg-black z-40">
          <span className="text-lg font-black tracking-tighter uppercase">QUANTUM_BLUE</span>
          <button onClick={() => setSidebarOpen(true)} className="text-white">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 flex flex-col">
          
          {/* Header Section */}
          <div className="p-8 md:p-12 border-b border-[#333] flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 label-mono">
                <div className="pulse-dot" />
                STATUS: OPTIMAL
              </div>
              <h1 className="text-fluid-h1 font-black">
                STARK <br /> <span className="text-[#333]">INTELLIGENCE.</span>
              </h1>
            </div>
            <div className="label-mono border border-[#333] p-4 text-[8px]">
              V2.6.4 / CORE_PROTOCOL
            </div>
          </div>

          {/* Wireframe Bento Grid */}
          <div className="bento-grid">
            
            {/* Global Flow - Span 8 */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="md:col-span-8 card-stark flex flex-col justify-between"
            >
              <div>
                <span className="label-mono mb-4 block">GEOSPATIAL_FLOW_MATRIX</span>
                <h3 className="text-fluid-h2">REAL-TIME <br />TRAFFIC</h3>
              </div>
              
              <div className="flex-1 flex items-center justify-center p-12">
                <div className="w-full max-w-sm aspect-square border border-[#222] flex items-center justify-center relative">
                   <div className="absolute inset-0 opacity-10">
                     <Globe />
                   </div>
                   <div className="label-mono text-[8px]">RENDERING_LATTICE...</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-[#333] -mx-8 -mb-8">
                 {[
                   { label: "NODES", value: "1,248" },
                   { label: "LATENCY", value: "12MS" },
                   { label: "INTEGRITY", value: "100%" }
                 ].map((stat, i) => (
                   <div key={stat.label} className={cn("p-8", i !== 2 && "border-r border-[#333]")}>
                      <p className="label-mono text-[8px]">{stat.label}</p>
                      <p className="text-2xl font-black font-mono mt-2 tracking-tight">{stat.value}</p>
                   </div>
                 ))}
              </div>
            </motion.div>

            {/* AI Agent - Span 4 */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
              className="md:col-span-4 card-stark flex flex-col gap-8"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-fluid-h2 flex items-center gap-4">
                  <Sparkles className="w-6 h-6" /> INTEL
                </h3>
                <div className="label-mono border border-[#333] px-2 py-1">G_3.1</div>
              </div>

              <div ref={scrollRef} className="flex-1 space-y-6 overflow-y-auto font-mono text-[10px] leading-relaxed pr-2">
                <AnimatePresence>
                  {messages.map((m, i) => (
                    <motion.div 
                      key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                      className={cn("p-4 border", m.role === "assistant" ? "border-[#333] text-[#888]" : "border-white text-white")}
                    >
                      <div className="label-mono text-[8px] mb-2">{m.role === "assistant" ? "SYSTEM" : "USER"}</div>
                      {m.content}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isTyping && (
                  <div className="label-mono animate-pulse">THINKING...</div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="relative mt-auto">
                <input 
                  type="text" placeholder="CMD_INPUT..." value={input} onChange={(e) => setInput(e.target.value)}
                  className="w-full bg-black border border-[#333] p-4 text-[10px] font-mono focus:outline-none focus:border-white transition-all uppercase"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#333] hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>

            {/* Keys - Span 4 */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="md:col-span-4 card-stark flex flex-col gap-12"
            >
               <div className="flex items-center justify-between">
                  <h3 className="text-fluid-h2 flex items-center gap-4">
                    <Key className="w-6 h-6" /> KEYS
                  </h3>
                  <div className="pulse-dot" />
               </div>

               <form onSubmit={handleCreateKey} className="space-y-4">
                  <input
                    type="text" placeholder="NEW_IDENTITY..." value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)}
                    className="w-full bg-black border border-[#333] p-4 text-[10px] font-mono focus:outline-none focus:border-white uppercase"
                  />
                  <button 
                    type="submit" disabled={!newKeyName}
                    className="w-full bg-white text-black py-4 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#888] transition-all disabled:opacity-10"
                  >
                    GENERATE_TOKEN
                  </button>
               </form>

               <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                  {keys.map(k => (
                    <div key={k.id} className="p-6 border border-[#333] group hover:border-white transition-all">
                      <div className="flex justify-between items-center mb-4">
                        <span className="label-mono text-white">{k.name}</span>
                        <button onClick={() => handleDeleteKey(k.id)} className="text-[#333] hover:text-white transition-colors">
                          <Trash className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between bg-[#111] p-3 border border-[#222]">
                         <code className="text-[9px] font-mono text-[#555] truncate mr-4">{k.key}</code>
                         <button onClick={() => navigator.clipboard.writeText(k.key)} className="text-[#333] hover:text-white">
                           <Copy className="w-3 h-3" />
                         </button>
                      </div>
                    </div>
                  ))}
               </div>
            </motion.div>

            {/* Asset Ledger - Span 8 */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="md:col-span-8 card-stark flex flex-col gap-12"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-fluid-h2 flex items-center gap-4">
                    <FileText className="w-6 h-6" /> LEDGER
                  </h3>
                  <p className="label-mono mt-2">P_QUANTUM_NOTARY_STREAM</p>
                </div>
                <button 
                  onClick={fetchAssets}
                  className="touch-target"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 border border-[#333] overflow-hidden">
                {assets.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-[#111] text-[#888] text-[8px] uppercase tracking-[0.4em] font-bold border-b border-[#333]">
                          <th className="px-8 py-5">ARTIFACT</th>
                          <th className="px-8 py-5">SIGNATURE_HASH</th>
                          <th className="px-8 py-5">VERIFICATION</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#333] font-mono text-[10px]">
                        {assets.map((a) => (
                          <tr key={a.id} className="group hover:bg-[#050505] transition-colors">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <Zap className="w-3 h-3 text-[#333]" />
                                <span className="font-bold">{a.filename}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="text-[#333] group-hover:text-[#555] transition-colors">
                                <EncryptedText text={a.signatureHash.slice(0, 32) + "..."} />
                              </div>
                            </td>
                            <td className="px-8 py-6">
                               <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 bg-white" />
                                  <span className="label-mono text-white tracking-[0.1em]">VALID</span>
                               </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full min-h-[300px] opacity-10">
                     <Terminal className="w-12 h-12 mb-4" />
                     <span className="label-mono">STREAM_EMPTY</span>
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
