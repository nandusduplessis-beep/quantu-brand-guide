import { loadFont } from '@remotion/google-fonts/Roboto';
import {
  AbsoluteFill,
  interpolate,
  spring,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { BRAND } from '../brand';

const { fontFamily } = loadFont('normal', {
  weights: ['400', '700'],
  subsets: ['latin'],
});

export type SocialReelProps = {
  headline: string;
  subline: string;
  badge?: string;
  backgroundImage?: string;
  logoUrl?: string;
};

const TealParticle: React.FC<{ x: number; y: number; delay: number; size: number }> = ({
  x, y, delay, size,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const opacity = interpolate(frame - delay, [0, 8, 60, 80], [0, 0.6, 0.4, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: BRAND.colors.quantumTeal,
        opacity,
        transform: `scale(${progress})`,
      }}
    />
  );
};

export const SocialReel: React.FC<SocialReelProps> = ({
  headline,
  subline,
  badge,
  backgroundImage,
  logoUrl,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Badge pop in
  const badgeScale = spring({ frame, fps, config: { damping: 12, stiffness: 120 } });

  // Headline slide up
  const headlineY = interpolate(frame, [10, 30], [80, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const headlineOpacity = interpolate(frame, [10, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Subline delayed reveal
  const sublineOpacity = interpolate(frame, [35, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const sublineY = interpolate(frame, [35, 50], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Teal bar wipe from left
  const barWidth = spring({ frame, fps, delay: 5, config: { damping: 200 } });

  // CTA pulse
  const ctaScale = 1 + 0.04 * Math.sin((frame / fps) * Math.PI * 2);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BRAND.colors.deepNavy,
        fontFamily,
        overflow: 'hidden',
      }}
    >
      {/* Background */}
      {backgroundImage ? (
        <img
          src={backgroundImage}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.25,
          }}
        />
      ) : (
        /* Gradient bg when no image */
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at 30% 40%, ${BRAND.colors.resonanceBlue}44 0%, transparent 60%),
                          radial-gradient(ellipse at 80% 80%, ${BRAND.colors.quantumTeal}33 0%, transparent 50%)`,
          }}
        />
      )}

      {/* Decorative particles */}
      <TealParticle x={60} y={120} delay={5} size={12} />
      <TealParticle x={920} y={240} delay={12} size={8} />
      <TealParticle x={80} y={1600} delay={8} size={14} />
      <TealParticle x={980} y={1500} delay={15} size={10} />

      {/* Top bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: 8,
          width: `${barWidth * 100}%`,
          background: `linear-gradient(to right, ${BRAND.colors.quantumTeal}, ${BRAND.colors.resonanceBlue})`,
        }}
      />

      {/* Logo */}
      {logoUrl ? (
        <img
          src={logoUrl}
          style={{ position: 'absolute', top: 60, left: 60, height: 70, objectFit: 'contain' }}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            top: 60,
            left: 60,
            color: BRAND.colors.quantumTeal,
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: 3,
          }}
        >
          {BRAND.shortName}
        </div>
      )}

      {/* Badge */}
      {badge && (
        <div
          style={{
            position: 'absolute',
            top: 60,
            right: 60,
            backgroundColor: BRAND.colors.quantumTeal,
            color: BRAND.colors.deepNavy,
            fontSize: 28,
            fontWeight: 700,
            padding: '12px 28px',
            borderRadius: 40,
            transform: `scale(${badgeScale})`,
            letterSpacing: 1,
          }}
        >
          {badge}
        </div>
      )}

      {/* Main content — centred vertically */}
      <div
        style={{
          position: 'absolute',
          left: 60,
          right: 60,
          top: '30%',
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
        }}
      >
        {/* Headline */}
        <div
          style={{
            color: BRAND.colors.white,
            fontSize: 96,
            fontWeight: 700,
            lineHeight: 1.1,
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
          }}
        >
          {headline}
        </div>

        {/* Teal divider */}
        <div
          style={{
            width: 120,
            height: 6,
            backgroundColor: BRAND.colors.quantumTeal,
            borderRadius: 3,
            opacity: headlineOpacity,
          }}
        />

        {/* Subline */}
        <div
          style={{
            color: BRAND.colors.coolGray,
            fontSize: 44,
            fontWeight: 400,
            lineHeight: 1.4,
            opacity: sublineOpacity,
            transform: `translateY(${sublineY}px)`,
          }}
        >
          {subline}
        </div>
      </div>

      {/* Bottom CTA strip */}
      <Sequence from={50}>
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            left: 60,
            right: 60,
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            transform: `scale(${ctaScale})`,
            transformOrigin: 'left center',
          }}
        >
          <div
            style={{
              width: 4,
              height: 48,
              backgroundColor: BRAND.colors.quantumTeal,
              borderRadius: 2,
            }}
          />
          <div style={{ color: BRAND.colors.coolGray, fontSize: 30, fontWeight: 400 }}>
            {BRAND.name}
          </div>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
