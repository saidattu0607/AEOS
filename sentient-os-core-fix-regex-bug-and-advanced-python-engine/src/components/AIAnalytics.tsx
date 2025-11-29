import { Brain, Cpu, Zap, TrendingUp, BarChart, Server } from "lucide-react";
import { useEffect, useState } from "react";

interface AnalyticsData {
  totalCommands: number;
  aiAccuracy: number;
  responseTime: number;
  activeAgents: number;
  tokensGenerated: number;
  masumiLoad: number;
}

export const AIAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalCommands: 1240,
    aiAccuracy: 98.2,
    responseTime: 45,
    activeAgents: 12,
    tokensGenerated: 450,
    masumiLoad: 24
  });

  useEffect(() => {
    // Simulate real-time analytics
    const interval = setInterval(() => {
      setAnalytics(prev => ({
        totalCommands: prev.totalCommands + Math.floor(Math.random() * 2),
        aiAccuracy: 98 + (Math.random() * 1.5 - 0.5),
        responseTime: 40 + Math.random() * 20,
        activeAgents: 12 + Math.floor(Math.random() * 3),
        tokensGenerated: prev.tokensGenerated + Math.floor(Math.random() * 5),
        masumiLoad: 20 + Math.random() * 15
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const metrics = [
    {
      icon: <Brain className="h-4 w-4" />,
      label: "Commands Processed",
      value: analytics.totalCommands.toLocaleString(),
      unit: "req",
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/20"
    },
    {
      icon: <Cpu className="h-4 w-4" />,
      label: "Neural Accuracy",
      value: analytics.aiAccuracy.toFixed(1),
      unit: "%",
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20"
    },
    {
      icon: <Zap className="h-4 w-4" />,
      label: "Global Latency",
      value: Math.round(analytics.responseTime),
      unit: "ms",
      color: "text-yellow-400",
      bg: "bg-yellow-500/10 border-yellow-500/20"
    },
    {
      icon: <Server className="h-4 w-4" />,
      label: "Masumi Net Load",
      value: analytics.masumiLoad.toFixed(0),
      unit: "%",
      color: "text-green-400",
      bg: "bg-green-500/10 border-green-500/20"
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className={`p-3 rounded-lg border transition-all ${metric.bg}`}
        >
          <div className="flex items-center gap-2 mb-2">
             <div className={`${metric.color}`}>{metric.icon}</div>
             <p className="text-[10px] text-gray-400 uppercase tracking-wider">{metric.label}</p>
          </div>
          <div className="flex items-baseline gap-1">
            <p className="text-lg font-bold text-white">{metric.value}</p>
            <p className="text-[10px] text-gray-500">{metric.unit}</p>
          </div>
        </div>
      ))}

      {/* Mini Graph (Visual Only) */}
      <div className="col-span-2 p-3 rounded-lg border bg-white/5 border-white/10 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <BarChart className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-300 font-mono">24H ACTIVITY METRIC</span>
         </div>
         <div className="flex items-end gap-1 h-8">
            {[40, 60, 45, 70, 50, 80, 65, 90, 75, 60].map((h, i) => (
               <div key={i} style={{ height: `${h}%` }} className="w-2 bg-cyan-500/50 rounded-sm" />
            ))}
         </div>
      </div>
    </div>
  );
};
