import { loadFont } from '@remotion/google-fonts/Roboto';
import {
  AbsoluteFill,
  interpolate,
  spring,
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

type Theme = { label: string; accent: string; glow: string };

type SaaSPromoProps = {
  brandTheme: BrandThemeKey;
  backgroundImage?: string;
  heroTitle: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  mockupHeadline: string;
  mockupSubtitle: string;
  mockupCtaText: string;
  mockupScreenshot?: string;
  statNumber: string;
  statLabel: string;
  stat2Number: string;
  stat2Label: string;
  stat3Number: string;
  stat3Label: string;
  productName: string;
  tagline: string;
  ctaText: string;
  ctaUrl: string;
  logoUrl?: string;
};

// ─── Shared background with optional image ───────────────────────────────────

const SceneBackground: React.FC<{
  theme: Theme;
  backgroundImage?: string;
  glowPosition?: string;
}> = ({ theme, backgroundImage, glowPosition = 'center' }) => (
  <>
    {backgroundImage && (
      <img
        src={backgroundImage}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.15,
        }}
      />
    )}
    {/* Primary glow orb */}
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `radial-gradient(ellipse at ${glowPosition}, ${hexToRgba(theme.glow, 0.2)} 0%, ${hexToRgba(theme.glow, 0.05)} 40%, transparent 70%)`,
      }}
    />
    {/* Secondary accent glow */}
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '80%',
        height: '50%',
        background: `radial-gradient(ellipse at bottom center, ${hexToRgba(theme.accent, 0.1)} 0%, transparent 70%)`,
      }}
    />
  </>
);

// ─── Scene 1: Hero Title ─────────────────────────────────────────────────────

const HeroScene: React.FC<{
  heroTitle: string;
  theme: Theme;
  backgroundImage?: string;
}> = ({ heroTitle, theme, backgroundImage }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { damping: 200 } });
  const titleOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const lineWidth = spring({ frame, fps, delay: 15, config: { damping: 200 } });

  const glowOpacity = interpolate(frame, [0, 1 * fps], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BRAND.colors.deepNavy,
        fontFamily,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 80,
      }}
    >
      <div style={{ opacity: glowOpacity, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <SceneBackground theme={theme} backgroundImage={backgroundImage} glowPosition="50% 40%" />
      </div>

      {/* Converging light beam effect */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600 * titleScale,
          height: 300 * titleScale,
          background: `radial-gradient(ellipse, ${hexToRgba(theme.glow, 0.15)} 0%, transparent 70%)`,
          filter: 'blur(40px)',
        }}
      />

      <div
        style={{
          color: BRAND.colors.white,
          fontSize: 80,
          fontWeight: 700,
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          textAlign: 'center',
          letterSpacing: -1,
          lineHeight: 1.1,
          maxWidth: 1200,
          zIndex: 1,
        }}
      >
        {heroTitle}
      </div>

      {/* Accent line */}
      <div
        style={{
          width: 200 * lineWidth,
          height: 3,
          background: `linear-gradient(to right, ${theme.glow}, ${theme.accent})`,
          marginTop: 32,
          borderRadius: 2,
          zIndex: 1,
        }}
      />
    </AbsoluteFill>
  );
};

// ─── Scene 2: Feature Cards ──────────────────────────────────────────────────

