import { VoiceCommand } from "@/components/VoiceCommand";
import { AgentStatus } from "@/components/AgentStatus";
import { NetworkStatus } from "@/components/NetworkStatus";
import { TransactionMonitor } from "@/components/TransactionMonitor";
import { SecurityPanel } from "@/components/SecurityPanel";
import { AIAnalytics } from "@/components/AIAnalytics";
import { Terminal, Cpu, Sparkles, Globe, ShieldCheck, Banknote, UserCheck } from "lucide-react";
import { useEffect } from "react";
import { initializeNLP } from "@/utils/nlpProcessor";

const Index = () => {
  useEffect(() => {
    // Initialize NLP models on mount
    initializeNLP().catch(console.error);
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-black/95">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
      </div>

      {/* Header */}
      <header className="mb-8 relative z-10">
        <div className="glass-card p-6 rounded-2xl border border-primary/20 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-primary rounded-xl glow-cyan animate-float shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                <Globe className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-blue-500 tracking-tight">
                    AEOS
                  </h1>
                  <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
                </div>
                <p className="text-sm md:text-base text-cyan-200/80 mt-1 font-medium">
                  Autonomous Earth Operating System • Planetary Multi-Agent Intelligence
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
               <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                  <Cpu className="h-4 w-4 text-cyan-400" />
                  <span className="text-xs font-mono text-cyan-100">ORCHESTRATOR: ACTIVE</span>
               </div>
              <div className="flex items-center gap-1 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/30">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-green-400 font-medium">MASUMI NETWORK ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="space-y-8 relative z-10">

        {/* Core Control Center */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Command & Orchestration (4 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <VoiceCommand />
            <AIAnalytics />
          </div>

          {/* Right Column: Division Status (8 cols) */}
          <div className="lg:col-span-7">
             <div className="glass-card p-1 rounded-2xl border border-primary/20 h-full">
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-cyan-400" />
                    Operational Divisions
                  </h2>
                  <span className="text-xs text-muted-foreground font-mono">LIVE MONITORING</span>
                </div>
                <div className="p-4">
                  <AgentStatus />
                </div>
             </div>
          </div>
        </div>

        {/* Bottom Infrastructure Layer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-5 rounded-xl border border-white/5 hover:border-primary/30 transition-all duration-300">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <Banknote className="w-4 h-4 text-emerald-400" />
              DeFi Settlements
            </h3>
            <TransactionMonitor />
          </div>

          <div className="glass-card p-5 rounded-xl border border-white/5 hover:border-primary/30 transition-all duration-300">
             <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-purple-400" />
              Collaboration Logs
            </h3>
             <div className="h-[200px] overflow-y-auto space-y-2 font-mono text-xs">
               <div className="p-2 bg-white/5 rounded border border-white/5 text-gray-400">
                 <span className="text-blue-400">[ORCHESTRATOR]</span> System initialized.
               </div>
               <div className="p-2 bg-white/5 rounded border border-white/5 text-gray-400">
                 <span className="text-green-400">[EID]</span> Satellite uplink established.
               </div>
               <div className="p-2 bg-white/5 rounded border border-white/5 text-gray-400">
                 <span className="text-purple-400">[ENID]</span> Compliance modules loaded.
               </div>
               {/* This area would be dynamic in a real app */}
               <div className="p-2 bg-blue-500/10 rounded border border-blue-500/20 text-blue-200">
                 <span className="text-yellow-400">[ALERT]</span> Waiting for incoming queries...
               </div>
             </div>
          </div>

          <div className="glass-card p-5 rounded-xl border border-white/5 hover:border-primary/30 transition-all duration-300">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-red-400" />
              Global Security
            </h3>
            <SecurityPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
