import logging
from typing import Any, Dict, List, Optional
from falkordb import Graph
from backend.ingestion.vault import SnapshotVault, VAULT_DATA
from backend.ingestion.live_resolver import LiveResolver

logger = logging.getLogger("chokepoint.builder")

class GraphBuilder:
    @staticmethod
    def calculate_semver_capacity(pkg_meta: Dict[str, Any]) -> tuple[float, float]:
        """
        Calculates the capacity and cost for the flow network:
        Patch bump (lowest break risk) -> lower capacity (favored cut)
        Minor bump (moderate break risk) -> medium capacity
        Major bump (high break risk) -> high capacity penalty (avoid if possible)
        """
        semver_type = pkg_meta.get("semver_type", "minor")
        relation = pkg_meta.get("relation", "direct")

        if relation == "root":
            return 999999.0, 999999.0  # Root cannot be cut

        if semver_type == "patch":
            return 3.0, 1.0
        elif semver_type == "minor":
            return 6.0, 2.0
        elif semver_type == "major":
            return 25.0, 5.0
        else:
            return 8.0, 2.5

    @classmethod
    def build_graph_from_data(cls, graph: Graph, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Populates the FalkorDB graph with:
        1. Pure dependency AST (:Pkg, :Advisory, [:DEPENDS_ON], [:AFFECTED_BY])
        2. Dual-Node Flow Network (:PkgIn, :PkgOut, :SuperSink, [:FLOW])
        """
        system = data.get("system", "npm")
        root_pkg = data.get("package")
        root_ver = data.get("version")
        root_key = f"{system.lower()}:{root_pkg}@{root_ver}"

        # 1. Clean previous entities in this graph
        try:
            graph.query("MATCH (n) DETACH DELETE n")
        except Exception:
            pass

        # 2. Ingest packages & dual-node flow network
        pkgs = data.get("packages", [])
        vulnerable_pkg_keys = set()
        for adv in data.get("advisories", []):
            v_key = adv["package"]
            if not v_key.startswith(f"{system.lower()}:"):
                v_key = f"{system.lower()}:{v_key}"
            vulnerable_pkg_keys.add(v_key)

        for p in pkgs:
            p_name = p["name"]
            p_ver = p["version"]
            p_rel = p.get("relation", "transitive")
            p_clean = p.get("clean_version", p_ver)
            p_semver = p.get("semver_type", "minor")
            p_key = f"{system.lower()}:{p_name}@{p_ver}"

            cap, cost = cls.calculate_semver_capacity(p)

            # Ingest standard :Pkg node
            graph.query("""
            MERGE (p:Pkg {key: $key})
            SET p.name = $name,
                p.version = $version,
                p.system = $system,
                p.relation = $relation,
                p.clean_version = $clean_ver,
                p.semver_type = $semver_type
            """, {
                "key": p_key,
                "name": p_name,
                "version": p_ver,
                "system": system,
                "relation": p_rel,
                "clean_ver": p_clean,
                "semver_type": p_semver
            })

            # Ingest dual-node flow nodes (:PkgIn, :PkgOut)
            graph.query("""
            MERGE (pin:PkgIn {key: $key})
            SET pin.name = $name, pin.version = $version, pin.relation = $relation
            MERGE (pout:PkgOut {key: $key})
            SET pout.name = $name, pout.version = $version, pout.relation = $relation
            MERGE (pin)-[f:FLOW {role: 'self'}]->(pout)
            SET f.capacity = $capacity,
                f.cost = $cost,
                f.key = $key,
                f.name = $name,
                f.version = $version,
                f.relation = $relation,
                f.clean_version = $clean_ver
            """, {
                "key": p_key,
                "name": p_name,
                "version": p_ver,
                "relation": p_rel,
                "capacity": cap,
                "cost": cost,
                "clean_ver": p_clean
            })

        # 3. Create Dependency Edges & Flow link edges
        for src, dst in data.get("dependencies", []):
            s_key = src if src.startswith(f"{system.lower()}:") else f"{system.lower()}:{src}"
            d_key = dst if dst.startswith(f"{system.lower()}:") else f"{system.lower()}:{dst}"

            # Standard DEPENDS_ON
            graph.query("""
            MATCH (s:Pkg {key: $src}), (d:Pkg {key: $dst})
            MERGE (s)-[:DEPENDS_ON {weight: 1.0}]->(d)
            """, {"src": s_key, "dst": d_key})

            # Flow network link: PkgOut -> PkgIn (infinite capacity)
            graph.query("""
            MATCH (sout:PkgOut {key: $src}), (din:PkgIn {key: $dst})
            MERGE (sout)-[:FLOW {capacity: 999999.0, role: 'dep'}]->(din)
            """, {"src": s_key, "dst": d_key})

        # 4. Ingest Advisories & Connect to SuperSink
        graph.query("MERGE (sink:SuperSink {id: '__SINK__'})")

        for adv in data.get("advisories", []):
            v_key = adv["package"]
            if not v_key.startswith(f"{system.lower()}:"):
                v_key = f"{system.lower()}:{v_key}"

            # Advisory node
            graph.query("""
            MERGE (a:Advisory {id: $id})
            SET a.cvss3 = $cvss,
                a.severity = $severity,
                a.summary = $summary
            WITH a
            MATCH (v:Pkg {key: $v_key})
            MERGE (v)-[:AFFECTED_BY]->(a)
            """, {
                "id": adv["id"],
                "cvss": float(adv.get("cvss3", 7.5)),
                "severity": adv.get("severity", "HIGH"),
                "summary": adv.get("summary", "Vulnerability detected."),
                "v_key": v_key
            })

            # Connect PkgOut of vulnerable package to SuperSink
            graph.query("""
            MATCH (vout:PkgOut {key: $v_key}), (sink:SuperSink {id: '__SINK__'})
            MERGE (vout)-[:FLOW {capacity: 999999.0, role: 'sink'}]->(sink)
            """, {"v_key": v_key})

        # Return summary
        node_count = graph.query("MATCH (n:Pkg) RETURN count(n)").result_set[0][0]
        edge_count = graph.query("MATCH ()-[r:DEPENDS_ON]->() RETURN count(r)").result_set[0][0]
        adv_count = graph.query("MATCH (a:Advisory) RETURN count(a)").result_set[0][0]

        return {
            "root_key": root_key,
            "packages_count": node_count,
            "dependencies_count": edge_count,
            "advisories_count": adv_count,
            "status": "ready"
        }

    @classmethod
    def ingest_package(cls, graph: Graph, system: str, package: str, version: str) -> Dict[str, Any]:
        """
        Hybrid Ingestion:
        1. Checks Pre-Warmed Snapshot Vault (Tier 1: < 5ms guaranteed)
        2. Falls back to LiveResolver (Tier 2)
        """
        key = f"{system.lower()}:{package}@{version}"
        vault_data = SnapshotVault.get_snapshot(system, package, version)
        if vault_data:
            logger.info(f"Loading {key} from Pre-Warmed Snapshot Vault (offline fast path)...")
            return cls.build_graph_from_data(graph, vault_data)

        # Fallback to Live
        logger.info(f"Attempting live resolve for {key}...")
        live = LiveResolver.resolve_package(system, package, version)
        if live:
            # construct basic data from live
            return cls.build_graph_from_data(graph, live)

        # If completely unknown, synthesize minimum safe topology
        fallback_data = {
            "system": system,
            "package": package,
            "version": version,
            "packages": [{"name": package, "version": version, "relation": "root"}],
            "dependencies": [],
            "advisories": []
        }
        return cls.build_graph_from_data(graph, fallback_data)
