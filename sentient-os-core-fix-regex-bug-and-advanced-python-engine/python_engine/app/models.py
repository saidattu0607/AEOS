from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class AgentRequest(BaseModel):
    query: str
    user_id: str
    context: Optional[Dict[str, Any]] = None

class AgentResponse(BaseModel):
    response: str
    tool_usage: List[Dict[str, Any]] = []
    sentiment: str = "neutral"
    cost_incurred: float = 0.0

class MasumiAgentConfig(BaseModel):
    name: str
    did: str
    capabilities: List[str]
    price_per_request: float = 0.0
    wallet_address: str
