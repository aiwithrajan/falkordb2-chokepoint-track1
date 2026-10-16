import React from "react";
import { Play, Package, ShieldAlert, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import type { Preset } from "../types";
import { sound } from "../utils/sound";

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
    <div className="flex flex-col gap-5 text-left font-sans">
      {/* Target Input Bento Card */}
      <div className="bg-[#09080e] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-[#a982ff] font-mono text-sm font-bold">&gt;</span>
            <h2 className="text-xs uppercase tracking-wider font-mono font-bold text-white flex items-center gap-1.5">
              <span>Target Inspection</span>
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#a982ff] bg-[#8d62eb]/15 px-2.5 py-0.5 rounded-full border border-[#8d62eb]/30 font-semibold">
            Vault Cached
          </span>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#737373] mb-1.5 font-semibold">
                Ecosystem
              </label>
              <select
                value={system}
                onChange={(e) => setSystem(e.target.value)}
                className="w-full bg-[#040308] border border-white/10 hover:border-white/20 rounded-xl px-2.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#8d62eb] transition"
              >
                <option value="npm">npm</option>
                <option value="pypi">PyPI</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#737373] mb-1.5 font-semibold">
                Package
              </label>
              <input
                type="text"
                value={pkg}
                onChange={(e) => setPkg(e.target.value)}
                className="w-full bg-[#040308] border border-white/10 hover:border-white/20 rounded-xl px-2.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#8d62eb] transition"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#737373] mb-1.5 font-semibold">
                Version
              </label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full bg-[#040308] border border-white/10 hover:border-white/20 rounded-xl px-2.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#8d62eb] transition"
              />
            </div>
          </div>

          {/* Kog-Style High-Contrast Run Button */}
          <button
            onClick={() => {
              sound.playClick();
              onRunAgent();
            }}
            disabled={isLoading || !pkg || !version}
            className={`w-full mt-2 py-3 px-5 rounded-full font-bold text-xs tracking-wide uppercase transition-all flex items-center justify-center gap-2 ${
              isLoading
                ? "bg-white/10 text-[#a982ff] border border-[#8d62eb]/40 cursor-wait animate-pulse"
                : "bg-white text-black hover:bg-neutral-200 shadow-[0_0_25px_rgba(255,255,255,0.25)] transform hover:scale-[1.01] active:scale-[0.99]"
            }`}
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-[#a982ff] border-t-transparent rounded-full animate-spin" />
                <span>Traversing FalkorDB Graph...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>Run ChokePoint Agent</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Quick Selects Bento */}
      <div className="bg-[#09080e] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-[#a982ff] font-mono text-sm font-bold">&gt;</span>
            <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-white flex items-center gap-1.5">
              <span>Battleground Targets</span>
            </h3>
          </div>
          <span className="text-[10px] text-[#737373] font-mono">15ms Demo</span>
        </div>

        <div className="space-y-2.5">
          {presets.map((p) => {
            const isSelected = pkg === p.package && version === p.version;
            return (
              <button
                key={p.key}
                onClick={() => {
                  sound.playClick();
                  onSelectPreset(p);
                }}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between text-xs ${
                  isSelected
                    ? "bg-[#0d0b16] border-[#8d62eb] text-white shadow-[0_0_15px_rgba(141,98,235,0.25)]"
                    : "bg-[#040308] border-white/10 hover:border-white/20 text-[#b5b5b5]"
                }`}
              >
                <div>
                  <div className="font-mono font-bold flex items-center gap-1.5 text-white">
                    <span>{p.package}</span>
                    <span className="text-[11px] text-[#737373]">@{p.version}</span>
                  </div>
                  <div className="text-[10px] text-[#737373] mt-0.5 font-mono">
                    {p.direct_deps_count} direct deps &bull; Transitive CVEs
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] bg-rose-950/70 text-rose-300 border border-rose-800/40 font-semibold">
                    <ShieldAlert className="w-3 h-3 text-rose-400" />
                    {p.vulnerabilities_count} CVEs
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Why FalkorDB Min-Cut Wins Bento */}
      <div className="bg-[#09080e] border border-white/10 rounded-2xl p-5 space-y-2 text-xs text-[#b5b5b5]">
        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-white">
          <span className="text-[#a982ff]">&gt;</span>
          <span>Why FalkorDB Min-Cut Wins</span>
        </div>
        <p className="leading-relaxed text-[11px] pt-1">
          Traditional scanners open 50 separate PRs, triggering breaking changes. ChokePoint models the dependency tree as a flow network in FalkorDB and computes the exact bottleneck upgrade that severs 100% of attack paths in 15.2ms.
        </p>
      </div>
    </div>
  );
};
