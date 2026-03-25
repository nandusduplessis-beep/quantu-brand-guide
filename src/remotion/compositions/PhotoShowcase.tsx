import { loadFont } from '@remotion/google-fonts/Roboto';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from 'remotion';
import { BRAND } from '../brand';

const { fontFamily } = loadFont('normal', {
  weights: ['400', '700'],
  subsets: ['latin'],
});

type PhotoEntry = {
  url: string;
  caption?: string;
};

export type PhotoShowcaseProps = {
  title: string;
  photos: PhotoEntry[];
  credit?: string;
};

const SLIDE_DURATION = 90; // frames per slide
const TRANSITION_FRAMES = 15;

const KenBurnsSlide: React.FC<{ photo: PhotoEntry; isActive: boolean; index: number }> = ({
  photo,
  isActive,
  index,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Each slide starts at index * SLIDE_DURATION
  const localFrame = frame - index * SLIDE_DURATION;

  const opacity = interpolate(
    localFrame,
    [-TRANSITION_FRAMES, 0, SLIDE_DURATION - TRANSITION_FRAMES, SLIDE_DURATION],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Alternating Ken Burns: odd slides pan right, even pan left + slight zoom
  const panX = interpolate(localFrame, [0, SLIDE_DURATION], index % 2 === 0 ? [-2, 2] : [2, -2], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scale = interpolate(localFrame, [0, SLIDE_DURATION], [1.06, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Caption slide
  const captionY = spring({ frame: localFrame - 10, fps, config: { damping: 200 } });
  const captionOpacity = interpolate(localFrame, [10, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  if (!photo.url || opacity === 0) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity }}>
      <img
        src={photo.url}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale}) translateX(${panX}%)`,
        }}
      />
      {/* Dark gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(4,6,32,0.4) 0%, transparent 40%, rgba(4,6,32,0.75) 100%)',
        }}
      />
      {/* Caption */}
      {photo.caption && (
        <div
          style={{
            position: 'absolute',
            bottom: 120,
            left: 80,
            right: 80,
            opacity: captionOpacity,
            transform: `translateY(${(1 - captionY) * 20}px)`,
          }}
        >
          <div
            style={{
              color: BRAND.colors.white,
              fontSize: 28,
              fontWeight: 400,
              letterSpacing: 0.5,
              fontFamily,
            }}
          >
            {photo.caption}
          </div>
        </div>
      )}
    </div>
  );
};

export const PhotoShowcase: React.FC<PhotoShowcaseProps> = ({ title, photos, credit }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const activeIndex = Math.min(Math.floor(frame / SLIDE_DURATION), photos.length - 1);

  // Title entrance
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleY = interpolate(frame, [0, 20], [-30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Progress dots
  const progressWidth = (frame / durationInFrames) * 100;

  return (
    <AbsoluteFill style={{ fontFamily, backgroundColor: BRAND.colors.deepNavy, overflow: 'hidden' }}>
      {/* Photo slides */}
      {photos.map((photo, i) => (
        <KenBurnsSlide key={i} photo={photo} isActive={i === activeIndex} index={i} />
      ))}

      {/* Top title bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '40px 80px',
          background: 'linear-gradient(to bottom, rgba(4,6,32,0.85), transparent)',
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <div
            style={{ width: 4, height: 40, backgroundColor: BRAND.colors.quantumTeal, borderRadius: 2 }}
          />
          <div style={{ color: BRAND.colors.white, fontSize: 42, fontWeight: 700, letterSpacing: 1 }}>
            {title}
          </div>
        </div>
      </div>

      {/* Slide counter dots */}
      <div
        style={{
          position: 'absolute',
          bottom: 50,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 12,
        }}
      >
        {photos.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === activeIndex ? 32 : 10,
              height: 10,
              borderRadius: 5,
              backgroundColor:
                i === activeIndex ? BRAND.colors.quantumTeal : `${BRAND.colors.coolGray}66`,
              transition: 'all 0.3s',
            }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 4,
          width: `${progressWidth}%`,
          background: `linear-gradient(to right, ${BRAND.colors.quantumTeal}, ${BRAND.colors.resonanceBlue})`,
        }}
      />

      {/* Credit */}
      {credit && (
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            right: 80,
            color: `${BRAND.colors.coolGray}99`,
            fontSize: 22,
            fontWeight: 400,
          }}
        >
          {credit}
        </div>
      )}
    </AbsoluteFill>
  );
};
