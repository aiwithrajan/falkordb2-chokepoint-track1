import React, { useEffect, useRef, useState } from "react";
import cytoscape from "cytoscape";
// @ts-ignore
import dagre from "cytoscape-dagre";
import { Eye, Shield, Check, Info } from "lucide-react";
import type { CytoscapeData, AnalysisResult } from "../types";

cytoscape.use(dagre);

interface GraphCanvasProps {
  graphData: CytoscapeData | null;
  result: AnalysisResult | null;
  onOpenApproval: () => void;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({ graphData, result, onOpenApproval }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  useEffect(() => {
    if (!containerRef.current || !graphData) return;

    // Destroy existing instance
    if (cyRef.current) {
      cyRef.current.destroy();
    }

    const cutPackageNames = new Set(result?.proposed_changes?.map((c) => c.name) || []);
    const isApproved = result?.status === "clean";

    // Prepare elements with classes
    const styledNodes = graphData.nodes.map((n) => {
      const name = n.data?.name;
      const isCut = cutPackageNames.has(name);
      return {
        ...n,
        classes: isCut ? "chokepoint" : ""
      };
    });

    // Style configuration
    const cy = cytoscape({
      container: containerRef.current,
      elements: [...styledNodes, ...graphData.edges],
      style: [
        {
          selector: "node",
          style: {
            "label": "data(label)",
            "text-valign": "bottom",
            "text-margin-y": 6,
            "color": "#cbd5e1",
            "font-family": "Inter, sans-serif",
            "font-size": "9px",
            "font-weight": 600,
            "text-wrap": "wrap",
            "text-max-width": "90px",
            "background-color": "#334155",
            "border-width": 2,
            "border-color": "#475569",
            "width": 32,
            "height": 32,
            "transition-property": "background-color, border-color, width, height",
            "transition-duration": 0.3
          }
        },
        // Root package
        {
          selector: "node[relation = 'root']",
          style: {
            "background-color": "#4f46e5",
            "border-color": "#818cf8",
            "width": 42,
            "height": 42,
            "color": "#e0e7ff",
            "font-size": "11px",
            "font-weight": 700
          }
        },
        // Advisory nodes
        {
          selector: "node[type = 'advisory']",
          style: {
            "shape": "diamond",
            "background-color": "#991b1b",
            "border-color": "#f87171",
            "color": "#fca5a5",
            "width": 28,
            "height": 28
          }
        },
        // Chokepoint / Bottleneck Cut
        {
          selector: "node.chokepoint",
          style: {
            "background-color": "#d97706",
            "border-color": "#fde047",
            "border-width": 4,
            "width": 40,
            "height": 40
          }
        },
        // Edges
        {
          selector: "edge",
          style: {
            "width": 1.5,
            "line-color": "#475569",
            "target-arrow-color": "#475569",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            "opacity": 0.7
          }
        },
        {
          selector: "edge[type = 'affected_by']",
          style: {
            "line-color": "#ef4444",
            "target-arrow-color": "#ef4444",
            "line-style": "dashed",
            "width": 2,
            "opacity": 0.9
          }
        }
      ],
      layout: {
        name: "dagre",
        // @ts-ignore
        rankDir: "TB",
        nodeSep: 45,
        rankSep: 60,
        animate: true,
        animationDuration: 500
      }
    });

    cy.on("tap", "node", (evt) => {
      setSelectedNode(evt.target.data());
    });

    cy.on("tap", (evt) => {
      if (evt.target === cy) {
        setSelectedNode(null);
      }
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
  }, [graphData, result]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg shadow-black/20 flex flex-col h-full min-h-[520px] relative">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-2">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-indigo-400" />
          <h2 className="text-xs uppercase tracking-wider font-mono font-bold text-slate-200">
            FalkorDB Visual Topology & Provenance
          </h2>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Root App
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-400 ring-2 ring-amber-400/40" /> Chokepoint (Min-Cut)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rotate-45 bg-rose-600" /> CVE Advisory
          </span>
        </div>
      </div>

      {/* Cytoscape Viewport */}
      <div className="flex-1 w-full bg-slate-950/80 rounded-lg border border-slate-800 relative overflow-hidden">
        <div ref={containerRef} className="w-full h-full min-h-[380px]" />

        {/* Selected Node Drawer Popup */}
        {selectedNode && (
          <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur border border-slate-700/80 rounded-lg p-3 text-xs w-64 shadow-xl z-20 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
              <span className="font-bold text-indigo-300">{selectedNode.name || selectedNode.id}</span>
              <span className="text-[10px] uppercase text-slate-400">{selectedNode.type}</span>
            </div>
            {selectedNode.version && (
              <div className="text-[11px] text-slate-300">Version: <span className="text-white">{selectedNode.version}</span></div>
            )}
            {selectedNode.cvss && (
              <div className="text-[11px] text-rose-400 font-bold">CVSS Score: {selectedNode.cvss} ({selectedNode.severity})</div>
            )}
            {selectedNode.summary && (
              <div className="text-[10px] text-slate-400 mt-1 line-clamp-3 font-sans">{selectedNode.summary}</div>
            )}
            {selectedNode.clean_version && (
              <div className="mt-2 text-[10px] text-emerald-400 bg-emerald-950/60 p-1.5 rounded border border-emerald-800/40">
                Remediation target: {selectedNode.clean_version}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action / Reversibility Gate Bar at Bottom */}
      {result?.proposed_changes && result.proposed_changes.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Chokepoint Proposal: Upgrade {result.proposed_changes.length} Package(s)</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              Severs {result.initial_vulnerabilities} CVE attack paths &bull; Proof: {result.verification_proof?.proof}
            </div>
          </div>
          <button
            onClick={onOpenApproval}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/25"
          >
            <Check className="w-4 h-4" />
            <span>Approve & Export 1-Click PR</span>
          </button>
        </div>
      )}
    </div>
  );
};
