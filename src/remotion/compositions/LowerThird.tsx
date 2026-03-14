import { loadFont } from '@remotion/google-fonts/Roboto';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { BRAND } from '../brand';

const { fontFamily } = loadFont('normal', {
  weights: ['400', '700'],
  subsets: ['latin'],
});

type LowerThirdProps = {
  name: string;
  role: string;
  avatarUrl?: string;
};

export const LowerThird: React.FC<LowerThirdProps> = ({ name, role, avatarUrl }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Entrance animation
  const enterProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  // Exit animation
  const exitProgress = spring({
    frame,
    fps,
    delay: durationInFrames - 30,
    config: { damping: 200 },
  });

  const translateX = interpolate(enterProgress - exitProgress, [0, 1], [-400, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  const opacity = interpolate(enterProgress - exitProgress, [0, 1], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Teal accent bar
  const barWidth = spring({
    frame,
    fps,
    delay: 8,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        fontFamily,
        justifyContent: 'flex-end',
        padding: 60,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          transform: `translateX(${translateX}px)`,
          opacity,
        }}
      >
        {/* Teal accent bar */}
        <div
          style={{
            width: 6,
            backgroundColor: BRAND.colors.quantumTeal,
            borderRadius: 3,
            transform: `scaleY(${barWidth})`,
            transformOrigin: 'bottom',
          }}
        />

        {/* Avatar */}
        {avatarUrl && (
          <img
            src={avatarUrl}
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              objectFit: 'cover',
              marginLeft: 16,
              border: `2px solid ${BRAND.colors.quantumTeal}`,
            }}
          />
        )}

        {/* Content */}
        <div
          style={{
            marginLeft: avatarUrl ? 12 : 16,
            backgroundColor: `${BRAND.colors.deepNavy}ee`,
            padding: '16px 32px',
            borderRadius: '0 8px 8px 0',
          }}
        >
          <div
            style={{
              color: BRAND.colors.white,
              fontSize: 32,
              fontWeight: 700,
              marginBottom: 4,
            }}
          >
            {name}
          </div>
          <div
            style={{
              color: BRAND.colors.quantumTeal,
              fontSize: 20,
              fontWeight: 400,
            }}
          >
            {role}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
