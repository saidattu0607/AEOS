import { CheckCircle, Clock, AlertCircle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Transaction {
  id: string;
  type: string;
  amount: string;
  status: "completed" | "pending" | "failed";
  timestamp: string;
  from: string;
  to: string;
}

export const TransactionMonitor = () => {
  const transactions: Transaction[] = [
    {
      id: "tx_001",
      type: "Smart Contract Deploy",
      amount: "2.5 ADA",
      status: "completed",
      timestamp: "2 mins ago",
      from: "AEOS Wallet",
      to: "Pre-Prod Network",
    },
    {
      id: "tx_002",
      type: "DID Verification",
      amount: "0.5 ADA",
      status: "pending",
      timestamp: "5 mins ago",
      from: "Veritas Agent",
      to: "Identity Layer",
    },
    {
      id: "tx_003",
      type: "Agent Payment",
      amount: "10 ADA",
      status: "completed",
      timestamp: "8 mins ago",
      from: "DeFi Agent",
      to: "Compliance Agent",
    },
  ];

  const getStatusIcon = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "pending":
        return <Clock className="h-4 w-4 text-warning animate-pulse" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusVariant = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
    }
  };

  return (
    <div className="glass-card p-6 rounded-2xl">
      <h2 className="text-xl font-semibold text-foreground mb-4">Transaction Monitor</h2>
      <div className="space-y-3">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="p-4 bg-muted/20 rounded-xl border border-border/50 hover:border-primary/30 transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(tx.status)}
                <span className="font-semibold text-foreground">{tx.type}</span>
              </div>
              <Badge variant={getStatusVariant(tx.status)} className="text-xs">
                {tx.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <span>{tx.from}</span>
              <ArrowRight className="h-4 w-4" />
              <span>{tx.to}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-primary font-mono">{tx.amount}</span>
              <span className="text-muted-foreground">{tx.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
