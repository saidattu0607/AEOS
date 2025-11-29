import { Brain, Cpu, Zap, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface AnalyticsData {
  totalCommands: number;
  aiAccuracy: number;
  responseTime: number;
  activeModels: number;
}

export const AIAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalCommands: 0,
    aiAccuracy: 0,
    responseTime: 0,
    activeModels: 3,
  });

  useEffect(() => {
    // Simulate real-time analytics
    const interval = setInterval(() => {
      setAnalytics(prev => ({
        totalCommands: prev.totalCommands + Math.floor(Math.random() * 3),
        aiAccuracy: 95 + Math.random() * 4,
        responseTime: 120 + Math.random() * 80,
        activeModels: 3,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const metrics = [
    {
      icon: <Brain className="h-5 w-5" />,
      label: "AI Commands",
      value: analytics.totalCommands,
      unit: "processed",
      color: "text-primary",
    },
    {
      icon: <Cpu className="h-5 w-5" />,
      label: "Model Accuracy",
      value: analytics.aiAccuracy.toFixed(1),
      unit: "%",
      color: "text-success",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      label: "Avg Response",
      value: Math.round(analytics.responseTime),
      unit: "ms",
      color: "text-warning",
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      label: "Active Models",
      value: analytics.activeModels,
      unit: "models",
      color: "text-secondary",
    },
  ];

  return (
    <div className="glass-card p-6 rounded-2xl">
      <h2 className="text-xl font-semibold text-foreground mb-4">AI Analytics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="p-4 bg-gradient-holographic rounded-xl border border-primary/20 hover:border-primary/40 transition-all"
          >
            <div className={`${metric.color} mb-3`}>{metric.icon}</div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">{metric.label}</p>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                <p className="text-xs text-muted-foreground">{metric.unit}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
