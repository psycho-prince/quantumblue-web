"use client";

import { useState, useEffect, useRef } from "react";
import { UserButton, useUser, useClerk, useOrganization } from "@clerk/nextjs";
import Link from "next/link";
import { ShieldCheck, Key, RefreshCw, FileText, Copy, Send, Sparkles, Zap, Menu, X, Activity, Cpu, Library, LogOut, ScanLine, AlertTriangle, LayoutDashboard, Trash } from "lucide-react";
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
  const { signOut } = useClerk();
  const { organization } = useOrganization();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [pqcKey, setPqcKey] = useState<{ public_key: string, private_key: string } | null>(null);
  const [generatingPqc, setGeneratingPqc] = useState(false);
  
  // AI Agent State
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "EXECUTIVE_INTELLIGENCE_ACTIVE. HOW_CAN_I_ASSIST_WITH_YOUR_SECURITY_POSTURE_TODAY?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchKeys = async () => {
    const headers: HeadersInit = process.env.NODE_ENV === "development" ? { "x-org-id": "org-test-001" } : {};
    const res = await fetch("/api/keys", { headers });
    if (res.ok) {
      const data = await res.json();
      setKeys(data);
    }
  };

  const fetchAssets = async () => {
    const headers: HeadersInit = process.env.NODE_ENV === "development" ? { "x-org-id": "org-test-001" } : {};
    const res = await fetch("/api/assets", { headers });
    if (res.ok) {
      const data = await res.json();
      setAssets(data);
    }
  };

  useEffect(() => {
    const initDashboard = async () => {
      const isDev = process.env.NODE_ENV === "development";
      if (user || isDev) {
        await Promise.all([fetchKeys(), fetchAssets()]);
        setLoading(false);
      }
    };
    initDashboard();
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
      let response = "SECURITY_AUDIT_COMPLETE. ASSET_INTEGRITY_VERIFIED_AT_100%. NO_VULNERABILITIES_DETECTED.";
      if (userMsg.toLowerCase().includes("risk")) {
        response = "MARKET_ANALYSIS: PREDICTIVE_MODELS_SHOW_STABLE_ASSET_PERFORMANCE. INSTITUTIONAL_EXPOSURE_IS_WITHIN_SECURE_THRESHOLDS.";
      } else if (userMsg.toLowerCase().includes("seal")) {
        response = "ADVANCED_PROTECTION_PROTOCOL_INITIATED. NOTARIZING_ASSET_REGISTRY.";
      }
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  const isDev = process.env.NODE_ENV === "development";
  if ((!user && !isDev) || loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center font-mono">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 border border-accent-blue flex items-center justify-center animate-pulse">
          <ShieldCheck className="w-8 h-8 text-accent-blue" />
        </div>
        <span className="text-sm font-semibold tracking-wider text-accent-blue">INITIALIZING_COMMAND_CENTER...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row relative selection:bg-accent-blue/30 font-mono">
      
      {/* Sidebar - SaaS Navigation */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-black border-r border-border-bright transition-transform duration-300 md:relative md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-10">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 border border-accent-blue/50 flex items-center justify-center transition-all group-hover:bg-accent-blue/20">
                <ShieldCheck className="w-5 h-5 text-accent-blue" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white neon-text-blue">QUANTUM_BLUE</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-accent-red">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1">
            {[
              { id: "overview", label: "OVERVIEW", icon: LayoutDashboard },
              { id: "scans", label: "SCANS", icon: ScanLine },
              { id: "anomalies", label: "ANOMALIES", icon: AlertTriangle },
              { id: "quickstart", label: "QUICK_START", icon: Zap },
              { id: "keys", label: "ACCESS_KEYS", icon: Key },
              { id: "pqc-keys", label: "PQC_KEYS", icon: ShieldCheck },
              { id: "notary", label: "REGISTRY", icon: FileText },
              { id: "intelligence", label: "SECURITY_AI", icon: Cpu },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all border",
                  activeTab === item.id 
                    ? "bg-accent-blue/10 text-accent-blue border-accent-blue" 
                    : "text-zinc-500 border-transparent hover:text-white hover:bg-zinc-900"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
            <Link 
              href="/resources"
              className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-zinc-500 border border-transparent hover:text-white hover:bg-zinc-900 transition-all"
            >
              <Library className="w-4 h-4" />
              RESOURCES
            </Link>
          </nav>

          <div className="pt-6 border-t border-border-bright space-y-4">
             {/* Current Plan Card */}
             <div className="border border-border-bright p-4 space-y-3">
                <div className="flex items-center justify-between">
                   <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">ACTIVE_PLAN</span>
                   <span className="text-[9px] font-bold text-accent-blue uppercase tracking-widest bg-accent-blue/10 px-2 py-0.5">FREE</span>
                </div>
                <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">UPGRADE_TO_PROFESSIONAL_FOR_ENTERPRISE_PQC_FEATURES.</p>
                <Link href="/pricing" className="block text-[10px] font-bold text-white hover:text-accent-blue transition-colors uppercase tracking-widest">UPGRADE_NOW_→</Link>
             </div>

            <div className="flex items-center gap-3 pl-1">
              <div className="p-0.5 border border-accent-blue/30 rounded-none">
                <UserButton appearance={{ elements: { userButtonAvatarBox: 'w-7 h-7' } }} />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-semibold truncate text-zinc-300">{user?.emailAddresses?.[0]?.emailAddress ?? "dev@local.test"}</span>
                <span className="text-[9px] font-bold text-accent-green uppercase tracking-wider">ADMIN_ACCESS</span>
              </div>
            </div>

            <button 
              onClick={() => signOut({ redirectUrl: "/" })}
              className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-zinc-500 hover:text-accent-red hover:bg-accent-red/5 transition-all border border-transparent hover:border-accent-red mt-2 uppercase tracking-widest"
            >
              <LogOut className="w-4 h-4" />
              SIGN_OUT
            </button>
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
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border-bright">
                  <div className="space-y-1">
                    <span className="text-accent-blue font-bold text-[10px] uppercase tracking-[0.2em] block">SYSTEM_STATUS</span>
                    <h1 className="text-3xl font-bold tracking-tight">OVERVIEW</h1>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-border-bright text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                    NODES_HEALTHY
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-8 glass p-8 min-h-[400px] flex flex-col relative border border-border-bright group">
                     <div className="relative z-10 flex-1 flex flex-col">
                        <div className="mb-8">
                          <h3 className="text-xl font-bold text-white mb-2 font-mono">PLATFORM_NETWORK</h3>
                          <p className="text-zinc-500 text-sm font-mono">REAL_TIME_VISUALIZATION_OF_QUANTUM_SAFE_NODE_ACTIVITY.</p>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                           <Globe />
                        </div>
                        <div className="grid grid-cols-3 gap-8 mt-8 border-t border-border-bright pt-8">
                           <div>
                              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">GLOBAL_NODES</p>
                              <p className="text-2xl font-bold text-white font-mono">1,248</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">MEAN_LATENCY</p>
                              <p className="text-2xl font-bold text-white font-mono">12MS</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">PQC_ENTROPY</p>
                              <p className="text-2xl font-bold text-white font-mono">99.9%</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="md:col-span-4 glass p-8 space-y-6 border border-border-bright">
                     <h3 className="text-lg font-bold font-mono">QUICK_INTEGRATION</h3>
                     <div className="space-y-4">
                        <div className="p-4 bg-black border border-border-bright space-y-3">
                           <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">INSTALL_CLI</span>
                              <Copy className="w-3 h-3 text-zinc-700 cursor-pointer hover:text-white" />
                           </div>
                           <code className="text-[11px] font-mono text-accent-blue block truncate">NPM_INSTALL_-G_QUANTUMBLUE_CLI</code>
                        </div>
                        <div className="p-4 bg-black border border-border-bright space-y-3">
                           <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">INITIALIZE_PROJECT</span>
                              <Copy className="w-3 h-3 text-zinc-700 cursor-pointer hover:text-white" />
                           </div>
                           <code className="text-[11px] font-mono text-accent-blue block truncate">QB_INIT_--KEY_{keys[0]?.key.slice(0, 8)}...</code>
                        </div>
                     </div>
                     <button onClick={() => setActiveTab("quickstart")} className="w-full py-3 bg-accent-blue/10 border border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-black transition-all text-xs font-bold uppercase tracking-widest font-mono">
                        VIEW_DOCUMENTATION
                     </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "scans" && (
              <motion.div 
                key="scans" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="pb-6 border-b border-border-bright">
                   <span className="text-accent-blue font-bold text-[10px] uppercase tracking-[0.2em] block font-mono">SCAN_MANAGEMENT</span>
                   <h1 className="text-3xl font-bold tracking-tight font-mono">SCANS</h1>
                </div>
                <div className="glass p-8 border border-border-bright">
                  <p className="text-zinc-400 text-sm font-mono">Use the CLI to scan and push:</p>
                  <code className="text-[11px] font-mono text-accent-blue block mt-2">qb scan /path/to/target --push --endpoint https://app.quantum-blue.in</code>
                </div>
              </motion.div>
            )}

            {activeTab === "anomalies" && (
              <motion.div 
                key="anomalies" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="pb-6 border-b border-border-bright">
                   <span className="text-accent-blue font-bold text-[10px] uppercase tracking-[0.2em] block font-mono">ANOMALY_DETECTION</span>
                   <h1 className="text-3xl font-bold tracking-tight font-mono">ANOMALIES</h1>
                </div>
                <div className="glass p-8 border border-border-bright">
                  <p className="text-zinc-400 text-sm font-mono">Anomalies are detected automatically when a new quantum-vulnerable primitive appears at a new location compared to the previous scan.</p>
                </div>
              </motion.div>
            )}

            {activeTab === "quickstart" && (
              <motion.div 
                key="quickstart" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="pb-6 border-b border-border-bright">
                   <span className="text-accent-blue font-bold text-[10px] uppercase tracking-[0.2em] block font-mono">ONBOARDING</span>
                   <h1 className="text-3xl font-bold tracking-tight font-mono">QUICK_START_GUIDE</h1>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                   <div className="glass p-8 border border-border-bright space-y-6">
                      <h3 className="text-xl font-bold font-mono">WHAT_IS_QUANTUM_BLUE?</h3>
                      <p className="text-zinc-400 text-sm leading-relaxed font-mono">
                        QUANTUM_BLUE_IS_A_COMPLETE_ECOSYSTEM_DESIGNED_TO_FUTURE_PROOF_YOUR_DATA_AGAINST_QUANTUM_COMPUTERS. 
                        OUR_PLATFORM_PROVIDES_LATTICE_BASED_ENCRYPTION_ML_KEM_ML_DSA_WHICH_IS_MATHEMATICALLY_PROVEN_TO_BE_RESISTANT_TO_SHOR_ALGORITHM.
                      </p>
                      <div className="space-y-4 pt-4">
                         {[
                           { step: "1", title: "GENERATE_ACCESS_KEYS" },
                           { step: "2", title: "INSTALL_CLI_TOOL" },
                           { step: "3", title: "SEAL_AND_DEPLOY_ASSETS" }
                         ].map(item => (
                            <div key={item.step} className="flex items-center gap-4">
                               <div className="w-8 h-8 border border-accent-blue/50 flex items-center justify-center text-accent-blue font-bold text-xs font-mono">{item.step}</div>
                               <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest font-mono">{item.title}</span>
                            </div>
                         ))}
                      </div>
                   </div>

                   <div className="glass p-8 border border-border-bright space-y-6">
                       <h3 className="text-xl font-bold font-mono">NODE.JS SDK INTEGRATION</h3>
                       <div className="space-y-4">
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest font-mono">1_LINE_OF_CODE_FOR_FINANCIAL_GRADE_SECURITY</p>
                          <div className="p-4 bg-black border border-border-bright space-y-1 overflow-hidden">
                             <code className="text-[10px] font-mono text-accent-blue font-bold whitespace-pre">
{`import { QuantumBlue } from '@quantumblue/sdk';

const qb = new QuantumBlue({ apiKey: 'YOUR_KEY' });

// Sign financial payload with ML-DSA-65
const signature = await qb.sign({ amount: 500M });
`}
                             </code>
                          </div>
                       </div>
                   </div>
                </div>

                <div className="glass p-8 bg-accent-blue/[0.05] border border-accent-blue/30 flex flex-col md:flex-row items-center justify-between gap-8">
                   <div className="space-y-2">
                      <h3 className="text-lg font-bold font-mono">NEED_HIGHER_THROUGHPUT?</h3>
                      <p className="text-zinc-400 text-sm font-mono">THE_PROFESSIONAL_PLAN_OFFERS_DEDICATED_SENTINEL_NODES_AND_24/7_TECHNICAL_ASSISTANCE.</p>
                   </div>
                   <Link href="/pricing" className="py-3 px-10 bg-accent-blue text-black font-bold uppercase tracking-widest font-mono text-xs text-center w-full md:w-auto">
                      VIEW_PRICING_PLANS
                   </Link>
                </div>
              </motion.div>
            )}

            {activeTab === "keys" && (
              <motion.div 
                key="keys" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="pb-6 border-b border-border-bright">
                   <span className="text-accent-blue font-bold text-[10px] uppercase tracking-[0.2em] block font-mono">IDENTITY_CORE</span>
                   <h1 className="text-3xl font-bold tracking-tight font-mono">ACCESS_KEYS</h1>
                </div>

                <div className="grid md:grid-cols-12 gap-8">
                   <div className="md:col-span-4 glass p-8 border border-border-bright h-fit space-y-6">
                      <h3 className="text-lg font-bold font-mono">GENERATE_NEW_KEY</h3>
                      <form onSubmit={handleCreateKey} className="space-y-4">
                        <input
                          type="text" placeholder="IDENTITY_LABEL (E.G. MY_MACBOOK)" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)}
                          className="w-full bg-black border border-border-bright py-3 px-4 text-sm focus:outline-none focus:border-accent-blue font-mono text-white"
                        />
                        <button 
                          type="submit" disabled={!newKeyName}
                          className="w-full py-3 bg-accent-blue/10 border border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-black transition-all text-xs font-bold uppercase tracking-widest font-mono"
                        >
                          GENERATE_IDENTITY_TOKEN
                        </button>
                      </form>
                      <p className="text-[10px] text-zinc-600 font-bold italic font-mono">TOKENS_ARE_USED_TO_AUTHORIZE_CLI_SESSIONS_AND_API_REQUESTS.</p>
                   </div>

                   <div className="md:col-span-8 glass p-8 border border-border-bright space-y-6">
                      <div className="flex justify-between items-center border-b border-border-bright pb-4">
                         <h3 className="text-lg font-bold font-mono">ACTIVE_IDENTIFIERS</h3>
                         <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">{keys.length} ACTIVE</span>
                      </div>
                      <div className="space-y-3">
                         {keys.map(k => (
                           <div key={k.id} className="p-5 bg-black border border-border-bright hover:border-accent-blue transition-all flex items-center justify-between gap-4">
                             <div className="space-y-1 overflow-hidden">
                                <span className="text-xs font-bold text-white uppercase tracking-wider block font-mono">{k.name}</span>
                                <code className="text-[10px] font-mono text-zinc-500 truncate block">{k.key}</code>
                             </div>
                             <div className="flex items-center gap-2">
                                <button onClick={() => navigator.clipboard.writeText(k.key)} className="p-2 border border-border-bright hover:border-accent-blue transition-all text-zinc-500 hover:text-white">
                                   <Copy className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDeleteKey(k.id)} className="p-2 border border-border-bright hover:border-accent-red transition-all text-zinc-500 hover:text-accent-red">
                                   <Trash className="w-4 h-4" />
                                </button>
                             </div>
                           </div>
                         ))}
                         {keys.length === 0 && <div className="text-center py-10 text-zinc-600 font-bold uppercase text-[10px] tracking-widest font-mono">NO_KEYS_GENERATED_YET.</div>}
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === "pqc-keys" && (
              <motion.div 
                key="pqc-keys" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="pb-6 border-b border-border-bright">
                   <span className="text-accent-blue font-bold text-[10px] uppercase tracking-[0.2em] block font-mono">CRYPTOGRAPHIC_MATERIAL</span>
                   <h1 className="text-3xl font-bold tracking-tight font-mono">POST-QUANTUM KEYS</h1>
                </div>

                <div className="glass p-8 border border-border-bright space-y-6">
                   <h3 className="text-lg font-bold font-mono">GENERATE ML-DSA-65 KEYPAIR</h3>
                   <p className="text-zinc-400 text-sm font-mono leading-relaxed">
                     Generate a true lattice-based post-quantum keypair natively via the QuantumBlue Crypto Engine.
                   </p>
                   <button 
                     onClick={async () => {
                       setGeneratingPqc(true);
                       const res = await fetch("/api/pqc-keys", { method: "POST" });
                       if (res.ok) {
                         const data = await res.json();
                         setPqcKey(data);
                       } else if (res.status === 429) {
                         const errData = await res.json();
                         alert(errData.error || "Rate limit exceeded.");
                       } else {
                         const errData = await res.json().catch(() => ({}));
                         alert(`Failed to generate keys. ${errData.error || ''}`);
                       }
                       setGeneratingPqc(false);
                     }}
                     disabled={generatingPqc}
                     className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white font-bold uppercase tracking-widest font-mono shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 rounded-lg border border-white/20"
                   >
                     {generatingPqc ? "GENERATING_LATTICE..." : "REQUEST_PQC_KEYPAIR"}
                   </button>
                   
                   {pqcKey && (
                     <div className="mt-8 space-y-4">
                       <div className="p-4 bg-black border border-border-bright space-y-2">
                         <div className="flex justify-between">
                            <span className="text-[10px] font-bold text-accent-green uppercase tracking-widest font-mono">PUBLIC_KEY (ML-DSA-65)</span>
                            <Copy onClick={() => navigator.clipboard.writeText(pqcKey.public_key)} className="w-4 h-4 text-zinc-500 cursor-pointer hover:text-white" />
                         </div>
                         <div className="max-h-32 overflow-y-auto custom-scrollbar">
                            <code className="text-[10px] font-mono text-zinc-400 break-all">{pqcKey.public_key}</code>
                         </div>
                       </div>
                       <div className="p-4 bg-black border border-accent-red/30 space-y-2">
                         <div className="flex justify-between">
                            <span className="text-[10px] font-bold text-accent-red uppercase tracking-widest font-mono">PRIVATE_KEY (SENSITIVE)</span>
                            <Copy onClick={() => navigator.clipboard.writeText(pqcKey.private_key)} className="w-4 h-4 text-zinc-500 cursor-pointer hover:text-white" />
                         </div>
                         <div className="max-h-32 overflow-y-auto custom-scrollbar opacity-30 hover:opacity-100 transition-opacity">
                            <code className="text-[10px] font-mono text-zinc-500 break-all">{pqcKey.private_key}</code>
                         </div>
                       </div>
                     </div>
                   )}
                </div>
              </motion.div>
            )}

            {activeTab === "notary" && (
              <motion.div 
                key="notary" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="pb-6 border-b border-border-bright">
                   <span className="text-accent-blue font-bold text-[10px] uppercase tracking-[0.2em] block font-mono">DATA_VAULT</span>
                   <h1 className="text-3xl font-bold tracking-tight font-mono">SOVEREIGN_REGISTRY</h1>
                </div>

                <div className="glass p-8 border border-border-bright overflow-hidden">
                   <div className="flex justify-between items-center mb-8">
                      <h3 className="text-xl font-bold font-mono">VERIFIED_ASSETS</h3>
                      <button onClick={fetchAssets} className="py-2 px-4 border border-border-bright text-[10px] font-bold uppercase tracking-widest font-mono text-zinc-500 hover:text-accent-blue flex items-center gap-2">
                         <RefreshCw className="w-3 h-3" /> SYNC_REGISTRY
                      </button>
                   </div>

                   <div className="overflow-x-auto">
                      <table className="w-full text-left font-mono">
                         <thead>
                            <tr className="border-b border-border-bright text-zinc-600 text-[10px] uppercase tracking-widest font-bold">
                               <th className="px-6 py-4">ASSET_LABEL</th>
                               <th className="px-6 py-4">SECURITY_FINGERPRINT</th>
                               <th className="px-6 py-4">STATUS</th>
                            </tr>
                         </thead>
                         <tbody className="text-sm">
                            {assets.map((a) => (
                              <tr key={a.id} className="group border-b border-border-bright hover:bg-zinc-900 transition-colors">
                                <td className="px-6 py-6 font-bold text-zinc-200">{a.filename}</td>
                                <td className="px-6 py-6 font-mono text-zinc-500 text-[10px]">
                                   <EncryptedText text={a.signatureHash.slice(0, 32) + "..."} />
                                </td>
                                <td className="px-6 py-6">
                                   <span className="text-[10px] font-bold text-accent-green bg-accent-green/10 px-3 py-1 uppercase tracking-widest">VERIFIED</span>
                                </td>
                              </tr>
                            ))}
                         </tbody>
                      </table>
                      {assets.length === 0 && (
                        <div className="text-center py-20">
                           <FileText className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                           <p className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest font-mono">NO_ASSETS_NOTARIZED_IN_THIS_REGISTRY.</p>
                        </div>
                      )}
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === "intelligence" && (
              <motion.div 
                key="intelligence" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="max-w-4xl mx-auto h-[70vh] flex flex-col glass border border-border-bright overflow-hidden"
              >
                <div className="p-8 border-b border-border-bright flex items-center justify-between bg-zinc-950">
                   <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-accent-blue animate-pulse" />
                      <div>
                         <h3 className="text-lg font-bold font-mono">SECURITY_AI</h3>
                         <p className="text-[10px] font-bold text-accent-green uppercase tracking-widest font-mono">EXECUTIVE_ENGINE_ACTIVE</p>
                      </div>
                   </div>
                   <div className="px-3 py-1 border border-border-bright text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
                      NIST_COMPLIANT_MODELS
                   </div>
                </div>

                <div ref={scrollRef} className="flex-1 p-8 space-y-6 overflow-y-auto custom-scrollbar">
                   {messages.map((m, i) => (
                     <motion.div 
                       key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                       className={cn(
                         "p-5 text-sm font-medium leading-relaxed max-w-[80%] font-mono border",
                         m.role === "assistant" 
                           ? "bg-zinc-900 text-zinc-200 border-border-bright" 
                           : "bg-accent-blue/10 text-accent-blue border-accent-blue/30 ml-auto"
                       )}
                     >
                       {m.content}
                     </motion.div>
                   ))}
                   {isTyping && (
                     <div className="p-5 bg-zinc-900 text-zinc-200 border border-border-bright max-w-[80%] font-mono">
                       <span className="animate-pulse">ANALYZING...</span>
                     </div>
                   )}
                </div>

                <form onSubmit={handleSendMessage} className="p-6 border-t border-border-bright bg-zinc-950">
                   <div className="flex gap-3">
                      <input
                        type="text" value={input} onChange={(e) => setInput(e.target.value)}
                        placeholder="QUERY_SECURITY_POSTURE..."
                        className="flex-1 bg-black border border-border-bright py-3 px-4 text-sm focus:outline-none focus:border-accent-blue font-mono text-white placeholder:text-zinc-600"
                      />
                      <button type="submit" className="px-6 py-3 bg-accent-blue text-black font-bold uppercase tracking-widest text-xs font-mono hover:bg-accent-blue/80 transition-colors">
                         <Send className="w-4 h-4" />
                      </button>
                   </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
