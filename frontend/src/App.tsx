import React, { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { TargetSelector } from "./components/TargetSelector";
import { AgentTelemetry } from "./components/AgentTelemetry";
import { GraphCanvas } from "./components/GraphCanvas";
import { ApprovalGateModal } from "./components/ApprovalGateModal";
import { BenchmarkModal } from "./components/BenchmarkModal";
import type { Preset, TraceStep, AnalysisResult, CytoscapeData } from "./types";

export function App() {
  const [falkorConnected, setFalkorConnected] = useState(true);
  const [system, setSystem] = useState("npm");
  const [pkg, setPkg] = useState("express");
  const [version, setVersion] = useState("4.16.0");
  const [presets, setPresets] = useState<Preset[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [trace, setTrace] = useState<TraceStep[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [graphData, setGraphData] = useState<CytoscapeData | null>(null);

  const [isApprovalOpen, setIsApprovalOpen] = useState(false);
  const [isBenchmarkOpen, setIsBenchmarkOpen] = useState(false);

  // Fetch presets and check health on load
  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((d) => setFalkorConnected(d.falkordb_connected))
      .catch(() => setFalkorConnected(false));

    fetch("/api/presets")
      .then((res) => res.json())
      .then((d) => {
        if (d.presets) setPresets(d.presets);
      })
      .catch((e) => console.error("Error fetching presets:", e));

    // Load initial graph
    loadGraph("npm", "express", "4.16.0");
  }, []);

  const loadGraph = (sys: string, p: string, v: string) => {
    fetch(`/api/graph/${sys}/${p}/${v}`)
      .then((res) => res.json())
      .then((d) => {
        if (d.elements) {
          setGraphData(d.elements);
        }
      })
      .catch((e) => console.error("Error fetching graph:", e));
  };

  const handleSelectPreset = (preset: Preset) => {
    setSystem(preset.system);
    setPkg(preset.package);
    setVersion(preset.version);
    setResult(null);
    setTrace([]);
    loadGraph(preset.system, preset.package, preset.version);
  };

  const handleRunAgent = async () => {
    setIsLoading(true);
    setTrace([]);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system, package: pkg, version })
      });
      const data: AnalysisResult = await res.json();
      setResult(data);
      if (data.trace) {
        setTrace(data.trace);
      }
      // Refresh canvas with latest node states
      loadGraph(system, pkg, version);
    } catch (e) {
      console.error("Agent execution failed:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyApproval = async () => {
    if (!result?.proposed_changes) return;
    try {
      const res = await fetch("/api/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          package: pkg,
          version,
          changes: result.proposed_changes
        })
      });
      const d = await res.json();
      alert(d.message || "Remediation verified & PR diff generated!");
    } catch (e) {
      console.error("Error applying approval:", e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header
        falkorConnected={falkorConnected}
        onOpenBenchmark={() => setIsBenchmarkOpen(true)}
      />

      {/* Main 3-Column Command Grid */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Column 1: Controls & Battleground Selector (3 cols) */}
        <section className="lg:col-span-3">
          <TargetSelector
            system={system}
            setSystem={setSystem}
            pkg={pkg}
            setPkg={setPkg}
            version={version}
            setVersion={setVersion}
            presets={presets}
            onSelectPreset={handleSelectPreset}
            onRunAgent={handleRunAgent}
            isLoading={isLoading}
          />
        </section>

        {/* Column 2: Agent Telemetry & Reasoning Log (4 cols) */}
        <section className="lg:col-span-4 h-full">
          <AgentTelemetry
            trace={trace}
            result={result}
            isLoading={isLoading}
          />
        </section>

        {/* Column 3: Cytoscape Physics Graph & Proof (5 cols) */}
        <section className="lg:col-span-5 h-full">
          <GraphCanvas
            graphData={graphData}
            result={result}
            onOpenApproval={() => setIsApprovalOpen(true)}
          />
        </section>
      </main>

      {/* Modals */}
      <ApprovalGateModal
        isOpen={isApprovalOpen}
        onClose={() => setIsApprovalOpen(false)}
        result={result}
        onApplyApproval={handleApplyApproval}
      />

      <BenchmarkModal
        isOpen={isBenchmarkOpen}
        onClose={() => setIsBenchmarkOpen(false)}
      />
    </div>
  );
}
