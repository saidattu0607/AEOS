from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class AgentRequest(BaseModel):
    query: str
    user_id: str
    division: str = Field(..., description="The AEOS division to route to: eid, enid, dtad, or hid")
    context: Optional[Dict[str, Any]] = None

class AgentResponse(BaseModel):
    response: str
    tool_usage: List[Dict[str, Any]] = []
    sentiment: str = "neutral"
    cost_incurred: float = 0.0
    division_used: str

class DivisionConfig(BaseModel):
    id: str
    name: str
    description: str
    capabilities: List[str]
    price_per_request: float
