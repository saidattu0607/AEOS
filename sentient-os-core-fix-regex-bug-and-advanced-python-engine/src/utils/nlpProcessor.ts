import { pipeline } from "@huggingface/transformers";

let sentimentAnalyzer: any = null;
let embeddingModel: any = null;

export const initializeNLP = async () => {
  try {
    console.log('Initializing NLP models...');
    
    // Initialize sentiment analysis
    sentimentAnalyzer = await pipeline(
      'sentiment-analysis',
      'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
      { device: 'wasm' }
    );
    
    console.log('NLP models initialized successfully');
  } catch (error) {
    console.error('Error initializing NLP models:', error);
  }
};

export const analyzeSentiment = async (text: string) => {
  if (!sentimentAnalyzer) {
    await initializeNLP();
  }
  
  try {
    const result = await sentimentAnalyzer(text);
    return result[0];
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return { label: 'NEUTRAL', score: 0.5 };
  }
};

export const classifyIntent = (text: string): string => {
  const lowerText = text.toLowerCase();
  
  // Transaction intents
  if (lowerText.includes('send') || lowerText.includes('transfer') || lowerText.includes('pay')) {
    return 'transaction';
  }
  
  // Deployment intents
  if (lowerText.includes('deploy') || lowerText.includes('contract') || lowerText.includes('smart contract')) {
    return 'deployment';
  }
  
  // Query intents
  if (lowerText.includes('check') || lowerText.includes('status') || lowerText.includes('balance')) {
    return 'query';
  }
  
  // Security intents
  if (lowerText.includes('security') || lowerText.includes('threat') || lowerText.includes('protect')) {
    return 'security';
  }
  
  // DeFi intents
  if (lowerText.includes('stake') || lowerText.includes('yield') || lowerText.includes('liquidity')) {
    return 'defi';
  }
  
  return 'general';
};

export const extractEntities = (text: string) => {
  const entities: { type: string; value: string }[] = [];
  
  // Extract ADA amounts
  const adaPattern = /((?:\d+(?:\.\d*)?|\.\d+))\s*ADA/gi;
  const adaMatches = text.match(adaPattern);
  if (adaMatches) {
    adaMatches.forEach(match => {
      entities.push({ type: 'amount', value: match });
    });
  }
  
  // Extract wallet addresses (simplified)
  const addressPattern = /addr[a-z0-9]{50,}/gi;
  const addressMatches = text.match(addressPattern);
  if (addressMatches) {
    addressMatches.forEach(match => {
      entities.push({ type: 'address', value: match });
    });
  }
  
  return entities;
};

export const routeToAgent = (intent: string): string => {
  const agentRouting: Record<string, string> = {
    transaction: 'payment',
    deployment: 'aegis',
    query: 'sentinel',
    security: 'sentinel',
    defi: 'defi',
    general: 'general'
  };
  
  return agentRouting[intent] || 'general';
};
