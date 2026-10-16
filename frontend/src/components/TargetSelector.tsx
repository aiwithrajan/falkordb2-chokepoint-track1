import React from "react";
import { Play, Package, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";
import type { Preset } from "../types";

interface TargetSelectorProps {
  system: string;
  setSystem: (s: string) => void;
  pkg: string;
  setPkg: (p: string) => void;
  version: string;
  setVersion: (v: string) => void;
  presets: Preset[];
  onSelectPreset: (preset: Preset) => void;
  onRunAgent: () => void;
  isLoading: boolean;
}

export const TargetSelector: React.FC<TargetSelectorProps> = ({
  system,
  setSystem,
  pkg,
  setPkg,
  version,
  setVersion,
  presets,
  onSelectPreset,
  onRunAgent,
  isLoading
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Target Input Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg shadow-black/20">
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-xs uppercase tracking-wider font-mono font-bold text-slate-300 flex items-center gap-2">
            <Package className="w-4 h-4 text-indigo-400" />
            <span>Target Package Inspection</span>
          </h2>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
            Vault Cached
          </span>
        </div>

        {/* Inputs */}
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Ecosystem</label>
              <select
                value={system}
                onChange={(e) => setSystem(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
              >
                <option value="npm">npm</option>
                <option value="pypi">PyPI</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Package</label>
              <input
                type="text"
                value={pkg}
                onChange={(e) => setPkg(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Version</label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Run Button */}
          <button
            onClick={onRunAgent}
            disabled={isLoading || !pkg || !version}
            className={`w-full mt-2 py-2.5 px-4 rounded-lg font-semibold text-xs tracking-wide uppercase transition flex items-center justify-center gap-2 shadow-lg ${
              isLoading
                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-600/30 active:scale-[0.99]"
            }`}
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                <span>Traversing FalkorDB Graph...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Run ChokePoint Agent</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Quick Selects */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg shadow-black/20">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Pre-Warmed Battlegrounds</span>
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">1-Click Load</span>
        </div>

        <div className="space-y-2">
          {presets.map((p) => {
            const isSelected = pkg === p.package && version === p.version;
            return (
              <button
                key={p.key}
                onClick={() => onSelectPreset(p)}
                className={`w-full text-left p-2.5 rounded-lg border transition flex items-center justify-between text-xs ${
                  isSelected
                    ? "bg-indigo-950/60 border-indigo-500/80 text-indigo-200"
                    : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-300"
                }`}
              >
                <div>
                  <div className="font-mono font-semibold flex items-center gap-1.5">
                    <span>{p.package}</span>
                    <span className="text-[11px] text-slate-500">@{p.version}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {p.direct_deps_count} direct deps &bull; Transitive CVEs
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] bg-rose-950/80 text-rose-300 border border-rose-800/50">
                    <ShieldAlert className="w-3 h-3 text-rose-400" />
                    {p.vulnerabilities_count} CVEs
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* The Problem Explainer Card */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950/30 border border-slate-800/80 rounded-xl p-4 text-xs text-slate-400">
        <h4 className="font-semibold text-slate-200 flex items-center gap-1.5 mb-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Why FalkorDB Min-Cut Wins</span>
        </h4>
        <p className="leading-relaxed text-[11px]">
          Traditional scanners demand 50 leaf updates, triggering breaking changes. ChokePoint models the dependency tree as a flow network in FalkorDB and computes the exact bottleneck upgrade that severs 100% of attack paths.
        </p>
      </div>
    </div>
  );
};
