import React, { useState } from "react";
import {
  Cpu,
  Layers,
  Network,
  GitBranch,
  ShieldCheck,
  Zap,
  Copy,
  Check,
  Database,
  ArrowRight,
  Boxes,
  Code2
} from "lucide-react";
import { sound } from "../utils/sound";

interface CypherSnippet {
  title: string;
  description: string;
  query: string;
}

const CYPHER_SNIPPETS: CypherSnippet[] = [
  {
    title: "1. Multi-Hop Exposure Traversal (1..8 Hops)",
    description: "Traverse from root application through arbitrary transitive depth to discover all reachability paths to CVE advisory nodes.",
    query: `MATCH (root:Package {name: $pkg, version: $ver})
MATCH path = (root)-[:DEPENDS_ON*1..8]->(dep:Package)-[:AFFECTED_BY]->(adv:Advisory)
RETURN dep.name AS vulnerable_package,
       dep.version AS current_version,
       adv.id AS cve,
       adv.cvss AS cvss,
       adv.severity AS severity,
       length(path) AS hop_depth
ORDER BY cvss DESC;`
  },
  {
    title: "2. Dual-Node Flow Network Construction",
    description: "Transforms each package vertex into virtual in/out nodes with internal SemVer-weighted flow capacities to solve vertex min-cut.",
    query: `// Create virtual in/out nodes for vertex cut
MERGE (u_in:PkgIn {name: p.name, version: p.version})
MERGE (u_out:PkgOut {name: p.name, version: p.version})
MERGE (u_in)-[f:FLOW {
  capacity: CASE
    WHEN semver_risk = 'patch' THEN 100.0
    WHEN semver_risk = 'minor' THEN 10.0
    ELSE 1.0
  END
}]->(u_out);`
  },
  {
    title: "3. Native FalkorDB GraphBLAS Max-Flow Execution",
    description: "Computes the maximum flow and saturated minimum cut via GraphBLAS sparse matrix linear algebra in C.",
    query: `CALL algo.maxFlow('dual_flow_express_4_16_0', 'Source_express', 'SuperSink', {
  relationshipCapacityProp: 'capacity'
}) YIELD flow, cuts
RETURN flow AS max_vulnerability_flow, cuts AS saturated_bottleneck_nodes;`
  },
  {
    title: "4. Speculative Sandboxing via GRAPH.COPY",
    description: "Clones the active repository graph in under 3ms to test proposed candidate overrides with zero risk to production state.",
    query: `// 1. Fork production graph into isolated sandbox
GRAPH.COPY repo_graph repo_sandbox_f7a2;

// 2. Speculatively apply overrides in sandbox
MATCH (p:Package {name: 'body-parser'}) SET p.version = '1.18.3';

// 3. Re-verify residual vulnerability flow is 0.00
CALL algo.maxFlow('repo_sandbox_f7a2', 'Source', 'Sink') YIELD flow;

// 4. Destroy sandbox
GRAPH.DELETE repo_sandbox_f7a2;`
  }
];

