import { useState, useEffect } from "react";
import { Mic, MicOff, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { useAIAgent } from "@/hooks/useAIAgent";
import { classifyIntent, routeToAgent, extractEntities, analyzeSentiment } from "@/utils/nlpProcessor";

export const VoiceCommand = () => {
  const { isListening, transcript, startListening, stopListening } = useVoiceRecognition();
  const { processCommand, isProcessing } = useAIAgent();
  const [textInput, setTextInput] = useState("");
  const [lastResponse, setLastResponse] = useState("");
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
      setLastResponse(response.response);
    }
    
    setTextInput("");
  };

  useEffect(() => {
    if (transcript && !isListening && transcript !== "Listening...") {
      handleSendCommand(transcript);
    }
  }, [transcript, isListening]);

  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">AI Voice Command Interface</h2>
        <Button
          variant={isListening ? "destructive" : "default"}
          size="lg"
          onClick={toggleListening}
          disabled={isProcessing}
          className={`rounded-full w-16 h-16 ${
            isListening ? "animate-pulse-glow glow-cyan" : ""
          }`}
        >
          {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </Button>
      </div>

      {/* Text Input Alternative */}
      <div className="flex gap-2 mb-4">
        <Input
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendCommand(textInput)}
          placeholder="Type a command or use voice..."
          className="flex-1 bg-muted/20 border-primary/20"
          disabled={isProcessing}
        />
        <Button
          onClick={() => handleSendCommand(textInput)}
          disabled={isProcessing || !textInput.trim()}
          className="glow-cyan"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="mb-4 p-4 bg-gradient-holographic rounded-lg border border-primary/20">
          <p className="text-sm text-muted-foreground mb-1">Voice Input:</p>
          <p className="text-foreground font-medium">{transcript}</p>
        </div>
      )}

      {/* NLP Analysis */}
      {nlpAnalysis && (
        <div className="mb-4 p-4 bg-muted/20 rounded-lg border border-border/50">
          <p className="text-sm text-muted-foreground mb-2">NLP Analysis:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">Intent:</span>{" "}
              <span className="text-primary font-medium">{nlpAnalysis.intent}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Agent:</span>{" "}
              <span className="text-secondary font-medium">{nlpAnalysis.agent}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Sentiment:</span>{" "}
              <span className="text-success font-medium">{nlpAnalysis.sentiment?.label}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Entities:</span>{" "}
              <span className="text-foreground">{nlpAnalysis.entities?.length || 0}</span>
            </div>
          </div>
        </div>
      )}

      {/* AI Response */}
      {lastResponse && (
        <div className="mb-4 p-4 bg-gradient-primary rounded-lg border border-primary/30 glow-cyan">
          <p className="text-sm text-muted-foreground mb-1">AI Response:</p>
          <p className="text-foreground">{lastResponse}</p>
        </div>
      )}

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="mb-4 p-3 bg-warning/10 rounded-lg border border-warning/30 animate-pulse">
          <p className="text-sm text-warning text-center">Processing with AI...</p>
        </div>
      )}

      {/* Examples */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => handleSendCommand("Deploy smart contract on pre-prod")}
          className="p-3 bg-muted/20 rounded-lg border border-border/50 hover:border-primary/40 transition-all text-left"
        >
          <p className="text-xs text-muted-foreground">Example:</p>
          <p className="text-sm text-foreground mt-1">"Deploy smart contract"</p>
        </button>
        <button
          onClick={() => handleSendCommand("Check network security status")}
          className="p-3 bg-muted/20 rounded-lg border border-border/50 hover:border-primary/40 transition-all text-left"
        >
          <p className="text-xs text-muted-foreground">Example:</p>
          <p className="text-sm text-foreground mt-1">"Check security status"</p>
        </button>
      </div>
    </div>
  );
};
