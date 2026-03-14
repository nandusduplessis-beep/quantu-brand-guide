import { loadFont } from '@remotion/google-fonts/Roboto';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { BRAND } from '../brand';

const { fontFamily } = loadFont('normal', {
  weights: ['400', '700'],
  subsets: ['latin'],
});

type TypewriterTitleProps = {
  text: string;
  backgroundImage?: string;
};

const CHAR_FRAMES = 2;
const CURSOR_BLINK_FRAMES = 16;

export const TypewriterTitle: React.FC<TypewriterTitleProps> = ({ text, backgroundImage }) => {
  const frame = useCurrentFrame();

  const typedChars = Math.min(text.length, Math.floor(frame / CHAR_FRAMES));
  const typedText = text.slice(0, typedChars);

  const cursorOpacity = interpolate(
    frame % CURSOR_BLINK_FRAMES,
    [0, CURSOR_BLINK_FRAMES / 2, CURSOR_BLINK_FRAMES],
    [1, 0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BRAND.colors.deepNavy,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 120,
        fontFamily,
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

      <div
        style={{
          color: BRAND.colors.white,
          fontSize: 56,
          fontWeight: 700,
          lineHeight: 1.4,
          textAlign: 'center',
          maxWidth: 1200,
        }}
      >
        <span>{typedText}</span>
        <span
          style={{
            color: BRAND.colors.quantumTeal,
            opacity: cursorOpacity,
          }}
        >
          {'\u258C'}
        </span>
      </div>
    </AbsoluteFill>
  );
};
