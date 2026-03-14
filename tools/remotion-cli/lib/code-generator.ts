import type { Rule } from './rule-parser.js';

type TemplateType = 'text-animation' | 'data-visualization' | 'brand-intro' | 'scene-transition' | 'generic';

function detectTemplate(description: string, matchedRules: Rule[]): TemplateType {
  const desc = description.toLowerCase();
  const ruleNames = matchedRules.map((r) => r.name);

  if (desc.includes('chart') || desc.includes('graph') || desc.includes('data') || ruleNames.includes('charts')) {
    return 'data-visualization';
  }
  if (desc.includes('typewriter') || desc.includes('text') || desc.includes('highlight') || desc.includes('title')) {
    return 'text-animation';
  }
  if (desc.includes('transition') || desc.includes('scene') || ruleNames.includes('transitions')) {
    return 'scene-transition';
  }
  if (desc.includes('intro') || desc.includes('logo') || desc.includes('brand')) {
    return 'brand-intro';
  }
  return 'generic';
}

function toComponentName(description: string): string {
  return description
    .replace(/[^a-zA-Z\s]/g, '')
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('')
    .slice(0, 30) || 'MyComposition';
}

const TEMPLATES: Record<TemplateType, (name: string) => string> = {
  'text-animation': (name) => `import { loadFont } from '@remotion/google-fonts/Roboto';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const { fontFamily } = loadFont('normal', {
  weights: ['400', '700'],
  subsets: ['latin'],
});

// TQI Brand Colors
const COLORS = {
  quantumTeal: '#0aa0ab',
  deepNavy: '#040620',
  coolGray: '#bec1c9',
  resonanceBlue: '#0014f0',
  white: '#ffffff',
};

type ${name}Props = {
  text: string;
};

export const ${name}: React.FC<${name}Props> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  const scale = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.deepNavy,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily,
      }}
    >
      <div
        style={{
          color: COLORS.white,
          fontSize: 56,
          fontWeight: 700,
          opacity,
          transform: \`scale(\${scale})\`,
          textAlign: 'center',
          maxWidth: 1000,
          padding: 80,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
`,

  'data-visualization': (name) => `import { loadFont } from '@remotion/google-fonts/Roboto';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';

const { fontFamily } = loadFont('normal', {
  weights: ['400', '700'],
  subsets: ['latin'],
});

// TQI Brand Colors
const COLORS = {
  quantumTeal: '#0aa0ab',
  deepNavy: '#040620',
  coolGray: '#bec1c9',
  resonanceBlue: '#0014f0',
  white: '#ffffff',
};

type DataPoint = {
  label: string;
  value: number;
};

type ${name}Props = {
  title: string;
  data: DataPoint[];
};

export const ${name}: React.FC<${name}Props> = ({ title, data }) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();

  const maxValue = Math.max(...data.map((d) => d.value));
  const chartHeight = height - 320;

  const titleProgress = spring({ frame, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.deepNavy,
        padding: 80,
        display: 'flex',
        flexDirection: 'column',
        fontFamily,
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 48, opacity: titleProgress }}>
        <div style={{ color: COLORS.white, fontSize: 48, fontWeight: 700 }}>
          {title}
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, alignItems: 'flex-end', gap: 24 }}>
        {data.map((item, i) => {
          const progress = spring({
            frame: frame - i * 6 - 15,
            fps,
            config: { damping: 18, stiffness: 80 },
          });
          const barHeight = (item.value / maxValue) * chartHeight * progress;

          return (
            <div key={item.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
              <div style={{ color: COLORS.quantumTeal, fontSize: 20, fontWeight: 700, marginBottom: 8, opacity: progress }}>
                {item.value}
              </div>
              <div style={{ width: '70%', height: barHeight, background: \`linear-gradient(to top, \${COLORS.resonanceBlue}, \${COLORS.quantumTeal})\`, borderRadius: '8px 8px 0 0' }} />
              <div style={{ color: COLORS.coolGray, fontSize: 18, marginTop: 12, opacity: progress }}>
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
`,

  'brand-intro': (name) => `import { loadFont } from '@remotion/google-fonts/Roboto';
import {
  AbsoluteFill,
  interpolate,
  spring,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const { fontFamily } = loadFont('normal', {
  weights: ['400', '700'],
  subsets: ['latin'],
});

// TQI Brand Colors
const COLORS = {
  quantumTeal: '#0aa0ab',
  deepNavy: '#040620',
  coolGray: '#bec1c9',
  resonanceBlue: '#0014f0',
  white: '#ffffff',
};

type ${name}Props = {
  title: string;
  subtitle: string;
};

export const ${name}: React.FC<${name}Props> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { damping: 200 } });
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  const lineWidth = spring({ frame, fps, delay: 15, config: { damping: 200 } });

  const subtitleOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.deepNavy,
        fontFamily,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 80,
      }}
    >
      <div style={{ color: COLORS.white, fontSize: 72, fontWeight: 700, opacity: titleOpacity, transform: \`scale(\${titleScale})\`, textAlign: 'center' }}>
        {title}
      </div>
      <div style={{ width: 200 * lineWidth, height: 4, backgroundColor: COLORS.quantumTeal, marginTop: 24, marginBottom: 24, borderRadius: 2 }} />
      <Sequence from={30} premountFor={30}>
        <div style={{ color: COLORS.coolGray, fontSize: 28, fontWeight: 400, opacity: subtitleOpacity, textAlign: 'center', maxWidth: 900, lineHeight: 1.5 }}>
          {subtitle}
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
`,

  'scene-transition': (name) => `import { loadFont } from '@remotion/google-fonts/Roboto';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';

const { fontFamily } = loadFont('normal', {
  weights: ['400', '700'],
  subsets: ['latin'],
});

// TQI Brand Colors
const COLORS = {
  quantumTeal: '#0aa0ab',
  deepNavy: '#040620',
  coolGray: '#bec1c9',
  resonanceBlue: '#0014f0',
  white: '#ffffff',
};

const Scene: React.FC<{ text: string; bg: string }> = ({ text, bg }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: bg, alignItems: 'center', justifyContent: 'center', fontFamily }}>
      <div style={{ color: COLORS.white, fontSize: 56, fontWeight: 700, opacity }}>{text}</div>
    </AbsoluteFill>
  );
};

type ${name}Props = {
  scenes: string[];
};

export const ${name}: React.FC<${name}Props> = ({ scenes }) => {
  return (
    <TransitionSeries>
      {scenes.map((text, i) => (
        <>
          {i > 0 && (
            <TransitionSeries.Transition
              presentation={fade()}
              timing={linearTiming({ durationInFrames: 15 })}
            />
          )}
          <TransitionSeries.Sequence key={i} durationInFrames={60}>
            <Scene text={text} bg={i % 2 === 0 ? COLORS.deepNavy : COLORS.resonanceBlue} />
          </TransitionSeries.Sequence>
        </>
      ))}
    </TransitionSeries>
  );
};
`,

  generic: (name) => `import { loadFont } from '@remotion/google-fonts/Roboto';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const { fontFamily } = loadFont('normal', {
  weights: ['400', '700'],
  subsets: ['latin'],
});

// TQI Brand Colors
const COLORS = {
  quantumTeal: '#0aa0ab',
  deepNavy: '#040620',
  coolGray: '#bec1c9',
  resonanceBlue: '#0014f0',
  white: '#ffffff',
};

type ${name}Props = {
  title: string;
};

export const ${name}: React.FC<${name}Props> = ({ title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  const scale = spring({ frame, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.deepNavy,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily,
      }}
    >
      <div
        style={{
          color: COLORS.white,
          fontSize: 56,
          fontWeight: 700,
          opacity,
          transform: \`scale(\${scale})\`,
          textAlign: 'center',
          padding: 80,
        }}
      >
        {title}
      </div>
    </AbsoluteFill>
  );
};
`,
};

export function generateCode(description: string, matchedRules: Rule[]): { code: string; componentName: string; templateType: TemplateType } {
  const templateType = detectTemplate(description, matchedRules);
  const componentName = toComponentName(description);
  const code = TEMPLATES[templateType](componentName);

  return { code, componentName, templateType };
}
