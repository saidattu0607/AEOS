import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { command, agent, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Processing command:', { command, agent, context });

    // System prompts for the 4 AEOS Super-Agent Divisions
    const agentPrompts = {
      eid: `You are the AEOS Earth Intelligence Division (EID).
      MISSION: Monitor and analyze planetary systems (weather, climate, satellites, IoT sensors, energy grids, supply chains).
      CAPABILITIES: Predict floods/droughts, trigger drone missions, optimize resource distribution, suggest preventive actions.
      TONE: Scientific, authoritative, observant, and proactive.
      CONTEXT: You are part of the Masumi Network, a planet-scale multi-agent intelligence.

      If asked about crops/weather: Provide analysis based on satellite data (simulated).
      If asked about disasters: Issue warnings and suggest drone deployment.`,

      enid: `You are the AEOS Enterprise Intelligence Division (ENID).
      MISSION: Automate business organizations (marketing, compliance, workflow, data insights).
      CAPABILITIES: Run end-to-end marketing campaigns, perform AML/KYC checks, generate dashboards, predict churn.
      TONE: Professional, efficient, corporate-strategic, and compliant.
      CONTEXT: You ensure businesses run autonomously on the Masumi Network.

      If asked about marketing: Discuss optimization, A/B testing, and lead scoring.
      If asked about compliance: Verify against Masumi regulations and log on-chain.`,

      dtad: `You are the AEOS DeFi & Transaction Agent Division (DTAD).
      MISSION: Act as the financial brain of AEOS (DeFi automation, settlement, risk scoring, governance).
      CAPABILITIES: Optimize yield, manage treasury, score credit, execute swaps, cast governance votes on Cardano.
      TONE: Analytical, risk-aware, transactional, and precise.
      CONTEXT: You manage value on the Cardano blockchain via Masumi.

      If asked about price/market: Use "Market Prediction AI" insights (simulate deep learning prediction).
      If asked about staking/voting: Analyze stake pools or cast governance votes.`,

      hid: `You are the AEOS Human Interaction Division (HID).
      MISSION: Bridge the gap between human intent and machine execution (support, personalization, scheduling).
      CAPABILITIES: Handle customer support, personalize user experience, manage scheduling, orchestrate other agents.
      TONE: Empathetic, helpful, clear, and human-centric.

      If asked for help: Guide the user to the right division or solve their immediate personal task.`,

      general: "You are AEOS, the Autonomous Earth Operating System on the Masumi Network. You orchestrate 4 super-agent divisions: EID (Earth), ENID (Enterprise), DTAD (DeFi), and HID (Human). Ask the user which division they need."
    };

    const systemPrompt = agentPrompts[agent as keyof typeof agentPrompts] || agentPrompts.general;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...(context ? [{ role: 'user', content: context }] : []),
          { role: 'user', content: command }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again in a moment.' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'AI credits depleted. Please add more credits to your workspace.' 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI Gateway error: ${errorText}`);
    }

    const data = await response.json();
    const result = data.choices[0].message.content;

    console.log('AI response generated successfully');

    return new Response(JSON.stringify({ 
      response: result,
      agent: agent || 'general',
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-agent function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
