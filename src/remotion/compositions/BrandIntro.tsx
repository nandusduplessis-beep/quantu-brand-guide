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

type BrandIntroProps = {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  logoUrl?: string;
};

export const BrandIntro: React.FC<BrandIntroProps> = ({ title, subtitle, backgroundImage, logoUrl }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo/title entrance with spring
  const titleScale = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Teal accent line wipe
  const lineWidth = spring({
    frame,
    fps,
    delay: 15,
    config: { damping: 200 },
  });

  // Subtitle fade in
  const subtitleOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  const subtitleY = interpolate(frame, [30, 50], [20, 0], {
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
      }}
    >
      {/* Background image */}
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

      {/* Logo */}
      {logoUrl && (
        <img
          src={logoUrl}
          style={{
            position: 'absolute',
            top: 40,
            right: 40,
            height: 80,
            objectFit: 'contain',
          }}
        />
      )}

      {/* Title */}
      <div
        style={{
          color: BRAND.colors.white,
          fontSize: 72,
          fontWeight: 700,
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          textAlign: 'center',
          letterSpacing: 2,
        }}
      >
        {title}
      </div>

      {/* Accent line */}
      <div
        style={{
          width: 200 * lineWidth,
          height: 4,
          backgroundColor: BRAND.colors.quantumTeal,
          marginTop: 24,
          marginBottom: 24,
          borderRadius: 2,
        }}
      />

      {/* Subtitle */}
      <Sequence from={30} premountFor={30}>
        <div
          style={{
            color: BRAND.colors.coolGray,
            fontSize: 28,
            fontWeight: 400,
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
            textAlign: 'center',
            maxWidth: 900,
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
