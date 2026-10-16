import React, { useEffect, useRef, useState } from "react";
import cytoscape from "cytoscape";
// @ts-ignore
import dagre from "cytoscape-dagre";
import { Eye, Shield, Check, Info, ZoomIn, ZoomOut, Maximize2, Flame, RefreshCw } from "lucide-react";
import type { CytoscapeData, AnalysisResult } from "../types";
import { sound } from "../utils/sound";

cytoscape.use(dagre);

interface GraphCanvasProps {
  graphData: CytoscapeData | null;
  result: AnalysisResult | null;
  onOpenApproval: () => void;
  onLaunchSimulator?: () => void;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  graphData,
  result,
  onOpenApproval,
  onLaunchSimulator
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  useEffect(() => {
    if (!containerRef.current || !graphData) return;

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

    // Style configuration with high-impact cyber-glow aesthetic
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
            "background-color": "#1e293b",
            "border-width": 2,
            "border-color": "#475569",
            "width": 32,
            "height": 32,
            "transition-property": "background-color, border-color, width, height",
            "transition-duration": 0.3
          }
        },
        // Root package (Target application)
        {
          selector: "node[relation = 'root']",
          style: {
            "background-color": "#4f46e5",
            "border-color": "#818cf8",
            "border-width": 3,
            "width": 44,
            "height": 44,
            "color": "#e0e7ff",
            "font-size": "11px",
            "font-weight": 700
          }
        },
        // CVE Advisory nodes
        {
          selector: "node[type = 'advisory']",
          style: {
            "shape": "diamond",
            "background-color": "#991b1b",
            "border-color": "#ef4444",
            "border-width": 2,
            "color": "#fca5a5",
            "width": 30,
            "height": 30
          }
        },
        // Chokepoint / Bottleneck Cut Nodes (High-Energy Amber Pulsing Glow)
        {
          selector: "node.chokepoint",
          style: {
            "background-color": "#d97706",
            "border-color": "#fde047",
            "border-width": 4,
            "width": 44,
            "height": 44,
            "color": "#fef08a",
            "font-weight": 800
          }
        },
        // Dependency Edges
        {
          selector: "edge",
          style: {
            "width": 1.5,
            "line-color": "#334155",
            "target-arrow-color": "#475569",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            "opacity": 0.75
          }
        },
        // Attack Reachability / CVE Edges
        {
          selector: "edge[type = 'affected_by']",
          style: {
            "line-color": "#ef4444",
            "target-arrow-color": "#ef4444",
            "line-style": "dashed",
            "width": 2,
            "opacity": 0.95
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
      sound.playClick();
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

  const handleZoomIn = () => {
    sound.playClick();
    cyRef.current?.zoom(cyRef.current.zoom() * 1.25);
  };

  const handleZoomOut = () => {
    sound.playClick();
    cyRef.current?.zoom(cyRef.current.zoom() * 0.8);
  };

  const handleFit = () => {
    sound.playClick();
    cyRef.current?.fit();
    cyRef.current?.center();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col h-full min-h-[540px] relative ring-1 ring-white/5">
      {/* Canvas Header */}
      <div className="flex flex-wrap items-center justify-between pb-3.5 border-b border-slate-800 mb-2 gap-2">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-indigo-400" />
          <h2 className="text-xs uppercase tracking-wider font-mono font-bold text-slate-200">
            FalkorDB Connected Topology & Blast Radius
          </h2>
        </div>

        {/* Legend Badges */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500" /> Root App
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-400 ring-2 ring-amber-400/40" /> Min-Cut Bottleneck
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rotate-45 bg-rose-600 shadow-sm shadow-rose-600" /> CVE Advisory
          </span>
        </div>
      </div>

      {/* Cytoscape Viewport Container */}
      <div className="flex-1 w-full bg-slate-950/90 rounded-xl border border-slate-800/80 relative overflow-hidden">
        <div ref={containerRef} className="w-full h-full min-h-[400px]" />

        {/* Floating Zoom / Control Toolbar */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20 bg-slate-900/80 backdrop-blur-md p-1 rounded-lg border border-slate-700/60 shadow-lg">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleFit}
            title="Fit to Screen"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Floating Exploit Simulator Quick-Link */}
        {onLaunchSimulator && (
          <button
            onClick={() => {
              sound.playClick();
              onLaunchSimulator();
            }}
            className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900/90 text-rose-300 border border-rose-600/40 text-xs font-mono font-semibold shadow-lg backdrop-blur-md transition group"
          >
            <Flame className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform" />
            <span>Simulate Transitive Exploit</span>
          </button>
        )}

        {/* Selected Node Inspector Drawer */}
        {selectedNode && (
          <div className="absolute top-3 right-3 bg-slate-900/95 backdrop-blur-md border border-indigo-500/40 rounded-xl p-3.5 text-xs w-72 shadow-2xl z-20 font-mono ring-1 ring-white/10 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <span className="font-bold text-indigo-300 truncate max-w-[170px]">
                {selectedNode.name || selectedNode.id}
              </span>
              <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {selectedNode.type}
              </span>
            </div>

            {selectedNode.version && (
              <div className="text-[11px] text-slate-300">
                Version: <span className="text-white font-semibold">{selectedNode.version}</span>
              </div>
            )}

            {selectedNode.cvss && (
              <div className="text-[11px] text-rose-400 font-bold mt-1">
                CVSS: {selectedNode.cvss} ({selectedNode.severity})
              </div>
            )}

            {selectedNode.summary && (
              <div className="text-[10px] text-slate-400 mt-1.5 line-clamp-3 font-sans leading-snug">
                {selectedNode.summary}
              </div>
            )}

            {selectedNode.clean_version && (
              <div className="mt-2.5 text-[11px] text-emerald-300 bg-emerald-950/70 p-2 rounded-lg border border-emerald-500/40">
                Remediation target: <strong className="text-white">{selectedNode.clean_version}</strong>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action / Reversibility Gate Bar at Bottom */}
      {result?.proposed_changes && result.proposed_changes.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Chokepoint Proposal: Override {result.proposed_changes.length} Bottleneck(s)</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              Severs {result.initial_vulnerabilities} CVE attack paths &bull; Proof: {result.verification_proof?.proof}
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onOpenApproval();
            }}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/30"
          >
            <Check className="w-4 h-4" />
            <span>Approve & Export 1-Click PR</span>
          </button>
        </div>
      )}
    </div>
  );
};
