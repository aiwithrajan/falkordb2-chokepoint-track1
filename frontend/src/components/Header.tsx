import React from "react";
import { Zap, ShieldCheck, Cpu, BarChart2 } from "lucide-react";

interface HeaderProps {
  falkorConnected: boolean;
  onOpenBenchmark: () => void;
}

export const Header: React.FC<HeaderProps> = ({ falkorConnected, onOpenBenchmark }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3.5">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
          <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-2">
              ChokePoint
            </h1>
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Track 01 • Agent That Acts
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Autonomous Dependency Min-Cut Agent • Powered by FalkorDB GraphBLAS
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Rule 3 Benchmark Trigger */}
        <button
          onClick={onOpenBenchmark}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
        >
          <BarChart2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Rule 3 Ablation Benchmark</span>
        </button>

        {/* MCP Status */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-md bg-slate-950/80 border border-slate-800 text-slate-300">
          <Cpu className="w-3.5 h-3.5 text-violet-400" />
          <span>FastMCP: 6 Tools</span>
        </div>

        {/* FalkorDB Engine Status */}
        <div
          className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-md border ${
            falkorConnected
              ? "bg-emerald-950/50 text-emerald-300 border-emerald-800/60"
              : "bg-rose-950/50 text-rose-300 border-rose-800/60"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              falkorConnected ? "bg-emerald-400 animate-pulse" : "bg-rose-400"
            }`}
          />
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{falkorConnected ? "FalkorDB GraphBLAS" : "DB Disconnected"}</span>
        </div>
      </div>
    </header>
  );
};
