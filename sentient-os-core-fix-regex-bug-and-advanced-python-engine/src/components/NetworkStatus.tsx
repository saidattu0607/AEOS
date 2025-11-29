import { Activity, Database, Link, Server, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const NetworkStatus = () => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Simulate network check
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Network Status Updated",
      description: "All systems operational",
    });
    
    setIsRefreshing(false);
  };

  const metrics = [
    {
      icon: <Database className="h-5 w-5" />,
      label: "Cardano Network",
      value: "Pre-Prod",
      status: "Connected",
      color: "text-success",
    },
    {
      icon: <Link className="h-5 w-5" />,
      label: "Masumi Protocol",
      value: "Active",
      status: "Synced",
      color: "text-success",
    },
    {
      icon: <Server className="h-5 w-5" />,
      label: "AEOS Core",
      value: "v2.5.1",
      status: "Online",
      color: "text-success",
    },
    {
      icon: <Activity className="h-5 w-5" />,
      label: "Transaction Pool",
      value: "12",
      status: "Pending",
      color: "text-warning",
    },
  ];

  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Network Status</h2>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="outline"
          size="sm"
          className="border-primary/20"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <button
            key={index}
            onClick={() => toast({
              title: metric.label,
              description: `Status: ${metric.status} - ${metric.value}`,
            })}
            className="p-4 bg-gradient-holographic rounded-xl border border-primary/20 hover:border-primary/40 transition-all cursor-pointer"
          >
            <div className={`${metric.color} mb-3`}>{metric.icon}</div>
            <div className="space-y-1 text-left">
              <p className="text-xs text-muted-foreground">{metric.label}</p>
              <p className="text-lg font-bold text-foreground">{metric.value}</p>
              <p className={`text-xs font-medium ${metric.color}`}>{metric.status}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
