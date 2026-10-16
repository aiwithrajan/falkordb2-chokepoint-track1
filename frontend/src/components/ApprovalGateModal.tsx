import React, { useState } from "react";
import { X, Check, Copy, GitPullRequest, ShieldCheck, ArrowRight } from "lucide-react";
import type { AnalysisResult } from "../types";
import { sound } from "../utils/sound";

interface ApprovalGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AnalysisResult | null;
  onApplyApproval: () => void;
}

export const ApprovalGateModal: React.FC<ApprovalGateModalProps> = ({
  isOpen,
  onClose,
  result,
  onApplyApproval
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !result) return null;

  const handleCopy = () => {
    if (result.generated_pr_diff) {
      navigator.clipboard.writeText(result.generated_pr_diff);
      setCopied(true);
      sound.playClick();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-[#09080e] border border-white/10 rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl relative text-left ring-1 ring-white/5">
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 text-[#737373] hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-[#8d62eb]/15 border border-[#8d62eb]/30 flex items-center justify-center text-[#a982ff]">
            <GitPullRequest className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[#a982ff] font-mono text-xs font-bold">&gt;</span>
              <h2 className="text-base font-bold text-white">
                Human-in-the-Loop Reversibility Gate
              </h2>
            </div>
            <p className="text-xs text-[#b5b5b5] font-mono mt-0.5">
              Verified by FalkorDB GRAPH.COPY Sandbox Simulation ({result.verification_proof?.proof})
            </p>
          </div>
        </div>

        {/* Changes Breakdown */}
        <div className="bg-[#040308] rounded-xl border border-white/10 p-4 mb-4">
          <div className="text-xs font-semibold uppercase font-mono text-[#a982ff] mb-2.5">
            Proposed Chokepoint Upgrades ({result.proposed_changes?.length}):
          </div>
          <div className="space-y-2">
            {result.proposed_changes?.map((c, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-[#09080e] border border-white/10 text-xs font-mono"
              >
                <div className="flex items-center gap-2 font-bold text-white">
                  <span>{c.name}</span>
                  <span className="text-[#737373] font-normal">({c.old_version})</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#a982ff]" />
                  <span className="text-emerald-400 font-bold">{c.new_version}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[#8d62eb]/20 text-[#a982ff] border border-[#8d62eb]/30">
                  {c.semver_risk}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* PR Diff Preview */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-semibold text-[#b5b5b5] uppercase">
              Generated GitHub PR Patch Diff:
            </span>
            <button
              onClick={handleCopy}
              className="text-xs flex items-center gap-1.5 text-[#a982ff] hover:text-white font-mono transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? "Copied Diff!" : "Copy Diff"}</span>
            </button>
          </div>
          <pre className="bg-[#040308] border border-white/10 rounded-xl p-3.5 text-xs font-mono text-emerald-400/90 overflow-x-auto max-h-40 leading-relaxed">
            {result.generated_pr_diff}
          </pre>
        </div>

        {/* Actions (Kog Style) */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2.5 rounded-full border border-white/15 hover:border-white/30 text-[#b5b5b5] hover:text-white text-xs font-mono transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              sound.playShield();
              onApplyApproval();
              onClose();
            }}
            className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-neutral-200 text-xs font-bold transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.25)]"
          >
            <Check className="w-4 h-4" />
            <span>Apply &amp; Export PR Diff</span>
          </button>
        </div>
      </div>
    </div>
  );
};
