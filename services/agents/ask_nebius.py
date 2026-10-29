"""One-shot CLI: Ask the NVIDIA Nemotron agent on Nebius Token Factory questions about the TwinForge digital twin.

    uv run python ask_nebius.py "Which machine is most at risk?"
"""

import asyncio
import os
import sys
import json
import httpx
from dotenv import load_dotenv

load_dotenv("twinforge_mcp_agent/.env")
load_dotenv("../../.env")

NEBIUS_API_KEY = os.environ.get("NEBIUS_API_KEY", "")
NEBIUS_BASE_URL = os.environ.get("NEBIUS_BASE_URL", "https://api.tokenfactory.nebius.com/v1")
NEBIUS_MODEL = os.environ.get("NEBIUS_MODEL", "nvidia/llama-3.1-nemotron-70b-instruct")
MCP_URL = os.environ.get("TWINFORGE_MCP_URL", "http://localhost:3000/api/mcp")
MCP_TOKEN = os.environ.get("TWINFORGE_MCP_TOKEN", "")

SYSTEM_PROMPT = (
    "You are an expert industrial operations analyst powered by NVIDIA Nemotron on Nebius Token Factory. "
    "You have real-time access to the TwinForge digital twin via deterministic MCP tools. "
    "Always ground your answers in the exact numbers and asset IDs returned by the tools. "
    "Never guess or fabricate telemetry metrics."
)

async def main(question: str) -> int:
    headers = {"Content-Type": "application/json"}
    if MCP_TOKEN:
        headers["Authorization"] = f"Bearer {MCP_TOKEN}"

    print(f"🤖 Connecting to Nebius Token Factory [{NEBIUS_MODEL}]...")
    print(f"🏭 Connecting to TwinForge MCP [{MCP_URL}]...")

    async with httpx.AsyncClient(timeout=30.0) as client:
        # Fetch plant overview first
        try:
            res = await client.post(
                MCP_URL,
                headers=headers,
                json={"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "get_plant_overview", "arguments": {}}}
            )
            overview_data = res.json()
        except Exception as e:
            overview_data = {"error": f"MCP connection failed: {e}. Ensure Next.js app is running on localhost:3000."}

        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"TwinForge Context:\n{json.dumps(overview_data)}\n\nUser Question:\n{question}"}
        ]

        if not NEBIUS_API_KEY:
            print("⚠️ NEBIUS_API_KEY not set. Using offline deterministic response format.")
            print(f"Overview retrieved: {overview_data}")
            return 0

        nebius_res = await client.post(
            f"{NEBIUS_BASE_URL.rstrip('/')}/chat/completions",
            headers={"Authorization": f"Bearer {NEBIUS_API_KEY}", "Content-Type": "application/json"},
            json={
                "model": NEBIUS_MODEL,
                "messages": messages,
                "temperature": 0.2,
                "max_tokens": 1024,
            }
        )
        if nebius_res.status_code == 200:
            result = nebius_res.json()
            answer = result["choices"][0]["message"]["content"]
            print("\n=== Operational Briefing (NVIDIA Nemotron via Nebius) ===\n")
            print(answer)
            return 0
        else:
            print(f"Error from Nebius Token Factory: {nebius_res.status_code} {nebius_res.text}")
            return 1

if __name__ == "__main__":
    sys.exit(asyncio.run(main(" ".join(sys.argv[1:]) or "Give me a short status of the plant.")))
