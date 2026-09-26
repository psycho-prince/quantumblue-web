"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Terminal, Shield, Home, RefreshCw, Cpu, Activity } from "lucide-react";

export default function NotFound() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [qubitPos, setQubitPos] = useState({ x: 50, y: 50 });
  const [highScore, setHighScore] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(true);
    moveQubit();
  };

  const moveQubit = () => {
    if (gameAreaRef.current) {
      const maxX = 90; // percentage
      const maxY = 90; // percentage
      const newX = Math.floor(Math.random() * maxX);
      const newY = Math.floor(Math.random() * maxY);
      setQubitPos({ x: newX, y: newY });
    }
  };

  const catchQubit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isPlaying) return;
    setScore((s) => s + 1);
    moveQubit();
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && isPlaying) {
      setIsPlaying(false);
      if (score > highScore) setHighScore(score);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, isPlaying, score, highScore]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center justify-center p-6 font-mono overflow-hidden relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-900/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="z-10 max-w-2xl w-full flex flex-col items-center space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-tighter">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-100">
            State Superposition Lost
          </h2>
          <p className="text-slate-400 max-w-md mx-auto">
            The page you're looking for has collapsed into a parallel reality. While you're here, try catching the rogue qubit.
          </p>
        </div>

        {/* Game Area */}
        <div 
          ref={gameAreaRef}
          className="relative w-full max-w-md h-64 sm:h-80 bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm group select-none"
          onClick={() => { if (isPlaying) setScore(s => Math.max(0, s - 1)) }}
        >
          {!isPlaying && timeLeft === 30 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md">
              <Activity className="w-12 h-12 text-cyan-400 mb-4 animate-pulse" />
              <button 
                onClick={startGame}
                className="px-6 py-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/20 transition-all font-semibold flex items-center gap-2"
              >
                <Terminal className="w-4 h-4" /> Initialize Qubit Catcher
              </button>
            </div>
          ) : !isPlaying && timeLeft === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md">
              <h3 className="text-2xl font-bold text-slate-100 mb-2">Simulation Ended</h3>
              <p className="text-slate-400 mb-4">You caught {score} qubits!</p>
              <button 
                onClick={startGame}
                className="px-6 py-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/20 transition-all font-semibold flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Restart Simulation
              </button>
            </div>
          ) : (
            <>
              <div className="absolute top-4 left-4 text-sm font-semibold text-slate-400 z-10 flex gap-4 pointer-events-none">
                <span>Time: <span className="text-cyan-400">{timeLeft}s</span></span>
                <span>Score: <span className="text-cyan-400">{score}</span></span>
              </div>
              
              <button
                className="absolute w-10 h-10 -ml-5 -mt-5 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)] flex items-center justify-center transition-all duration-200 ease-out animate-pulse"
                style={{ top: `${qubitPos.y}%`, left: `${qubitPos.x}%` }}
                onClick={catchQubit}
              >
                <Cpu className="w-5 h-5 text-slate-900 pointer-events-none" />
              </button>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center pt-4">
          <Link href="/" className="px-6 py-3 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg hover:bg-slate-700 transition-all font-semibold flex items-center gap-2">
            <Home className="w-4 h-4" /> Return to Base
          </Link>
          <Link href="/blog" className="px-6 py-3 bg-transparent text-slate-400 hover:text-cyan-400 transition-all font-semibold flex items-center gap-2">
            Read Security Logs <Shield className="w-4 h-4" />
          </Link>
        </div>
        
        {highScore > 0 && (
          <p className="text-slate-500 text-sm mt-8">
            High Score: {highScore}
          </p>
        )}
      </div>
    </div>
  );
}
