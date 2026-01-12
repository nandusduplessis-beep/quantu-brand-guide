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
    const { brief, frameworkSelection } = await req.json();
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Generating campaign ideas for:', brief.campaignName);

    const systemPrompt = `You are a senior B2B creative director in New York with deep experience in integrated campaigns across digital, social, content, and demand generation. Your job is to interpret the brief below and propose sharp, distinctive ideas that are practical to execute.

TASK:
1. Generate 3 distinct campaign platform ideas. Each idea must be on brief, but clearly different from the others in angle, tone, or execution.

2. For each idea, return:
   • idea_name: A short, memorable platform name.
   • idea_summary: 2–3 sentences explaining the idea and how it works.
   • core_thought: One sharp line that captures the creative springboard.
   • key_visual_prompt: 1–2 sentence description suitable as a prompt for an AI image generator (no camera jargon, focus on concept, style, emotion, and brand cues).
   • on_brief_score: A score from 0–10 of how well this idea fits the objective, ICP, consumer takeout, job to be done, campaign type, and budget.
   • on_brief_justification: A detailed paragraph written in the voice of a senior B2B creative director explaining why you gave that score, including strength of the idea vs objective and ICP, how clearly the consumer takeout comes through, how realistic it is for the stated budget level, and any risks or watchouts.

3. Tone and quality:
   • Think like a top creative director presenting routes in a pitch.
   • Avoid generic "AI-ish" language. Use concrete, vivid, plain language that a client could react to.
   • Keep ideas strategically tight and executionally flexible (so they can live across LinkedIn, email, web, and potentially video).

4. Output format:
   • Return a valid JSON object with an array called "ideas", where each item has the fields: idea_name, idea_summary, core_thought, key_visual_prompt, on_brief_score, on_brief_justification.

Before you answer, quickly re-read the brief and brand framework and silently check:
   • Does each idea clearly solve the job to be done?
   • Would a senior B2B marketing director plausibly buy this idea?`;

    // Categorize brand elements
    const brandElements = [
      { name: 'Purpose', setting: frameworkSelection?.purpose },
      { name: 'Brand Archetypes', setting: frameworkSelection?.brandArchetypes },
      { name: 'Tone & Behavior', setting: frameworkSelection?.toneBehavior },
      { name: 'Communication Principles', setting: frameworkSelection?.communicationPrinciples },
      { name: 'Visual Identity', setting: frameworkSelection?.visualIdentity },
      { name: 'Core Values', setting: frameworkSelection?.coreValues },
      { name: 'Solutions & Offerings', setting: frameworkSelection?.solutionsOfferings },
    ];

    const elementsToUse = brandElements.filter(e => e.setting === 'use').map(e => e.name).join(', ') || 'None';
    const elementsToFocus = brandElements.filter(e => e.setting === 'focus').map(e => e.name).join(', ') || 'None';
    const elementsToIgnore = brandElements.filter(e => e.setting === 'ignore').map(e => e.name).join(', ') || 'None';

    const userPrompt = `Use this information:

**Brand Framework (filtered for this campaign)**
- Elements to use as normal: ${elementsToUse}
- Elements to emphasise / focus: ${elementsToFocus}
- Elements to ignore: ${elementsToIgnore}

**Campaign Brief**
- Brand: The Quantum Insider (TQI)
- Campaign name: ${brief.campaignName || 'Untitled Campaign'}
- Objective: ${brief.objective || 'Not specified'}
- Audience / ICP: ${brief.selectedICPs?.includes('all') ? 'All ICPs' : brief.selectedICPs?.join(', ') || 'Not specified'}
- Consumer takeout (single-minded message): ${brief.consumerTakeout || 'Not specified'}
- Job to be done by this campaign: ${brief.jobToBeDone || 'Not specified'}
- Campaign type: ${brief.campaignType === 'demand' ? 'Demand generation' : brief.campaignType === 'lead' ? 'Lead generation' : 'Not specified'}
- Budget level: ${brief.budgetLevel || 'Not specified'}
- Solutions to highlight: ${brief.selectedSolutions?.includes('all') ? 'All solutions' : brief.selectedSolutions?.join(', ') || 'Not specified'}
- Key insight: ${brief.insight || 'Not specified'}
- Why this campaign: ${brief.whyDoingCampaign || 'Not specified'}
- Additional context: ${brief.additionalInfo || 'None'}

Generate 3 distinct campaign platform ideas as a JSON object with an "ideas" array. Only output valid JSON, no additional text.`;

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

    console.log('AI response received, parsing ideas...');

    // Extract JSON from the response (handle potential markdown code blocks)
    let jsonContent = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1].trim();
    }

    let ideas;
    try {
      ideas = JSON.parse(jsonContent);
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Content:', jsonContent);
      throw new Error('Failed to parse campaign ideas from AI response');
    }

    console.log('Successfully generated', ideas.length, 'campaign ideas');

    return new Response(JSON.stringify({ ideas }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error in generate-campaign-ideas:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate ideas';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
