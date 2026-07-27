"use client";

import { useState, useEffect } from "react";
import { 
  Calculator, 
  Terminal, 
  FlaskConical, 
  FileText, 
  Copy, 
  Check, 
  Atom, 
  ExternalLink, 
  ArrowLeft 
} from "lucide-react";
import Link from "next/link";

export default function OvsCritiquePage() {
  // Math Simulator State
  const [sigma, setSigma] = useState(-35);
  const [n, setN] = useState(5);
  const [s, setS] = useState(40);
  const [l, setL] = useState(-2);

  // Math calculation variables
  const N_val = Math.pow(10, n);
  const sigmaPlanck_val = Math.pow(10, sigma);
  const S_val = Math.pow(10, s);
  const sigmaMacro = Math.sqrt(N_val) * sigmaPlanck_val * S_val;

  const lP = 1.616e-35;
  const lVal = Math.pow(10, l);
  const rw = Math.sqrt(lP * lVal);
  const holo = Math.pow(lP, 2/3) * Math.pow(lVal, 1/3);

  const logOvs = Math.log10(sigmaMacro);
  const logRw = Math.log10(rw);
  const ordersDiff = Math.abs(Math.round(logOvs - logRw));

  // Console terminal states
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [cliActiveKey, setCliActiveKey] = useState<string | null>(null);

  // Testbench diagnostic states
  const [testbenchLines, setTestbenchLines] = useState<string[]>([]);
  const [isTestbenchRunning, setIsTestbenchRunning] = useState(false);

  // Copy Citation state
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTerminalLines([
      "// Welcome to QuantumBlue CLI Console",
      "// Select a command below to trigger simulation...",
      "kali@resilience-node:~$"
    ]);
    setTestbenchLines([
      "// Testbench ready.",
      "// Press 'Run Diagnostics' to execute the standard controls sequence."
    ]);
  }, []);

  const getSuperscript = (num: number) => {
    const sups: Record<string, string> = {
      '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
    };
    return String(num).split('').map(c => sups[c] || c).join('');
  };

  const formatScientific = (num: number) => {
    if (num === 0) return "0";
    if (Math.abs(num) >= 0.01 && Math.abs(num) < 1000) {
      return num.toFixed(2);
    }
    const exp = Math.floor(Math.log10(Math.abs(num)));
    const base = num / Math.pow(10, exp);
    return `${base.toFixed(2)} × 10${getSuperscript(exp)}`;
  };

  const getLengthLabel = (logL: number) => {
    const val = Math.pow(10, logL);
    if (logL === -3) return "1 mm (10⁻³ m)";
    if (logL === -6) return "1 µm (10⁻⁶ m)";
    if (logL === -9) return "1 nm (10⁻⁹ m)";
    return val >= 0.01 ? `${val.toFixed(2)} m` : `${val.toExponential(1)} m`;
  };

  const copyCitation = () => {
    const citation = `Independent Research Analysis. (2026). A Critical Evaluation of the "Orchestrated Variance Suppression" Framework: Deconstructing Gravitational and Biological Incompatibilities. Physics Preprint - Quantum Gravity & Consciousness Studies. Under Review.`;
    navigator.clipboard.writeText(citation).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const cliOutputs: Record<string, string[]> = {
    init: [
      "$ quantumblue init",
      "[+] Initializing post-quantum notary environment...",
      "[+] Loading cryptographic parameters...",
      "[+] Generating Kyber-1024 (PQC KEM) keypair...",
      "[+] Generating Dilithium5 (PQC Signature) keypair...",
      "[+] Master key successfully backed by secure enclave emulation.",
      "[+] quantumblue-cli environment initialized."
    ],
    register: [
      "$ quantumblue register --owner \"Prince T Philip\"",
      "[+] Generating cryptographic identity registration token...",
      "[+] Contacting public post-quantum blockchain ledger...",
      "[+] Identity registered: Dilithium5-PK-Hash: 0x9f3d51ab2c00a89d...",
      "[+] Sovereign ownership certified."
    ],
    seal: [
      "$ quantumblue seal --dir src/",
      "[+] Scanning active workspace: src/ (Found 8 files)",
      "[+] Compiling notary tree metadata...",
      "[+] Running Dilithium5 high-security sign operation on manifest...",
      "[+] Sealing files with Dilithium5 signature...",
      "[+] Notarization complete. Manifest Hash: qb_notary_8b31a89c9d0ef...",
      "[+] Sovereign daemon initialized: active file monitoring active."
    ],
    verify: [
      "$ quantumblue verify --manifest qb_notary_8b31a89c9d0ef.json",
      "[+] Loading signed manifest...",
      "[+] Verifying Dilithium5 signature against registration hash...",
      "[+] Validating file hashes against sealed manifest...",
      "[✓] Integrity CHECK: 100% matched.",
      "[✓] Notarized signature valid. Code integrity verified."
    ],
    status: [
      "$ quantumblue status",
      "[+] Daemon status: RUNNING (PID 40821)",
      "[+] Monitored path: /home/kali/Desktop/src",
      "[+] Security level: Post-Quantum Dilithium5 + Kyber-1024",
      "[+] Auto-seal triggered: 3 times today.",
      "[+] Notary integrity: SAFE"
    ]
  };

  const runCliCommand = (cmdKey: string) => {
    if (cliActiveKey) return;
    setCliActiveKey(cmdKey);
    setTerminalLines([]);

    const lines = cliOutputs[cmdKey];
    let idx = 0;

    const interval = setInterval(() => {
      if (idx < lines.length) {
        setTerminalLines(prev => [...prev, lines[idx]]);
        idx++;
      } else {
        setTerminalLines(prev => [...prev, "kali@resilience-node:~$"]);
        setCliActiveKey(null);
        clearInterval(interval);
      }
    }, 180);
  };

  const testbenchSteps = [
    { text: "[SYS] Initializing Atom Interferometer suite...", delay: 400 },
    { text: "[SYS] Calibrating optical platform isolation (vibration check < 1e-7 Hz)...", delay: 500 },
    { text: "[TEST 1] Testing Central Limit Theorem Applicability...", delay: 400 },
    { text: "[DATA] Analyzing topological correlations in Planck-scale spacetime cell foam...", delay: 600 },
    { text: "[RESULT 1] Entangled metric states detected. Non-linear scaling (α ≈ 0.67) confirmed. CLT is NOT applicable.", delay: 500 },
    { text: "[TEST 2] Testing Weak Equivalence Principle (WEP) Shielding...", delay: 400 },
    { text: "[DATA] Loading control sample (fused silica glass microtubule lattice)...", delay: 500 },
    { text: "[DATA] Control gravity acceleration measured: 9.80665 m/s² (0% suppression)", delay: 600 },
    { text: "[DATA] Loading biologically active microtubule sample (Debye-screened, structured water)...", delay: 700 },
    { text: "[DATA] Microtubule gravity acceleration measured: 9.80665 m/s² (0% suppression)", delay: 600 },
    { text: "[RESULT 2] WEP validated to 1 part in 10¹⁵. No gravitational shielding detected. Claim: FALSIFIED.", delay: 500 },
    { text: "[TEST 3] Testing Cosmological Spacetime Stability...", delay: 400 },
    { text: "[DATA] Pulling Chandra/Hubble quasar light path phase coherence statistics...", delay: 600 },
    { text: "[RESULT 3] Quasar images are sharp (blur threshold << 1 arcsecond). Naive metric volatility ruled out.", delay: 500 },
    { text: "[TEST 4] Testing Microtubule Quantum Coherence Lifespans...", delay: 400 },
    { text: "[RESULT 4] Decoherence time measured: ~10⁻¹⁵ seconds. Gamma synchrony (25 ms) impossible at 310 K.", delay: 600 },
    { text: "[CONCLUSION] OVS framework fails on all mathematical, empirical, and physical grounds.", delay: 800 }
  ];

  const runTestbenchSequence = () => {
    if (isTestbenchRunning) return;
    setIsTestbenchRunning(true);
    setTestbenchLines([]);

    let idx = 0;
    const executeNext = () => {
      if (idx < testbenchSteps.length) {
        setTestbenchLines(prev => [...prev, testbenchSteps[idx].text]);
        const delay = testbenchSteps[idx].delay;
        idx++;
        setTimeout(executeNext, delay);
      } else {
        setIsTestbenchRunning(false);
      }
    };
    executeNext();
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Link */}
        <div className="mb-8">
          <Link href="/resources" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" />
            Back to Resources
          </Link>
        </div>

        {/* Hero Section */}
        <div className="mb-16 space-y-4">
          <div className="flex items-center gap-2 text-blue-500 font-bold text-[10px] uppercase tracking-[0.2em]">
            <Atom className="w-4 h-4" />
            Research preprint review
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
            Deconstructing <br/> Orchestrated Variance Suppression.
          </h1>
          <p className="text-zinc-500 text-lg font-medium max-w-2xl leading-relaxed">
            A critical physics evaluation and mathematical deconstruction of the Orchestrated Variance Suppression (OVS) framework proposed by Prince T. Philip.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Interactive Simulators (7 Columns) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Math Simulator Card */}
            <div className="glass p-8 rounded-[2.5rem] bg-zinc-900/10 border border-white/5 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Calculator className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">OVS & Spacetime Foam Simulator</h3>
                    <p className="text-xs text-zinc-500 font-medium">Verify OVS claims against modern quantum gravity models</p>
                  </div>
                </div>
                <span className="text-[9px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
                  Interactive Model
                </span>
              </div>

              <div className="space-y-6 bg-black/40 p-6 rounded-3xl border border-white/5">
                {/* Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex justify-between">
                      <span>Planck Scale Variance (log₁₀)</span>
                      <span className="text-blue-400">10{getSuperscript(sigma)}</span>
                    </label>
                    <input 
                      type="range" 
                      min="-37" 
                      max="-33" 
                      value={sigma} 
                      onChange={(e) => setSigma(parseInt(e.target.value))}
                      className="w-full accent-blue-500 bg-zinc-800 rounded-lg cursor-pointer h-2" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex justify-between">
                      <span>Contributions (log₁₀ N)</span>
                      <span className="text-blue-400">10{getSuperscript(n)}</span>
                    </label>
                    <input 
                      type="range" 
                      min="3" 
                      max="7" 
                      value={n} 
                      onChange={(e) => setN(parseInt(e.target.value))}
                      className="w-full accent-blue-500 bg-zinc-800 rounded-lg cursor-pointer h-2" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex justify-between">
                      <span>Scaling Factor (log₁₀ S)</span>
                      <span className="text-blue-400">10{getSuperscript(s)}</span>
                    </label>
                    <input 
                      type="range" 
                      min="38" 
                      max="42" 
                      value={s} 
                      onChange={(e) => setS(parseInt(e.target.value))}
                      className="w-full accent-blue-500 bg-zinc-800 rounded-lg cursor-pointer h-2" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex justify-between">
                      <span>Physical Scale (l in meters)</span>
                      <span className="text-blue-400">{getLengthLabel(l)}</span>
                    </label>
                    <input 
                      type="range" 
                      min="-10" 
                      max="-1" 
                      value={l} 
                      onChange={(e) => setL(parseInt(e.target.value))}
                      className="w-full accent-blue-500 bg-zinc-800 rounded-lg cursor-pointer h-2" 
                    />
                  </div>
                </div>

                {/* Outputs */}
                <div className="border-t border-white/5 pt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-2xl">
                    <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider">OVS Macro Variance</span>
                    <span className="block text-base font-extrabold text-red-500 mt-1">{formatScientific(sigmaMacro)} m/s²</span>
                  </div>
                  <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-2xl">
                    <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Random Walk δl</span>
                    <span className="block text-base font-extrabold text-teal-450 mt-1">{formatScientific(rw)} m</span>
                  </div>
                  <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-2xl">
                    <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Holographic δl</span>
                    <span className="block text-base font-extrabold text-sky-400 mt-1">{formatScientific(holo)} m</span>
                  </div>
                </div>

                {/* Mismatch indicator */}
                <div className="p-4 bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/10 rounded-2xl flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest">Theoretical Discrepancy</span>
                    <p className="text-xs font-semibold text-zinc-300">The OVS model overestimates macroscopic fluctuations by:</p>
                  </div>
                  <span className="text-lg md:text-xl font-black text-red-500 font-mono">{ordersDiff} Orders</span>
                </div>
              </div>
            </div>

            {/* CLI Console Card */}
            <div className="glass p-8 rounded-[2.5rem] bg-zinc-900/10 border border-white/5 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Terminal className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">Sovereign Notary Console</h3>
                    <p className="text-xs text-zinc-500 font-medium">Auto-seal source code, Smart Contracts, & AI assets</p>
                  </div>
                </div>
                <a href="https://github.com/psycho-prince/quantumblue-cli" target="_blank" className="px-3 py-1 text-[9px] font-bold uppercase bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded flex items-center gap-1 cursor-pointer">
                  CLI Repo <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                Because physical structures cannot suppress gravity at the biological scale, quantum security must be handled mathematically at the digital core. Play with the commands of <code className="text-white">quantumblue-cli</code> to simulate post-quantum notarization.
              </p>

              {/* Console terminal emulator */}
              <div className="bg-black border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col font-mono text-xs">
                <div className="bg-zinc-900/60 px-5 py-3 border-b border-white/5 flex items-center justify-between">
                  <div className="flex space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-600 tracking-wider">BASH - quantumblue-cli</span>
                </div>
                <div className="p-6 text-blue-400 space-y-2 h-48 overflow-y-auto scrollbar-thin">
                  {terminalLines.map((line, i) => {
                    if (line.startsWith("$")) {
                      return (
                        <div key={i}>
                          <span className="text-teal-400">kali@resilience-node</span>:<span className="text-indigo-400">~</span> {line}
                        </div>
                      );
                    } else if (line.startsWith("[✓]")) {
                      return <div key={i} className="text-green-400">{line}</div>;
                    } else if (line.startsWith("[+]")) {
                      return <div key={i} className="text-sky-400">{line}</div>;
                    } else if (line.startsWith("//")) {
                      return <div key={i} className="text-zinc-600">{line}</div>;
                    } else {
                      return <div key={i} className="text-zinc-300">{line}</div>;
                    }
                  })}
                  {cliActiveKey && (
                    <div className="flex items-center">
                      <span className="w-1.5 h-3 bg-blue-400 ml-1 animate-pulse"></span>
                    </div>
                  )}
                </div>
              </div>

              {/* Command Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px] font-bold uppercase tracking-wider">
                <button 
                  disabled={!!cliActiveKey}
                  onClick={() => runCliCommand("init")}
                  className="py-3 bg-zinc-950 border border-white/5 hover:border-blue-500/30 text-zinc-300 hover:text-white rounded-2xl transition disabled:opacity-40"
                >
                  qb init
                </button>
                <button 
                  disabled={!!cliActiveKey}
                  onClick={() => runCliCommand("register")}
                  className="py-3 bg-zinc-950 border border-white/5 hover:border-blue-500/30 text-zinc-300 hover:text-white rounded-2xl transition disabled:opacity-40"
                >
                  qb register
                </button>
                <button 
                  disabled={!!cliActiveKey}
                  onClick={() => runCliCommand("seal")}
                  className="py-3 bg-zinc-950 border border-white/5 hover:border-blue-500/30 text-zinc-300 hover:text-white rounded-2xl transition disabled:opacity-40"
                >
                  qb seal
                </button>
                <button 
                  disabled={!!cliActiveKey}
                  onClick={() => runCliCommand("verify")}
                  className="py-3 bg-zinc-950 border border-white/5 hover:border-blue-500/30 text-zinc-300 hover:text-white rounded-2xl transition disabled:opacity-40"
                >
                  qb verify
                </button>
                <button 
                  disabled={!!cliActiveKey}
                  onClick={() => runCliCommand("status")}
                  className="py-3 bg-zinc-950 border border-white/5 hover:border-blue-500/30 text-zinc-300 hover:text-white rounded-2xl transition disabled:opacity-40 col-span-2 sm:col-span-1"
                >
                  qb status
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Academic Preprint & Testbench (5 Columns) */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
            
            {/* Academic Preprint Viewer */}
            <div className="glass p-8 rounded-[2.5rem] bg-zinc-900/10 border border-white/5 flex flex-col h-[400px]">
              <div className="flex items-center justify-between mb-4 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">Review Preprint</h3>
                    <p className="text-xs text-zinc-500 font-medium">arXiv / OSF Open Review</p>
                  </div>
                </div>
                <button 
                  onClick={copyCitation}
                  className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition flex items-center gap-1 cursor-pointer uppercase tracking-wider"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Citation
                    </>
                  )}
                </button>
              </div>

              {/* Paper Text */}
              <div className="flex-grow bg-black/60 border border-white/5 rounded-3xl p-6 overflow-y-auto text-xs text-zinc-400 space-y-6 scrollbar-thin select-text">
                <div className="text-center pb-4 border-b border-white/5">
                  <h4 className="text-sm font-bold text-white leading-relaxed">
                    A Critical Evaluation of the &quot;Orchestrated Variance Suppression&quot; Framework: Deconstructing Gravitational and Biological Incompatibilities
                  </h4>
                  <p className="text-[10px] text-zinc-500 font-semibold mt-1">July 2026 | Under Review</p>
                </div>

                <div className="space-y-2">
                  <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Abstract</span>
                  <p className="leading-relaxed text-justify text-zinc-400">
                    The &quot;Orchestrated Variance Suppression&quot; (OVS) framework, recently proposed by Prince T. Philip, attempts to reconcile the Penrose-Hameroff Orchestrated Objective Reduction (Orch OR) theory with quantum gravity by postulating that neural microtubules suppress macroscopic gravitational fluctuations by 15-19 orders of magnitude. This paper demonstrates through rigorous mathematical and physical analysis that the OVS framework rests on three foundationally invalid premises: (1) the erroneous application of the Classical Central Limit Theorem to quantum spacetime foam; (2) a fabricated &quot;Unobserved Gravity&quot; field that contradicts empirical astrophysical observations; and (3) the physical impossibility of &quot;gravitational Faraday cages,&quot; which violates the Weak Equivalence Principle of General Relativity.
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest">1. Introduction & Context</span>
                  <p className="leading-relaxed text-justify">
                    Recently, a derivative and highly controversial theoretical framework termed &quot;Orchestrated Variance Suppression&quot; (OVS) has surfaced, primarily authored by independent researcher Prince T. Philip. The model asserts: (1) Unobserved Gravity generates 10⁷ m/s² macroscopic variance; (2) microtubules act as gravitational Faraday cages; (3) this creates a stabilized envelope of spacetime; (4) structures evolved to support consciousness.
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest">2. Deconstructing the CLT Fallacy</span>
                  <p className="leading-relaxed text-justify text-zinc-400">
                    The OVS model applies the Classical Central Limit Theorem (CLT) to quantum foam. Given parameters: σ_Planck ~ 10⁻³⁵, contributions N = 10⁵, scaling S = 10⁴⁰, OVS claims σ_macro = √N × σ_Planck × S ≈ 3.16 × 10⁷ m/s². This calculation is physically invalid because spacetime geometry at quantum scales is not a pre-existing classical background, and metric fluctuations are fundamentally entangled rather than independent. Standard quantum gravity models scale non-linearly (Random Walk α=1/2, Holographic α=2/3), resulting in metric fluctuations on the order of 10⁻¹⁹ to 10⁻²⁴ m for biological scales—incomparable to OVS's claim.
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest">3. Astrophysical Contradictions</span>
                  <p className="leading-relaxed text-justify text-zinc-400">
                    If spacetime foam generated macroscopic variance of 10⁷ m/s², photons propagating across cosmological distances would undergo random diffusion, producing massive phase fluctuations. However, Hubble and Chandra images of cosmologically distant quasars display exceptional sharpness, indicating that the universe does not exhibit large-scale metric volatility. Lorentz invariance tests of gamma-ray bursts further establish that time-of-flight differences are infinitesimally small (~10⁻¹⁹ s), directly falsifying OVS.
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest">4. Equivalence Principle Violation</span>
                  <p className="leading-relaxed text-justify text-zinc-400">
                    The Weak Equivalence Principle (WEP) asserts inertial mass equals passive gravitational mass (m_i = m_g), meaning the trajectory of a freely falling body is independent of its structure. Einstein's elevator thought experiment shows that it is impossible to shield gravity because gravity is spacetime geometry, not a force propagating through a medium. Faraday cages work for electromagnetism due to negative and positive charges, but gravity has only a single positive charge type, meaning gravitational shielding cannot exist.
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest">5. Conclusions</span>
                  <p className="leading-relaxed text-justify text-zinc-400">
                    The OVS framework fails on mathematical, empirical, and physical grounds. The universe is empirically proven to be macroscopically smooth without biological suppression mechanisms. OVS must be classified as scientifically invalid.
                  </p>
                </div>
              </div>
            </div>

            {/* Experimental Testbench Card */}
            <div className="glass p-8 rounded-[2.5rem] bg-zinc-900/10 border border-white/5 flex flex-col h-[300px]">
              <div className="flex items-center justify-between mb-4 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <FlaskConical className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">Experimental Testbench</h3>
                    <p className="text-xs text-zinc-500 font-medium">Verify WEP suppression rates</p>
                  </div>
                </div>
                <button 
                  disabled={isTestbenchRunning}
                  onClick={runTestbenchSequence}
                  className="px-3.5 py-1.5 text-[9px] font-bold text-blue-400 border border-blue-500/30 hover:border-blue-500 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl transition duration-200 flex items-center gap-1 cursor-pointer disabled:opacity-40 uppercase tracking-wider"
                >
                  {isTestbenchRunning ? "Running..." : "Run Diagnostics"}
                </button>
              </div>

              {/* Console log output */}
              <div className="flex-grow bg-black border border-white/5 rounded-3xl overflow-hidden flex flex-col text-xs font-mono">
                <div className="flex-grow p-4 text-green-400 space-y-1 overflow-y-auto scrollbar-thin">
                  {testbenchLines.map((line, i) => {
                    let className = "text-zinc-300";
                    if (line.startsWith("[SYS]")) className = "text-blue-400";
                    else if (line.startsWith("[DATA]")) className = "text-zinc-500";
                    else if (line.startsWith("[RESULT") || line.startsWith("[CONCLUSION")) {
                      if (line.includes("FALSIFIED") || line.includes("fails") || line.includes("impossible")) {
                        className = "text-red-500 font-bold";
                      } else {
                        className = "text-green-400 font-bold";
                      }
                    }
                    return <div key={i} className={className}>{line}</div>;
                  })}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
