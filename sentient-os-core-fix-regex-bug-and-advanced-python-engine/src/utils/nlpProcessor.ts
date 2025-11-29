import { pipeline, env } from "@huggingface/transformers";

// Skip local model checks for browser environment
env.allowLocalModels = false;
env.useBrowserCache = true;

let sentimentAnalyzer: any = null;
let zeroShotClassifier: any = null;

export const initializeNLP = async () => {
  try {
    console.log('Initializing NLP models...');
    
    // Initialize sentiment analysis
    if (!sentimentAnalyzer) {
        sentimentAnalyzer = await pipeline(
        'sentiment-analysis',
        'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
        { device: 'wasm' }
        );
    }

    // Initialize Zero-Shot Classification for Intent Detection
    // Using a lightweight model suitable for browser
    if (!zeroShotClassifier) {
        zeroShotClassifier = await pipeline(
            'zero-shot-classification',
            'Xenova/mobilebert-uncased-mnli',
            { device: 'wasm' }
        );
    }
    
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

export const classifyIntent = async (text: string): Promise<string> => {
  if (!zeroShotClassifier) {
    await initializeNLP();
  }

  const candidateLabels = [
    'earth environmental monitoring',
    'business marketing and compliance',
    'financial defi transaction',
    'human support and help'
  ];

  try {
    const output = await zeroShotClassifier(text, candidateLabels);
    // output: { sequence:Str, labels:Str[], scores:float[] }
    // Get the top label
    const topLabel = output.labels[0];

    // Map full labels to short intent codes
    if (topLabel === 'earth environmental monitoring') return 'eid';
    if (topLabel === 'business marketing and compliance') return 'enid';
    if (topLabel === 'financial defi transaction') return 'dtad';
    if (topLabel === 'human support and help') return 'hid';

    return 'general';
  } catch (error) {
    console.error('Zero-shot classification error:', error);
    // Fallback to simple keyword matching if model fails
    const lowerText = text.toLowerCase();
    if (lowerText.includes('weather') || lowerText.includes('crop') || lowerText.includes('satellite')) return 'eid';
    if (lowerText.includes('marketing') || lowerText.includes('audit') || lowerText.includes('campaign')) return 'enid';
    if (lowerText.includes('pay') || lowerText.includes('stake') || lowerText.includes('ada')) return 'dtad';
    return 'hid';
  }
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

  // Extract Emails
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
  const emailMatches = text.match(emailPattern);
  if (emailMatches) {
      emailMatches.forEach(match => {
          entities.push({ type: 'email', value: match });
      });
  }
  
  return entities;
};

export const routeToAgent = (intent: string): string => {
    // Intent is now directly the agent ID (eid, enid, dtad, hid)
    const validAgents = ['eid', 'enid', 'dtad', 'hid'];
    if (validAgents.includes(intent)) {
        return intent;
    }
    return 'hid'; // Default to Human Interaction if unsure
};
