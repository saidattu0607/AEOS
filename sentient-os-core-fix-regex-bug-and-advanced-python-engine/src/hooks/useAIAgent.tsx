import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface AIResponse {
  response: string;
  division: string;
  tool_usage: any[];
  collaboration_log: string[];
  sentiment: string;
  cost_incurred: number;
  timestamp: string;
}

export const useAIAgent = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processCommand = async (
    command: string,
    division?: string,
    context?: string
  ): Promise<AIResponse | null> => {
    setIsProcessing(true);
    try {
      console.log('Sending command to AEOS Orchestrator:', { command, division, context });

      // In a real implementation, this would call the Python backend or an Edge Function acting as a proxy.
      // For this demo/prototype environment, we might simulate the response if the backend isn't reachable,
      // OR we assume the Supabase Function 'ai-agent' is updated to forward to our Python engine.

      // Since we modified the Python Engine, we need to ensure the Edge Function calls it correctly.
      // However, for this React-centric task, we will define the expected return type.

      const { data, error } = await supabase.functions.invoke('ai-agent', {
        body: { command, agent: division, context } // Mapping division to 'agent' param for backward compat if needed
      });

      if (error) {
        console.error('AI agent error:', error);
        throw error;
      }

      console.log('AEOS response:', data);

      toast({
        title: "AEOS Orchestrator",
        description: `Processed by ${data.division || division || 'Core'}`,
      });

      return data as AIResponse;
    } catch (error: any) {
      console.error('Error processing command:', error);
      
      const errorMessage = error.message || 'Failed to process command';
      toast({
        title: "Processing Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processCommand,
    isProcessing,
  };
};
