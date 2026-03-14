import fs from 'fs';

type ValidationIssue = {
  severity: 'error' | 'warning';
  rule: string;
  message: string;
  line?: number;
  fix?: string;
};

type ValidationResult = {
  issues: ValidationIssue[];
  passed: boolean;
  summary: string;
};

export function validateCode(filePath: string): ValidationResult {
  const code = fs.readFileSync(filePath, 'utf-8');
  const lines = code.split('\n');
  const issues: ValidationIssue[] = [];

  // Rule: animations.md — CSS transitions/animations are FORBIDDEN
  lines.forEach((line, i) => {
    if (/transition\s*:/.test(line) && !line.includes('TransitionSeries') && !line.includes('import')) {
      issues.push({
        severity: 'error',
        rule: 'animations',
        message: 'CSS transitions are FORBIDDEN in Remotion — use useCurrentFrame() + interpolate() instead',
        line: i + 1,
        fix: 'Replace CSS transition with interpolate() driven by useCurrentFrame()',
      });
    }

    if (/@keyframes/.test(line) || /animation\s*:/.test(line)) {
      issues.push({
        severity: 'error',
        rule: 'animations',
        message: 'CSS animations/keyframes are FORBIDDEN — use useCurrentFrame() for all animations',
        line: i + 1,
        fix: 'Replace CSS animation with spring() or interpolate() driven by useCurrentFrame()',
      });
    }
  });

  // Rule: animations.md — Tailwind animation classes FORBIDDEN
  lines.forEach((line, i) => {
    if (/className=.*\b(animate-|transition-)/.test(line)) {
      issues.push({
        severity: 'error',
        rule: 'animations',
        message: 'Tailwind animation/transition classes are FORBIDDEN in Remotion',
        line: i + 1,
        fix: 'Remove Tailwind animation classes and use useCurrentFrame() + interpolate()',
      });
    }
  });

  // Rule: compositions.md — Use type not interface for props
  lines.forEach((line, i) => {
    if (/^\s*interface\s+\w+Props/.test(line)) {
      issues.push({
        severity: 'warning',
        rule: 'compositions',
        message: 'Use `type` declarations for props instead of `interface` for Remotion defaultProps type safety',
        line: i + 1,
        fix: 'Change `interface FooProps {` to `type FooProps = {`',
      });
    }
  });

  // Rule: timing.md — interpolate without clamp
  const interpolateLines: number[] = [];
  lines.forEach((line, i) => {
    if (/interpolate\(/.test(line)) {
      interpolateLines.push(i);
    }
  });

  for (const lineIdx of interpolateLines) {
    // Check if clamp is used within the next 5 lines
    const context = lines.slice(lineIdx, lineIdx + 6).join('\n');
    if (!context.includes('extrapolateRight') && !context.includes('clamp')) {
      issues.push({
        severity: 'warning',
        rule: 'timing',
        message: 'interpolate() call without extrapolateRight: "clamp" — values may exceed intended range',
        line: lineIdx + 1,
        fix: 'Add { extrapolateRight: "clamp" } as the 4th argument to interpolate()',
      });
    }
  }

  // Rule: animations.md — No useCurrentFrame in component with animations
  const hasAnimationKeywords = /opacity|transform|scale|translate|rotate/.test(code);
  if (hasAnimationKeywords && !code.includes('useCurrentFrame')) {
    issues.push({
      severity: 'error',
      rule: 'animations',
      message: 'Component uses animation-like styles but does not call useCurrentFrame() — animations won\'t be frame-driven',
      fix: 'Import and use useCurrentFrame() from "remotion" to drive animations',
    });
  }

  // Rule: images.md, videos.md, audio.md — Direct HTML tags
  lines.forEach((line, i) => {
    if (/<video[\s>]/.test(line) && !line.includes('useVideoConfig') && !line.includes('//')) {
      issues.push({
        severity: 'error',
        rule: 'videos',
        message: 'Use <Video> from "remotion" instead of native <video> tag',
        line: i + 1,
        fix: 'Import { Video } from "remotion" and use <Video src={...} />',
      });
    }
    if (/<audio[\s>]/.test(line) && !line.includes('//')) {
      issues.push({
        severity: 'error',
        rule: 'audio',
        message: 'Use <Audio> from "remotion" instead of native <audio> tag',
        line: i + 1,
        fix: 'Import { Audio } from "remotion" and use <Audio src={...} />',
      });
    }
    if (/<img[\s>]/.test(line) && !line.includes('Img') && !line.includes('//')) {
      issues.push({
        severity: 'warning',
        rule: 'images',
        message: 'Consider using <Img> from "remotion" instead of native <img> for rendering reliability',
        line: i + 1,
        fix: 'Import { Img } from "remotion" and use <Img src={...} />',
      });
    }
  });

  // Rule: fonts.md — Check for @remotion/google-fonts usage
  if (/fontFamily/.test(code) && !code.includes('@remotion/google-fonts') && !code.includes('@remotion/fonts')) {
    issues.push({
      severity: 'warning',
      rule: 'fonts',
      message: 'Font used but not loaded via @remotion/google-fonts or @remotion/fonts — font may not render during export',
      fix: 'Use loadFont() from @remotion/google-fonts to ensure fonts load reliably during rendering',
    });
  }

  const errorCount = issues.filter((i) => i.severity === 'error').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;

  return {
    issues,
    passed: errorCount === 0,
    summary: errorCount === 0 && warningCount === 0
      ? 'All checks passed! Code follows Remotion best practices.'
      : `${errorCount} error(s), ${warningCount} warning(s) found`,
  };
}

export function formatValidation(result: ValidationResult): string {
  let output = `\n## Validation Results\n\n`;
  output += `**Status:** ${result.passed ? 'PASSED' : 'FAILED'}\n`;
  output += `**Summary:** ${result.summary}\n\n`;

  if (result.issues.length === 0) {
    output += 'No issues found. Code follows Remotion best practices.\n';
    return output;
  }

  for (const issue of result.issues) {
    const icon = issue.severity === 'error' ? 'ERROR' : 'WARN';
    output += `[${icon}] ${issue.message}\n`;
    output += `  Rule: ${issue.rule}`;
    if (issue.line) output += ` | Line: ${issue.line}`;
    output += '\n';
    if (issue.fix) output += `  Fix: ${issue.fix}\n`;
    output += '\n';
  }

  return output;
}
