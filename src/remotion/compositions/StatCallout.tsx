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

export type StatCalloutProps = {
  statValue: string;
  statUnit?: string;
  label: string;
  context?: string;
  source?: string;
  backgroundImage?: string;
};

// Animated counter for numeric values
const AnimatedNumber: React.FC<{ value: string; unit?: string }> = ({ value, unit }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const numericMatch = value.match(/^([\d,]+\.?\d*)/);
  const suffix = value.replace(/^[\d,]+\.?\d*/, '');
  const numericValue = numericMatch ? parseFloat(numericMatch[1].replace(/,/g, '')) : null;

  const progress = spring({
    frame,
    fps,
    delay: 10,
    config: { damping: 22, stiffness: 60 },
    durationInFrames: 60,
  });

  const displayValue =
    numericValue !== null
      ? (numericValue * progress).toFixed(value.includes('.') ? 1 : 0)
      : value;

  const displayFormatted =
    numericValue !== null && numericValue >= 1000
      ? Number(displayValue).toLocaleString()
      : displayValue;

  return (
    <span>
      {displayFormatted}
      {suffix}
      {unit && (
        <span
          style={{
            fontSize: '0.55em',
            color: BRAND.colors.quantumTeal,
            marginLeft: 8,
            fontWeight: 700,
          }}
        >
          {unit}
        </span>
      )}
    </span>
  );
};

export const StatCallout: React.FC<StatCalloutProps> = ({
  statValue,
  statUnit,
  label,
  context,
  source,
  backgroundImage,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Container entrance
  const containerScale = spring({ frame, fps, config: { damping: 200 } });
  const containerOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Label slide in
  const labelY = interpolate(frame, [25, 45], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const labelOpacity = interpolate(frame, [25, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Context fade in
  const contextOpacity = interpolate(frame, [50, 65], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Teal ring pulse
  const ringScale = 1 + 0.015 * Math.sin((frame / fps) * Math.PI * 1.5);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BRAND.colors.deepNavy,
        fontFamily,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Background image */}
      {backgroundImage && (
        <img
          src={backgroundImage}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.12,
          }}
        />
      )}

      {/* Radial glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at center, ${BRAND.colors.quantumTeal}22 0%, transparent 65%)`,
        }}
      />

      {/* Outer decorative ring */}
      <div
        style={{
          position: 'absolute',
          width: 700,
          height: 700,
          borderRadius: '50%',
          border: `2px solid ${BRAND.colors.quantumTeal}22`,
          transform: `scale(${ringScale})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 580,
          height: 580,
          borderRadius: '50%',
          border: `1px solid ${BRAND.colors.quantumTeal}18`,
          transform: `scale(${ringScale * 0.98})`,
        }}
      />

      {/* Main card */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          opacity: containerOpacity,
          transform: `scale(${containerScale})`,
          zIndex: 1,
          padding: '0 120px',
          textAlign: 'center',
        }}
      >
        {/* The stat number */}
        <div
          style={{
            color: BRAND.colors.white,
            fontSize: 180,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: -4,
          }}
        >
          <AnimatedNumber value={statValue} unit={statUnit} />
        </div>

        {/* Teal accent */}
        <div
          style={{
            width: 100,
            height: 5,
            backgroundColor: BRAND.colors.quantumTeal,
            borderRadius: 3,
          }}
        />

        {/* Label */}
        <div
          style={{
            color: BRAND.colors.coolGray,
            fontSize: 44,
            fontWeight: 400,
            lineHeight: 1.3,
            opacity: labelOpacity,
            transform: `translateY(${labelY}px)`,
            maxWidth: 900,
          }}
        >
          {label}
        </div>

        {/* Context */}
        {context && (
          <Sequence from={50}>
            <div
              style={{
                color: BRAND.colors.quantumTeal,
                fontSize: 30,
                fontWeight: 700,
                opacity: contextOpacity,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              {context}
            </div>
          </Sequence>
        )}
      </div>

      {/* Source attribution — bottom right */}
      {source && (
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 60,
            color: `${BRAND.colors.coolGray}66`,
            fontSize: 22,
            fontWeight: 400,
          }}
        >
          Source: {source}
        </div>
      )}

      {/* TQI brand mark — bottom left */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 60,
          color: BRAND.colors.quantumTeal,
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: 3,
          opacity: 0.7,
        }}
      >
        {BRAND.shortName}
      </div>
    </AbsoluteFill>
  );
};
