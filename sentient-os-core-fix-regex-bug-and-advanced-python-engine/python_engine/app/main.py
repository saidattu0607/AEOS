from fastapi import FastAPI, HTTPException
from app.models import AgentRequest, AgentResponse, MasumiAgentConfig
from app.agent import MasumiAgent

app = FastAPI(
    title="Masumi AI Agent Engine",
    description="Advanced Python-based AI Engine for AEOS, compliant with Masumi Network.",
    version="1.0.0"
)

agent = MasumiAgent()

@app.get("/")
async def root():
    return {"status": "online", "service": "Masumi AI Engine"}

@app.get("/config")
async def get_agent_config():
    return MasumiAgentConfig(
        name="Veritas-X",
        did="did:masumi:agent:veritas-x-99",
        capabilities=["DeFi", "Compliance", "Analysis"],
        price_per_request=0.005,
        wallet_address="addr1_masumi_agent_vault"
    )

@app.post("/interact", response_model=AgentResponse)
async def interact_with_agent(request: AgentRequest):
    try:
        response = agent.process(request.query)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
