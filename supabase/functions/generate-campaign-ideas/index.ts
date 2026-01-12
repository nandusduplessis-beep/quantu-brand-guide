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

    const systemPrompt = `You are a world-class creative strategist specializing in B2B marketing campaigns for quantum computing and deep tech industries. You generate innovative, data-driven campaign ideas that are both creative and practical.

Your task is to generate 3 distinct campaign ideas based on the provided brief and brand framework settings. Each idea should be unique in approach but aligned with the brand's positioning.

For each campaign idea, provide:
1. **Title**: A catchy, memorable campaign name
2. **Concept**: A 2-3 sentence description of the core creative concept
3. **Key Message**: The primary message or tagline
4. **Channels**: Recommended channels (e.g., LinkedIn, email, webinars, content marketing)
5. **Tactics**: 3-4 specific tactical recommendations
6. **Why It Works**: Brief explanation of why this approach fits the objective

Format your response as a JSON array with 3 objects, each containing: title, concept, keyMessage, channels (array), tactics (array), whyItWorks.`;

    const userPrompt = `Generate campaign ideas based on this brief:

**Campaign Name:** ${brief.campaignName || 'Untitled Campaign'}
**Objective:** ${brief.objective || 'Not specified'}
**Campaign Type:** ${brief.campaignType === 'demand' ? 'Demand Generation' : brief.campaignType === 'lead' ? 'Lead Generation' : 'Not specified'}
**Budget Level:** ${brief.budgetLevel || 'Not specified'}
**Target Audience:** ${brief.selectedICPs?.includes('all') ? 'All ICPs' : brief.selectedICPs?.join(', ') || 'Not specified'}
**Consumer Takeout:** ${brief.consumerTakeout || 'Not specified'}
**Key Insight:** ${brief.insight || 'Not specified'}
**Job to be Done:** ${brief.jobToBeDone || 'Not specified'}
**Why This Campaign:** ${brief.whyDoingCampaign || 'Not specified'}
**Additional Context:** ${brief.additionalInfo || 'None'}

**Brand Framework Settings:**
- Purpose: ${frameworkSelection?.purpose || 'use'}
- Brand Archetypes: ${frameworkSelection?.brandArchetypes || 'use'}
- Tone & Behavior: ${frameworkSelection?.toneBehavior || 'use'}
- Communication Principles: ${frameworkSelection?.communicationPrinciples || 'use'}
- Visual Identity: ${frameworkSelection?.visualIdentity || 'use'}
- Core Values: ${frameworkSelection?.coreValues || 'use'}
- Solutions & Offerings: ${frameworkSelection?.solutionsOfferings || 'use'}

Generate 3 creative campaign ideas as a JSON array. Only output valid JSON, no additional text.`;

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
