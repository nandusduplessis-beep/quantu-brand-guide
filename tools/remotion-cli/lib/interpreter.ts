import fs from 'fs';

type ComponentInfo = {
  imports: string[];
  remotionApis: string[];
  animationPatterns: string[];
  componentUsage: string[];
  summary: string;
};

const REMOTION_API_MAP: Record<string, string> = {
  useCurrentFrame: 'Frame-based animation driver',
  useVideoConfig: 'Access to fps, width, height, durationInFrames',
  interpolate: 'Linear value mapping between ranges',
  spring: 'Physics-based spring animation (0 to 1)',
  Easing: 'Custom easing curves for interpolate()',
  AbsoluteFill: 'Full-size positioned container',
  Sequence: 'Timeline sequencing with delay/duration',
  Series: 'Sequential playback of scenes',
  Audio: 'Audio playback component',
  Video: 'Video playback component',
  Img: 'Image component with rendering support',
  staticFile: 'Reference to public/ folder assets',
  delayRender: 'Delay rendering until async work completes',
  continueRender: 'Signal that async work is done',
};

const TRANSITION_MAP: Record<string, string> = {
  TransitionSeries: 'Scene transition container',
  linearTiming: 'Constant-speed transition timing',
  springTiming: 'Physics-based transition timing',
  fade: 'Fade transition between scenes',
  slide: 'Slide transition with direction',
  wipe: 'Wipe transition effect',
  flip: 'Flip transition effect',
  clockWipe: 'Clock wipe transition effect',
};

export function explainCode(filePath: string): ComponentInfo {
  const code = fs.readFileSync(filePath, 'utf-8');

  // Detect imports
  const importRe = /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g;
  const imports: string[] = [];
  const remotionApis: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = importRe.exec(code)) !== null) {
    const names = match[1].split(',').map((n) => n.trim());
    const source = match[2];
    imports.push(`${names.join(', ')} from ${source}`);

    if (source.startsWith('remotion') || source.startsWith('@remotion/')) {
      for (const name of names) {
        const api = REMOTION_API_MAP[name] || TRANSITION_MAP[name];
        if (api) {
          remotionApis.push(`${name}: ${api}`);
        }
      }
    }
  }

  // Detect animation patterns
  const animationPatterns: string[] = [];

  if (code.includes('useCurrentFrame()')) {
    animationPatterns.push('Frame-driven animation (useCurrentFrame)');
  }
  if (code.includes('interpolate(')) {
    const clampCount = (code.match(/extrapolateRight:\s*['"]clamp['"]/g) || []).length;
    const interpCount = (code.match(/interpolate\(/g) || []).length;
    animationPatterns.push(`Linear interpolation (${interpCount} calls, ${clampCount} clamped)`);
  }
  if (code.includes('spring(')) {
    const springCount = (code.match(/spring\(\{/g) || []).length;
    animationPatterns.push(`Spring animation (${springCount} instances)`);
  }
  if (code.includes('Easing.')) {
    animationPatterns.push('Custom easing curves');
  }

  // Detect component usage
  const componentUsage: string[] = [];
  const componentRe = /<(AbsoluteFill|Sequence|Series|Audio|Video|Img|TransitionSeries)[^>]*>/g;
  const usedComponents = new Set<string>();
  while ((match = componentRe.exec(code)) !== null) {
    usedComponents.add(match[1]);
  }
  for (const comp of usedComponents) {
    const desc = REMOTION_API_MAP[comp] || TRANSITION_MAP[comp] || 'Remotion component';
    componentUsage.push(`<${comp}>: ${desc}`);
  }

  // Check for font loading
  if (code.includes('loadFont')) {
    const fontMatch = code.match(/from\s+['"]@remotion\/google-fonts\/(\w+)['"]/);
    componentUsage.push(`Font: ${fontMatch ? fontMatch[1] : 'Google Font'} (loaded via @remotion/google-fonts)`);
  }

  // Build summary
  const summaryParts = [];
  if (animationPatterns.length > 0) {
    summaryParts.push(`Uses ${animationPatterns.length} animation technique(s)`);
  }
  if (usedComponents.size > 0) {
    summaryParts.push(`${usedComponents.size} Remotion component(s)`);
  }
  summaryParts.push(`${imports.length} import statement(s)`);

  return {
    imports,
    remotionApis,
    animationPatterns,
    componentUsage,
    summary: summaryParts.join(', '),
  };
}

export function formatExplanation(info: ComponentInfo): string {
  let output = `\n## Code Analysis\n\n`;
  output += `**Summary:** ${info.summary}\n\n`;

  if (info.remotionApis.length > 0) {
    output += `### Remotion APIs Used\n`;
    output += info.remotionApis.map((a) => `- ${a}`).join('\n');
    output += '\n\n';
  }

  if (info.animationPatterns.length > 0) {
    output += `### Animation Patterns\n`;
    output += info.animationPatterns.map((a) => `- ${a}`).join('\n');
    output += '\n\n';
  }

  if (info.componentUsage.length > 0) {
    output += `### Components & Features\n`;
    output += info.componentUsage.map((c) => `- ${c}`).join('\n');
    output += '\n\n';
  }

  return output;
}
