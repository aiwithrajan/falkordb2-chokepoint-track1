import logging
from typing import Any, Dict, List, Optional
from falkordb import Graph

logger = logging.getLogger("chokepoint.algorithms")

class GraphAlgorithms:
    @staticmethod
    def find_exposure(graph: Graph, root_key: str) -> Dict[str, Any]:
        """
        Finds all vulnerable packages reachable from the root across 1..8 hops.
        Returns paths, severity, CVSS3 scores, and summaries.
        """
        findings = []
        unique_vulnerable_pkgs = set()
        unique_advisories = set()

        # 1. Multi-hop transitive paths
        query = """
        MATCH (r:Pkg {key: $root})
        MATCH p = (r)-[:DEPENDS_ON*1..8]->(v:Pkg)-[:AFFECTED_BY]->(a:Advisory)
        RETURN v.key, v.name, v.version, a.id, a.cvss3, a.summary, a.severity, length(p), p
        ORDER BY a.cvss3 DESC, length(p) ASC
        """
        try:
            res = graph.query(query, {"root": root_key})
            seen_signatures = set()
            for row in res.result_set:
                pkg_key = row[0]
                adv_id = row[3]
                sig = (pkg_key, adv_id)
                if sig in seen_signatures:
                    continue
                seen_signatures.add(sig)

                unique_vulnerable_pkgs.add(pkg_key)
                unique_advisories.add(adv_id)

                path_obj = row[8]
                try:
                    path_keys = [n.properties.get("key") for n in path_obj.nodes()]
                except Exception:
                    path_keys = [root_key, pkg_key]

                findings.append({
                    "vulnerable_package": pkg_key,
                    "name": row[1],
                    "version": row[2],
                    "advisory": adv_id,
                    "cvss": float(row[4] or 7.5),
                    "summary": row[5],
                    "severity": row[6] or "HIGH",
                    "depth": row[7],
                    "path": path_keys
                })
        except Exception as e:
            logger.error(f"Error querying transitive exposure: {e}")

        # 2. Direct root vulnerabilities (depth 0)
        direct_query = """
        MATCH (r:Pkg {key: $root})-[:AFFECTED_BY]->(a:Advisory)
        RETURN r.key, r.name, r.version, a.id, a.cvss3, a.summary, a.severity
        """
        try:
            d_res = graph.query(direct_query, {"root": root_key})
            for row in d_res.result_set:
                pkg_key = row[0]
                adv_id = row[3]
                unique_vulnerable_pkgs.add(pkg_key)
                unique_advisories.add(adv_id)
                findings.append({
                    "vulnerable_package": pkg_key,
                    "name": row[1],
                    "version": row[2],
                    "advisory": adv_id,
                    "cvss": float(row[4] or 7.5),
                    "summary": row[5],
                    "severity": row[6] or "HIGH",
                    "depth": 0,
                    "path": [pkg_key]
                })
        except Exception:
            pass

        return {
            "total_reachable_vulnerabilities": len(findings),
            "unique_vulnerable_packages_count": len(unique_vulnerable_pkgs),
            "unique_advisories_count": len(unique_advisories),
            "unique_vulnerable_packages": sorted(list(unique_vulnerable_pkgs)),
            "findings": findings
        }

    @staticmethod
    def run_falkor_max_flow(graph: Graph, root_key: str) -> Optional[Dict[str, Any]]:
        """
        Executes native algo.maxFlow on the dual-node flow network in FalkorDB.
        """
        query = """
        MATCH (s:PkgIn {key: $root})
        MATCH (t:SuperSink {id: '__SINK__'})
        CALL algo.maxFlow({
          sourceNodes: [s],
          targetNodes: [t],
          relationshipTypes: ['FLOW'],
          capacityProperty: 'capacity'
        })
        YIELD edges, edgeFlows, maxFlow
        RETURN maxFlow, edges, edgeFlows
        """
        try:
            res = graph.query(query, {"root": root_key})
            if res.result_set:
                row = res.result_set[0]
                return {
                    "max_flow": row[0],
                    "edges": row[1],
                    "edge_flows": row[2]
                }
        except Exception as e:
            logger.error(f"algo.maxFlow error: {e}")
        return None

    @classmethod
    def compute_min_cut(cls, graph: Graph, root_key: str) -> Dict[str, Any]:
        """
        Computes the Semver-Weighted Minimum Vertex Cut using FalkorDB's native algo.maxFlow.
        Edges with flow >= capacity on role == 'self' define the bottleneck packages.
        """
        flow_res = cls.run_falkor_max_flow(graph, root_key)
        cut_packages = []
        seen_cut_keys = set()
        total_cost = 0.0

        if flow_res and flow_res["edges"]:
            edges = flow_res["edges"]
            flows = flow_res["edge_flows"]
            for e, f in zip(edges, flows):
                props = getattr(e, "properties", {})
                role = props.get("role")
                cap = float(props.get("capacity", 0.0))
                # Min-Cut condition: role == 'self', flow reaches capacity, not infinite capacity
                if role == "self" and f >= cap and cap < 900000.0:
                    cand_key = props.get("key")
                    if cand_key and cand_key != root_key and cand_key not in seen_cut_keys:
                        seen_cut_keys.add(cand_key)
                        cost = float(props.get("cost", 1.0))
                        total_cost += cost
                        cut_packages.append({
                            "package_key": cand_key,
                            "name": props.get("name"),
                            "current_version": props.get("version"),
                            "clean_version": props.get("clean_version"),
                            "relation": props.get("relation"),
                            "cost": cost,
                            "flow": f,
                            "capacity": cap,
                            "paths_severed_count": int(f)
                        })

        # Upstream Frontier Pruning: If package B is downstream of package A (where A is in cut),
        # then cutting A already severs B. B is redundant in the minimal bottleneck cut.
        if len(cut_packages) > 1:
            all_keys = [p["package_key"] for p in cut_packages]
            pruned_packages = []
            for p in cut_packages:
                k = p["package_key"]
                others = [o for o in all_keys if o != k]
                reach_q = "MATCH (a:Pkg)-[:DEPENDS_ON*1..6]->(b:Pkg {key: $k}) WHERE a.key IN $others RETURN count(a)"
                try:
                    reach_res = graph.query(reach_q, {"k": k, "others": others})
                    if reach_res.result_set[0][0] == 0:
                        pruned_packages.append(p)
                except Exception:
                    pruned_packages.append(p)
            cut_packages = pruned_packages
            seen_cut_keys = {p["package_key"] for p in cut_packages}
            total_cost = sum(p["cost"] for p in cut_packages)

        # Fallback if algo.maxFlow returned 0 packages or dual-node network not fully saturated:
        if not cut_packages:
            logger.info("Executing fallback bottleneck query for direct path severing...")
            direct_dep_query = """
            MATCH (r:Pkg {key: $root})-[:DEPENDS_ON]->(d:Pkg)
            MATCH p = (d)-[:DEPENDS_ON*0..6]->(v:Pkg)-[:AFFECTED_BY]->(:Advisory)
            RETURN d.key AS key, d.name AS name, d.version AS version, d.relation AS relation,
                   d.clean_version AS clean_version, count(p) AS paths
            ORDER BY paths DESC
            """
            try:
                res = graph.query(direct_dep_query, {"root": root_key})
                for row in res.result_set:
                    cand_key = row[0]
                    if cand_key not in seen_cut_keys:
                        seen_cut_keys.add(cand_key)
                        cost = 1.0
                        total_cost += cost
                        cut_packages.append({
                            "package_key": cand_key,
                            "name": row[1],
                            "current_version": row[2],
                            "clean_version": row[4] or row[2],
                            "relation": row[3],
                            "cost": cost,
                            "flow": row[5],
                            "capacity": 5.0,
                            "paths_severed_count": row[5]
                        })
            except Exception as e:
                logger.error(f"Fallback cut query error: {e}")

        return {
            "root_key": root_key,
            "max_flow": flow_res["max_flow"] if flow_res else 0.0,
            "cut_packages": cut_packages,
            "cut_packages_count": len(cut_packages),
            "total_cut_cost": total_cost,
            "blocked_keys": list(seen_cut_keys)
        }

    @staticmethod
    def get_load_bearing_nodes(graph: Graph, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Uses FalkorDB's native algo.pageRank to score the most load-bearing dependencies.
        """
        try:
            res = graph.query("""
            CALL algo.pageRank('Pkg', 'DEPENDS_ON')
            YIELD node, score
            RETURN node.key AS key, node.name AS name, node.version AS version, score
            ORDER BY score DESC
            LIMIT $limit
            """, {"limit": limit})
            return [
                {"key": r[0], "name": r[1], "version": r[2], "pagerank_score": round(float(r[3]), 4)}
                for r in res.result_set
            ]
        except Exception as e:
            logger.warning(f"algo.pageRank failed: {e}")
            return []
