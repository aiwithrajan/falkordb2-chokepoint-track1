import React from "react";
import { Terminal, Clock, CheckCircle, ShieldAlert, Cpu, GitCommit } from "lucide-react";
import type { TraceStep, AnalysisResult } from "../types";

interface AgentTelemetryProps {
  trace: TraceStep[];
  result: AnalysisResult | null;
  isLoading: boolean;
}

export const AgentTelemetry: React.FC<AgentTelemetryProps> = ({ trace, result, isLoading }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg shadow-black/20 flex flex-col h-full min-h-[520px]">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <h2 className="text-xs uppercase tracking-wider font-mono font-bold text-slate-200">
            Agent Reasoning & MCP Tool Stream
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          {isLoading && (
            <span className="flex items-center gap-1.5 text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-800/40 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              Deciding & Acting...
            </span>
          )}
          {result && (
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              {result.total_duration_sec}s
            </span>
          )}
        </div>
      </div>

      {/* Telemetry Steps Scroll */}
      <div className="flex-1 overflow-y-auto space-y-3 font-mono text-xs pr-1">
        {trace.length === 0 && !isLoading && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <Cpu className="w-10 h-10 text-slate-700 mb-2 stroke-[1.5]" />
            <p className="text-xs font-medium text-slate-400">Agent Ready to Act</p>
            <p className="text-[11px] mt-1 max-w-xs">
              Select a package from the left panel and click &lsquo;Run ChokePoint Agent&rsquo; to begin the autonomous FalkorDB loop.
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
              className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5 font-bold text-[11px] text-indigo-300">
                  <span className="w-4 h-4 rounded bg-indigo-950 border border-indigo-700 flex items-center justify-center text-[9px] text-indigo-300">
                    {t.step}
                  </span>
                  <span>{t.tool}</span>
                </span>
                <span className="text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                  {t.latency_ms}ms
                </span>
              </div>

              {/* Dynamic summary per tool */}
              {isIngest && (
                <div className="text-[11px] text-slate-300">
                  <span className="text-emerald-400 font-semibold">✓ Ingested topology: </span>
                  {t.output.packages_count} packages, {t.output.dependencies_count} dependencies,{" "}
                  {t.output.advisories_count} advisories.
                </div>
              )}

              {isExposure && (
                <div className="text-[11px] text-slate-300 space-y-1">
                  <div className="text-rose-400 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Reachable Vulnerabilities: {t.output.findings_count}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Pkgs: {t.output.vulnerable_pkgs?.join(", ")}
                  </div>
                </div>
              )}

              {isMinCut && (
                <div className="text-[11px] text-slate-300 space-y-1">
                  <div className="text-amber-300 font-semibold">
                    ⚡ algo.maxFlow Min-Cut Found: {t.output.packages_to_change} Bottleneck(s)
                  </div>
                  <div className="text-[10px] text-amber-200/80">
                    Severing: {t.output.proposals?.join(", ")}
                  </div>
                </div>
              )}

              {isPick && (
                <div className="text-[11px] text-slate-300">
                  <span className="text-indigo-400">Upgrade Candidate: </span>
                  <span className="font-semibold text-white">{t.output.package}</span>: {t.output.current_version} &rarr;{" "}
                  <span className="text-emerald-400 font-bold">{t.output.recommended_clean_version}</span>{" "}
                  <span className="text-[10px] text-slate-400">({t.output.semver_risk})</span>
                </div>
              )}

              {isSim && (
                <div className="text-[11px] text-slate-300 space-y-1">
                  <div className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>GRAPH.COPY Sandbox Proof: {t.output.assertion}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Cloned in {t.output.proof_result?.graph_copy_latency_ms}ms &bull; Residual CVEs: {t.output.proof_result?.residual_vulnerabilities}
                  </div>
                </div>
              )}

              {isExplain && (
                <div className="text-[11px] text-slate-300">
                  <div className="text-slate-300 font-sans">{t.output.explanation?.impact_summary}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Proof Banner at bottom of Telemetry */}
      {result?.verification_proof && (
        <div className="mt-3 pt-3 border-t border-slate-800">
          <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-lg p-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold text-emerald-300 text-[11px]">
                  FalkorDB Mathematical Proof: Verified Clean
                </div>
                <div className="text-[10px] text-emerald-400/80 font-mono">
                  {result.verification_proof.mathematical_assertion}
                </div>
              </div>
            </div>
            <div className="font-mono text-[10px] text-emerald-300 bg-emerald-900/40 px-2 py-0.5 rounded">
              0 Attack Paths
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
