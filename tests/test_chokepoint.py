import pytest
from backend.graph.client import FalkorManager
from backend.graph.builder import GraphBuilder
from backend.graph.algorithms import GraphAlgorithms
from backend.graph.sandbox import SandboxVerifier
from backend.mcp.tools import ChokePointTools
from backend.agent.loop import ChokePointAgent
from backend.benchmark.ablation import Rule3AblationStudy

@pytest.fixture(scope="module")
def falkor():
    fm = FalkorManager()
    assert fm.ping() is True, "FalkorDB must be running on localhost:6379"
    return fm

def test_falkordb_connection_and_vault_ingestion(falkor):
    """Test 1: Verify hybrid ingestion into FalkorDB from snapshot vault."""
    graph_name = "test_chokepoint_ingest"
    graph = falkor.select_graph(graph_name)

    ingest_res = GraphBuilder.ingest_package(graph, "npm", "express", "4.16.0")
    assert ingest_res["packages_count"] >= 5
    assert ingest_res["advisories_count"] >= 2
    assert ingest_res["status"] == "ready"
    falkor.delete_graph(graph_name)

def test_multi_hop_exposure_traversal(falkor):
    """Test 2: Verify multi-hop reachability query discovers transitive CVEs."""
    tools = ChokePointTools(falkor)
    ingest = tools.ingest_root("npm", "express", "4.16.0")
    graph_name = ingest["graph_name"]
    root_key = ingest["root_key"]

    exposure = tools.find_exposure(graph_name, root_key)
    assert exposure["total_reachable_vulnerabilities"] >= 2
    assert "npm:qs@6.5.1" in exposure["unique_vulnerable_packages"]
    assert any(f["depth"] >= 2 for f in exposure["findings"]), "Must detect transitive depth >= 2"

def test_semver_weighted_min_cut(falkor):
    """Test 3: Verify FalkorDB native algo.maxFlow isolates the upstream bottleneck cut."""
    tools = ChokePointTools(falkor)
    graph_name = "chokepoint:npm:express:4.16.0"
    root_key = "npm:express@4.16.0"

    cut = tools.min_cut(graph_name, root_key)
    assert cut["cut_packages_count"] >= 1
    cut_names = [p["name"] for p in cut["cut_proposals"]]
    assert "body-parser" in cut_names or "qs" in cut_names
    assert cut["total_cut_cost"] > 0.0

def test_speculative_sandbox_verification_graph_copy(falkor):
    """Test 4: Verify FalkorDB GRAPH.COPY sandbox cloning and mathematical maxFlow == 0 proof."""
    tools = ChokePointTools(falkor)
    graph_name = "chokepoint:npm:express:4.16.0"
    root_key = "npm:express@4.16.0"

    changes = [
        {"name": "body-parser", "old_version": "1.18.2", "new_version": "1.19.0"},
        {"name": "send", "old_version": "0.16.0", "new_version": "0.18.0"}
    ]
    sim = tools.simulate_fix(graph_name, root_key, changes)
    assert sim["verified"] is True
    proof = sim["proof_result"]
    assert proof["is_clean"] is True
    assert proof["residual_vulnerabilities"] == 0
    assert proof["graph_copy_latency_ms"] < 20.0, "GRAPH.COPY must be sub-20ms"

def test_full_autonomous_agent_decide_and_act(falkor):
    """Test 5: Verify the full 6-step decide-and-act loop halts at human approval gate with PR diff."""
    agent = ChokePointAgent()
    res = agent.run("npm", "express", "4.16.0")

    assert res["status"] == "awaiting_approval"
    assert res["initial_vulnerabilities"] >= 2
    assert res["chokepoint_changes_count"] >= 1
    assert res["verification_proof"]["is_clean"] is True
    assert "--- package.json (original)" in res["generated_pr_diff"]
    assert len(res["trace"]) >= 6, "Must record all steps in trace telemetry"

def test_rule3_ablation_benchmark(falkor):
    """Test 6: Verify Rule 3 ablation comparisons between FalkorDB and traditional scanners."""
    study = Rule3AblationStudy(falkor)
    res = study.run_comparison("npm", "express", "4.16.0")

    assert "falkordb_min_cut" in res
    assert "traditional_scanners" in res
    assert res["falkordb_min_cut"]["packages_to_upgrade"] < res["traditional_scanners"]["packages_to_upgrade"]
    assert res["falkordb_min_cut"]["execution_latency_ms"] < 100.0
