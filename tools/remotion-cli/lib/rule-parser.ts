import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type Rule = {
  name: string;
  description: string;
  tags: string[];
  codeExamples: string[];
  prohibitions: string[];
  requirements: string[];
  body: string;
  filePath: string;
};

const CODE_BLOCK_RE = /```(?:tsx?|bash)?\n([\s\S]*?)```/g;
const PROHIBITION_RE = /^.*\b(FORBIDDEN|MUST NOT|DO NOT|never use|must never)\b.*$/gim;
const REQUIREMENT_RE = /^.*\b(MUST|always|required|should always)\b.*$/gim;

export function parseRuleFile(filePath: string): Rule {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  const tags: string[] = [];
  if (data.metadata?.tags) {
    tags.push(
      ...String(data.metadata.tags)
        .split(',')
        .map((t: string) => t.trim().toLowerCase()),
    );
  }

  const codeExamples: string[] = [];
  let match: RegExpExecArray | null;
  const codeRe = new RegExp(CODE_BLOCK_RE.source, CODE_BLOCK_RE.flags);
  while ((match = codeRe.exec(content)) !== null) {
    codeExamples.push(match[1].trim());
  }

  const prohibitions: string[] = [];
  const reqRe1 = new RegExp(PROHIBITION_RE.source, PROHIBITION_RE.flags);
  while ((match = reqRe1.exec(content)) !== null) {
    prohibitions.push(match[0].trim());
  }

  const requirements: string[] = [];
  const reqRe2 = new RegExp(REQUIREMENT_RE.source, REQUIREMENT_RE.flags);
  while ((match = reqRe2.exec(content)) !== null) {
    // Skip lines that are already prohibitions
    if (!prohibitions.includes(match[0].trim())) {
      requirements.push(match[0].trim());
    }
  }

  return {
    name: data.name || path.basename(filePath, '.md'),
    description: data.description || '',
    tags,
    codeExamples,
    prohibitions,
    requirements,
    body: content,
    filePath,
  };
}

export function loadAllRules(rulesDir: string): Rule[] {
  if (!fs.existsSync(rulesDir)) {
    throw new Error(`Rules directory not found: ${rulesDir}`);
  }

  const files = fs.readdirSync(rulesDir).filter((f) => f.endsWith('.md'));
  return files.map((f) => parseRuleFile(path.join(rulesDir, f)));
}
