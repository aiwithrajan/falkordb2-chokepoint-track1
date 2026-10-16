import time
from typing import Any, Dict, List, Optional
from backend.graph.client import FalkorManager
from backend.graph.builder import GraphBuilder
from backend.graph.algorithms import GraphAlgorithms
from backend.graph.sandbox import SandboxVerifier
from backend.ingestion.vault import SnapshotVault

class ChokePointTools:
    def __init__(self, falkor: Optional[FalkorManager] = None):
        self.falkor = falkor or FalkorManager()
        self.sandbox = SandboxVerifier(self.falkor)

    def ingest_root(self, system: str, package: str, version: str) -> Dict[str, Any]:
        """
        MCP Tool: Ingests a package version's resolved dependency topology and advisories into FalkorDB.
        """
        t0 = time.time()
        graph_name = f"chokepoint:{system.lower()}:{package}:{version}"
        graph = self.falkor.select_graph(graph_name)

        ingest_res = GraphBuilder.ingest_package(graph, system, package, version)
        latency_ms = round((time.time() - t0) * 1000, 2)

        return {
            "status": "success",
            "graph_name": graph_name,
            "root_key": ingest_res["root_key"],
            "packages_count": ingest_res["packages_count"],
            "dependencies_count": ingest_res["dependencies_count"],
            "advisories_count": ingest_res["advisories_count"],
            "latency_ms": latency_ms,
            "message": f"Successfully ingested {package}@{version} into FalkorDB ({ingest_res['packages_count']} pkgs, {ingest_res['dependencies_count']} edges)."
        }

    def find_exposure(self, graph_name: str, root_key: str) -> Dict[str, Any]:
        """
        MCP Tool: Queries FalkorDB to find all vulnerable packages reachable from root up to 8 hops.
        """
        t0 = time.time()
        graph = self.falkor.select_graph(graph_name)
        exposure = GraphAlgorithms.find_exposure(graph, root_key)
        latency_ms = round((time.time() - t0) * 1000, 2)

        return {
            **exposure,
            "latency_ms": latency_ms,
            "graph_name": graph_name
        }

    def min_cut(self, graph_name: str, root_key: str) -> Dict[str, Any]:
        """
        MCP Tool: Runs FalkorDB native algo.maxFlow on dual-node capacity network to find minimal bottleneck cut.
        """
        t0 = time.time()
        graph = self.falkor.select_graph(graph_name)
        cut_res = GraphAlgorithms.compute_min_cut(graph, root_key)
        latency_ms = round((time.time() - t0) * 1000, 2)

        return {
            **cut_res,
            "latency_ms": latency_ms,
            "cut_proposals": cut_res["cut_packages"]
        }

    def pick_version(self, system: str, package: str, current_version: str) -> Dict[str, Any]:
        """
        MCP Tool: Identifies the nearest backward-compatible clean version for a bottleneck package.
        """
        t0 = time.time()
        # Look in vault first
        target_clean = None
        semver_type = "minor"

        # Check across vault for clean version of this package
        for snap in SnapshotVault.list_presets():
            snap_data = SnapshotVault.get_snapshot(snap["system"], snap["package"], snap["version"])
            if snap_data:
                for p in snap_data.get("packages", []):
                    if p["name"] == package:
                        target_clean = p.get("clean_version")
                        semver_type = p.get("semver_type", "minor")
                        break
            if target_clean:
                break

        if not target_clean:
            # Generate conservative patch or minor bump
            parts = current_version.split(".")
            if len(parts) == 3:
                target_clean = f"{parts[0]}.{int(parts[1]) + 1}.0"
            else:
                target_clean = current_version

        latency_ms = round((time.time() - t0) * 1000, 2)
        return {
            "package": package,
            "current_version": current_version,
            "recommended_clean_version": target_clean,
            "semver_risk": semver_type,
            "latency_ms": latency_ms
        }

    def simulate_fix(self, graph_name: str, root_key: str, changes: List[Dict[str, str]]) -> Dict[str, Any]:
        """
        MCP Tool: Clones graph via FalkorDB GRAPH.COPY, applies speculative upgrades, asserts maxFlow == 0.
        """
        proof = self.sandbox.verify_speculative_fix(graph_name, root_key, changes)
        return {
            "proof_result": proof,
            "verified": proof.get("is_clean", False),
            "assertion": proof.get("mathematical_assertion", "maxFlow == 0.0")
        }

    def explain(self, graph_name: str, root_key: str, changes: List[Dict[str, str]]) -> Dict[str, Any]:
        """
        MCP Tool: Returns exact Cypher provenance, path hops, and impact diff explaining why the cut works.
        """
        t0 = time.time()
        graph = self.falkor.select_graph(graph_name)

        changed_names = [c["name"] for c in changes]
        cypher_proof = """
        MATCH (r:Pkg {key: $root})-[:DEPENDS_ON*1..8]->(cut:Pkg)
        WHERE cut.name IN $changed_names
        MATCH path = (cut)-[:DEPENDS_ON*0..6]->(v:Pkg)-[:AFFECTED_BY]->(a:Advisory)
        RETURN cut.name AS bottleneck, [n IN nodes(path) | n.name] AS severed_chain, a.id AS neutralized_cve
        """
        severed_paths = []
        try:
            res = graph.query(cypher_proof, {"root": root_key, "changed_names": changed_names})
            for r in res.result_set:
                severed_paths.append({
                    "bottleneck": r[0],
                    "severed_chain": r[1],
                    "neutralized_cve": r[2]
                })
        except Exception:
            pass

        latency_ms = round((time.time() - t0) * 1000, 2)
        return {
            "explanation": {
                "bottlenecks": changed_names,
                "severed_attack_paths_count": len(severed_paths),
                "severed_sample": severed_paths[:5],
                "cypher_query": cypher_proof.strip(),
                "impact_summary": f"Upgrading {len(changed_names)} package(s) effectively severs {len(severed_paths)} transitive attack vectors at minimal semver cost."
            },
            "latency_ms": latency_ms
        }
