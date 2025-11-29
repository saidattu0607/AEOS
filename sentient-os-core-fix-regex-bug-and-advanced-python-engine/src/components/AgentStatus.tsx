import { Activity, Shield, Brain, Lock, Zap, Users } from "lucide-react";
import { useState } from "react";
import { useAIAgent } from "@/hooks/useAIAgent";
import { useToast } from "@/hooks/use-toast";

interface Agent {
  id: string;
  name: string;
  status: "active" | "idle" | "processing";
  icon: React.ReactNode;
  description: string;
}

export const AgentStatus = () => {
  const { processCommand, isProcessing } = useAIAgent();
  const { toast } = useToast();
  const [activeAgent, setActiveAgent] = useState<string | null>(null);

  const agents: Agent[] = [
    {
      id: "aegis",
      name: "Aegis Agent",
      status: "active",
      icon: <Shield className="h-5 w-5" />,
      description: "Crisis Response & Security",
    },
    {
      id: "sentinel",
      name: "Sentinel Agent",
      status: "active",
      icon: <Activity className="h-5 w-5" />,
      description: "Cyber-Defense & Threat Intel",
    },
    {
      id: "veritas",
      name: "Veritas Agent",
      status: "idle",
      icon: <Brain className="h-5 w-5" />,
      description: "Truth & Identity Engine",
    },
    {
      id: "payment",
      name: "DID Payment Agent",
      status: "processing",
      icon: <Lock className="h-5 w-5" />,
      description: "Secure Transactions",
    },
    {
      id: "defi",
      name: "DeFi Agent",
      status: "active",
      icon: <Zap className="h-5 w-5" />,
      description: "Financial Operations",
    },
    {
      id: "compliance",
      name: "Compliance Agent",
      status: "idle",
      icon: <Users className="h-5 w-5" />,
      description: "Risk Management",
    },
  ];

  const handleAgentClick = async (agent: Agent) => {
    setActiveAgent(agent.id);
    
    const contextMessage = `Provide a status report for ${agent.name}. Include current tasks, system health, and any alerts.`;
    
    const response = await processCommand(
      "Generate status report",
      agent.id,
      contextMessage
    );

    if (response) {
      toast({
        title: `${agent.name} Report`,
        description: response.response,
        duration: 5000,
      });
    }
    
    setActiveAgent(null);
  };

  const getStatusColor = (status: Agent["status"]) => {
    switch (status) {
      case "active":
        return "text-success";
      case "processing":
        return "text-warning animate-pulse";
      case "idle":
        return "text-muted-foreground";
    }
  };

  const getStatusBg = (status: Agent["status"]) => {
    switch (status) {
      case "active":
        return "bg-success/10 border-success/30";
      case "processing":
        return "bg-warning/10 border-warning/30";
      case "idle":
        return "bg-muted/10 border-border/30";
    }
  };

  return (
    <div className="glass-card p-6 rounded-2xl">
      <h2 className="text-xl font-semibold text-foreground mb-4">Multi-Agent Intelligence</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent) => (
          <button
            key={agent.id}
            onClick={() => handleAgentClick(agent)}
            disabled={isProcessing && activeAgent === agent.id}
            className={`p-4 rounded-xl border ${getStatusBg(agent.status)} transition-all hover:scale-105 hover:border-primary/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              activeAgent === agent.id ? 'animate-pulse-glow' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className={`p-2 rounded-lg bg-background/50 ${getStatusColor(agent.status)}`}>
                {agent.icon}
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)} ${
                  agent.status === "active" ? "animate-pulse-glow" : ""
                }`} />
                <span className={`text-xs font-medium ${getStatusColor(agent.status)} uppercase`}>
                  {activeAgent === agent.id ? 'querying' : agent.status}
                </span>
              </div>
            </div>
            <h3 className="font-semibold text-foreground text-left">{agent.name}</h3>
            <p className="text-sm text-muted-foreground mt-1 text-left">{agent.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
