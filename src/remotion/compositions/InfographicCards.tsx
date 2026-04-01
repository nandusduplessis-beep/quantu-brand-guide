import { loadFont } from '@remotion/google-fonts/Roboto';
import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { BRAND, BRAND_THEMES, type BrandThemeKey, hexToRgba } from '../brand';

const { fontFamily } = loadFont('normal', {
  weights: ['400', '700'],
  subsets: ['latin'],
});

type InfographicCardsProps = {
  brandTheme: BrandThemeKey;
  section1Url: string;
  section2Url: string;
  section3Url: string;
  section4Url: string;
  section5Url: string;
  section6Url: string;
  fact1: string;
  fact2: string;
  fact3: string;
  fact4: string;
  fact5: string;
  fact6: string;
};

// ─── Single Card Scene ──────────────────────────────────────────────────────

const CardScene: React.FC<{
  imageUrl: string;
  factText: string;
  theme: { accent: string; glow: string };
  cardIndex: number;
  totalCards: number;
}> = ({ imageUrl, factText, theme, cardIndex, totalCards }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Card entrance: spring slide-up + fade
  const cardSpring = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const cardY = interpolate(cardSpring, [0, 1], [60, 0]);
  const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1]);

  // Fact text entrance: delayed spring
  const factSpring = spring({ frame: frame - 15, fps, config: { damping: 14, stiffness: 100 } });
  const factY = interpolate(factSpring, [0, 1], [30, 0]);
  const factOpacity = interpolate(factSpring, [0, 1], [0, 1]);

  // Glow pulse
  const glowScale = interpolate(
    Math.sin(frame / 20),
    [-1, 1],
    [0.95, 1.05],
  );

  const cardMaxWidth = width * 0.85;
  const cardMaxHeight = height * 0.52;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BRAND.colors.deepNavy,
        fontFamily,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          width: width * 0.6,
          height: width * 0.6,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${hexToRgba(theme.glow, 0.15)}, transparent 70%)`,
          top: '15%',
          left: '20%',
          transform: `scale(${glowScale})`,
        }}
      />

      {/* Card */}
      <div
        style={{
          transform: `translateY(${cardY}px)`,
          opacity: cardOpacity,
          maxWidth: cardMaxWidth,
          maxHeight: cardMaxHeight,
          borderRadius: 16,
          overflow: 'hidden',
          border: `1px solid ${hexToRgba(theme.accent, 0.3)}`,
          boxShadow: `0 8px 32px ${hexToRgba(theme.glow, 0.2)}, 0 0 60px ${hexToRgba(theme.glow, 0.08)}`,
        }}
      >
        <img
          src={imageUrl}
          alt=""
          style={{
            width: cardMaxWidth,
            height: 'auto',
            display: 'block',
          }}
        />
      </div>

      {/* Fact text */}
      <div
        style={{
          transform: `translateY(${factY}px)`,
          opacity: factOpacity,
          marginTop: 32,
          maxWidth: cardMaxWidth,
          textAlign: 'center',
          padding: '0 20px',
        }}
      >
        <p
          style={{
            color: BRAND.colors.white,
            fontSize: 32,
            fontWeight: 700,
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          {factText}
        </p>
      </div>

      {/* Progress dots */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          display: 'flex',
          gap: 12,
        }}
      >
        {Array.from({ length: totalCards }).map((_, i) => (
          <div
            key={i}
            style={{
              width: i === cardIndex ? 24 : 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: i === cardIndex ? theme.accent : hexToRgba(BRAND.colors.white, 0.25),
              transition: 'none',
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─── Main Composition ───────────────────────────────────────────────────────

export const InfographicCards: React.FC<InfographicCardsProps> = (props) => {
  const theme = BRAND_THEMES[props.brandTheme] || BRAND_THEMES.tqi;
  const SCENE_DURATION = 150; // 5s per card
  const TRANSITION_DURATION = 15;

  const sections = [
    { url: props.section1Url || staticFile('infographic/section-1-headline.png'), fact: props.fact1 },
    { url: props.section2Url || staticFile('infographic/section-2-columns.png'), fact: props.fact2 },
    { url: props.section3Url || staticFile('infographic/section-3-findings.png'), fact: props.fact3 },
    { url: props.section4Url || staticFile('infographic/section-4-calculation.png'), fact: props.fact4 },
    { url: props.section5Url || staticFile('infographic/section-5-simulation.png'), fact: props.fact5 },
    { url: props.section6Url || staticFile('infographic/section-6-roadmap.png'), fact: props.fact6 },
  ];

  const items: React.ReactNode[] = [];
  sections.forEach((section, i) => {
    items.push(
      <TransitionSeries.Sequence key={`s${i}`} durationInFrames={SCENE_DURATION}>
        <CardScene
          imageUrl={section.url}
          factText={section.fact}
          theme={theme}
          cardIndex={i}
          totalCards={sections.length}
        />
      </TransitionSeries.Sequence>
    );
    if (i < sections.length - 1) {
      items.push(
        <TransitionSeries.Transition
          key={`t${i}`}
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />
      );
    }
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.colors.deepNavy }}>
      <TransitionSeries>{items}</TransitionSeries>
    </AbsoluteFill>
  );
};
