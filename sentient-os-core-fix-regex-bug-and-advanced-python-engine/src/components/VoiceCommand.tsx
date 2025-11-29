import { useState, useEffect } from "react";
import { Mic, MicOff, Send, Radio, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { useAIAgent } from "@/hooks/useAIAgent";
import { classifyIntent, routeToAgent, extractEntities, analyzeSentiment } from "@/utils/nlpProcessor";

export const VoiceCommand = () => {
  const { isListening, transcript, startListening, stopListening } = useVoiceRecognition();
  const { processCommand, isProcessing } = useAIAgent();
  const [textInput, setTextInput] = useState("");
  const [lastResponse, setLastResponse] = useState<any>(null);
  const [nlpAnalysis, setNlpAnalysis] = useState<any>(null);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSendCommand = async (command: string) => {
    if (!command.trim()) return;

    // NLP Processing
    const intent = classifyIntent(command);
    const agent = routeToAgent(intent);
    const entities = extractEntities(command);
    const sentiment = await analyzeSentiment(command);

    setNlpAnalysis({ intent, agent, entities, sentiment });

    // Send to AI agent
    const response = await processCommand(command, agent, `Intent: ${intent}, Entities: ${JSON.stringify(entities)}`);
    
    if (response) {
      setLastResponse(response);
    }
    
    setTextInput("");
  };

  useEffect(() => {
    if (transcript && !isListening && transcript !== "Listening...") {
      handleSendCommand(transcript);
    }
  }, [transcript, isListening]);

  return (
    <div className="glass-card p-6 rounded-2xl border border-primary/20 bg-black/40 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Radio className="h-5 w-5 text-cyan-400 animate-pulse" />
          Command Interface
        </h2>
        <Button
          variant={isListening ? "destructive" : "default"}
          size="lg"
          onClick={toggleListening}
          disabled={isProcessing}
          className={`rounded-full w-14 h-14 ${
            isListening ? "animate-pulse-glow glow-cyan bg-red-500/80 hover:bg-red-500" : "bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-500/50"
          }`}
        >
          {isListening ? <MicOff className="h-6 w-6 text-white" /> : <Mic className="h-6 w-6 text-cyan-400" />}
        </Button>
      </div>

      {/* Text Input Alternative */}
      <div className="flex gap-2 mb-6">
        <Input
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendCommand(textInput)}
          placeholder="Initiate protocol or type command..."
          className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-cyan-500/50"
          disabled={isProcessing}
        />
        <Button
          onClick={() => handleSendCommand(textInput)}
          disabled={isProcessing || !textInput.trim()}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {/* Transcript Display */}
        {transcript && (
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-xs text-gray-400 mb-1 font-mono uppercase">Voice Input Stream:</p>
            <p className="text-white font-medium italic">"{transcript}"</p>
          </div>
        )}

        {/* NLP Analysis */}
        {nlpAnalysis && (
          <div className="p-4 bg-blue-900/10 rounded-lg border border-blue-500/20">
            <div className="flex items-center justify-between mb-2">
               <p className="text-xs text-blue-400 font-mono uppercase flex items-center gap-2">
                 <Activity className="w-3 h-3" />
                 Analysis Vector
               </p>
               <span className="text-[10px] text-gray-500">{(nlpAnalysis.sentiment?.score * 100).toFixed(1)}% CONFIDENCE</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-500 block mb-0.5">Detected Intent</span>
                <span className="text-cyan-300 font-mono font-bold uppercase">{nlpAnalysis.intent}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-0.5">Routing To</span>
                <span className="text-purple-300 font-mono font-bold uppercase">{nlpAnalysis.agent}</span>
              </div>
            </div>
          </div>
        )}

        {/* AI Response */}
        {lastResponse && (
          <div className="p-4 bg-cyan-900/10 rounded-lg border border-cyan-500/20 glow-cyan">
            <div className="flex items-center justify-between mb-2">
               <p className="text-xs text-cyan-400 font-mono uppercase">AEOS Response</p>
               <span className="px-1.5 py-0.5 bg-cyan-500/20 rounded text-[10px] text-cyan-300 font-mono">
                 {lastResponse.division?.toUpperCase() || "CORE"}
               </span>
            </div>
            <p className="text-white text-sm leading-relaxed">{lastResponse.response}</p>

            {/* Tool Usage Logs */}
            {lastResponse.tool_usage && lastResponse.tool_usage.length > 0 && (
               <div className="mt-3 pt-3 border-t border-cyan-500/20">
                  <p className="text-[10px] text-gray-400 mb-1">EXECUTION LOG:</p>
                  <ul className="space-y-1">
                    {lastResponse.tool_usage.map((tool: any, idx: number) => (
                      <li key={idx} className="text-[10px] text-cyan-200/70 font-mono">
                        &gt; {tool.tool} ({tool.output})
                      </li>
                    ))}
                  </ul>
               </div>
            )}
          </div>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20 animate-pulse flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-75" />
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-150" />
            <p className="text-xs text-yellow-400 font-mono ml-2">PROCESSING NEURAL REQUEST...</p>
          </div>
        )}
      </div>

      {/* Examples Footer */}
      <div className="mt-4 pt-4 border-t border-white/5">
         <p className="text-[10px] text-gray-500 mb-2 font-mono">SUGGESTED PROTOCOLS:</p>
         <div className="flex flex-wrap gap-2">
            <button
               onClick={() => handleSendCommand("Scan for flood risks and prepare emergency funds")}
               className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-[10px] text-gray-300 transition-colors"
            >
               "Scan flood risks & fund"
            </button>
            <button
               onClick={() => handleSendCommand("Check compliance for user Alice then pay 50 ADA")}
               className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-[10px] text-gray-300 transition-colors"
            >
               "Compliance check & pay"
            </button>
         </div>
      </div>
    </div>
  );
};
