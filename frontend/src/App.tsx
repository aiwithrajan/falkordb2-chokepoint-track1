import React, { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { TargetSelector } from "./components/TargetSelector";
import { AgentTelemetry } from "./components/AgentTelemetry";
import { GraphCanvas } from "./components/GraphCanvas";
import { ApprovalGateModal } from "./components/ApprovalGateModal";
import { BenchmarkModal } from "./components/BenchmarkModal";
import { HomeHero } from "./components/HomeHero";
import { ExploitSimulator } from "./components/ExploitSimulator";
import { ArchitecturePage } from "./components/ArchitecturePage";
import { AIChatModal } from "./components/AIChatModal";
import { sound } from "./utils/sound";
import type { Preset, TraceStep, AnalysisResult, CytoscapeData } from "./types";

export function App() {
  const [falkorConnected, setFalkorConnected] = useState(true);
  const [activeView, setActiveView] = useState<"home" | "console" | "simulator" | "architecture">("home");

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
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

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
    sound.playClick();
    setSystem(preset.system);
    setPkg(preset.package);
    setVersion(preset.version);
    setResult(null);
    setTrace([]);
    loadGraph(preset.system, preset.package, preset.version);
  };

  const handleSelectPresetFromExternal = (sys: string, p: string, v: string) => {
    setSystem(sys);
    setPkg(p);
    setVersion(v);
    setResult(null);
    setTrace([]);
    loadGraph(sys, p, v);
  };

  const handleRunAgent = async () => {
    setIsLoading(true);
    setTrace([]);
    setResult(null);
    sound.playClick();

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
      sound.playSuccess();
      // Refresh canvas with latest node states
      loadGraph(system, pkg, version);
    } catch (e) {
      console.error("Agent execution failed:", e);
      sound.playAlarm();
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
      sound.playShield();
      alert(d.message || "Remediation verified & PR diff generated!");
    } catch (e) {
      console.error("Error applying approval:", e);
    }
  };

  return (
    <div className="min-h-screen bg-[#040308] text-white flex flex-col font-sans selection:bg-[#8d62eb] selection:text-white">
      {/* Global Futuristic Navigation Header */}
      <Header
        falkorConnected={falkorConnected}
        activeView={activeView}
        onSwitchView={setActiveView}
        onOpenBenchmark={() => setIsBenchmarkOpen(true)}
        onOpenAIChat={() => setIsAIChatOpen(true)}
      />

      {/* Main View Router */}
      {activeView === "home" && (
        <HomeHero
          onEnterConsole={() => setActiveView("console")}
          onOpenSimulator={() => setActiveView("simulator")}
          onOpenArchitecture={() => setActiveView("architecture")}
          onOpenBenchmark={() => setIsBenchmarkOpen(true)}
          onOpenAIChat={() => setIsAIChatOpen(true)}
          onSelectPreset={handleSelectPresetFromExternal}
        />
      )}

      {activeView === "simulator" && (
        <main className="flex-1">
          <ExploitSimulator />
        </main>
      )}

      {activeView === "architecture" && (
        <main className="flex-1">
          <ArchitecturePage />
        </main>
      )}

      {activeView === "console" && (
        <div className="flex-1 max-w-[1680px] w-full mx-auto p-4 sm:p-8 space-y-6 animate-fade-in text-left">
          {/* Top Mission Command Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
            <div className="space-y-1">
              <div className="text-[11px] font-mono uppercase tracking-widest text-[#a982ff]">
                &gt; Autonomous War Room Console
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                FalkorDB Decide-and-Act Control Center
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#b5b5b5] bg-white/5 px-3.5 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active Target: <strong className="text-white">{pkg}@{version}</strong></span>
              </span>
            </div>
          </div>

          {/* Main 3-Column Command Grid */}
          <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
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
                onLaunchSimulator={() => setActiveView("simulator")}
              />
            </section>
          </main>
        </div>
      )}

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

      <AIChatModal
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        onSelectPreset={handleSelectPresetFromExternal}
        onSwitchView={setActiveView}
      />
    </div>
  );
}
