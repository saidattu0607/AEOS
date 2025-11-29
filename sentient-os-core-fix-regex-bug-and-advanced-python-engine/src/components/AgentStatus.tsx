import { Globe, Briefcase, TrendingUp, Users, Cpu, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useAIAgent } from "@/hooks/useAIAgent";
import { useToast } from "@/hooks/use-toast";
import { initializeNLP, classifyIntent } from "@/utils/nlpProcessor";

interface Agent {
  id: string;
  name: string;
  status: "active" | "idle" | "processing";
  icon: React.ReactNode;
  description: string;
  capabilities: string[];
}

export const AgentStatus = () => {
  const { processCommand, isProcessing } = useAIAgent();
  const { toast } = useToast();
  const [activeAgent, setActiveAgent] = useState<string | null>(null);

  // Initialize NLP models on component mount
  useEffect(() => {
    initializeNLP();
  }, []);

  const agents: Agent[] = [
    {
      id: "eid",
      name: "EID: Earth Intelligence",
      status: "active",
      icon: <Globe className="h-6 w-6" />,
      description: "Planetary Systems, IoT, Satellites, Agri-Tech",
      capabilities: ["Climate Models", "Satellite Analysis", "Disaster Prediction"],
    },
    {
      id: "enid",
      name: "ENID: Enterprise Intel",
      status: "active",
      icon: <Briefcase className="h-6 w-6" />,
      description: "Workflow, Marketing, Compliance, Audit",
      capabilities: ["Marketing Auto", "Compliance/KYC", "Data Insights"],
    },
    {
      id: "dtad",
      name: "DTAD: DeFi & Tx",
      status: "active",
      icon: <TrendingUp className="h-6 w-6" />,
      description: "Finance, Yield, Governance, Payments",
      capabilities: ["Yield Opt", "Risk Scoring", "Governance Voting"],
    },
    {
      id: "hid",
      name: "HID: Human Interaction",
      status: "idle",
      icon: <Users className="h-6 w-6" />,
      description: "Support, Personalization, Scheduling",
      capabilities: ["Customer Support", "Personalization", "Orchestration"],
    },
  ];

  const handleAgentClick = async (agent: Agent) => {
    setActiveAgent(agent.id);
    
    // Simulate complex context generation based on division
    let contextMessage = "";
    switch(agent.id) {
        case "eid":
            contextMessage = "Status Report Request: Analyze current global sensor data and satellite feeds. Report on any anomalies or risks.";
            break;
        case "enid":
            contextMessage = "Status Report Request: detailed audit of current marketing campaigns and compliance logs.";
            break;
        case "dtad":
            contextMessage = "Status Report Request: Analyze Cardano stake pool performance and market trends using deep learning models.";
            break;
        case "hid":
            contextMessage = "Status Report Request: Summary of user interactions and pending support tickets.";
            break;
    }
    
    const response = await processCommand(
      "Generate detailed division status report.",
      agent.id,
      contextMessage
    );

    if (response) {
      toast({
        title: `${agent.name} Report`,
        description: response.response,
        duration: 6000,
      });
    }
    
    setActiveAgent(null);
  };

  const getStatusColor = (status: Agent["status"]) => {
    switch (status) {
      case "active":
        return "text-emerald-400";
      case "processing":
        return "text-amber-400 animate-pulse";
      case "idle":
        return "text-slate-400";
    }
  };

  const getStatusBg = (status: Agent["status"]) => {
    switch (status) {
      case "active":
        return "bg-emerald-950/30 border-emerald-500/30 hover:border-emerald-500/60";
      case "processing":
        return "bg-amber-950/30 border-amber-500/30";
      case "idle":
        return "bg-slate-900/30 border-slate-700/30 hover:border-slate-500/50";
    }
  };

  return (
    <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Cpu className="w-24 h-24 text-primary" />
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">AEOS Divisions</h2>
            <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Autonomous Earth Operating System</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-500/20">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-medium text-blue-400">Masumi Network Secured</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent) => (
          <button
            key={agent.id}
            onClick={() => handleAgentClick(agent)}
            disabled={isProcessing && activeAgent === agent.id}
            className={`p-5 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg text-left group relative overflow-hidden ${getStatusBg(agent.status)} ${
              activeAgent === agent.id ? 'animate-pulse-glow ring-1 ring-primary/50' : ''
            }`}
          >
             {/* Progress bar simulation for active agents */}
             {activeAgent === agent.id && (
                <div className="absolute bottom-0 left-0 h-1 bg-primary/50 animate-progress w-full" />
             )}

            <div className="flex items-start justify-between mb-3">
              <div className={`p-3 rounded-lg bg-black/40 ${getStatusColor(agent.status)} group-hover:scale-110 transition-transform`}>
                {agent.icon}
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)} ${
                    agent.status === "active" ? "animate-ping" : ""
                    }`} />
                    <span className={`text-[10px] font-bold ${getStatusColor(agent.status)} uppercase tracking-wider`}>
                    {activeAgent === agent.id ? 'NEURAL PROCESSING...' : agent.status}
                    </span>
                </div>
              </div>
            </div>

            <h3 className="font-bold text-lg text-slate-100 mb-1 group-hover:text-primary transition-colors">{agent.name}</h3>
            <p className="text-sm text-slate-400 mb-3 leading-relaxed">{agent.description}</p>

            <div className="flex flex-wrap gap-1.5 mt-auto">
                {agent.capabilities.map((cap, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                        {cap}
                    </span>
                ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
