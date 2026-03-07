import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, template, contentMode, title, additionalInstructions } =
      await req.json();

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(
      "Generating white paper:",
      title,
      "| Template:",
      template.name,
      "| Mode:",
      contentMode
    );

    const sectionList = template.sections
      .map(
        (s: { name: string; description: string; required: boolean; maxWords?: number }) =>
          `- **${s.name}** ${s.required ? "(Required)" : "(Optional)"}: ${s.description}${s.maxWords ? ` [Max ~${s.maxWords} words]` : ""}`
      )
      .join("\n");

    const modeInstructions: Record<string, string> = {
      "direct-copy": `DIRECT TRANSPOSE MODE:
You are transposing existing content into the template structure.
- Preserve the original text as much as possible
- Reorganize content to fit the template sections naturally
- Fill every required section — if the source doesn't have content for a section, write a brief placeholder note
- Maintain the author's voice while ensuring TQI brand tone (Sage + Explorer)
- Do NOT fabricate data or statistics — only use what's in the source content
- If there are direct quotes, data points, or statistics in the source, preserve them exactly`,

      condense: `CONDENSE & SUMMARIZE MODE:
You are condensing a longer document into a shorter, more impactful format.
- Extract the most important insights, data points, and conclusions
- Restructure for maximum impact and readability
- Reduce word count significantly while preserving key messages
- Write in TQI's brand voice: authoritative yet accessible, data-driven yet forward-looking
- Highlight actionable takeaways
- Create compelling section transitions
- If the source has data/statistics, feature the most impactful ones prominently`,

      "lead-magnet": `LEAD MAGNET EXTRACT MODE:
You are creating a short, punchy lead magnet from longer content.
- Extract the 3-5 most compelling insights or data points
- Write with urgency and impact — every sentence must earn its place
- Use bold statistics and surprising findings as hooks
- Keep language accessible to a broad business audience
- End with a strong call to action
- The goal is to make the reader want to learn more (and engage with TQI)
- Format for scannability: bullet points, numbered lists, bold key phrases`,
    };

    const systemPrompt = `You are a senior content strategist and editor for The Quantum Insider (TQI), a quantum technology market intelligence platform. You transform source content into professionally structured, brand-aligned documents.

BRAND CONTEXT:
- TQI delivers actionable market intelligence for deep tech decision-makers
- Brand archetypes: The Sage (calm, informed, analytical) + The Explorer (confident, energizing, forward-leaning)
- Tone: Authoritative yet accessible, data-driven yet forward-looking
- Values: Accessible, Data-Driven, Enable
- Tagline: "Actionable quantum intelligence and bespoke solutions — empowering confident decisions that move the industry forward"

${modeInstructions[contentMode] || modeInstructions["direct-copy"]}

TEMPLATE: ${template.name}
TEMPLATE DESCRIPTION: ${template.description}
TARGET LENGTH: ${template.pageEstimate}

REQUIRED SECTIONS:
${sectionList}

OUTPUT FORMAT:
Return a valid JSON object with the following structure:
{
  "title": "The document title",
  "subtitle": "A compelling subtitle",
  "date": "Publication date",
  "sections": [
    {
      "id": "section-id-from-template",
      "name": "Section Name",
      "content": "The full content for this section in markdown format",
      "pullQuote": "An optional compelling quote to highlight (if applicable)",
      "dataCallout": { "value": "Key number", "label": "What it represents" }
    }
  ],
  "metadata": {
    "readingTime": "X min read",
    "wordCount": approximate_number,
    "keyTopics": ["topic1", "topic2", "topic3"]
  }
}

IMPORTANT:
- Use markdown formatting within section content (bold, lists, headers)
- Include pull quotes for sections where a standout line exists
- Include data callouts where there are compelling statistics
- The "cover" section content should just be a brief description for the cover page
- Generate content for ALL required sections, skip optional ones only if irrelevant
- Do NOT include the JSON in markdown code blocks — return raw JSON only`;

    const userPrompt = `Transform the following source content into a "${template.name}" using the ${contentMode === "direct-copy" ? "Direct Transpose" : contentMode === "condense" ? "Condense & Summarize" : "Lead Magnet Extract"} approach.

DOCUMENT TITLE: ${title || "Untitled Document"}

${additionalInstructions ? `ADDITIONAL INSTRUCTIONS: ${additionalInstructions}\n` : ""}
SOURCE CONTENT:
---
${content}
---

Generate the structured white paper as a JSON object. Only output valid JSON.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "Rate limit exceeded. Please try again in a moment.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            error: "Usage limit reached. Please add credits to continue.",
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;

    if (!rawContent) {
      throw new Error("No content in AI response");
    }

    console.log("AI response received, parsing white paper...");

    // Extract JSON from the response (handle potential markdown code blocks)
    let jsonContent = rawContent;
    const jsonMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1].trim();
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(jsonContent);
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Content:", jsonContent);
      throw new Error("Failed to parse white paper from AI response");
    }

    if (!parsedResponse.sections || !Array.isArray(parsedResponse.sections)) {
      console.error("Invalid white paper format:", parsedResponse);
      throw new Error("Invalid white paper format in AI response");
    }

    console.log(
      "Successfully generated white paper with",
      parsedResponse.sections.length,
      "sections"
    );

    return new Response(JSON.stringify({ whitepaper: parsedResponse }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in generate-whitepaper:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to generate white paper";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
