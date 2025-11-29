from langchain_community.llms import FakeListLLM
from langchain_core.prompts import PromptTemplate
from app.tools import get_masumi_tools
from app.models import AgentResponse

class MasumiAgent:
    def __init__(self):
        # We use FakeListLLM for demonstration since we don't have an OpenAI key in this environment.
        # In production, replace with: ChatOpenAI(model="gpt-4")
        self.llm = FakeListLLM(responses=[
            "I need to check the balance first.",
            "Action: Check Balance\nAction Input: addr1_test_wallet",
            "The balance is sufficient. Now I will transfer the assets.",
            "Action: DeFi Transfer\nAction Input: 100, ADA, addr1_recipient",
            "Final Answer: I have successfully initiated the transfer of 100 ADA after verifying the balance."
        ])

        self.tools = get_masumi_tools()
        self.prompt = PromptTemplate.from_template(
            """Answer the following questions as best you can. You have access to the following tools:

{tools}

Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

Begin!

Question: {input}
Thought:{agent_scratchpad}"""
        )

        # Note: In a real scenario with a real LLM, we would construct the agent proper.
        # Here we simulate the processing logic for stability in the demo environment.

    def process(self, query: str) -> AgentResponse:
        # Mocking the ReAct loop for the demo to ensure predictable output without a real LLM
        # Logic: Check if it's a transfer request

        response_text = ""
        tools_used = []

        if "transfer" in query.lower() or "send" in query.lower():
            tools_used.append({
                "tool": "Check Balance",
                "input": "User Wallet",
                "output": "1000.0 ADA"
            })
            tools_used.append({
                "tool": "DeFi Transfer",
                "input": "Amount extracted from query",
                "output": "Transaction Initiated"
            })
            response_text = "I have initiated the transaction on the Masumi Network after verifying funds."
        elif "compliance" in query.lower() or "kyc" in query.lower():
            tools_used.append({
                "tool": "Compliance Check",
                "input": "User ID",
                "output": "VERIFIED"
            })
            response_text = "User is fully compliant with Masumi Network regulations."
        else:
            response_text = "I am the Masumi AI Agent. I can help with DeFi transactions and compliance."

        return AgentResponse(
            response=response_text,
            tool_usage=tools_used,
            sentiment="positive",
            cost_incurred=0.005  # 0.005 ADA cost for agent usage
        )
