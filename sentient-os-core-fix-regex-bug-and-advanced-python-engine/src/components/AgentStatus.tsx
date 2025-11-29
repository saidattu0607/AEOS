import { Globe, Building2, Banknote, HeartHandshake, ShieldCheck, Activity } from "lucide-react";
import { useState } from "react";
import { useAIAgent } from "@/hooks/useAIAgent";
import { useToast } from "@/hooks/use-toast";

interface Division {
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
  const [activeDivision, setActiveDivision] = useState<string | null>(null);

  const divisions: Division[] = [
    {
      id: "eid",
      name: "EID: Earth Intelligence",
      status: "active",
      icon: <Globe className="h-6 w-6" />,
      description: "Planetary monitoring, weather analysis, IoT grid, disaster prediction.",
      capabilities: ["Satellite Uplink", "Disaster Forecast", "Energy Grid Opt", "Agri-Drone Swarm"]
    },
    {
      id: "enid",
      name: "ENID: Enterprise Intelligence",
      status: "active",
      icon: <Building2 className="h-6 w-6" />,
      description: "Business automation, marketing, compliance, data insights.",
      capabilities: ["Workflow Auto", "Marketing GenAI", "Compliance/KYC", "Audit Logging"]
    },
    {
      id: "dtad",
      name: "DTAD: DeFi & Transactions",
      status: "processing",
      icon: <Banknote className="h-6 w-6" />,
      description: "Financial brain, yield optimization, insurance, payments.",
      capabilities: ["Yield Optimize", "Smart Treasury", "Risk Scoring", "Instant Pay"]
    },
    {
      id: "hid",
      name: "HID: Human Interaction",
      status: "active",
      icon: <HeartHandshake className="h-6 w-6" />,
      description: "Support, personalization, user journey, recommendations.",
      capabilities: ["24/7 Support", "Personalization", "Ticket Auto-Resolve", "Voice Interface"]
    },
  ];

  const handleDivisionClick = async (div: Division) => {
    setActiveDivision(div.id);
    
    const contextMessage = `Run diagnostics for ${div.name}. Report on active nodes and recent collaboration events.`;
    
    // Using 'AEOS Core' as the routing agent/division for status checks
    const response = await processCommand(
      `Status Report for ${div.id.toUpperCase()}`,
      "AEOS Core",
      contextMessage
    );

    if (response) {
      toast({
        title: `${div.name} Status`,
        description: response.response,
        duration: 5000,
      });
    }
    
    setActiveDivision(null);
  };

  const getStatusColor = (status: Division["status"]) => {
    switch (status) {
      case "active":
        return "text-cyan-400";
      case "processing":
        return "text-yellow-400 animate-pulse";
      case "idle":
        return "text-gray-500";
    }
  };

  const getStatusBg = (status: Division["status"]) => {
    switch (status) {
      case "active":
        return "bg-cyan-500/10 border-cyan-500/30";
      case "processing":
        return "bg-yellow-500/10 border-yellow-500/30";
      case "idle":
        return "bg-gray-500/10 border-gray-500/30";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      {divisions.map((div) => (
        <button
          key={div.id}
          onClick={() => handleDivisionClick(div)}
          disabled={isProcessing && activeDivision === div.id}
          className={`relative group p-4 rounded-xl border ${getStatusBg(div.status)} transition-all duration-300 hover:scale-[1.02] hover:bg-white/5 cursor-pointer disabled:opacity-50 text-left`}
        >
          {/* Status Indicator */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${div.status === "active" ? "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" : "bg-yellow-400"} animate-pulse`} />
            <span className={`text-[10px] font-mono tracking-widest ${getStatusColor(div.status)} uppercase`}>
              {activeDivision === div.id ? 'SCANNING...' : div.status}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-3">
            <div className={`p-3 rounded-lg bg-black/40 border border-white/10 ${getStatusColor(div.status)} group-hover:scale-110 transition-transform`}>
              {div.icon}
            </div>
            <div>
              <h3 className="font-bold text-white text-lg tracking-tight">{div.name}</h3>
              <p className="text-xs text-gray-400 font-mono">ID: {div.id.toUpperCase()}-001</p>
            </div>
          </div>

          <p className="text-sm text-gray-300 mb-4 line-clamp-2">{div.description}</p>

          <div className="flex flex-wrap gap-2">
            {div.capabilities.map((cap) => (
              <span key={cap} className="px-2 py-1 text-[10px] rounded bg-white/5 border border-white/10 text-gray-400 font-mono">
                {cap}
              </span>
            ))}
          </div>
        </button>
      ))}
    </div>
  );
};
