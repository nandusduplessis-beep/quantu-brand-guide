#!/usr/bin/env npx tsx
import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { loadAllRules } from './lib/rule-parser.js';
import { matchRules } from './lib/rule-matcher.js';
import { buildPrompt, buildPromptSummary } from './lib/prompt-builder.js';
import { generateCode } from './lib/code-generator.js';
import { explainCode, formatExplanation } from './lib/interpreter.js';
import { validateCode, formatValidation } from './lib/validator.js';
import { launchPreview } from './lib/previewer.js';

const RULES_DIR = path.resolve(
  import.meta.dirname,
  '../../.agents/skills/remotion-best-practices/rules',
);

const program = new Command();

program
  .name('remotion-tool')
  .description('TQI Remotion prompt generator and code interpreter')
  .version('1.0.0');

// ── Generate ────────────────────────────────────────────────────────
program
  .command('generate')
  .description('Generate an AI prompt and starter Remotion code from a video description')
  .argument('<description>', 'Natural language description of the video you want to create')
  .option('-o, --output <dir>', 'Output directory', './output')
  .option('--prompt-only', 'Only output the AI prompt, no code generation')
  .option('--code-only', 'Only output the generated code, no prompt')
  .action((description: string, opts: { output: string; promptOnly?: boolean; codeOnly?: boolean }) => {
    const rules = loadAllRules(RULES_DIR);
    const matched = matchRules(description, rules);

    console.log(buildPromptSummary(description, matched));

    fs.mkdirSync(opts.output, { recursive: true });

    if (!opts.codeOnly) {
      const prompt = buildPrompt(description, matched);
      const promptFile = path.join(opts.output, 'prompt.md');
      fs.writeFileSync(promptFile, prompt);
      console.log(`AI prompt written to: ${promptFile}`);
    }

    if (!opts.promptOnly) {
      const { code, componentName, templateType } = generateCode(description, matched);
      const codeFile = path.join(opts.output, `${componentName}.tsx`);
      fs.writeFileSync(codeFile, code);
      console.log(`Starter code written to: ${codeFile} (template: ${templateType})`);
    }

    console.log('\nDone! Use the prompt with Claude/GPT or use the starter code directly.');
  });

// ── Explain ─────────────────────────────────────────────────────────
program
  .command('explain')
  .description('Parse and explain what a Remotion component does')
  .argument('<file>', 'Path to a .tsx file to analyze')
  .action((file: string) => {
    if (!fs.existsSync(file)) {
      console.error(`File not found: ${file}`);
      process.exit(1);
    }

    const info = explainCode(file);
    console.log(formatExplanation(info));
  });

// ── Validate ────────────────────────────────────────────────────────
program
  .command('validate')
  .description('Validate Remotion code against best practice rules')
  .argument('<file>', 'Path to a .tsx file to validate')
  .action((file: string) => {
    if (!fs.existsSync(file)) {
      console.error(`File not found: ${file}`);
      process.exit(1);
    }

    const result = validateCode(file);
    console.log(formatValidation(result));

    if (!result.passed) {
      process.exit(1);
    }
  });

// ── Preview ─────────────────────────────────────────────────────────
program
  .command('preview')
  .description('Set up a Remotion preview project for a component')
  .argument('<file>', 'Path to a .tsx file to preview')
  .action((file: string) => {
    if (!fs.existsSync(file)) {
      console.error(`File not found: ${file}`);
      process.exit(1);
    }

    launchPreview(file);
  });

// ── List Rules ──────────────────────────────────────────────────────
program
  .command('rules')
  .description('List all available Remotion best practice rules')
  .option('--verbose', 'Show tags and counts for each rule')
  .action((opts: { verbose?: boolean }) => {
    const rules = loadAllRules(RULES_DIR);
    console.log(`\n${rules.length} rules loaded:\n`);

    for (const rule of rules) {
      if (opts.verbose) {
        console.log(`  ${rule.name}`);
        console.log(`    ${rule.description}`);
        console.log(`    Tags: ${rule.tags.join(', ')}`);
        console.log(`    ${rule.codeExamples.length} code examples, ${rule.requirements.length} requirements, ${rule.prohibitions.length} prohibitions`);
        console.log();
      } else {
        console.log(`  ${rule.name.padEnd(25)} ${rule.description}`);
      }
    }
  });

program.parse();
