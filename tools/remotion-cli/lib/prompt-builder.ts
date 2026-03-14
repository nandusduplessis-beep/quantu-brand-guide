import type { Rule } from './rule-parser.js';

const BRAND_CONTEXT = `## TQI Brand Identity
- **Quantum Teal (Primary):** #0aa0ab
- **Deep Navy (Background):** #040620
- **Cool Gray (Neutral):** #bec1c9
- **Resonance Blue (Accent):** #0014f0
- **Font:** Roboto (Google Fonts) — weights 400, 700
- **Style:** Professional, data-driven, authoritative yet approachable`;

export function buildPrompt(description: string, matchedRules: Rule[]): string {
  const rulesSections = matchedRules.map((rule) => {
    let section = `### ${rule.name}\n${rule.description}\n`;

    if (rule.requirements.length > 0) {
      section += `\n**Requirements:**\n${rule.requirements.map((r) => `- ${r}`).join('\n')}\n`;
    }

    if (rule.prohibitions.length > 0) {
      section += `\n**Prohibitions:**\n${rule.prohibitions.map((p) => `- ${p}`).join('\n')}\n`;
    }

    if (rule.codeExamples.length > 0) {
      section += `\n**Code Pattern:**\n\`\`\`tsx\n${rule.codeExamples[0]}\n\`\`\`\n`;
    }

    return section;
  }).join('\n---\n\n');

  // Collect all unique prohibitions and requirements
  const allProhibitions = [...new Set(matchedRules.flatMap((r) => r.prohibitions))];
  const allRequirements = [...new Set(matchedRules.flatMap((r) => r.requirements))];

  return `# Remotion Video Generation Prompt

You are a Remotion expert creating brand-consistent video compositions for The Quantum Insider (TQI).

## Task
Generate a Remotion React component for: **${description}**

${BRAND_CONTEXT}

## Relevant Best Practices

${rulesSections}

## Critical Requirements
${allRequirements.map((r) => `- ${r}`).join('\n')}

## Prohibitions (NEVER do these)
${allProhibitions.map((p) => `- ${p}`).join('\n')}

## Output Format
Generate a single \`.tsx\` file that:
1. Imports from \`remotion\` and \`@remotion/google-fonts/Roboto\`
2. Uses \`useCurrentFrame()\` and \`useVideoConfig()\` for all animations
3. Uses TQI brand colors from the brand identity above
4. Uses \`type\` (not \`interface\`) for all props
5. Includes proper \`extrapolateRight: "clamp"\` on all \`interpolate()\` calls
6. Is ready to register as a \`<Composition>\` in Root.tsx
`;
}

export function buildPromptSummary(description: string, matchedRules: Rule[]): string {
  const ruleNames = matchedRules.map((r) => r.name).join(', ');
  return `Generated prompt for: "${description}"\nMatched rules (${matchedRules.length}): ${ruleNames}\n`;
}
