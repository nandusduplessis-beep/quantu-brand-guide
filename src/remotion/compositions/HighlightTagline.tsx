import { loadFont } from '@remotion/google-fonts/Roboto';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BRAND } from '../brand';

const { fontFamily } = loadFont('normal', {
  weights: ['400', '700'],
  subsets: ['latin'],
});

type HighlightTaglineProps = {
  text: string;
  highlightWord: string;
};

const Highlight: React.FC<{
  word: string;
  delay: number;
}> = ({ word, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    fps,
    frame,
    config: { damping: 200 },
    delay,
    durationInFrames: 18,
  });

  const scaleX = Math.max(0, Math.min(1, progress));

  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span
        style={{
          position: 'absolute',
          left: -4,
          right: -4,
          top: '50%',
          height: '1.1em',
          transform: `translateY(-50%) scaleX(${scaleX})`,
          transformOrigin: 'left center',
          backgroundColor: BRAND.colors.quantumTeal,
          borderRadius: '0.15em',
          zIndex: 0,
          opacity: 0.3,
        }}
      />
      <span style={{ position: 'relative', zIndex: 1 }}>{word}</span>
    </span>
  );
};

export const HighlightTagline: React.FC<HighlightTaglineProps> = ({
  text,
  highlightWord,
}) => {
  const highlightIndex = text.indexOf(highlightWord);
  const hasHighlight = highlightIndex >= 0;
  const preText = hasHighlight ? text.slice(0, highlightIndex) : text;
  const postText = hasHighlight
    ? text.slice(highlightIndex + highlightWord.length)
    : '';

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BRAND.colors.deepNavy,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily,
        padding: 120,
      }}
    >
      <div
        style={{
          color: BRAND.colors.white,
          fontSize: 56,
          fontWeight: 700,
          textAlign: 'center',
          lineHeight: 1.5,
          maxWidth: 1100,
        }}
      >
        {hasHighlight ? (
          <>
            <span>{preText}</span>
            <Highlight word={highlightWord} delay={30} />
            <span>{postText}</span>
          </>
        ) : (
          <span>{text}</span>
        )}
      </div>
    </AbsoluteFill>
  );
};
