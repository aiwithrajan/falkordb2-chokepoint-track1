import React from "react";
import { Terminal, Clock, CheckCircle, ShieldAlert, Cpu, CheckCircle2, Zap } from "lucide-react";
import type { TraceStep, AnalysisResult } from "../types";

interface AgentTelemetryProps {
  trace: TraceStep[];
  result: AnalysisResult | null;
  isLoading: boolean;
}

export const AgentTelemetry: React.FC<AgentTelemetryProps> = ({ trace, result, isLoading }) => {
  return (
    <div className="bg-[#09080e] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col h-full min-h-[560px] text-left font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[#a982ff] font-mono text-sm font-bold">&gt;</span>
          <h2 className="text-xs uppercase tracking-wider font-mono font-bold text-white flex items-center gap-2">
            <span>Agent Reasoning Telemetry</span>
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          {isLoading && (
            <span className="flex items-center gap-1.5 text-[#a982ff] bg-[#8d62eb]/15 px-3 py-1 rounded-full border border-[#8d62eb]/40 text-[10px] uppercase font-bold animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a982ff] animate-ping" />
              Deciding &amp; Acting...
            </span>
          )}
          {result && (
            <span className="text-[11px] text-[#b5b5b5] flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3 text-[#737373]" />
              {result.total_duration_sec}s total
            </span>
          )}
        </div>
      </div>

      {/* Telemetry Steps Scroll */}
      <div className="flex-1 overflow-y-auto space-y-3 font-mono text-xs pr-1">
        {trace.length === 0 && !isLoading && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#737373]">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
              <Cpu className="w-6 h-6 text-[#a982ff]" />
            </div>
            <p className="text-xs font-semibold text-white">FalkorDB Autonomous Agent Ready</p>
            <p className="text-[11px] mt-1 max-w-xs text-[#b5b5b5]">
              Select a battleground package on the left and click &lsquo;Run ChokePoint Agent&rsquo; to trigger the decide-and-act loop.
            </p>
          </div>
        )}

        {trace.map((t, idx) => {
          const isIngest = t.tool === "ingest_root";
          const isExposure = t.tool === "find_exposure";
          const isMinCut = t.tool === "min_cut";
          const isPick = t.tool === "pick_version";
          const isSim = t.tool === "simulate_fix";
          const isExplain = t.tool === "explain";

          return (
            <div
              key={idx}
              className="bg-[#040308] border border-white/10 hover:border-white/20 rounded-xl p-3.5 transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2 font-bold text-[11px] text-[#a982ff]">
                  <span className="w-4 h-4 rounded-full bg-[#8d62eb]/20 border border-[#8d62eb]/40 flex items-center justify-center text-[9px] text-[#a982ff]">
                    {t.step}
                  </span>
                  <span className="text-white font-mono">{t.tool}</span>
                </span>
                <span className="text-[10px] text-[#737373] bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                  {t.latency_ms}ms
                </span>
              </div>

              {/* Dynamic summary per tool */}
              {isIngest && (
                <div className="text-[11px] text-[#b5b5b5] font-sans">
                  <span className="text-emerald-400 font-semibold font-mono">✓ Ingested topology: </span>
                  {t.output.packages_count} packages, {t.output.dependencies_count} dependencies,{" "}
                  {t.output.advisories_count} advisories.
                </div>
              )}

              {isExposure && (
                <div className="text-[11px] text-[#b5b5b5] space-y-1">
                  <div className="text-rose-400 flex items-center gap-1 font-semibold">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Reachable Vulnerabilities: {t.output.findings_count}</span>
                  </div>
                  <div className="text-[10px] text-[#737373]">
                    Pkgs: {t.output.vulnerable_pkgs?.join(", ")}
                  </div>
                </div>
              )}

              {isMinCut && (
                <div className="text-[11px] text-[#b5b5b5] space-y-1">
                  <div className="text-[#a982ff] font-bold flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-[#a982ff]" />
                    <span>algo.maxFlow Min-Cut: {t.output.packages_to_change} Bottleneck(s)</span>
                  </div>
                  <div className="text-[10px] text-white/80">
                    Severing: {t.output.proposals?.join(", ")}
                  </div>
                </div>
              )}

              {isPick && (
                <div className="text-[11px] text-[#b5b5b5]">
                  <span className="text-[#a982ff]">Upgrade Candidate: </span>
                  <span className="font-semibold text-white">{t.output.package}</span>: {t.output.current_version} &rarr;{" "}
                  <span className="text-emerald-400 font-bold">{t.output.recommended_clean_version}</span>{" "}
                  <span className="text-[10px] text-[#737373]">({t.output.semver_risk})</span>
                </div>
              )}

              {isSim && (
                <div className="text-[11px] text-[#b5b5b5] space-y-1">
                  <div className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>GRAPH.COPY Proof: {t.output.assertion}</span>
                  </div>
                  <div className="text-[10px] text-[#737373]">
                    Cloned in {t.output.proof_result?.graph_copy_latency_ms}ms &bull; Residual CVEs: {t.output.proof_result?.residual_vulnerabilities}
                  </div>
                </div>
              )}

              {isExplain && (
                <div className="text-[11px] text-[#b5b5b5] font-sans leading-relaxed">
                  {t.output.explanation?.impact_summary}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Proof Banner at bottom of Telemetry */}
      {result?.verification_proof && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="bg-[#040308] border border-emerald-500/40 rounded-xl p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold text-emerald-300 text-[11px]">
                  FalkorDB Mathematical Assertion Verified Clean
                </div>
                <div className="text-[10px] text-emerald-400/80 font-mono">
                  {result.verification_proof.mathematical_assertion}
                </div>
              </div>
            </div>
            <div className="font-mono text-[10px] text-emerald-300 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/40 font-bold">
              0 Attack Paths
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
