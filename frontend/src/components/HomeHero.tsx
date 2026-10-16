import React from "react";
import {
  Zap,
  ShieldAlert,
  ShieldCheck,
  GitPullRequest,
  Cpu,
  BarChart2,
  Terminal,
  ArrowRight,
  Flame,
  CheckCircle2,
  XCircle,
  Layers,
  Sparkles,
  Bot
} from "lucide-react";
import { sound } from "../utils/sound";

interface HomeHeroProps {
  onEnterConsole: () => void;
  onOpenSimulator: () => void;
  onOpenArchitecture: () => void;
  onOpenBenchmark: () => void;
  onOpenAIChat: () => void;
  onSelectPreset: (system: string, pkg: string, version: string) => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onEnterConsole,
  onOpenSimulator,
  onOpenArchitecture,
  onOpenBenchmark,
  onOpenAIChat,
  onSelectPreset
}) => {
  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-x-hidden relative">
      {/* Background Neon Glows & Grid Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="absolute -top-32 right-1/4 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-600/10 rounded-full blur-[160px]" />
      </div>

      {/* Cyber Grid Lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "48px 48px"
        }}
      />

      {/* Hero Section Container */}
      <div className="relative z-10 max-w-[1500px] w-full mx-auto px-4 sm:px-8 py-10 sm:py-16 flex flex-col items-center text-center space-y-8">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-semibold">
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>WeMakeDevs x FalkorDB Hackathon 2026</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-mono font-semibold">
            <Cpu className="w-3.5 h-3.5 text-violet-400" />
            <span>Track 01: Agents That Act on Connected Data</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>FalkorDB GraphBLAS C-Engine</span>
          </div>
        </div>

        {/* Hero Main Headline */}
        <div className="max-w-4xl space-y-4">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
            The Autonomous Supply-Chain{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-amber-300 bg-clip-text text-transparent">
              Min-Cut Agent
            </span>
          </h1>
          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Why drown in 50 breaking PRs from Snyk when FalkorDB’s GraphBLAS computes the exact{" "}
            <span className="text-amber-300 font-semibold underline decoration-amber-400/50 underline-offset-4">
              1-PR minimum bottleneck cut
            </span>{" "}
            in 15 milliseconds?
          </p>
        </div>

        {/* High-Impact Primary Call to Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => {
              sound.playClick();
              onEnterConsole();
            }}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm tracking-wide uppercase flex items-center gap-2.5 shadow-2xl shadow-indigo-500/30 transition transform hover:-translate-y-0.5 ring-1 ring-white/20"
          >
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>Launch Live Mission Console</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenSimulator();
            }}
            className="px-6 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm tracking-wide uppercase flex items-center gap-2 border border-slate-700/80 hover:border-slate-600 shadow-xl transition transform hover:-translate-y-0.5"
          >
            <Flame className="w-4 h-4 text-rose-400" />
            <span>Interactive Exploit Simulator</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenAIChat();
            }}
            className="px-5 py-4 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/50 text-indigo-200 border border-indigo-500/30 text-sm font-semibold flex items-center gap-2 transition"
          >
            <Bot className="w-4 h-4 text-indigo-400" />
            <span>Ask AI Defense Copilot</span>
          </button>
        </div>

        {/* 4 Quantitative Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl pt-4 text-left">
          <div className="bg-slate-900/80 border border-slate-800/90 hover:border-indigo-500/50 rounded-2xl p-5 shadow-xl transition group">
            <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400 font-mono tracking-tight group-hover:scale-105 transition-transform origin-left">
              15.2 ms
            </div>
            <div className="text-xs uppercase font-mono tracking-wider text-slate-400 font-semibold mt-1">
              Autonomous Min-Cut Latency
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              FalkorDB GraphBLAS C-engine solves Edmonds-Karp 24.8x faster than Python NetworkX.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/90 hover:border-emerald-500/50 rounded-2xl p-5 shadow-xl transition group">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono tracking-tight group-hover:scale-105 transition-transform origin-left">
              97.8%
            </div>
            <div className="text-xs uppercase font-mono tracking-wider text-slate-400 font-semibold mt-1">
              Alert Fatigue Reduction
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              1 minimum bottleneck cut neutralizes 50 transitive CVE attack paths simultaneously.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/90 hover:border-amber-500/50 rounded-2xl p-5 shadow-xl transition group">
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-300 font-mono tracking-tight group-hover:scale-105 transition-transform origin-left">
              0 Drift
            </div>
            <div className="text-xs uppercase font-mono tracking-wider text-slate-400 font-semibold mt-1">
              Zero Breaking API Changes
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              SemVer-weighted capacities prioritize non-breaking patch/minor overrides over major bumps.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/90 hover:border-violet-500/50 rounded-2xl p-5 shadow-xl transition group">
            <div className="text-3xl sm:text-4xl font-extrabold text-violet-400 font-mono tracking-tight group-hover:scale-105 transition-transform origin-left">
              2.8 ms
            </div>
            <div className="text-xs uppercase font-mono tracking-wider text-slate-400 font-semibold mt-1">
              GRAPH.COPY Sandboxing
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              Instant copy-on-write sandbox validation asserts residual flow == 0 before human PR proposal.
            </p>
          </div>
        </div>

        {/* Head-to-Head Comparison: Snyk vs ChokePoint */}
        <div className="w-full max-w-5xl bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-left mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Architectural Breakdown
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                Legacy Greedy Scanners vs FalkorDB GraphBLAS Min-Cut
              </h2>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onOpenBenchmark();
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 border border-slate-700 self-start sm:self-auto transition"
            >
              <BarChart2 className="w-4 h-4 text-indigo-400" />
              <span>View Rule 3 Benchmark</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            {/* Left: The Snyk Problem */}
            <div className="bg-slate-950/80 border border-rose-900/40 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase font-mono">
                <ShieldAlert className="w-4 h-4" />
                <span>Legacy Snyk / Dependabot / npm audit</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <span><strong>50 Separate PRs:</strong> Opens individual alerts for every transitive leaf CVE without topology awareness.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <span><strong>High Breaking Risk:</strong> Upgrades transitive leaves directly, breaking upstream parent libraries and crashing CI.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Weeks of Manual Triage:</strong> Engineering teams spend hundreds of hours deciding which PR to merge first.</span>
                </li>
              </ul>
            </div>

            {/* Right: The ChokePoint FalkorDB Solution */}
            <div className="bg-slate-950/80 border border-indigo-500/40 rounded-xl p-5 space-y-4 ring-1 ring-indigo-500/20">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase font-mono">
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>ChokePoint FalkorDB Min-Cut Engine</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>1 Minimum Cut PR:</strong> Finds the global vertex bottleneck that severs all 50 attack paths at once.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Zero Breaking Changes:</strong> SemVer weights ensure only compatible patch/minor overrides are selected.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Speculative Sandboxing:</strong> Native <code className="text-amber-300 font-mono">GRAPH.COPY</code> proves residual flow == 0 in 2.8ms before PR generation.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 1-Click Interactive Preset Launchers */}
        <div className="w-full max-w-5xl space-y-4 pt-4 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-300">
                Pre-Warmed Real-World Battleground Targets (15ms Verified)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-500">Click to instantly inspect in War Room</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                sound.playClick();
                onSelectPreset("npm", "express", "4.16.0");
                onEnterConsole();
              }}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-850 text-left transition group shadow-lg"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-white group-hover:text-indigo-300 transition">express@4.16.0</span>
                <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-semibold text-[10px]">8 CVEs</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Deep multi-hop attack paths via <code className="text-slate-300">send</code>, <code className="text-slate-300">qs</code>, and <code className="text-slate-300">path-to-regexp</code>.
              </p>
              <div className="mt-3 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span>Chokepoint Cut: body-parser & send</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onSelectPreset("npm", "mocha", "8.0.0");
                onEnterConsole();
              }}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-850 text-left transition group shadow-lg"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-white group-hover:text-indigo-300 transition">mocha@8.0.0</span>
                <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-semibold text-[10px]">3 CVEs</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Command injection vulnerability in transitive notification package <code className="text-slate-300">growl</code>.
              </p>
              <div className="mt-3 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span>Chokepoint Cut: growl@1.10.5</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onSelectPreset("npm", "axios", "0.21.1");
                onEnterConsole();
              }}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-850 text-left transition group shadow-lg"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-white group-hover:text-indigo-300 transition">axios@0.21.1</span>
                <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-semibold text-[10px]">1 CVE</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                SSRF credential leakage via transitive HTTP redirect handler <code className="text-slate-300">follow-redirects</code>.
              </p>
              <div className="mt-3 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span>Chokepoint Cut: follow-redirects@1.14.8</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-12 text-xs text-slate-500 font-mono">
          ChokePoint Autonomous Agent &bull; Powered by FalkorDB GraphBLAS &bull; Track 01 Hackathon Submission
        </div>
      </div>
    </div>
  );
};
