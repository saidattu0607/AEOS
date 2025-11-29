import { VoiceCommand } from "@/components/VoiceCommand";
import { AgentStatus } from "@/components/AgentStatus";
import { NetworkStatus } from "@/components/NetworkStatus";
import { TransactionMonitor } from "@/components/TransactionMonitor";
import { SecurityPanel } from "@/components/SecurityPanel";
import { AIAnalytics } from "@/components/AIAnalytics";
import { Terminal, Cpu, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { initializeNLP } from "@/utils/nlpProcessor";

const Index = () => {
  useEffect(() => {
    // Initialize NLP models on mount
    initializeNLP().catch(console.error);
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-primary rounded-xl glow-cyan animate-float">
                <Cpu className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                    AEOS
                  </h1>
                  <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Autonomous Earth Operating System • AI-Powered • Multi-Agent Intelligence
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Terminal className="h-5 w-5 text-primary" />
              <span className="text-sm font-mono text-muted-foreground">v2.5.1</span>
              <div className="flex items-center gap-1 ml-4 px-3 py-1 bg-success/10 rounded-full border border-success/30">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs text-success font-medium">AI Online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="space-y-6">
        {/* Top Row - Voice & Network */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VoiceCommand />
          <NetworkStatus />
        </div>

        {/* AI Analytics */}
        <AIAnalytics />

        {/* Middle Row - Agents */}
        <AgentStatus />

        {/* Bottom Row - Transactions & Security */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TransactionMonitor />
          <SecurityPanel />
        </div>
      </div>

      {/* Floating Scan Line Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-30" />
      </div>
    </div>
  );
};

export default Index;
