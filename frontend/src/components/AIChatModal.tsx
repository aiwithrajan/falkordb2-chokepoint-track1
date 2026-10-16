import React, { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, Sparkles, Terminal, Copy, Check } from "lucide-react";
import { sound } from "../utils/sound";

interface Message {
  role: "assistant" | "user";
  text: string;
  code?: string;
  chips?: string[];
}

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset?: (system: string, pkg: string, version: string) => void;
  onSwitchView?: (view: "console" | "simulator" | "architecture") => void;
}

const PRESET_ANSWERS: Record<string, { text: string; code?: string }> = {
  "why-falkordb": {
    text: "FalkorDB is mathematically irreplaceable here because computing the minimum bottleneck cut on a 15,000+ node dependency graph requires solving the Max-Flow/Min-Cut problem ($O(V^2 E)$) and running copy-on-write sandboxes. FalkorDB runs GraphBLAS linear algebraic operations in C, computing multi-hop cuts in ~15ms and cloning graphs in <3ms via GRAPH.COPY. Relational SQL recursive joins choke at 5+ hops, and Vector RAG cannot compute flow conservation or matrix cuts at all.",
    code: `// FalkorDB Native GraphBLAS Execution
CALL algo.maxFlow('dual_flow_graph', 'Source_Root', 'SuperSink', {
  relationshipCapacityProp: 'capacity'
}) YIELD flow, cuts;`
  },
  "dual-node": {
    text: "In standard graph theory, Max-Flow/Min-Cut operates on edge capacities. But in a software supply chain, vulnerabilities reside inside packages (vertices), not the dependency edges. To apply the Ford-Fulkerson theorem, ChokePoint transforms each dependency node u into two virtual nodes (u_in and u_out) connected by a directed internal edge with capacity c(u) = semver_cost(u). When FalkorDB severs this edge, it corresponds exactly to upgrading or overriding package u!",
    code: `// Dual-node vertex transformation
(u_in:PkgIn)-[:FLOW {capacity: semver_cost(u)}]->(u_out:PkgOut)
// Upstream dependencies point to u_in
(p_out)-[:FLOW {capacity: INF}]->(u_in)
// Downstream dependencies flow out from u_out
(u_out)-[:FLOW {capacity: INF}]->(child_in)`
  },
  "snyk-comparison": {
    text: "Snyk, Dependabot, and npm audit look at each CVE individually and suggest bumping every vulnerable package directly. If Express transitively pulls in 50 CVEs through deep child libraries like qs, send, or debug, Snyk generates 50 separate breaking pull requests that crash your production CI/CD. ChokePoint looks at the connected graph topology, calculates the minimum bottleneck cut, and generates just 1 or 2 targeted overrides that sever all 50 attack paths with zero breaking API changes.",
    code: `// Impact Comparison:
// Snyk:       50 PRs  | 8 Breaking Changes | 2 weeks triage
// ChokePoint:  1 PR   | 0 Breaking Changes | 15.2ms reasoning`
  },
  "sandbox-copy": {
    text: "Traditional agents blindly execute changes and hope tests pass. ChokePoint uses FalkorDB's native GRAPH.COPY to fork the active graph into an isolated sandbox in under 3 milliseconds. In this memory-efficient copy, the agent mutates package versions to clean candidates, re-runs algo.maxFlow to prove residual vulnerability flow == 0, and validates compatibility before ever proposing a PR to human maintainers.",
    code: `// Speculative Sandbox Verification via FalkorDB
GRAPH.COPY repo_graph repo_graph_sandbox_9f2a
// In sandbox: apply candidate upgrades
MATCH (p:Package {name: 'body-parser'}) SET p.version = '1.18.3'
// Re-verify: assert residual flow is 0.00
CALL algo.maxFlow('repo_graph_sandbox_9f2a', 'Source', 'Sink')
// Destroy sandbox
GRAPH.DELETE repo_graph_sandbox_9f2a`
  },
  "fastmcp": {
    text: "ChokePoint exposes 6 typed agentic tools over FastMCP (Model Context Protocol) via JSON-RPC 2.0 at /mcp/jsonrpc: query_blast_radius, compute_chokepoints, speculative_sandbox_verify, generate_remediation_diff, query_package_provenance, and list_vulnerabilities. Any LLM (Claude Desktop, Antigravity, or Cursor) can connect as an autonomous orchestrator.",
    code: `// Connect Claude Desktop to ChokePoint FastMCP:
{
  "mcpServers": {
    "chokepoint": {
      "command": "python",
      "args": ["-m", "backend.mcp.server"]
    }
  }
}`
  }
};

