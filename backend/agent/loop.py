import time
from typing import Any, Callable, Dict, List, Optional
from backend.mcp.tools import ChokePointTools
from backend.agent.guard import HallucinationGuard

class AgentExecutionTrace:
    def __init__(self):
        self.steps: List[Dict[str, Any]] = []
        self.start_time = time.time()

    def log_step(
        self,
        tool_name: str,
        input_args: Dict[str, Any],
        output_summary: Dict[str, Any],
        latency_ms: float
    ):
        self.steps.append({
            "step": len(self.steps) + 1,
            "tool": tool_name,
            "input": input_args,
            "output": output_summary,
            "latency_ms": round(latency_ms, 2),
            "timestamp": round(time.time(), 3)
        })

    def get_total_duration_sec(self) -> float:
        return round(time.time() - self.start_time, 3)

class ChokePointAgent:
    def __init__(self, tools: Optional[ChokePointTools] = None):
        self.tools = tools or ChokePointTools()

    def run(
        self,
        system: str,
        package: str,
        version: str,
        trace_callback: Optional[Callable[[Dict[str, Any]], None]] = None
    ) -> Dict[str, Any]:
        """
        Executes the 6-Step Autonomous Decide-and-Act Agent Loop:
        1. Ingest Root
        2. Multi-Hop Exposure Traversal
        3. Semver-Weighted Min-Cut Computation (algo.maxFlow)
        4. Candidate Version Picking
        5. Speculative Sandbox Verification (GRAPH.COPY & maxFlow == 0 assertion)
        6. Explainable Provenance Generation
        Halts at Reversibility / Human Approval Gate with 1-Click PR Diff.
        """
        trace = AgentExecutionTrace()
        root_key = f"{system.lower()}:{package}@{version}"
        graph_name = f"chokepoint:{system.lower()}:{package}:{version}"

        # -------------------------------------------------------------
        # Step 1: Ingest Root
        # -------------------------------------------------------------
        t0 = time.time()
        ingest_res = self.tools.ingest_root(system, package, version)
        lat = (time.time() - t0) * 1000
        trace.log_step("ingest_root", {"system": system, "package": package, "version": version}, ingest_res, lat)
        if trace_callback:
            trace_callback({"step": 1, "tool": "ingest_root", "result": ingest_res["message"], "latency_ms": lat})

        # -------------------------------------------------------------
        # Step 2: Multi-Hop Exposure Traversal
        # -------------------------------------------------------------
        t0 = time.time()
        exposure_res = self.tools.find_exposure(graph_name, root_key)
        lat = (time.time() - t0) * 1000
        step2_summary = {
            "findings_count": exposure_res["total_reachable_vulnerabilities"],
            "vulnerable_pkgs": exposure_res["unique_vulnerable_packages"],
            "unique_advisories": exposure_res["unique_advisories_count"]
        }
        trace.log_step("find_exposure", {"graph_name": graph_name, "root_key": root_key}, step2_summary, lat)
        if trace_callback:
            trace_callback({
                "step": 2,
                "tool": "find_exposure",
                "findings_count": exposure_res["total_reachable_vulnerabilities"],
                "vulnerable_pkgs": exposure_res["unique_vulnerable_packages"],
                "latency_ms": lat
            })

        # If 0 vulnerabilities found, package is clean!
        if exposure_res["total_reachable_vulnerabilities"] == 0:
            return {
                "status": "clean",
                "root_package": f"{package}@{version}",
                "message": f"Package {package}@{version} has 0 reachable vulnerable paths in its dependency topology.",
                "trace": trace.steps,
                "duration_sec": trace.get_total_duration_sec()
            }

        # -------------------------------------------------------------
        # Step 3: Semver-Weighted Min-Cut Computation
        # -------------------------------------------------------------
        t0 = time.time()
        min_cut_res = self.tools.min_cut(graph_name, root_key)
        lat = (time.time() - t0) * 1000
        cut_proposals = min_cut_res["cut_proposals"]
        step3_summary = {
            "packages_to_change": len(cut_proposals),
            "proposals": [p["name"] for p in cut_proposals],
            "max_flow": min_cut_res.get("max_flow", 0.0)
        }
        trace.log_step("min_cut", {"graph_name": graph_name, "root_key": root_key}, step3_summary, lat)
        if trace_callback:
            trace_callback({
                "step": 3,
                "tool": "min_cut",
                "packages_to_change": len(cut_proposals),
                "proposals": [p["name"] for p in cut_proposals],
                "latency_ms": lat
            })

        # -------------------------------------------------------------
        # Step 4: Pick Clean Versions for Bottleneck Cut
        # -------------------------------------------------------------
        changes_to_simulate = []
        for p in cut_proposals:
            t0 = time.time()
            pkg_name = p["name"]
            curr_ver = p["current_version"]
            ver_res = self.tools.pick_version(system, pkg_name, curr_ver)
            lat = (time.time() - t0) * 1000
            clean_ver = ver_res.get("recommended_clean_version", curr_ver)
            semver_risk = ver_res.get("semver_risk", "minor")

            changes_to_simulate.append({
                "name": pkg_name,
                "old_version": curr_ver,
                "new_version": clean_ver,
                "semver_risk": semver_risk
            })
            trace.log_step("pick_version", {"package": pkg_name, "version": curr_ver}, ver_res, lat)
            if trace_callback:
                trace_callback({
                    "step": 4,
                    "tool": "pick_version",
                    "package": pkg_name,
                    "upgrade": f"{curr_ver} -> {clean_ver} ({semver_risk})",
                    "latency_ms": lat
                })

        # -------------------------------------------------------------
        # Step 5: Speculative Sandbox Verification (GRAPH.COPY)
        # -------------------------------------------------------------
        t0 = time.time()
        sim_res = self.tools.simulate_fix(graph_name, root_key, changes_to_simulate)
        lat = (time.time() - t0) * 1000
        proof = sim_res["proof_result"]
        trace.log_step("simulate_fix", {"changes": changes_to_simulate}, sim_res, lat)
        if trace_callback:
            trace_callback({
                "step": 5,
                "tool": "simulate_fix",
                "proof": proof["proof"],
                "is_clean": proof["is_clean"],
                "assertion": proof["mathematical_assertion"],
                "latency_ms": lat
            })

        # -------------------------------------------------------------
        # Step 6: Explain Cut & Provenance Generation
        # -------------------------------------------------------------
        t0 = time.time()
        explain_res = self.tools.explain(graph_name, root_key, changes_to_simulate)
        lat = (time.time() - t0) * 1000
        trace.log_step("explain", {"changes": changes_to_simulate}, explain_res, lat)
        if trace_callback:
            trace_callback({
                "step": 6,
                "tool": "explain",
                "explanation": explain_res["explanation"]["impact_summary"],
                "latency_ms": lat
            })

        # -------------------------------------------------------------
        # Final Payload Halts at Reversibility Gate
        # -------------------------------------------------------------
        # Format 1-Click PR package.json overrides diff
        overrides_snippet = "  \"overrides\": {\n"
        for c in changes_to_simulate:
            overrides_snippet += f'    "{c["name"]}": "{c["new_version"]}",\n'
        overrides_snippet = overrides_snippet.rstrip(",\n") + "\n  }"

        pr_diff = f"""--- package.json (original)
+++ package.json (ChokePoint FalkorDB Remediated)
@@ -12,6 +12,11 @@
   "dependencies": {{
     "{package}": "{version}"
   }},
+{overrides_snippet}
"""

        return {
            "status": "awaiting_approval",
            "root_package": f"{package}@{version}",
            "initial_vulnerabilities": exposure_res["total_reachable_vulnerabilities"],
            "initial_vulnerable_packages": exposure_res["unique_vulnerable_packages"],
            "chokepoint_changes_count": len(changes_to_simulate),
            "proposed_changes": changes_to_simulate,
            "verification_proof": proof,
            "explanation": explain_res["explanation"],
            "generated_pr_diff": pr_diff,
            "trace": trace.steps,
            "total_duration_sec": trace.get_total_duration_sec()
        }
