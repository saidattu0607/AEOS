import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AIResponse {
  response: string;
  agent: string;
  timestamp: string;
}

export const useAIAgent = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processCommand = async (
    command: string,
    agent?: string,
    context?: string
  ): Promise<AIResponse | null> => {
    setIsProcessing(true);
    try {
      console.log('Sending command to AI agent:', { command, agent, context });

      const { data, error } = await supabase.functions.invoke('ai-agent', {
        body: { command, agent, context }
      });

      if (error) {
        console.error('AI agent error:', error);
        throw error;
      }

      console.log('AI agent response:', data);

      toast({
        title: "Command Processed",
        description: `${agent || 'AEOS'} agent responded successfully`,
      });

      return data as AIResponse;
    } catch (error: any) {
      console.error('Error processing command:', error);
      
      const errorMessage = error.message || 'Failed to process command';
      toast({
        title: "Command Failed",
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
