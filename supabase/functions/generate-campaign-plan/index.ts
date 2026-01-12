import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { brief, frameworkSelection, selectedIdea } = await req.json();
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Generating campaign plan for idea:', selectedIdea.idea_name);

    const systemPrompt = `You are a senior B2B integrated marketing strategist in New York with deep experience planning and executing multi-channel campaigns for technology companies. Your job is to take a selected campaign concept and build out a comprehensive, actionable campaign plan.

TASK:
Take the selected campaign idea and create a detailed campaign plan that a marketing team could execute. Be specific, practical, and strategic.

OUTPUT STRUCTURE:
Return a valid JSON object with these sections:

1. "campaign_overview": {
   "platform_name": string (the campaign name),
   "tagline": string (a punchy campaign tagline),
   "big_idea": string (2-3 sentences on the strategic creative platform),
   "success_metrics": string[] (3-5 KPIs to measure success)
}

2. "messaging_framework": {
   "primary_message": string (the main message/headline),
   "supporting_messages": string[] (3-4 proof points or supporting messages),
   "call_to_action": string (primary CTA),
   "elevator_pitch": string (30-second version of the campaign story)
}

3. "channels": [
   {
     "channel": string (e.g., "LinkedIn", "Email", "Webinar", "Content Hub", "Paid Search"),
     "role": string (what this channel does in the journey),
     "tactics": string[] (2-4 specific tactics),
     "content_types": string[] (specific content pieces needed),
     "priority": "high" | "medium" | "low"
   }
] (provide 5-7 channels)

4. "timeline": {
   "total_duration": string (e.g., "12 weeks"),
   "phases": [
     {
       "phase_name": string,
       "duration": string,
       "focus": string,
       "key_activities": string[],
       "deliverables": string[]
     }
   ]
} (provide 3-4 phases)

5. "assets": [
   {
     "asset_name": string,
     "asset_type": string (e.g., "Landing Page", "Email Template", "Social Post", "Video Script", "Whitepaper"),
     "description": string,
     "channel": string (where it will be used),
     "priority": "must-have" | "nice-to-have"
   }
] (provide 10-15 assets)

6. "budget_allocation": {
   "level": string (the budget level),
   "recommendation": string (overall budget strategy),
   "breakdown": [
     {
       "category": string,
       "percentage": number,
       "notes": string
     }
   ]
}

7. "risks_and_mitigations": [
   {
     "risk": string,
     "mitigation": string
   }
] (provide 3-5 risks)

GUIDELINES:
- Be specific to B2B technology marketing
- Tailor recommendations to the stated budget level
- Ensure tactics are practical and executable
- Think like a senior strategist presenting to a CMO
- Avoid generic marketing jargon - use concrete, actionable language
- Consider the full buyer journey from awareness to conversion`;

    // Build context from brief and selected idea
    const userPrompt = `Create a detailed campaign plan based on the following:

**SELECTED CAMPAIGN IDEA:**
- Platform Name: ${selectedIdea.idea_name}
- Core Thought: ${selectedIdea.core_thought}
- Summary: ${selectedIdea.idea_summary}
- Visual Concept: ${selectedIdea.key_visual_prompt}

**ORIGINAL CAMPAIGN BRIEF:**
- Brand: The Quantum Insider (TQI)
- Campaign name: ${brief.campaignName || 'Untitled Campaign'}
- Objective: ${brief.objective || 'Not specified'}
- Audience / ICP: ${brief.selectedICPs?.includes('all') ? 'All ICPs' : brief.selectedICPs?.join(', ') || 'Not specified'}
- Consumer takeout: ${brief.consumerTakeout || 'Not specified'}
- Job to be done: ${brief.jobToBeDone || 'Not specified'}
- Campaign type: ${brief.campaignType === 'demand' ? 'Demand generation' : brief.campaignType === 'lead' ? 'Lead generation' : 'Not specified'}
- Budget level: ${brief.budgetLevel || 'Medium'} (Low = $5-15K, Medium = $15-50K, High = $50K+)
- Solutions to highlight: ${brief.selectedSolutions?.includes('all') ? 'All solutions' : brief.selectedSolutions?.join(', ') || 'Not specified'}
- Key insight: ${brief.insight || 'Not specified'}
- Why this campaign: ${brief.whyDoingCampaign || 'Not specified'}
- Additional context: ${brief.additionalInfo || 'None'}

Generate a comprehensive campaign plan as a JSON object. Only output valid JSON, no additional text.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Usage limit reached. Please add credits to continue.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content in AI response');
    }

    console.log('AI response received, parsing campaign plan...');

    // Extract JSON from the response (handle potential markdown code blocks)
    let jsonContent = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1].trim();
    }

    let plan;
    try {
      plan = JSON.parse(jsonContent);
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Content:', jsonContent);
      throw new Error('Failed to parse campaign plan from AI response');
    }

    console.log('Successfully generated campaign plan');

    return new Response(JSON.stringify({ plan }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error in generate-campaign-plan:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate plan';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
