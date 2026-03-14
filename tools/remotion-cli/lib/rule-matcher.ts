import type { Rule } from './rule-parser.js';

type ScoredRule = Rule & { score: number };

// Keywords that map to always-included foundational rules
const FOUNDATIONAL_RULES = ['compositions', 'animations'];

export function matchRules(description: string, allRules: Rule[], topN = 8): Rule[] {
  const words = description
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2);

  const scored: ScoredRule[] = allRules.map((rule) => {
    let score = 0;

    // Always include foundational rules
    if (FOUNDATIONAL_RULES.includes(rule.name)) {
      score += 5;
    }

    // Tag overlap (high weight)
    for (const tag of rule.tags) {
      for (const word of words) {
        if (tag.includes(word) || word.includes(tag)) {
          score += 3;
        }
      }
    }

    // Name/description match
    const nameDesc = `${rule.name} ${rule.description}`.toLowerCase();
    for (const word of words) {
      if (nameDesc.includes(word)) {
        score += 2;
      }
    }

    // Body keyword frequency (lower weight)
    const bodyLower = rule.body.toLowerCase();
    for (const word of words) {
      const matches = bodyLower.split(word).length - 1;
      score += Math.min(matches, 3) * 0.5;
    }

    return { ...rule, score };
  });

  return scored
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}
