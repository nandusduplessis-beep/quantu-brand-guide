import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
  Sequence,
} from "remotion";

// Brand colors
const TEAL = "#0aa0ab";
const NAVY = "#040620";
const BLUE = "#0014f0";
const LIGHT_TEAL = "#6dd5ed";
const GRAY = "#bec1c9";
const WHITE = "#ffffff";

// ─── Reusable Components ───

const Hexagon: React.FC<{
  size: number;
  strokeColor: string;
  opacity: number;
  rotation: number;
  strokeWidth?: number;
}> = ({ size, strokeColor, opacity, rotation, strokeWidth = 1.5 }) => {
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return `${size / 2 + (size / 2) * Math.cos(angle)},${size / 2 + (size / 2) * Math.sin(angle)}`;
  }).join(" ");

  return (
    <svg
      width={size}
      height={size}
      style={{ opacity, transform: `rotate(${rotation}deg)`, position: "absolute" }}
    >
      <polygon points={points} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
    </svg>
  );
};

// Background with slow-rotating hexagons and subtle glow
const BrandBackground: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>
      {/* Radial teal glow */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, ${TEAL}10, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />
      {/* Rotating hexagons */}
      {[0, 1, 2].map((i) => {
        const size = 400 + i * 200;
        const rot = interpolate(frame, [0, 1800], [0, (i % 2 === 0 ? 1 : -1) * 360]);
        const op = 0.04 + i * 0.02;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Hexagon size={size} strokeColor={i === 1 ? LIGHT_TEAL : TEAL} opacity={op} rotation={rot} />
          </div>
        );
      })}
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

// ─── Scene 1: "More Than News" (frames 0–90) ───

