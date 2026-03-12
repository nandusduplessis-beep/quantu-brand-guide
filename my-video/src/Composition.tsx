import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Easing,
} from "remotion";

// Brand colors
const TEAL = "#0aa0ab";
const LIGHT_TEAL = "#6dd5ed";
const WHITE = "#ffffff";
const GRAY = "#bec1c9";

// ─── Stacked Hexagon Logo (3 nested hexagons) ───

const StackedHexagon: React.FC<{
  size: number;
  opacity?: number;
}> = ({ size, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const layers = [
    { scale: 1.0, color: TEAL, delay: 0, strokeWidth: 2.5 },
    { scale: 0.68, color: LIGHT_TEAL, delay: 5, strokeWidth: 2 },
    { scale: 0.38, color: WHITE, delay: 10, strokeWidth: 1.5 },
  ];

  const hexPoints = (s: number) =>
    Array.from({ length: 6 }, (_, i) => {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      return `${s / 2 + (s / 2) * Math.cos(angle)},${s / 2 + (s / 2) * Math.sin(angle)}`;
    }).join(" ");

  return (
    <div style={{ width: size, height: size, position: "relative", opacity }}>
      {layers.map((layer, i) => {
        const layerSize = size * layer.scale;
        const enter = Math.max(
          0,
          spring({ frame: frame - layer.delay, fps, config: { damping: 20, mass: 0.6 } })
        );
        const offset = (size - layerSize) / 2;
        // Subtle slow rotation for outer rings
        const rot = i === 0 ? interpolate(frame, [0, 1200], [0, 360]) : i === 1 ? interpolate(frame, [0, 1200], [0, -360]) : 0;

        return (
          <svg
            key={i}
            width={layerSize}
            height={layerSize}
            style={{
              position: "absolute",
              left: offset,
              top: offset,
              opacity: enter,
              transform: `scale(${enter}) rotate(${rot}deg)`,
            }}
          >
            <polygon
              points={hexPoints(layerSize)}
              fill="none"
              stroke={layer.color}
              strokeWidth={layer.strokeWidth}
            />
          </svg>
        );
      })}
    </div>
  );
};

// ─── Rolling Word Scroller ───
// Vertically scrolls through words with a clip mask so only one shows at a time

const SCROLL_WORDS = [
  "News",
  "Innovation",
  "Research",
  "Competitors",
  "Due Diligence",
  "Funding",
  "Investment",
  "Partnership",
  "Decisions",
  "Intelligence",
];

const WORD_HEIGHT = 90; // px per word slot
const FRAMES_PER_WORD = 25; // how long each word shows
const SCROLL_TRANSITION = 12; // frames for scroll animation

const WordScroller: React.FC<{ startFrame?: number }> = ({ startFrame = 0 }) => {
  const frame = useCurrentFrame() - startFrame;
  const { fps } = useVideoConfig();

  // Calculate which word we're on
  const totalWords = SCROLL_WORDS.length;
  const rawIndex = Math.min(frame / FRAMES_PER_WORD, totalWords - 1);
  const currentIndex = Math.floor(rawIndex);

  // Smooth scroll position using spring for each transition
  let scrollY = 0;
  for (let i = 0; i <= currentIndex && i < totalWords; i++) {
    const transitionFrame = i * FRAMES_PER_WORD;
    const prog = Math.max(
      0,
      spring({
        frame: frame - transitionFrame,
        fps,
        config: { damping: 22, mass: 0.5, stiffness: 150 },
      })
    );
    if (i > 0) {
      scrollY += prog;
    }
  }

  const translateY = -scrollY * WORD_HEIGHT;

  // Fade in the scroller
  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        height: WORD_HEIGHT,
        overflow: "hidden",
        position: "relative",
        opacity: fadeIn,
      }}
    >
      <div
        style={{
          transform: `translateY(${translateY}px)`,
          transition: "none",
        }}
      >
        {SCROLL_WORDS.map((word, i) => {
          const isLast = i === totalWords - 1;
          return (
            <div
              key={i}
              style={{
                height: WORD_HEIGHT,
                display: "flex",
                alignItems: "center",
                fontSize: 68,
                fontWeight: 800,
                fontFamily: "Roboto, Arial, sans-serif",
                letterSpacing: 3,
                whiteSpace: "nowrap",
                ...(isLast
                  ? {
                      background: `linear-gradient(135deg, ${TEAL}, ${LIGHT_TEAL})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }
                  : { color: WHITE }),
              }}
            >
              {word}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Scene 1: Hexagon + Word Scroll (frames 0–310) ───
// Hexagon on left, word scroller to its right, scrolling through all words
// ending on "Intelligence"

const HexagonWordScroll: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Hexagon scales in at center (frames 0–30)
  const hexEnter = Math.max(0, spring({ frame, fps, config: { damping: 18, mass: 0.6 }, delay: 0 }));
  const hexScale = interpolate(hexEnter, [0, 1], [0.3, 1]);
  const hexOpacity = hexEnter;

  // Phase 2: Hexagon slides from center to left (frames 30–60)
  const slideProgress = Math.max(
    0,
    spring({ frame: frame - 30, fps, config: { damping: 20, mass: 0.8 } })
  );
  // Slide left by ~200px from center (half the gap + half the scroller width)
  const hexSlideX = interpolate(slideProgress, [0, 1], [0, -200]);

  // Word scroller fades in after hexagon has moved left
  const scrollerOpacity = interpolate(slideProgress, [0.3, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scrollerX = interpolate(slideProgress, [0, 1], [80, 0]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Hexagon — starts center, slides left */}
      <div
        style={{
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // translateX moves it from center (0) to left (-200)
          transform: `translateX(${hexSlideX}px) scale(${hexScale})`,
          opacity: hexOpacity,
        }}
      >
        <StackedHexagon size={160} />
      </div>

      {/* Word scroller — appears to the right of hexagon after slide */}
      <div
        style={{
          position: "absolute",
          // Position to the right of where the hexagon ends up
          transform: `translateX(${hexSlideX + 140 + scrollerX}px)`,
          opacity: scrollerOpacity,
        }}
      >
        <WordScroller startFrame={55} />
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2: "Intelligence Starts Here" reveal (frames 310–530) ───
// "Intelligence" is already visible (carried from scene 1 feel),
// it slides left, "Starts Here" reveals to its right,
// then "The Quantum Insider" appears above

const IntelligenceStartsHere: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "Intelligence" slides from center-right to center-left
  const slideProgress = Math.max(
    0,
    spring({ frame, fps, config: { damping: 20, mass: 0.8 }, delay: 5 })
  );
  const intelligenceX = interpolate(slideProgress, [0, 1], [80, 0]);

  // "Starts Here" fades in and slides from right
  const startsHereProgress = Math.max(
    0,
    spring({ frame, fps, config: { damping: 22, mass: 0.7 }, delay: 25 })
  );
  const startsHereX = interpolate(startsHereProgress, [0, 1], [60, 0]);

  // "The Quantum Insider" reveals above
  const tqiProgress = Math.max(
    0,
    spring({ frame, fps, config: { damping: 25 }, delay: 55 })
  );
  const tqiY = interpolate(tqiProgress, [0, 1], [-30, 0]);

  // "Beyond the Headlines" subtitle
  const taglineProgress = Math.max(
    0,
    spring({ frame, fps, config: { damping: 25 }, delay: 80 })
  );
  const taglineY = interpolate(taglineProgress, [0, 1], [20, 0]);

  // Hexagon reappears small in the corner
  const hexProgress = Math.max(
    0,
    spring({ frame, fps, config: { damping: 25 }, delay: 45 })
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Small hexagon accent top-left area */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 80,
          opacity: hexProgress * 0.6,
          transform: `scale(${hexProgress})`,
        }}
      >
        <StackedHexagon size={80} />
      </div>

      <div style={{ textAlign: "center" }}>
        {/* THE QUANTUM INSIDER */}
        <div
          style={{
            fontSize: 22,
            fontFamily: "Roboto, Arial, sans-serif",
            color: TEAL,
            letterSpacing: 10,
            textTransform: "uppercase",
            opacity: tqiProgress,
            transform: `translateY(${tqiY}px)`,
            marginBottom: 25,
          }}
        >
          THE QUANTUM INSIDER
        </div>

        {/* Intelligence Starts Here */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: 18 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              fontFamily: "Roboto, Arial, sans-serif",
              background: `linear-gradient(135deg, ${TEAL}, ${LIGHT_TEAL})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              transform: `translateX(${intelligenceX}px)`,
              lineHeight: 1.1,
            }}
          >
            Intelligence
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              fontFamily: "Roboto, Arial, sans-serif",
              color: WHITE,
              opacity: startsHereProgress,
              transform: `translateX(${startsHereX}px)`,
              lineHeight: 1.1,
            }}
          >
            Starts Here
          </div>
        </div>

        {/* Glow line */}
        <div style={{ marginTop: 25 }}>
          <GlowLine delay={40} width={500} />
        </div>

        {/* Beyond the Headlines */}
        <div
          style={{
            fontSize: 26,
            fontFamily: "Roboto, Arial, sans-serif",
            color: GRAY,
            letterSpacing: 6,
            marginTop: 30,
            opacity: taglineProgress,
            transform: `translateY(${taglineY}px)`,
          }}
        >
          BEYOND THE HEADLINES
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Animated teal gradient line
const GlowLine: React.FC<{ delay: number; width: number }> = ({ delay, width }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = Math.max(0, spring({ frame: frame - delay, fps, config: { damping: 30 } }));
  return (
    <div
      style={{
        width: width * progress,
        height: 3,
        background: `linear-gradient(90deg, transparent, ${TEAL}, ${LIGHT_TEAL}, ${TEAL}, transparent)`,
        margin: "0 auto",
        boxShadow: `0 0 20px ${TEAL}60`,
      }}
    />
  );
};

// ─── Main Composition ───
// Transparent background — render with --codec vp8 (WebM) for transparency

export const MyComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      {/* Scene 1: Hexagon + scrolling words (0–310) */}
      <Sequence from={0} durationInFrames={310}>
        <HexagonWordScroll />
      </Sequence>

      {/* Crossfade transition */}
      <Sequence from={290} durationInFrames={20}>
        <AbsoluteFill
          style={{
            opacity: interpolate(
              useCurrentFrame(),
              [0, 20],
              [0, 0],
              { extrapolateRight: "clamp" }
            ),
          }}
        />
      </Sequence>

      {/* Scene 2: Intelligence Starts Here + brand reveal (310–750) */}
      <Sequence from={310} durationInFrames={440}>
        <IntelligenceStartsHere />
      </Sequence>
    </AbsoluteFill>
  );
};
