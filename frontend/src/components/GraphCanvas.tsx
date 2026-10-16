import React, { useEffect, useRef, useState } from "react";
import cytoscape from "cytoscape";
// @ts-ignore
import dagre from "cytoscape-dagre";
import { Eye, Shield, Check, Info, ZoomIn, ZoomOut, Maximize2, Flame, ArrowRight } from "lucide-react";
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

    // Prepare elements with classes
    const styledNodes = graphData.nodes.map((n) => {
      const name = n.data?.name;
      const isCut = cutPackageNames.has(name);
      return {
        ...n,
        classes: isCut ? "chokepoint" : ""
      };
    });

    // Style configuration with Kog-style obsidian & electric violet palette
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
            "color": "#b5b5b5",
            "font-family": "Inter, sans-serif",
            "font-size": "9px",
            "font-weight": 600,
            "text-wrap": "wrap",
            "text-max-width": "90px",
            "background-color": "#161420",
            "border-width": 1.5,
            "border-color": "rgba(255, 255, 255, 0.2)",
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
            "background-color": "#8d62eb",
            "border-color": "#a982ff",
            "border-width": 3,
            "width": 44,
            "height": 44,
            "color": "#ffffff",
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
            "border-color": "#f43f5e",
            "border-width": 2,
            "color": "#fda4af",
            "width": 30,
            "height": 30
          }
        },
        // Chokepoint / Bottleneck Cut Nodes (High-Energy Electric Amber Glow)
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
            "line-color": "#272535",
            "target-arrow-color": "#434055",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            "opacity": 0.8
          }
        },
        // Attack Reachability / CVE Edges
        {
          selector: "edge[type = 'affected_by']",
          style: {
            "line-color": "#f43f5e",
            "target-arrow-color": "#f43f5e",
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
    <div className="bg-[#09080e] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col h-full min-h-[560px] relative text-left font-sans">
      {/* Canvas Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-white/10 mb-2 gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[#a982ff] font-mono text-sm font-bold">&gt;</span>
          <h2 className="text-xs uppercase tracking-wider font-mono font-bold text-white flex items-center gap-2">
            <span>Connected Topology &amp; Blast Radius</span>
          </h2>
        </div>

        {/* Legend Badges */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-[#b5b5b5]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8d62eb] shadow-[0_0_8px_#8d62eb]" /> Root App
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b] ring-2 ring-amber-400/40" /> Min-Cut Bottleneck
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rotate-45 bg-rose-600 shadow-[0_0_8px_#e11d48]" /> CVE Advisory
          </span>
        </div>
      </div>

      {/* Cytoscape Viewport Container */}
      <div className="flex-1 w-full bg-[#040308] rounded-xl border border-white/10 relative overflow-hidden">
        <div ref={containerRef} className="w-full h-full min-h-[420px]" />

        {/* Floating Zoom / Control Toolbar */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20 bg-[#09080e]/90 backdrop-blur-md p-1.5 rounded-xl border border-white/10 shadow-xl">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1.5 rounded-lg hover:bg-white/10 text-[#b5b5b5] hover:text-white transition"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1.5 rounded-lg hover:bg-white/10 text-[#b5b5b5] hover:text-white transition"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleFit}
            title="Fit to Screen"
            className="p-1.5 rounded-lg hover:bg-white/10 text-[#b5b5b5] hover:text-white transition"
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
            className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-950/80 hover:bg-rose-900/90 text-rose-300 border border-rose-500/40 text-[11px] font-mono font-semibold shadow-lg backdrop-blur-md transition group"
          >
            <Flame className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform" />
            <span>Simulate Transitive Exploit &rarr;</span>
          </button>
        )}

        {/* Selected Node Inspector Drawer */}
        {selectedNode && (
          <div className="absolute top-3 right-3 bg-[#09080e]/95 backdrop-blur-md border border-[#8d62eb]/40 rounded-xl p-4 text-xs w-72 shadow-2xl z-20 font-mono ring-1 ring-white/10 animate-fade-in space-y-2">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-bold text-[#a982ff] truncate max-w-[170px]">
                {selectedNode.name || selectedNode.id}
              </span>
              <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-white/5 text-white/80 border border-white/10">
                {selectedNode.type}
              </span>
            </div>

            {selectedNode.version && (
              <div className="text-[11px] text-[#b5b5b5]">
                Version: <span className="text-white font-semibold">{selectedNode.version}</span>
              </div>
            )}

            {selectedNode.cvss && (
              <div className="text-[11px] text-rose-400 font-bold">
                CVSS: {selectedNode.cvss} ({selectedNode.severity})
              </div>
            )}

            {selectedNode.summary && (
              <div className="text-[10px] text-[#b5b5b5] line-clamp-3 font-sans leading-snug">
                {selectedNode.summary}
              </div>
            )}

            {selectedNode.clean_version && (
              <div className="mt-2 text-[11px] text-emerald-300 bg-emerald-950/60 p-2 rounded-lg border border-emerald-500/40">
                Remediation target: <strong className="text-white">{selectedNode.clean_version}</strong>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action / Reversibility Gate Bar at Bottom (Kog Style) */}
      {result?.proposed_changes && result.proposed_changes.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs">
            <div className="font-semibold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Chokepoint Proposal: Override {result.proposed_changes.length} Bottleneck(s)</span>
            </div>
            <div className="text-[11px] text-[#737373] font-mono mt-0.5">
              Severs {result.initial_vulnerabilities} CVE attack paths &bull; Proof: {result.verification_proof?.proof}
            </div>
          </div>

          {/* Kog-Style High-Contrast White Pill Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenApproval();
            }}
            className="px-5 py-2.5 rounded-full bg-white text-black hover:bg-neutral-200 text-xs font-bold transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.25)] transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Check className="w-4 h-4" />
            <span>Approve &amp; Export 1-Click PR</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
