import { Shield, Lock, Eye, AlertTriangle } from "lucide-react";

export const SecurityPanel = () => {
  const securityFeatures = [
    {
      icon: <Lock className="h-5 w-5" />,
      title: "Private Key Protection",
      status: "Secured",
      detail: "Hardware-isolated signing enclave",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "DID Identity",
      status: "Active",
      detail: "Decentralized authentication",
    },
    {
      icon: <Eye className="h-5 w-5" />,
      title: "Transaction Simulation",
      status: "Running",
      detail: "Pre-execution validation",
    },
    {
      icon: <AlertTriangle className="h-5 w-5" />,
      title: "Threat Detection",
      status: "Monitoring",
      detail: "Real-time security analysis",
    },
  ];

  return (
    <div className="glass-card p-6 rounded-2xl">
      <h2 className="text-xl font-semibold text-foreground mb-4">Security & Compliance</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {securityFeatures.map((feature, index) => (
          <div
            key={index}
            className="p-4 bg-gradient-holographic rounded-xl border border-success/20 hover:border-success/40 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-success/10 text-success">{feature.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-success font-medium mt-1">{feature.status}</p>
                <p className="text-xs text-muted-foreground mt-1">{feature.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