const FeatureCardsScene: React.FC<{
  features: { title: string; desc: string }[];
  theme: Theme;
  backgroundImage?: string;
}> = ({ features, theme, backgroundImage }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const featureIcons = ['\u2B21', '\u2B22', '\u2B23']; // hexagon variants

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BRAND.colors.deepNavy,
        fontFamily,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 100,
      }}
    >
      <SceneBackground theme={theme} backgroundImage={backgroundImage} glowPosition="50% 60%" />

      <div style={{ display: 'flex', gap: 40, zIndex: 1 }}>
        {features.map((feat, i) => {
          const progress = spring({
            frame: frame - i * 8 - 15,
            fps,
            config: { damping: 18, stiffness: 80 },
          });

          const cardOpacity = interpolate(progress, [0, 1], [0, 1], {
            extrapolateRight: 'clamp',
          });
          const cardY = interpolate(progress, [0, 1], [60, 0], {
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={i}
              style={{
                width: 340,
                padding: 40,
                borderRadius: 20,
                background: hexToRgba(BRAND.colors.deepNavy, 0.8),
                border: `1px solid ${hexToRgba(theme.accent, 0.2)}`,
                opacity: cardOpacity,
                transform: `translateY(${cardY}px)`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: 20,
              }}
            >
              {/* Icon circle with gradient */}
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  background: `linear-gradient(135deg, ${theme.glow}, ${theme.accent})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  color: BRAND.colors.white,
                  transform: `scale(${progress})`,
                }}
              >
                {featureIcons[i]}
              </div>
              <div
                style={{
                  color: BRAND.colors.white,
                  fontSize: 24,
                  fontWeight: 700,
                  lineHeight: 1.3,
                }}
              >
                {feat.title}
              </div>
              <div
                style={{
                  color: BRAND.colors.coolGray,
                  fontSize: 16,
                  fontWeight: 400,
                  lineHeight: 1.5,
                }}
              >
                {feat.desc}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 3: Browser Mockup ─────────────────────────────────────────────────

const BrowserMockScene: React.FC<{
  headline: string;
  subtitle: string;
  ctaText: string;
  screenshot?: string;
  theme: Theme;
  backgroundImage?: string;
}> = ({ headline, subtitle, ctaText, screenshot, theme, backgroundImage }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const frameProgress = spring({ frame, fps, config: { damping: 200 } });
  const frameY = interpolate(frameProgress, [0, 1], [80, 0], {
    extrapolateRight: 'clamp',
  });
  const contentOpacity = interpolate(frame, [0.7 * fps, 1.2 * fps], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BRAND.colors.deepNavy,
        fontFamily,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 80,
      }}
    >
      <SceneBackground theme={theme} backgroundImage={backgroundImage} glowPosition="50% 30%" />

      {/* Browser frame */}
      <div
        style={{
          width: 1200,
          height: 700,
          borderRadius: 16,
          border: `1px solid ${hexToRgba(BRAND.colors.coolGray, 0.15)}`,
          background: hexToRgba(BRAND.colors.deepNavy, 0.9),
          overflow: 'hidden',
          transform: `translateY(${frameY}px)`,
          opacity: frameProgress,
          zIndex: 1,
          position: 'relative',
        }}
      >
        {/* Glow bar at top */}
        <div
          style={{
            height: 3,
            background: `linear-gradient(to right, transparent, ${theme.accent}, ${theme.glow}, ${theme.accent}, transparent)`,
          }}
        />

        {/* Browser top bar */}
        <div
          style={{
            height: 40,
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            gap: 8,
            borderBottom: `1px solid ${hexToRgba(BRAND.colors.coolGray, 0.1)}`,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: 6, background: '#ff5f57' }} />
          <div style={{ width: 12, height: 12, borderRadius: 6, background: '#febc2e' }} />
          <div style={{ width: 12, height: 12, borderRadius: 6, background: '#28c840' }} />
          <div
            style={{
              flex: 1,
              height: 24,
              borderRadius: 6,
              background: hexToRgba(BRAND.colors.coolGray, 0.1),
              marginLeft: 12,
            }}
          />
        </div>

        {/* Inner content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 60,
            opacity: contentOpacity,
            position: 'relative',
            height: 'calc(100% - 43px)',
          }}
        >
          {screenshot ? (
            <img
              src={screenshot}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            />
          ) : (
            <>
              {/* Glow orb behind text */}
              <div
                style={{
                  position: 'absolute',
                  width: 400,
                  height: 400,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${hexToRgba(theme.glow, 0.15)} 0%, transparent 70%)`,
                  filter: 'blur(30px)',
                }}
              />
              <div
                style={{
                  color: BRAND.colors.white,
                  fontSize: 44,
                  fontWeight: 700,
                  textAlign: 'center',
                  maxWidth: 800,
                  lineHeight: 1.2,
                  zIndex: 1,
                }}
              >
                {headline}
              </div>
              <div
                style={{
                  color: BRAND.colors.coolGray,
                  fontSize: 20,
                  fontWeight: 400,
                  textAlign: 'center',
                  maxWidth: 600,
                  marginTop: 20,
                  lineHeight: 1.5,
                  zIndex: 1,
                }}
              >
                {subtitle}
              </div>
              <div
                style={{
                  marginTop: 32,
                  padding: '14px 40px',
                  borderRadius: 999,
                  background: theme.accent,
                  color: BRAND.colors.white,
                  fontSize: 18,
                  fontWeight: 700,
                  zIndex: 1,
                }}
              >
                {ctaText}
              </div>
            </>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 4: Stats / Impact ─────────────────────────────────────────────────

const StatsScene: React.FC<{
  stats: { number: string; label: string }[];
  theme: Theme;
  backgroundImage?: string;
}> = ({ stats, theme, backgroundImage }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headingOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const mainStatScale = spring({ frame: frame - 10, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BRAND.colors.deepNavy,
        fontFamily,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 80,
        gap: 40,
      }}
    >
      <SceneBackground theme={theme} backgroundImage={backgroundImage} glowPosition="50% 50%" />

      {/* Heading */}
      <div
        style={{
          color: BRAND.colors.coolGray,
          fontSize: 20,
          fontWeight: 400,
          letterSpacing: 4,
          textTransform: 'uppercase',
          opacity: headingOpacity,
          zIndex: 1,
        }}
      >
        Our Impact
      </div>

      {/* Main stat */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          transform: `scale(${mainStatScale})`,
          zIndex: 1,
        }}
      >
        <div
          style={{
            color: theme.accent,
            fontSize: 120,
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          {stats[0]?.number}
        </div>
        <div
          style={{
            color: BRAND.colors.coolGray,
            fontSize: 24,
            fontWeight: 400,
          }}
        >
          {stats[0]?.label}
        </div>
      </div>

      {/* Secondary stats */}
      <div style={{ display: 'flex', gap: 40, zIndex: 1 }}>
        {stats.slice(1).map((stat, i) => {
          const pillProgress = spring({
            frame: frame - (i + 1) * 10 - 20,
            fps,
            config: { damping: 18, stiffness: 80 },
          });

          return (
            <div
              key={i}
              style={{
                padding: '20px 40px',
                borderRadius: 16,
                border: `1px solid ${hexToRgba(theme.accent, 0.25)}`,
                background: hexToRgba(BRAND.colors.deepNavy, 0.8),
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                opacity: pillProgress,
                transform: `translateY(${interpolate(pillProgress, [0, 1], [30, 0])})`,
              }}
            >
              <div
                style={{
                  color: BRAND.colors.white,
                  fontSize: 36,
                  fontWeight: 700,
                }}
              >
                {stat.number}
              </div>
              <div
                style={{
                  color: BRAND.colors.coolGray,
                  fontSize: 16,
                  fontWeight: 400,
                }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 5: CTA ────────────────────────────────────────────────────────────

const CTAScene: React.FC<{
  productName: string;
  tagline: string;
  ctaText: string;
  ctaUrl: string;
  logoUrl?: string;
  theme: Theme;
  backgroundImage?: string;
}> = ({ productName, tagline, ctaText, ctaUrl, logoUrl, theme, backgroundImage }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const nameScale = spring({ frame, fps, config: { damping: 200 } });
  const nameOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const taglineOpacity = interpolate(frame, [0.8 * fps, 1.3 * fps], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  const ctaProgress = spring({
    frame: frame - Math.round(1.2 * fps),
    fps,
    config: { damping: 200 },
  });

  const urlOpacity = interpolate(frame, [1.5 * fps, 2 * fps], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BRAND.colors.deepNavy,
        fontFamily,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 80,
        gap: 24,
      }}
    >
      <SceneBackground theme={theme} backgroundImage={backgroundImage} glowPosition="50% 45%" />

      {/* Logo */}
      {logoUrl && (
        <img
          src={logoUrl}
          style={{
            position: 'absolute',
            top: 40,
            right: 40,
            height: 60,
            objectFit: 'contain',
            opacity: urlOpacity,
            zIndex: 1,
          }}
        />
      )}

      {/* Product name */}
      <div
        style={{
          color: BRAND.colors.white,
          fontSize: 80,
          fontWeight: 700,
          opacity: nameOpacity,
          transform: `scale(${nameScale})`,
          zIndex: 1,
          letterSpacing: 2,
        }}
      >
        {productName}
      </div>

      {/* Tagline */}
      <div
        style={{
          color: BRAND.colors.coolGray,
          fontSize: 24,
          fontWeight: 400,
          opacity: taglineOpacity,
          textAlign: 'center',
          maxWidth: 800,
          lineHeight: 1.5,
          zIndex: 1,
        }}
      >
        {tagline}
      </div>

      {/* CTA button */}
      <div
        style={{
          marginTop: 16,
          padding: '16px 48px',
          borderRadius: 999,
          background: theme.accent,
          color: BRAND.colors.white,
          fontSize: 22,
          fontWeight: 700,
          transform: `scale(${ctaProgress})`,
          zIndex: 1,
        }}
      >
        {ctaText}
      </div>

      {/* URL */}
      <div
        style={{
          color: hexToRgba(BRAND.colors.coolGray, 0.6),
          fontSize: 18,
          fontWeight: 400,
          opacity: urlOpacity,
          zIndex: 1,
        }}
      >
        {ctaUrl}
      </div>
    </AbsoluteFill>
  );
};

// ─── Main Composition ────────────────────────────────────────────────────────

export const SaaSPromo: React.FC<SaaSPromoProps> = (props) => {
  const theme = BRAND_THEMES[props.brandTheme] || BRAND_THEMES.qhub;

  const features = [
    { title: props.feature1Title, desc: props.feature1Desc },
    { title: props.feature2Title, desc: props.feature2Desc },
    { title: props.feature3Title, desc: props.feature3Desc },
  ];

  const stats = [
    { number: props.statNumber, label: props.statLabel },
    { number: props.stat2Number, label: props.stat2Label },
    { number: props.stat3Number, label: props.stat3Label },
  ];

  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={150}>
        <HeroScene
          heroTitle={props.heroTitle}
          theme={theme}
          backgroundImage={props.backgroundImage}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />

      <TransitionSeries.Sequence durationInFrames={210}>
        <FeatureCardsScene
          features={features}
          theme={theme}
          backgroundImage={props.backgroundImage}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />

      <TransitionSeries.Sequence durationInFrames={180}>
        <BrowserMockScene
          headline={props.mockupHeadline}
          subtitle={props.mockupSubtitle}
          ctaText={props.mockupCtaText}
          screenshot={props.mockupScreenshot}
          theme={theme}
          backgroundImage={props.backgroundImage}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />

      <TransitionSeries.Sequence durationInFrames={150}>
        <StatsScene
          stats={stats}
          theme={theme}
          backgroundImage={props.backgroundImage}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />

      <TransitionSeries.Sequence durationInFrames={150}>
        <CTAScene
          productName={props.productName}
          tagline={props.tagline}
          ctaText={props.ctaText}
          ctaUrl={props.ctaUrl}
          logoUrl={props.logoUrl}
          theme={theme}
          backgroundImage={props.backgroundImage}
        />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
