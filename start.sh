#!/bin/bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "=========================================================="
echo "⚡ Starting ChokePoint: Autonomous Supply-Chain Agent"
echo "   Track 01: Agents That Act on Connected Data"
echo "   Powered by FalkorDB GraphBLAS"
echo "=========================================================="

# 1. Verify / Start FalkorDB Container
if ! docker ps | grep -q "falkordb"; then
    echo "📦 FalkorDB container not running. Starting falkordb-server..."
    docker run -d --name falkordb-server -p 6379:6379 -p 3000:3000 falkordb/falkordb:latest || true
fi

# 2. Activate Python Virtual Environment
if [ -d ".venv" ]; then
    source .venv/bin/activate
elif [ -d "../falkordb/.venv" ]; then
    source ../falkordb/.venv/bin/activate
fi

# 3. Start Backend Intelligence Gateway (Port 8000)
echo "🚀 Launching Backend & FastMCP Server on http://localhost:8000..."
PYTHONPATH=. uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# 4. Start Frontend Console (Port 5174)
echo "🎨 Launching Frontend Command Console on http://localhost:5174..."
cd frontend
npm run dev &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true; exit" SIGINT SIGTERM

echo "=========================================================="
echo "✅ ChokePoint is Live!"
echo "   • Web Dashboard:     http://localhost:5174"
echo "   • API Docs:          http://localhost:8000/docs"
echo "   • FastMCP JSON-RPC:  http://localhost:8000/mcp/jsonrpc"
echo "   • FalkorDB Browser:  http://localhost:3000"
echo "=========================================================="

wait