export const AIChatModal: React.FC<AIChatModalProps> = ({ isOpen, onClose, onSwitchView }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hello! I am ChokePoint's Autonomous Supply-Chain Copilot. Ask me anything about our FalkorDB GraphBLAS min-cut engine, the dual-node flow transformation, or why legacy tools like Snyk open 50 breaking PRs.",
      chips: [
        "Why is FalkorDB mathematically irreplaceable?",
        "Explain Dual-Node Flow Transformation",
        "Snyk vs ChokePoint comparison",
        "How does GRAPH.COPY sandbox work?",
        "What FastMCP tools are exposed?"
      ]
    }
  ]);
  const [input, setInput] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    sound.playClick();
    const newMessages: Message[] = [...messages, { role: "user", text: query }];
    setMessages(newMessages);
    setInput("");

    const q = query.toLowerCase();
    let replyKey = "why-falkordb";

    if (q.includes("dual") || q.includes("node") || q.includes("transformation") || q.includes("split")) {
      replyKey = "dual-node";
    } else if (q.includes("snyk") || q.includes("dependabot") || q.includes("50") || q.includes("comparison")) {
      replyKey = "snyk-comparison";
    } else if (q.includes("sandbox") || q.includes("copy") || q.includes("speculative") || q.includes("verify")) {
      replyKey = "sandbox-copy";
    } else if (q.includes("mcp") || q.includes("tool") || q.includes("claude") || q.includes("fastmcp")) {
      replyKey = "fastmcp";
    } else if (q.includes("falkordb") || q.includes("why") || q.includes("graphblas") || q.includes("irreplaceable") || q.includes("rule 3")) {
      replyKey = "why-falkordb";
    }

    setTimeout(() => {
      const resp = PRESET_ANSWERS[replyKey];
      sound.playSuccess();
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          text: resp.text,
          code: resp.code,
          chips: [
            "Why is FalkorDB mathematically irreplaceable?",
            "Explain Dual-Node Flow Transformation",
            "Snyk vs ChokePoint comparison",
            "How does GRAPH.COPY sandbox work?"
          ]
        }
      ]);
    }, 400);
  };

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    sound.playClick();
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl shadow-indigo-950/50 overflow-hidden ring-1 ring-white/10">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
              <Bot className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm">ChokePoint Cyber Defense Copilot</h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                  Track 01 Agent
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Trained on FalkorDB GraphBLAS, Dual-Node Flow Networks & Supply-Chain Min-Cuts
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs font-sans">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <div className="w-7 h-7 rounded-lg bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center flex-shrink-0 text-indigo-300 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-xl p-3.5 leading-relaxed ${
                  m.role === "user"
                    ? "bg-indigo-600 text-white font-medium shadow-md shadow-indigo-600/20"
                    : "bg-slate-800/90 text-slate-200 border border-slate-700/70"
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>

                {m.code && (
                  <div className="mt-2.5 rounded-lg bg-slate-950 border border-slate-800 p-2.5 font-mono text-[11px] text-indigo-300 relative group overflow-x-auto">
                    <pre>{m.code}</pre>
                    <button
                      onClick={() => handleCopyCode(m.code!, idx)}
                      className="absolute top-2 right-2 p-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 opacity-0 group-hover:opacity-100 transition"
                      title="Copy code"
                    >
                      {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}

                {m.chips && (
                  <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-slate-700/50">
                    {m.chips.map((chip, cIdx) => (
                      <button
                        key={cIdx}
                        onClick={() => handleSend(chip)}
                        className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-900/90 hover:bg-indigo-950 hover:text-indigo-200 hover:border-indigo-500/40 border border-slate-700 text-slate-300 transition text-left"
                      >
                        ⚡ {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {m.role === "user" && (
                <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center flex-shrink-0 text-white mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about FalkorDB GraphBLAS, algo.maxFlow, dual-node transformation..."
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition font-sans"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-lg shadow-indigo-600/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
