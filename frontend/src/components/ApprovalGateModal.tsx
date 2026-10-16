import React, { useState } from "react";
import { X, Check, Copy, GitPullRequest, ShieldCheck, ArrowRight } from "lucide-react";
import type { AnalysisResult } from "../types";

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
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center">
            <GitPullRequest className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Human-in-the-Loop Reversibility Gate
            </h2>
            <p className="text-xs text-slate-400">
              Verified by FalkorDB GRAPH.COPY Sandbox Simulation ({result.verification_proof?.proof})
            </p>
          </div>
        </div>

        {/* Changes Breakdown */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 mb-4">
          <div className="text-xs font-semibold uppercase font-mono text-slate-400 mb-2">
            Proposed Chokepoint Upgrades ({result.proposed_changes?.length}):
          </div>
          <div className="space-y-2">
            {result.proposed_changes?.map((c, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono"
              >
                <div className="flex items-center gap-2 font-bold text-slate-200">
                  <span>{c.name}</span>
                  <span className="text-slate-500 font-normal">({c.old_version})</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-emerald-400 font-bold">{c.new_version}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                  {c.semver_risk}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* PR Diff Preview */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono font-semibold text-slate-400 uppercase">
              Generated GitHub PR Patch Diff:
            </span>
            <button
              onClick={handleCopy}
              className="text-xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-mono transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? "Copied!" : "Copy Diff"}</span>
            </button>
          </div>
          <pre className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-emerald-400/90 overflow-x-auto max-h-40">
            {result.generated_pr_diff}
          </pre>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onApplyApproval();
              onClose();
            }}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-600/30"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Approve & Export PR</span>
          </button>
        </div>
      </div>
    </div>
  );
};
