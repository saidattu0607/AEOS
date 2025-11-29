# AEOS – Autonomous Earth Operating System

**A Planet-Scale Multi-Agent Intelligence Built on the Masumi Network**

AEOS is a revolutionary "Operating System" for the planet, powered by AI agents that live on the Masumi Network (Cardano). It is designed to automate, optimize, and protect both Earth-scale systems (like weather monitoring and disaster response) and Enterprise-scale systems (like marketing, compliance, and finance).

![AEOS Interface](https://via.placeholder.com/800x400?text=AEOS+Interface+Preview)

## 🌍 The Vision

AEOS is not just a chatbot; it's a **self-managing economy of agents**.
*   **The Orchestrator**: A master AI that understands intent and delegates tasks.
*   **The Divisions**: 4 specialized teams of agents (EID, ENID, DTAD, HID).
*   **The Network**: Agents collaborate, hire each other, and settle payments on-chain via Masumi.

## 🧠 The 4 Intelligence Divisions

1.  **Earth Intelligence Division (EID)**
    *   *Focus*: Planetary health, weather, satellites, IoT, disaster prediction.
    *   *Key Feature*: Can trigger financial aid (via DTAD) instantly upon detecting a flood.

2.  **Enterprise Intelligence Division (ENID)**
    *   *Focus*: Business automation, marketing, compliance, workflow.
    *   *Key Feature*: Runs autonomous marketing campaigns and ensures on-chain KYC/AML.

3.  **DeFi & Transaction Division (DTAD)**
    *   *Focus*: Finance, payments, insurance, yield optimization.
    *   *Key Feature*: The "Bank" of the OS, managing treasury and settlements for other agents.

4.  **Human Interaction Division (HID)**
    *   *Focus*: Support, personalization, voice interface, recommendations.
    *   *Key Feature*: The "Face" of the OS, translating complex data into human-friendly insights.

## 🚀 Key Technical Features

*   **Multi-Agent Orchestration**: A central Python-based logic engine that routes tasks and manages complex workflows.
*   **Masumi Network Integration**: Agents have DIDs (Decentralized IDs) and wallets to transact on Cardano.
*   **Browser-Based NLP**: Uses Transformers.js for privacy-preserving, local intent classification and entity extraction.
*   **Voice Interface**: Hands-free command and control system.
*   **Real-Time Analytics**: Dashboard monitoring neural accuracy, network load, and agent status.

## 🛠 Project Structure

*   `src/`: React/Vite frontend with Tailwind CSS and Shadcn UI.
    *   `components/`: UI components for Agent Status, Voice Command, Analytics.
    *   `utils/nlpProcessor.ts`: Local NLP logic (Hugging Face).
*   `python_engine/`: The "Brain" of AEOS.
    *   `app/agent.py`: The Master Orchestrator logic.
    *   `app/divisions.py`: Implementation of the 4 Intelligence Divisions.
*   `supabase/`: Edge functions for serverless scaling.

## 📦 Getting Started

1.  **Clone the Repo**
2.  **Install Dependencies**: `npm install`
3.  **Run Development Server**: `npm run dev`
4.  **Interact**: Use the Voice Command interface to say "Check flood risk and prepare funds" to see multi-agent collaboration in action.

## 🏆 Hackathon Value Proposition

AEOS demonstrates the future of AI on Blockchain:
*   **Monetizable Agents**: Every service is a transaction.
*   **Trustless Collaboration**: Code is law, settlements are on-chain.
*   **Real-World Impact**: Combining Earth data with DeFi rails for instant disaster relief.

---

**Powered by Masumi Network & Lovable AI**
