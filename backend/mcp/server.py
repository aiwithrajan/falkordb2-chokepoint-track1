import logging
from typing import Any, Dict, List, Optional
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from backend.mcp.tools import ChokePointTools

logger = logging.getLogger("chokepoint.mcp.server")

mcp_app = FastAPI(
    title="ChokePoint FastMCP Server",
    description="Official Model Context Protocol (MCP) Server for FalkorDB GraphBLAS Dependency Remediations",
    version="1.0.0"
)

tools = ChokePointTools()

TOOL_DEFINITIONS = [
    {
        "name": "ingest_root",
        "description": "Loads a package version's resolved dependency topology and advisories into FalkorDB",
        "inputSchema": {
            "type": "object",
            "properties": {
                "system": {"type": "string", "default": "npm"},
                "package": {"type": "string"},
                "version": {"type": "string"}
            },
            "required": ["package", "version"]
        }
    },
    {
        "name": "find_exposure",
        "description": "Returns vulnerable packages reachable from root up to 8 hops with exact path traces and CVSS scores",
        "inputSchema": {
            "type": "object",
            "properties": {
                "graph_name": {"type": "string"},
                "root_key": {"type": "string"}
            },
            "required": ["graph_name", "root_key"]
        }
    },
    {
        "name": "min_cut",
        "description": "Computes the Semver-Weighted Minimum Vertex Cut using FalkorDB native algo.maxFlow",
        "inputSchema": {
            "type": "object",
            "properties": {
                "graph_name": {"type": "string"},
                "root_key": {"type": "string"}
            },
            "required": ["graph_name", "root_key"]
        }
    },
    {
        "name": "pick_version",
        "description": "Selects the nearest backward-compatible clean semver version for a cut package",
        "inputSchema": {
            "type": "object",
            "properties": {
                "system": {"type": "string", "default": "npm"},
                "package": {"type": "string"},
                "current_version": {"type": "string"}
            },
            "required": ["package", "current_version"]
        }
    },
    {
        "name": "simulate_fix",
        "description": "Clones graph using FalkorDB GRAPH.COPY, applies speculative upgrades, and asserts maxFlow == 0",
        "inputSchema": {
            "type": "object",
            "properties": {
                "graph_name": {"type": "string"},
                "root_key": {"type": "string"},
                "changes": {"type": "array", "items": {"type": "object"}}
            },
            "required": ["graph_name", "root_key", "changes"]
        }
    },
    {
        "name": "explain",
        "description": "Returns the exact Cypher query, severed attack paths, and human-readable explanation",
        "inputSchema": {
            "type": "object",
            "properties": {
                "graph_name": {"type": "string"},
                "root_key": {"type": "string"},
                "changes": {"type": "array", "items": {"type": "object"}}
            },
            "required": ["graph_name", "root_key", "changes"]
        }
    }
]

@mcp_app.get("/")
def index():
    return {
        "status": "online",
        "protocol": "Model Context Protocol (MCP)",
        "version": "1.0.0",
        "transport": ["stdio", "sse", "json-rpc-2.0"],
        "tools_count": len(TOOL_DEFINITIONS)
    }

@mcp_app.get("/tools")
def list_tools_rest():
    return {"tools": TOOL_DEFINITIONS}

@mcp_app.post("/jsonrpc")
async def handle_jsonrpc(req: Request):
    """
    Standard Model Context Protocol (MCP) JSON-RPC 2.0 Handler
    Compatible with Claude Desktop, Cursor, and IDE extensions.
    """
    body = await req.json()
    method = body.get("method")
    req_id = body.get("id")

    if method == "initialize":
        return {
            "jsonrpc": "2.0",
            "id": req_id,
            "result": {
                "protocolVersion": "2024-11-05",
                "capabilities": {"tools": {}},
                "serverInfo": {"name": "ChokePoint FalkorDB MCP", "version": "1.0.0"}
            }
        }
    elif method == "tools/list":
        return {
            "jsonrpc": "2.0",
            "id": req_id,
            "result": {"tools": TOOL_DEFINITIONS}
        }
    elif method == "tools/call":
        params = body.get("params", {})
        tool_name = params.get("name")
        args = params.get("arguments", {})

        try:
            if tool_name == "ingest_root":
                res = tools.ingest_root(args.get("system", "npm"), args["package"], args["version"])
            elif tool_name == "find_exposure":
                res = tools.find_exposure(args["graph_name"], args["root_key"])
            elif tool_name == "min_cut":
                res = tools.min_cut(args["graph_name"], args["root_key"])
            elif tool_name == "pick_version":
                res = tools.pick_version(args.get("system", "npm"), args["package"], args["current_version"])
            elif tool_name == "simulate_fix":
                res = tools.simulate_fix(args["graph_name"], args["root_key"], args["changes"])
            elif tool_name == "explain":
                res = tools.explain(args["graph_name"], args["root_key"], args["changes"])
            else:
                return {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "error": {"code": -32601, "message": f"Method not found: {tool_name}"}
                }
            return {
                "jsonrpc": "2.0",
                "id": req_id,
                "result": {"content": [{"type": "text", "text": str(res)}], "data": res}
            }
        except Exception as e:
            return {
                "jsonrpc": "2.0",
                "id": req_id,
                "error": {"code": -32000, "message": str(e)}
            }

    return {
        "jsonrpc": "2.0",
        "id": req_id,
        "error": {"code": -32601, "message": f"Unsupported method: {method}"}
    }