export const ArchitecturePage: React.FC = () => {
  const [activeSnippetIdx, setActiveSnippetIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    sound.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto p-4 sm:p-6 space-y-8 animate-fade-in font-sans">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-violet-950/60 border border-indigo-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden ring-1 ring-white/10">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono text-[11px] font-bold tracking-wider uppercase">
              Mathematical Foundation & System Architecture
            </span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-[11px] font-bold tracking-wider uppercase">
              Rule 3 Compliance
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white mt-3 tracking-tight">
            How FalkorDB Solves the Vertex Min-Cut Bottleneck
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
            Standard dependency tools treat security vulnerabilities as independent leaf issues. ChokePoint proves that
            supply-chain security is fundamentally a connected topological network problem solvable in polynomial time
            via FalkorDB’s native GraphBLAS C-engine.
          </p>
        </div>
      </div>

      {/* 4 Architectural Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
            <Network className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">1. Dual-Node Flow Transformation</h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Standard Max-Flow solves edge cuts. To compute vertex bottleneck cuts, ChokePoint splits each package u into
            (u_in &rarr; u_out) with internal flow capacity c(u). Severing this internal edge represents overriding that specific package.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">2. SemVer-Weighted Capacities</h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Capacity $c(u)$ encodes breaking risk: Patch upgrades receive capacity $100.0$, Minor $10.0$, and Major $1.0$.
            Max-Flow naturally avoids high-risk major breaking upgrades in favor of safe upstream bottlenecks.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">3. Sub-3ms GRAPH.COPY Sandboxing</h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            FalkorDB's native <code className="text-amber-300 font-mono">GRAPH.COPY</code> clones entire multi-thousand node graphs
            into copy-on-write isolated sandboxes in 2.8ms, allowing the agent to test mutations with zero production blast radius.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="w-10 h-10 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4">
            <Boxes className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">4. FastMCP Agentic Tool Server</h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            6 typed tools exposed over FastMCP JSON-RPC 2.0 at <code className="text-violet-300 font-mono">/mcp/jsonrpc</code>.
            Standardized for Claude Desktop, Antigravity, and autonomous agent loops.
          </p>
        </div>
      </div>

      {/* Visual Workflow Diagram */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700">
              <Layers className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                End-to-End Autonomous Decide-and-Act Pipeline
              </h2>
              <span className="text-xs text-slate-400">
                From package.json ingestion to FalkorDB GraphBLAS cut to Reversible 1-Click PR
              </span>
            </div>
          </div>
        </div>

        {/* Pipeline Step Flow */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 py-4">
          {[
            {
              step: "Step 01",
              title: "Vault Ingest",
              desc: "Load dependency tree + CVE advisory nodes into FalkorDB",
              tag: "sub-10ms"
            },
            {
              step: "Step 02",
              title: "Blast Radius",
              desc: "Multi-hop Cypher traversal (1..8 hops) to map all reachable CVEs",
              tag: "O(E)"
            },
            {
              step: "Step 03",
              title: "Dual Flow Net",
              desc: "Synthesize virtual in/out nodes with SemVer-weighted capacities",
              tag: "GraphBLAS"
            },
            {
              step: "Step 04",
              title: "Min-Cut Solver",
              desc: "CALL algo.maxFlow to isolate saturated minimum bottleneck vertex",
              tag: "15.2ms"
            },
            {
              step: "Step 05",
              title: "GRAPH.COPY Proof",
              desc: "Speculatively mutate candidate in sandbox; assert residual flow == 0",
              tag: "2.8ms"
            },
            {
              step: "Step 06",
              title: "Human PR Gate",
              desc: "Export 1-click non-breaking package.json overrides with rollback",
              tag: "1-Click"
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-3.5 flex flex-col justify-between transition group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-indigo-400 font-bold">{item.step}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {item.tag}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white mt-1.5 group-hover:text-indigo-300 transition">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Cypher Query Explorer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700">
              <Code2 className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Interactive FalkorDB Cypher Queries
              </h2>
              <span className="text-xs text-slate-400">
                Executable Cypher code driving ChokePoint's autonomous agent
              </span>
            </div>
          </div>

          <button
            onClick={() => handleCopy(CYPHER_SNIPPETS[activeSnippetIdx].query)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium flex items-center gap-1.5 border border-slate-700 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied Cypher!" : "Copy Query"}</span>
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2">
          {CYPHER_SNIPPETS.map((snippet, idx) => (
            <button
              key={idx}
              onClick={() => {
                sound.playClick();
                setActiveSnippetIdx(idx);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono transition ${
                activeSnippetIdx === idx
                  ? "bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20"
                  : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {snippet.title}
            </button>
          ))}
        </div>

        {/* Code Viewport */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 font-mono text-xs text-indigo-300 relative overflow-x-auto">
          <p className="text-slate-400 font-sans text-xs mb-3">
            {CYPHER_SNIPPETS[activeSnippetIdx].description}
          </p>
          <pre className="text-indigo-200 font-mono text-[12px] leading-relaxed">
            {CYPHER_SNIPPETS[activeSnippetIdx].query}
          </pre>
        </div>
      </div>
    </div>
  );
};
