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
  
  // EID Intents
  if (lowerText.includes('weather') || lowerText.includes('climate') || lowerText.includes('disaster') || lowerText.includes('satellite') || lowerText.includes('flood')) {
    return 'eid';
  }

  // ENID Intents
  if (lowerText.includes('marketing') || lowerText.includes('compliance') || lowerText.includes('audit') || lowerText.includes('workflow') || lowerText.includes('kyc')) {
    return 'enid';
  }

  // DTAD Intents
  if (lowerText.includes('send') || lowerText.includes('pay') || lowerText.includes('yield') || lowerText.includes('stake') || lowerText.includes('insurance') || lowerText.includes('loan')) {
    return 'dtad';
  }
  
  // HID Intents
  if (lowerText.includes('support') || lowerText.includes('help') || lowerText.includes('ticket') || lowerText.includes('recommend') || lowerText.includes('contact')) {
    return 'hid';
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
    eid: 'Earth Intelligence',
    enid: 'Enterprise Intelligence',
    dtad: 'DeFi & Transaction',
    hid: 'Human Interaction',
    general: 'AEOS Core'
  };
  
  return agentRouting[intent] || 'AEOS Core';
};
