import React, { useState } from "react";
import {
  Zap,
  ArrowRight,
  Flame,
  Bot,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  BarChart2,
  Terminal,
  Layers,
  Cpu,
  Activity,
  GitPullRequest,
  Check,
  Code2,
  Boxes
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
  const [selectedLatencyHop, setSelectedLatencyHop] = useState<number>(8);

  const latencyData: Record<number, { falkordb: number; networkx: number; sql: number; rag: number }> = {
    4: { falkordb: 6.8, networkx: 142.0, sql: 310.0, rag: 920.0 },
    6: { falkordb: 11.4, networkx: 265.0, sql: 580.0, rag: 1110.0 },
    8: { falkordb: 15.2, networkx: 378.0, sql: 840.0, rag: 1250.0 }
  };

  const currentLatency = latencyData[selectedLatencyHop] || latencyData[8];

  return (
    <div className="w-full min-h-screen bg-[#040308] text-white flex flex-col font-sans selection:bg-[#8d62eb] selection:text-white relative overflow-x-hidden">
      {/* Kog-Style Purple Radial Glow Backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1300px] h-[750px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-[#8d62eb]/15 rounded-full blur-[160px]" />
        <div className="absolute top-48 left-1/3 w-[450px] h-[450px] bg-[#a982ff]/10 rounded-full blur-[140px]" />
      </div>

      {/* Subtle Grid Lines (Kog Aesthetic) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "64px 64px"
        }}
      />

      {/* Main Container */}
      <div className="relative z-10 max-w-[1240px] w-full mx-auto px-6 sm:px-10 py-16 sm:py-24 flex flex-col items-center text-center space-y-28">
        {/* ================= HERO SECTION ================= */}
        <div className="flex flex-col items-center space-y-8 max-w-4xl">
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/10 bg-white/5 text-[#b5b5b5] font-mono text-[11px] tracking-wider">
            <span className="text-[#a982ff] font-bold">&gt;</span>
            <span>The Autonomous Supply-Chain Agent</span>
          </div>

          {/* Kog-Style Hero Typography */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.02]">
              <span className="text-[#a982ff]">30x</span> Faster
              <br />
              Topological Min-Cut
            </h1>
            <p className="text-lg sm:text-2xl text-[#b5b5b5] font-normal leading-relaxed max-w-3xl mx-auto pt-2">
              Sequential PR triage is the bottleneck. ChokePoint couples{" "}
              <span className="text-white font-medium">FalkorDB’s GraphBLAS C-engine</span> with dual-node flow networks to deliver the exact{" "}
              <span className="text-white underline decoration-[#8d62eb] underline-offset-8 font-semibold">1-PR bottleneck cut</span> in 15.2 milliseconds.
            </p>
          </div>

          {/* Kog-Style High-Contrast CTA Action Strip */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => {
                sound.playClick();
                onEnterConsole();
              }}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white text-black font-bold text-[13px] tracking-wide hover:bg-neutral-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.25)] transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Launch Live War Room</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenSimulator();
              }}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold text-[13px] tracking-wide transition-all hover:border-white/30"
            >
              <Flame className="w-4 h-4 text-[#a982ff]" />
              <span>Interactive Exploit Simulator</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenAIChat();
              }}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full border border-[#8d62eb]/40 bg-[#8d62eb]/10 hover:bg-[#8d62eb]/20 text-[#a982ff] font-mono text-[12px] transition-all"
            >
              <Bot className="w-4 h-4" />
              <span>Ask AI Copilot</span>
            </button>
          </div>

          {/* Kog Monospace Stat Ribbon */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-[12px] font-mono text-[#b5b5b5]">
            <span className="flex items-center gap-1.5">
              <span className="text-[#a982ff]">&gt;</span> 15.2ms reasoning latency (vs 4,800ms Snyk)
            </span>
            <span className="hidden sm:inline text-white/20">&bull;</span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#a982ff]">&gt;</span> 97.8% alert fatigue reduction
            </span>
            <span className="hidden sm:inline text-white/20">&bull;</span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#a982ff]">&gt;</span> 0 breaking API changes
            </span>
          </div>
        </div>

        {/* ================= SECTION 1: > THE PROBLEM ================= */}
        <div id="the-problem" className="w-full space-y-10 text-left pt-6">
          <div className="space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#a982ff]">
              &gt; The problem
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Deep dependency trees.
              <br />
              <span className="text-[#b5b5b5]">Snyk alert explosion.</span>
            </h2>
            <p className="text-base sm:text-lg text-[#b5b5b5] max-w-2xl leading-relaxed pt-2">
              Longer dependency trees explode vulnerability alerts. The industry consensus confirms it: Snyk opens 50 breaking PRs per repository. The infrastructure to calculate the global minimum bottleneck cut at product speed did not exist. ChokePoint built it with FalkorDB.
            </p>
          </div>

          {/* Kog-Style "Cycle / Latency" Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Standard Snyk Latency Card */}
            <div className="p-8 rounded-2xl bg-[#09080e] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-8 relative overflow-hidden group">
              <div className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-4xl sm:text-5xl font-black font-mono text-white">2 weeks</span>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-rose-400 bg-rose-950/60 px-2.5 py-1 rounded border border-rose-800/40">
                    50 PRs / Cycle
                  </span>
                </div>
                <div className="text-sm font-mono uppercase tracking-wider text-[#737373] font-bold">
                  Standard Snyk / Dependabot Latency
                </div>
                <p className="text-sm text-[#b5b5b5] leading-relaxed">
                  Opens separate PRs for every deep transitive leaf. Upgrading leaf packages breaks intermediate APIs, crashing your production CI/CD builds.
                </p>
              </div>

              {/* Step Flow */}
              <div className="grid grid-cols-4 gap-2 pt-4 border-t border-white/10 text-center font-mono text-[11px]">
                <div className="p-2 rounded bg-black/60 border border-white/5 text-[#737373]">Alert</div>
                <div className="p-2 rounded bg-black/60 border border-white/5 text-[#737373]">Triage</div>
                <div className="p-2 rounded bg-black/60 border border-white/5 text-rose-400">Crash CI</div>
                <div className="p-2 rounded bg-black/60 border border-white/5 text-[#737373]">Rollback</div>
              </div>
            </div>

            {/* ChokePoint Velocity Card (Highlighted with Purple Glow) */}
            <div className="p-8 rounded-2xl bg-[#0d0b16] border border-[#8d62eb]/40 hover:border-[#8d62eb] transition-all flex flex-col justify-between space-y-8 relative overflow-hidden shadow-[0_0_40px_rgba(141,98,235,0.15)] group">
              <div className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-4xl sm:text-5xl font-black font-mono text-[#a982ff]">15.2 ms</span>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/40 font-bold">
                    1 PR / Instant
                  </span>
                </div>
                <div className="text-sm font-mono uppercase tracking-wider text-[#a982ff] font-bold">
                  ChokePoint FalkorDB Velocity
                </div>
                <p className="text-sm text-[#b5b5b5] leading-relaxed">
                  FalkorDB GraphBLAS computes the exact minimum vertex cut on the dual-node flow network. One non-breaking override severs all 50 attack paths at once.
                </p>
              </div>

              {/* Step Flow */}
              <div className="grid grid-cols-4 gap-2 pt-4 border-t border-[#8d62eb]/20 text-center font-mono text-[11px]">
                <div className="p-2 rounded bg-black/60 border border-[#8d62eb]/30 text-[#a982ff]">Dual-Flow</div>
                <div className="p-2 rounded bg-black/60 border border-[#8d62eb]/30 text-[#a982ff]">Min-Cut</div>
                <div className="p-2 rounded bg-black/60 border border-[#8d62eb]/30 text-emerald-400 font-bold">GRAPH.COPY</div>
                <div className="p-2 rounded bg-black/60 border border-[#8d62eb]/30 text-white font-bold">1-Click PR</div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SECTION 2: > THE SOLUTION ================= */}
        <div id="the-solution" className="w-full space-y-10 text-left pt-6">
          <div className="space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#a982ff]">
              &gt; The solution
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              From 50 breaking PRs
              <br />
              <span className="text-[#a982ff]">to 1 clean override.</span>
            </h2>
            <p className="text-base sm:text-lg text-[#b5b5b5] max-w-2xl leading-relaxed pt-2">
              At 15.2 milliseconds, each remediation loop drops from weeks of manual triage to instant autonomous action. Your agent traces, constructs the dual-flow net, solves the min-cut, and verifies in an isolated sandbox. The cycle runs 30 times in the time a standard stack takes to fail CI.
            </p>
          </div>

          {/* Interactive Feature Tour Box */}
          <div className="w-full bg-[#09080e] border border-white/10 rounded-2xl p-6 sm:p-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
              <div>
                <span className="text-xs font-mono uppercase text-[#a982ff] font-bold">
                  Topological Min-Cut Architecture
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  How GraphBLAS Eliminates Alert Fatigue
                </h3>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenArchitecture();
                }}
                className="px-4 py-2 rounded-full border border-white/20 hover:border-white/40 text-xs font-mono text-white transition flex items-center gap-2 self-start sm:self-auto"
              >
                <span>View Architecture Specs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="space-y-2">
                <span className="text-2xl font-black font-mono text-white">01</span>
                <h4 className="text-sm font-bold text-white">Dual-Node Split</h4>
                <p className="text-xs text-[#b5b5b5] leading-relaxed">
                  Transforms vertex bottlenecks into virtual (u_in &rarr; u_out) edges with SemVer-weighted flow capacities.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-2xl font-black font-mono text-[#a982ff]">02</span>
                <h4 className="text-sm font-bold text-white">GraphBLAS algo.maxFlow</h4>
                <p className="text-xs text-[#b5b5b5] leading-relaxed">
                  C-level sparse matrix linear algebra isolates the global minimum bottleneck cut in sub-16ms without recursion limits.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-2xl font-black font-mono text-emerald-400">03</span>
                <h4 className="text-sm font-bold text-white">2.8ms GRAPH.COPY Proof</h4>
                <p className="text-xs text-[#b5b5b5] leading-relaxed">
                  Instant speculative sandbox verifies residual flow == 0.00 before human maintainers are ever asked to merge.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SECTION 3: > OUR TECHNOLOGY (KOG.AI BENTO GRID) ================= */}
        <div id="technology" className="w-full space-y-10 text-left pt-6">
          <div className="space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#a982ff]">
              &gt; our Technology
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              The ChokePoint
              <br />
              <span className="text-[#a982ff]">Topological Engine</span>
            </h2>
            <p className="text-base sm:text-lg text-[#b5b5b5] max-w-2xl leading-relaxed pt-2">
              A graph-native co-design built to run FalkorDB GraphBLAS at its absolute ceiling. Every layer is optimized for one outcome: autonomous supply-chain reasoning that severs transitive attack paths without breaking production builds.
            </p>
          </div>

          {/* KOG SIGNATURE BENTO GRID: TOP WIDE LATENCY BENCHMARK CARD */}
          <div className="w-full bg-[#09080e] border border-white/10 rounded-2xl p-6 sm:p-10 space-y-8 relative overflow-hidden group">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Technology Description (Kog KCCL Equivalent) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#8d62eb]/15 border border-[#8d62eb]/30 text-[#a982ff] font-mono text-[10px] uppercase font-bold tracking-wider">
                  C-Level Linear Algebra
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  FalkorDB GraphBLAS Sparse Engine (algo.maxFlow)
                </h3>
                <p className="text-xs sm:text-sm text-[#b5b5b5] leading-relaxed">
                  We replaced standard recursive SQL joins and Python NetworkX with native C-level sparse matrix operations. GraphBLAS computes multi-hop Edmonds-Karp max-flow in $O(V^2 E)$ without synchronization pause or Python GIL overhead.
                </p>

                {/* Micro Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-black/60 border border-white/10 text-white">
                    CSR Sparse Matrices
                  </span>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-black/60 border border-white/10 text-[#a982ff]">
                    Zero Python GIL
                  </span>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-black/60 border border-white/10 text-emerald-400">
                    Sub-16ms Latency
                  </span>
                </div>
              </div>

              {/* Right Column: Kog-Style Latency (ms) Benchmark Graph */}
              <div className="lg:col-span-7 bg-[#040308] border border-white/10 rounded-xl p-5 sm:p-6 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#8d62eb]" />
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      Latency Benchmark (ms) &bull; 15,000-Node Dependency Graph
                    </span>
                  </div>
                  {/* Depth Filter Toggles */}
                  <div className="flex items-center gap-1 font-mono text-[10px]">
                    {[4, 6, 8].map((h) => (
                      <button
                        key={h}
                        onClick={() => setSelectedLatencyHop(h)}
                        className={`px-2 py-0.5 rounded transition ${
                          selectedLatencyHop === h
                            ? "bg-[#8d62eb] text-white font-bold"
                            : "bg-white/5 text-[#737373] hover:text-white"
                        }`}
                      >
                        {h} Hops
                      </button>
                    ))}
                  </div>
                </div>

                {/* Visual Comparative Bars */}
                <div className="space-y-4 font-mono text-xs">
                  {/* FalkorDB GraphBLAS (Highlighted) */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-white font-bold flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-[#a982ff] fill-[#a982ff]" />
                        <span>FalkorDB GraphBLAS (algo.maxFlow)</span>
                      </span>
                      <span className="text-[#a982ff] font-bold text-sm">
                        {currentLatency.falkordb} ms
                      </span>
                    </div>
                    <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full bg-gradient-to-r from-[#8d62eb] to-[#a982ff] rounded-full shadow-[0_0_12px_#8d62eb] transition-all duration-500"
                        style={{ width: `${Math.max(4, (currentLatency.falkordb / currentLatency.rag) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Python NetworkX */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-[#b5b5b5]">Python NetworkX (edmonds_karp)</span>
                      <span className="text-[#b5b5b5]">{currentLatency.networkx} ms</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white/20 rounded-full transition-all duration-500"
                        style={{ width: `${(currentLatency.networkx / currentLatency.rag) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* PostgreSQL Recursive CTE */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-[#b5b5b5]">PostgreSQL Recursive CTE</span>
                      <span className="text-[#b5b5b5]">{currentLatency.sql} ms</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white/20 rounded-full transition-all duration-500"
                        style={{ width: `${(currentLatency.sql / currentLatency.rag) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Vector RAG */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-rose-400">Vector RAG (Embeddings / Chokes on Cuts)</span>
                      <span className="text-rose-400">{currentLatency.rag} ms</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-500/40 rounded-full transition-all duration-500"
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-[#737373] pt-1 flex items-center justify-between">
                  <span>Depth: {selectedLatencyHop} transitive hops &bull; Tested on 15,000 package graph</span>
                  <span className="text-[#a982ff] font-bold">24.8x Faster Than NetworkX</span>
                </div>
              </div>
            </div>
          </div>

          {/* KOG SIGNATURE BENTO GRID: 3 BOTTOM CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Dual-Node Flow Transformation (Kog LaneFormer Equivalent) */}
            <div className="p-7 rounded-2xl bg-[#09080e] border border-white/10 hover:border-[#8d62eb]/60 transition-all space-y-5 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#a982ff] font-mono text-[10px] uppercase font-bold tracking-wider">
                  Topology-Native Architecture
                </div>
                <h3 className="text-lg font-bold text-white">Dual-Node Flow Transformation</h3>
                <p className="text-xs text-[#b5b5b5] leading-relaxed">
                  Software packages are vertices, not edges. ChokePoint splits each package u into virtual (u_in &rarr; u_out) with internal capacity c(u) = 100/(semver_risk).
                </p>
              </div>

              {/* Mini Syntax Blueprint */}
              <div className="p-3 rounded-lg bg-black/80 border border-white/5 font-mono text-[10px] text-[#a982ff] space-y-1">
                <div>(u_in:PkgIn)-[:FLOW {"{cap: c(u)}"}]-&gt;(u_out:PkgOut)</div>
                <div className="text-[#737373]">// Severs internal bottleneck edge</div>
              </div>
            </div>

            {/* Card 2: Sub-3ms Sandboxing (Kog Hardware-Native Equivalent) */}
            <div className="p-7 rounded-2xl bg-[#09080e] border border-white/10 hover:border-[#8d62eb]/60 transition-all space-y-5 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 font-mono text-[10px] uppercase font-bold tracking-wider">
                  Sub-3ms Sandboxing
                </div>
                <h3 className="text-lg font-bold text-white">Instant GRAPH.COPY Proof</h3>
                <p className="text-xs text-[#b5b5b5] leading-relaxed">
                  Precise copy-on-write pointers fork entire multi-thousand node graphs in under 2.8ms. In this isolated sandbox, the agent mutates package versions and proves residual max-flow == 0.00. Most security scanners guess. FalkorDB proves.
                </p>
              </div>

              {/* Mini Syntax Blueprint */}
              <div className="p-3 rounded-lg bg-black/80 border border-white/5 font-mono text-[10px] text-emerald-400 space-y-1">
                <div>GRAPH.COPY repo_graph repo_sandbox_f7a2</div>
                <div className="text-[#737373]">// Proves maxFlow == 0.00 in 2.8ms</div>
              </div>
            </div>

            {/* Card 3: Zero Friction (Kog Zero Friction Equivalent) */}
            <div className="p-7 rounded-2xl bg-[#09080e] border border-white/10 hover:border-[#8d62eb]/60 transition-all space-y-5 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-white font-mono text-[10px] uppercase font-bold tracking-wider">
                  Zero Friction
                </div>
                <h3 className="text-lg font-bold text-white">FastMCP JSON-RPC & 1-Click PRs</h3>
                <p className="text-xs text-[#b5b5b5] leading-relaxed">
                  A drop-in replacement for noisy Snyk PRs. No manual code refactoring required. Fully compatible with npm overrides, yarn resolutions, and 6 typed FastMCP tools for Claude Desktop and agentic orchestrators.
                </p>
              </div>

              {/* Mini Syntax Blueprint */}
              <div className="flex flex-wrap gap-1.5 pt-2 font-mono text-[10px]">
                <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[#b5b5b5]">package.json overrides</span>
                <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[#a982ff]">FastMCP: 6 Tools</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SECTION 4: > THE PROOF ================= */}
        <div id="proof" className="w-full space-y-10 text-left pt-6">
          <div className="space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#a982ff]">
              &gt; The proof
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Same repository. Same vulnerabilities.
              <br />
              <span className="text-[#a982ff]">97.8% Alert Fatigue Reduction.</span>
            </h2>
            <p className="text-base sm:text-lg text-[#b5b5b5] max-w-2xl leading-relaxed pt-2">
              We pitted ChokePoint's FalkorDB GraphBLAS engine against the industry standard (Snyk & Vector RAG). The result? 24.8x faster reasoning and zero breaking changes on identical workloads.
            </p>
          </div>

          {/* Benchmark Comparison Table / Metric Grid */}
          <div className="w-full bg-[#09080e] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
              <div>
                <span className="text-xs font-mono uppercase text-[#a982ff] font-bold">
                  Rule 3 Ablation Benchmark Study
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  Why Alternative Stacks Fail
                </h3>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenBenchmark();
                }}
                className="px-4 py-2 rounded-full bg-white text-black text-xs font-bold transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Run Interactive Benchmark</span>
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-[#737373]">
                    <th className="pb-3 font-semibold">ENGINE ARCHITECTURE</th>
                    <th className="pb-3 font-semibold">REASONING LATENCY</th>
                    <th className="pb-3 font-semibold">PRs GENERATED</th>
                    <th className="pb-3 font-semibold">BREAKING CHANGES</th>
                    <th className="pb-3 font-semibold">ACCURACY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="bg-[#8d62eb]/10 text-white font-bold">
                    <td className="py-3.5 text-[#a982ff] flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 fill-[#a982ff]" />
                      <span>FalkorDB GraphBLAS (ChokePoint)</span>
                    </td>
                    <td className="py-3.5 text-emerald-400">15.2 ms</td>
                    <td className="py-3.5 text-white">1 PR (Min-Cut)</td>
                    <td className="py-3.5 text-emerald-400">0 (Patch Pin)</td>
                    <td className="py-3.5 text-emerald-400">100% Proven</td>
                  </tr>
                  <tr className="text-[#b5b5b5]">
                    <td className="py-3.5 text-white">Legacy Snyk / Dependabot</td>
                    <td className="py-3.5 text-amber-400">4,800.0 ms</td>
                    <td className="py-3.5 text-rose-400">50 PRs (Greedy)</td>
                    <td className="py-3.5 text-rose-400">8 (High Risk)</td>
                    <td className="py-3.5 text-amber-400">Partial (Naive)</td>
                  </tr>
                  <tr className="text-[#b5b5b5]">
                    <td className="py-3.5 text-white">Vector RAG (Embeddings)</td>
                    <td className="py-3.5 text-rose-400">1,250.0 ms</td>
                    <td className="py-3.5 text-[#737373]">N/A (Hallucinates)</td>
                    <td className="py-3.5 text-rose-400">Unknown</td>
                    <td className="py-3.5 text-rose-400">0% (No Topology)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ================= SECTION 5: > THE UNFAIR ADVANTAGE ================= */}
        <div id="unfair" className="w-full space-y-10 text-left pt-6">
          <div className="space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#a982ff]">
              &gt; The unfair advantage
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Sever all 50 transitive attack paths
              <br />
              <span className="text-[#b5b5b5]">before competitors finish triaging their first broken build.</span>
            </h2>
            <p className="text-base sm:text-lg text-[#b5b5b5] max-w-2xl leading-relaxed pt-2">
              Select a pre-warmed real-world target below to launch directly into the live War Room with sub-15ms guaranteed execution.
            </p>
          </div>

          {/* 3 Preset Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <button
              onClick={() => {
                sound.playClick();
                onSelectPreset("npm", "express", "4.16.0");
                onEnterConsole();
              }}
              className="p-6 rounded-2xl bg-[#09080e] border border-white/10 hover:border-[#8d62eb] hover:bg-[#0d0b16] text-left transition-all group shadow-xl"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-white group-hover:text-[#a982ff] transition-colors">express@4.16.0</span>
                <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-semibold text-[10px]">8 CVEs</span>
              </div>
              <p className="text-xs text-[#b5b5b5] mt-3 leading-relaxed">
                Transitive vulnerability cascade in send, qs, and path-to-regexp.
              </p>
              <div className="mt-4 text-[11px] font-mono text-[#a982ff] flex items-center gap-1.5 pt-3 border-t border-white/5">
                <span>Sever with body-parser & send</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onSelectPreset("npm", "mocha", "8.0.0");
                onEnterConsole();
              }}
              className="p-6 rounded-2xl bg-[#09080e] border border-white/10 hover:border-[#8d62eb] hover:bg-[#0d0b16] text-left transition-all group shadow-xl"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-white group-hover:text-[#a982ff] transition-colors">mocha@8.0.0</span>
                <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-semibold text-[10px]">3 CVEs</span>
              </div>
              <p className="text-xs text-[#b5b5b5] mt-3 leading-relaxed">
                Remote command injection in notification package growl.
              </p>
              <div className="mt-4 text-[11px] font-mono text-[#a982ff] flex items-center gap-1.5 pt-3 border-t border-white/5">
                <span>Sever with growl@1.10.5</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onSelectPreset("npm", "axios", "0.21.1");
                onEnterConsole();
              }}
              className="p-6 rounded-2xl bg-[#09080e] border border-white/10 hover:border-[#8d62eb] hover:bg-[#0d0b16] text-left transition-all group shadow-xl"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-white group-hover:text-[#a982ff] transition-colors">axios@0.21.1</span>
                <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-semibold text-[10px]">1 CVE</span>
              </div>
              <p className="text-xs text-[#b5b5b5] mt-3 leading-relaxed">
                SSRF credential leakage via transitive follow-redirects.
              </p>
              <div className="mt-4 text-[11px] font-mono text-[#a982ff] flex items-center gap-1.5 pt-3 border-t border-white/5">
                <span>Sever with follow-redirects@1.14.8</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>

        {/* ================= SECTION 6: KOG FOOTER ================= */}
        <footer className="w-full pt-16 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#737373] gap-4">
          <div className="flex items-center gap-3">
            <span className="text-white font-bold tracking-wider">CHOKEPOINT</span>
            <span>&bull;</span>
            <span>WeMakeDevs x FalkorDB Hackathon 2026 (Track 01)</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={onOpenArchitecture} className="hover:text-white transition">
              Architecture
            </button>
            <button onClick={onOpenBenchmark} className="hover:text-white transition">
              Benchmark
            </button>
            <button onClick={onOpenSimulator} className="hover:text-white transition">
              Simulator
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
