export interface Preset {
  key: string;
  system: string;
  package: string;
  version: string;
  vulnerabilities_count: number;
  direct_deps_count: number;
}

export interface TraceStep {
  step: number;
  tool: string;
  input: Record<string, any>;
  output: Record<string, any>;
  latency_ms: number;
  timestamp: number;
}

export interface ProposedChange {
  name: string;
  old_version: string;
  new_version: string;
  semver_risk: "patch" | "minor" | "major";
}

export interface VerificationProof {
  sandbox_id: string;
  graph_copy_latency_ms: number;
  total_simulation_latency_ms: number;
  residual_max_flow: number;
  residual_vulnerabilities: number;
  is_clean: boolean;
  proof: string;
  mathematical_assertion: string;
}

export interface Explanation {
  bottlenecks: string[];
  severed_attack_paths_count: number;
  severed_sample: Array<{
    bottleneck: string;
    severed_chain: string[];
    neutralized_cve: string;
  }>;
  cypher_query: string;
  impact_summary: string;
}

export interface AnalysisResult {
  status: "clean" | "awaiting_approval";
  root_package: string;
  message?: string;
  initial_vulnerabilities?: number;
  initial_vulnerable_packages?: string[];
  chokepoint_changes_count?: number;
  proposed_changes?: ProposedChange[];
  verification_proof?: VerificationProof;
  explanation?: Explanation;
  generated_pr_diff?: string;
  trace: TraceStep[];
  total_duration_sec: number;
}

export interface CytoscapeData {
  nodes: Array<{ data: Record<string, any> }>;
  edges: Array<{ data: Record<string, any> }>;
}
