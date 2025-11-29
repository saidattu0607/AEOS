from typing import List, Dict, Any
from app.models import AgentResponse
from app.divisions import (
    EarthIntelligenceDivision,
    EnterpriseIntelligenceDivision,
    DeFiTransactionDivision,
    HumanInteractionDivision
)

class AEOSOrchestrator:
    """
    The Superior AI OS that controls and orchestrates the other 4 agent divisions.
    It acts as the "Brain" of the Autonomous Earth Operating System.
    """
    def __init__(self):
        self.eid = EarthIntelligenceDivision()
        self.enid = EnterpriseIntelligenceDivision()
        self.dtad = DeFiTransactionDivision()
        self.hid = HumanInteractionDivision()
        self.divisions = [self.eid, self.enid, self.dtad, self.hid]

    def process(self, query: str) -> AgentResponse:
        """
        Main entry point for AEOS. Analyzes the query and delegates to the appropriate division(s).
        Demonstrates the "Superior OS" capability by coordinating multi-agent workflows.
        """

        selected_division = None
        logs = []

        # 1. Master Logic: Determine Intent
        logs.append(f"AEOS Orchestrator receiving query: '{query}'")
        logs.append("Analyzing intent across 4 Intelligence Divisions...")

        # 2. Check for Cross-Division Collaboration Triggers
        # Example: "Compliance check then pay" -> ENID + DTAD
        # Example: "Disaster payment" -> EID + DTAD

        if ("flood" in query.lower() or "disaster" in query.lower()) and ("pay" in query.lower() or "fund" in query.lower()):
            return self._handle_collaboration_eid_dtad(query)

        if "compliance" in query.lower() and "pay" in query.lower():
            return self._handle_collaboration_enid_dtad(query)

        # 3. Standard Routing (Single Division)
        for division in self.divisions:
            if division.can_handle(query):
                selected_division = division
                break

        # Fallback to HID if no specific technical division matches
        if not selected_division:
            selected_division = self.hid

        logs.append(f"Delegating task to: {selected_division.name}")

        # 4. Execute Division Logic
        result = selected_division.process(query)

        # 5. Aggregate Results
        full_logs = logs + result.get("logs", [])

        return AgentResponse(
            response=result["response"],
            division=selected_division.name,
            tool_usage=result["tool_usage"],
            collaboration_log=full_logs,
            sentiment="positive", # simplified for now
            cost_incurred=result.get("cost", 0.0)
        )

    def _handle_collaboration_eid_dtad(self, query: str) -> AgentResponse:
        """
        Handles the complex workflow: Earth Intelligence detects disaster -> DeFi Agent releases funds.
        """
        logs = []
        logs.append("AEOS Orchestrator detected MULTI-AGENT workflow: Disaster Response + Financial Settlement")

        # Step 1: EID
        logs.append("Step 1: Activating EID for disaster verification...")
        eid_result = self.eid.process(query)
        logs.extend(eid_result["logs"])

        # Step 2: DTAD
        logs.append("Step 2: Activating DTAD for emergency fund release...")
        dtad_result = self.dtad.process("send emergency funds")
        logs.extend(dtad_result["logs"])

        # Collaboration log
        logs.append("COLLABORATION SUCCESS: Verified disaster data on-chain, triggered smart contract release.")

        return AgentResponse(
            response=f"Collaborative Workflow Complete: {eid_result['response']} -> {dtad_result['response']}",
            division="AEOS Collaborative Core (EID + DTAD)",
            tool_usage=eid_result["tool_usage"] + dtad_result["tool_usage"],
            collaboration_log=logs,
            sentiment="serious",
            cost_incurred=eid_result["cost"] + dtad_result["cost"]
        )

    def _handle_collaboration_enid_dtad(self, query: str) -> AgentResponse:
        """
        Handles: Enterprise Compliance -> DeFi Payment.
        """
        logs = []
        logs.append("AEOS Orchestrator detected MULTI-AGENT workflow: Compliance Check + Payment")

        # Step 1: ENID
        logs.append("Step 1: Activating ENID for KYC/AML check...")
        enid_result = self.enid.process(query)
        logs.extend(enid_result["logs"])

        # Step 2: DTAD
        logs.append("Step 2: Activating DTAD for secure settlement...")
        dtad_result = self.dtad.process(query) # Pass original query to capture amount
        logs.extend(dtad_result["logs"])

        logs.append("COLLABORATION SUCCESS: Identity proof minted, transaction executed.")

        return AgentResponse(
            response=f"Secure Transaction Complete: {enid_result['response']} -> {dtad_result['response']}",
            division="AEOS Collaborative Core (ENID + DTAD)",
            tool_usage=enid_result["tool_usage"] + dtad_result["tool_usage"],
            collaboration_log=logs,
            sentiment="positive",
            cost_incurred=enid_result["cost"] + dtad_result["cost"]
        )

# Maintain the interface expected by main.py but redirect to Orchestrator
class MasumiAgent:
    def __init__(self):
        self.orchestrator = AEOSOrchestrator()

    def process(self, query: str) -> AgentResponse:
        return self.orchestrator.process(query)