const MoreThanNews: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "MORE THAN" fades in
  const moreThanOpacity = spring({ frame, fps, config: { damping: 30 }, delay: 5 });
  const moreThanY = interpolate(moreThanOpacity, [0, 1], [50, 0]);

  // "NEWS" appears then gets crossed out
  const newsOpacity = spring({ frame, fps, config: { damping: 30 }, delay: 20 });
  const strikeProgress = interpolate(frame, [45, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Whole scene fades out
  const fadeOut = interpolate(frame, [70, 90], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      <BrandBackground />
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            fontFamily: "Roboto, Arial, sans-serif",
            color: WHITE,
            letterSpacing: 8,
            opacity: Math.max(0, moreThanOpacity),
            transform: `translateY(${moreThanY}px)`,
          }}
        >
          MORE THAN
        </div>
        <div
          style={{
            fontSize: 110,
            fontWeight: 900,
            fontFamily: "Roboto, Arial, sans-serif",
            color: WHITE,
            letterSpacing: 12,
            marginTop: -10,
            opacity: Math.max(0, newsOpacity),
            position: "relative",
            display: "inline-block",
          }}
        >
          NEWS
          {/* Strikethrough line */}
          <div
            style={{
              position: "absolute",
              top: "55%",
              left: "-5%",
              width: `${strikeProgress * 110}%`,
              height: 6,
              background: `linear-gradient(90deg, ${TEAL}, ${LIGHT_TEAL})`,
              boxShadow: `0 0 15px ${TEAL}80`,
              borderRadius: 3,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2: Word cascade (frames 90–480) ───

const WORDS = [
  "Quantum News",
  "Innovation",
  "Research",
  "Competitor Intelligence",
  "Due Diligence",
  "Funding",
  "Investment",
  "Partnership",
  "Strategic Decisions",
];

const WordCascade: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Each word gets ~40 frames of screen time, staggered by 40 frames
  // Word appears, holds, then fades as the next one comes
  const STAGGER = 38;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <BrandBackground />

      {/* Small "We do" label at the top */}
      <div
        style={{
          position: "absolute",
          top: 180,
          zIndex: 1,
          fontSize: 22,
          fontFamily: "Roboto, Arial, sans-serif",
          color: TEAL,
          letterSpacing: 8,
          textTransform: "uppercase",
          opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        WE DO
      </div>

      {/* Animated words */}
      {WORDS.map((word, i) => {
        const wordStart = i * STAGGER;
        const wordEnd = wordStart + STAGGER + 15;

        // Spring in
        const enterProgress = spring({
          frame: frame - wordStart,
          fps,
          config: { damping: 18, mass: 0.7, stiffness: 120 },
        });

        // Fade out when the next word is coming
        const exitOpacity = interpolate(frame, [wordEnd - 10, wordEnd], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        // Last word stays
        const isLast = i === WORDS.length - 1;
        const opacity = Math.max(0, enterProgress) * (isLast ? 1 : exitOpacity);

        const scale = interpolate(Math.max(0, enterProgress), [0, 1], [0.7, 1]);
        const translateY = interpolate(Math.max(0, enterProgress), [0, 1], [60, 0]);

        // Alternate subtle color accents
        const isAccented = i % 2 === 0;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              zIndex: 1,
              opacity,
              transform: `translateY(${translateY}px) scale(${scale})`,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: word.length > 15 ? 58 : 72,
                fontWeight: 800,
                fontFamily: "Roboto, Arial, sans-serif",
                color: WHITE,
                letterSpacing: 4,
                ...(isAccented
                  ? {
                      background: `linear-gradient(135deg, ${WHITE}, ${LIGHT_TEAL})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }
                  : {}),
              }}
            >
              {word}
            </div>

            {/* Underline accent */}
            <div
              style={{
                width: interpolate(Math.max(0, enterProgress), [0, 1], [0, Math.min(word.length * 18, 350)]),
                height: 3,
                background: `linear-gradient(90deg, ${TEAL}, ${LIGHT_TEAL})`,
                margin: "12px auto 0",
                boxShadow: `0 0 10px ${TEAL}50`,
                borderRadius: 2,
              }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ─── Scene 3: "Intelligence Starts Here" + CTA (frames 480–750) ───

const IntelligenceStartsHere: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulse = 0.96 + 0.04 * Math.sin((frame / fps) * Math.PI * 2.5);

  // Fade in
  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: fadeIn }}>
      <BrandBackground />
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        {/* Main headline */}
        <div
          style={{
            fontSize: 28,
            fontFamily: "Roboto, Arial, sans-serif",
            color: TEAL,
            letterSpacing: 10,
            textTransform: "uppercase",
            opacity: Math.max(0, spring({ frame, fps, config: { damping: 30 }, delay: 10 })),
            marginBottom: 15,
          }}
        >
          THE QUANTUM INSIDER
        </div>

        <GlowLine delay={20} width={400} />

        <div
          style={{
            marginTop: 30,
            opacity: Math.max(0, spring({ frame, fps, config: { damping: 25 }, delay: 25 })),
            transform: `translateY(${interpolate(
              Math.max(0, spring({ frame, fps, config: { damping: 25 }, delay: 25 })),
              [0, 1],
              [30, 0]
            )}px)`,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              fontFamily: "Roboto, Arial, sans-serif",
              background: `linear-gradient(135deg, ${WHITE}, ${LIGHT_TEAL})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.15,
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
              lineHeight: 1.15,
            }}
          >
            Starts Here
          </div>
        </div>

        <div style={{ marginTop: 30 }}>
          <GlowLine delay={45} width={300} />
        </div>

        {/* CTA button */}
        <div
          style={{
            marginTop: 40,
            opacity: Math.max(0, spring({ frame, fps, config: { damping: 30 }, delay: 55 })),
            transform: `scale(${pulse})`,
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "18px 55px",
              background: `linear-gradient(135deg, ${TEAL}, ${BLUE})`,
              borderRadius: 50,
              fontSize: 22,
              fontWeight: 600,
              fontFamily: "Roboto, Arial, sans-serif",
              color: WHITE,
              letterSpacing: 2,
              boxShadow: `0 0 30px ${TEAL}40`,
            }}
          >
            thequantuminsider.com
          </div>
        </div>

        {/* Powered by Resonance */}
        <div
          style={{
            marginTop: 30,
            fontSize: 14,
            fontFamily: "Roboto, Arial, sans-serif",
            color: GRAY,
            letterSpacing: 6,
            textTransform: "uppercase",
            opacity: Math.max(0, spring({ frame, fps, config: { damping: 30 }, delay: 70 })),
          }}
        >
          Powered by Resonance
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Main Composition ───

export const MyComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>
      {/* Scene 1: "More Than News" — 0 to 90 */}
      <Sequence from={0} durationInFrames={90}>
        <MoreThanNews />
      </Sequence>

      {/* Scene 2: Word cascade — 90 to 480 */}
      <Sequence from={90} durationInFrames={390}>
        <WordCascade />
      </Sequence>

      {/* Scene 3: "Intelligence Starts Here" + CTA — 480 to 750 */}
      <Sequence from={480} durationInFrames={270}>
        <IntelligenceStartsHere />
      </Sequence>
    </AbsoluteFill>
  );
};
