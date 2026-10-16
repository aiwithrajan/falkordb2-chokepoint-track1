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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#040308]/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#09080e] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl shadow-[#8d62eb]/15 overflow-hidden ring-1 ring-white/10">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-white/10 bg-[#040308]/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#8d62eb]/20 border border-[#8d62eb]/40 flex items-center justify-center text-[#a982ff] shadow-lg shadow-[#8d62eb]/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm tracking-tight font-sans">ChokePoint Cyber Defense Copilot</h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#8d62eb]/15 text-[#a982ff] border border-[#8d62eb]/30 font-semibold">
                  Track 01 Agent
                </span>
              </div>
              <p className="text-[11px] text-white/50 font-sans">
                Trained on FalkorDB GraphBLAS, Dual-Node Flow Networks & Supply-Chain Min-Cuts
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
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
                <div className="w-7 h-7 rounded-lg bg-[#040308] border border-[#8d62eb]/40 flex items-center justify-center flex-shrink-0 text-[#a982ff] mt-0.5 shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-xl p-3.5 leading-relaxed ${
                  m.role === "user"
                    ? "bg-white text-black font-semibold shadow-md shadow-white/10"
                    : "bg-[#040308] text-white/90 border border-white/10"
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>

                {m.code && (
                  <div className="mt-2.5 rounded-lg bg-[#09080e] border border-white/10 p-2.5 font-mono text-[11px] text-[#a982ff] relative group overflow-x-auto">
                    <pre>{m.code}</pre>
                    <button
                      onClick={() => handleCopyCode(m.code!, idx)}
                      className="absolute top-2 right-2 p-1 rounded bg-white/10 hover:bg-white/20 text-white/80 opacity-0 group-hover:opacity-100 transition"
                      title="Copy code"
                    >
                      {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}

                {m.chips && (
                  <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                    {m.chips.map((chip, cIdx) => (
                      <button
                        key={cIdx}
                        onClick={() => handleSend(chip)}
                        className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#09080e] hover:bg-[#0d0b16] hover:text-white hover:border-[#8d62eb]/60 border border-white/10 text-white/70 transition text-left"
                      >
                        ⚡ {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {m.role === "user" && (
                <div className="w-7 h-7 rounded-lg bg-[#8d62eb] flex items-center justify-center flex-shrink-0 text-white mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3.5 border-t border-white/10 bg-[#040308] flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about FalkorDB GraphBLAS, algo.maxFlow, dual-node transformation..."
            className="flex-1 bg-[#09080e] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#8d62eb] focus:ring-1 focus:ring-[#8d62eb] transition font-sans"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-white/90 disabled:opacity-30 text-black text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-white/5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
