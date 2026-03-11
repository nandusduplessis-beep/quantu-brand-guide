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

const TEAL = "#0aa0ab";
const NAVY = "#040620";
const BLUE = "#0014f0";
const LIGHT_TEAL = "#6dd5ed";
const GRAY = "#bec1c9";

// Animated hexagon shape (brand element)
const Hexagon: React.FC<{
  size: number;
  strokeColor: string;
  opacity: number;
  rotation: number;
  strokeWidth?: number;
}> = ({ size, strokeColor, opacity, rotation, strokeWidth = 2 }) => {
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return `${size / 2 + (size / 2) * Math.cos(angle)},${size / 2 + (size / 2) * Math.sin(angle)}`;
  }).join(" ");

  return (
    <svg
      width={size}
      height={size}
      style={{
        opacity,
        transform: `rotate(${rotation}deg)`,
        position: "absolute",
      }}
    >
      <polygon
        points={points}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

// Fade-in and slide-up text component
const AnimatedText: React.FC<{
  children: React.ReactNode;
  delay: number;
  style?: React.CSSProperties;
}> = ({ children, delay, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = spring({
    frame: frame - delay,
    fps,
    config: { damping: 30, mass: 0.8 },
  });

  const translateY = interpolate(
    spring({ frame: frame - delay, fps, config: { damping: 30, mass: 0.8 } }),
    [0, 1],
    [40, 0]
  );

  return (
    <div
      style={{
        opacity: Math.max(0, opacity),
        transform: `translateY(${translateY}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Glowing line divider
const GlowLine: React.FC<{ delay: number; width: number }> = ({
  delay,
  width,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 30, mass: 1 },
  });

  return (
    <div
      style={{
        width: width * Math.max(0, progress),
        height: 2,
        background: `linear-gradient(90deg, transparent, ${TEAL}, ${LIGHT_TEAL}, ${TEAL}, transparent)`,
        margin: "0 auto",
        boxShadow: `0 0 15px ${TEAL}60`,
      }}
    />
  );
};

// Scene 1: Logo Reveal with hexagons (frames 0-120)
const LogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame,
    fps,
    config: { damping: 15, mass: 0.6 },
    delay: 15,
  });

  const glowOpacity = interpolate(frame, [30, 60], [0, 0.6], {
    extrapolateRight: "clamp",
  });

  // Pulsing glow
  const pulse =
    0.3 + 0.3 * Math.sin((frame / fps) * Math.PI * 2);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: NAVY,
      }}
    >
      {/* Background hexagon grid */}
      {[0, 1, 2].map((i) => {
        const hexDelay = i * 10;
        const hexOpacity = interpolate(
          frame - hexDelay,
          [0, 30],
          [0, 0.08 + i * 0.03],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const hexRotation = interpolate(frame, [0, 900], [0, 360 * (i % 2 === 0 ? 1 : -1)]);
        const size = 300 + i * 120;
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
            <Hexagon
              size={size}
              strokeColor={i === 0 ? TEAL : i === 1 ? LIGHT_TEAL : BLUE}
              opacity={hexOpacity}
              rotation={hexRotation}
              strokeWidth={1.5}
            />
          </div>
        );
      })}

      {/* Logo text */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          textAlign: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            fontFamily: "Roboto, Arial, sans-serif",
            color: "white",
            letterSpacing: 6,
            textShadow: `0 0 ${30 + pulse * 20}px ${TEAL}${Math.round(glowOpacity * 255).toString(16).padStart(2, "0")}`,
          }}
        >
          THE QUANTUM INSIDER
        </div>
        <div style={{ marginTop: 15 }}>
          <GlowLine delay={40} width={500} />
        </div>
        <AnimatedText delay={55}>
          <div
            style={{
              fontSize: 20,
              fontFamily: "Roboto, Arial, sans-serif",
              color: GRAY,
              letterSpacing: 8,
              marginTop: 20,
              textTransform: "uppercase",
            }}
          >
            Powered by Resonance
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Tagline reveal (frames 120-300)
const TaglineReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Particle-like dots floating
  const dots = Array.from({ length: 20 }, (_, i) => {
    const x = (i * 137.5) % 100;
    const baseY = (i * 73.1) % 100;
    const y = baseY + Math.sin((frame + i * 20) / 30) * 3;
    const size = 2 + (i % 3);
    const opacity = 0.1 + (i % 5) * 0.04;
    return { x, y, size, opacity };
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: NAVY,
      }}
    >
      {/* Floating particles */}
      {dots.map((dot, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: dot.size,
            height: dot.size,
            borderRadius: "50%",
            backgroundColor: TEAL,
            opacity: dot.opacity,
          }}
        />
      ))}

      {/* Gradient accent line on the left */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: "50%",
          transform: "translateY(-50%)",
          width: 3,
          height: interpolate(frame, [0, 30], [0, 200], {
            extrapolateRight: "clamp",
          }),
          background: `linear-gradient(180deg, ${TEAL}, ${BLUE})`,
          borderRadius: 2,
        }}
      />

      <div
        style={{
          maxWidth: 900,
          paddingLeft: 140,
          paddingRight: 100,
        }}
      >
        <AnimatedText delay={10}>
          <div
            style={{
              fontSize: 42,
              fontWeight: 700,
              fontFamily: "Roboto, Arial, sans-serif",
              color: "white",
              lineHeight: 1.3,
            }}
          >
            Actionable Quantum Intelligence
          </div>
        </AnimatedText>

        <AnimatedText delay={30}>
          <div
            style={{
              fontSize: 42,
              fontWeight: 700,
              fontFamily: "Roboto, Arial, sans-serif",
              background: `linear-gradient(135deg, ${TEAL}, ${LIGHT_TEAL})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.3,
            }}
          >
            & Bespoke Solutions
          </div>
        </AnimatedText>

        <div style={{ marginTop: 25 }}>
          <GlowLine delay={50} width={400} />
        </div>

        <AnimatedText delay={60}>
          <div
            style={{
              fontSize: 22,
              fontFamily: "Roboto, Arial, sans-serif",
              color: GRAY,
              marginTop: 25,
              lineHeight: 1.6,
            }}
          >
            Empowering confident decisions that move the industry forward.
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Key offerings (frames 300-540)
const KeyOfferings: React.FC = () => {
  const frame = useCurrentFrame();

  const offerings = [
    { label: "Market Intelligence", icon: "◆" },
    { label: "Strategic Advisory", icon: "◆" },
    { label: "Due Diligence", icon: "◆" },
    { label: "Ecosystem Mapping", icon: "◆" },
  ];

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: NAVY,
      }}
    >
      {/* Subtle radial gradient background */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `radial-gradient(ellipse at center, ${TEAL}08 0%, transparent 70%)`,
        }}
      />

      <AnimatedText delay={5}>
        <div
          style={{
            fontSize: 18,
            fontFamily: "Roboto, Arial, sans-serif",
            color: TEAL,
            letterSpacing: 6,
            textTransform: "uppercase",
            marginBottom: 40,
            textAlign: "center",
          }}
        >
          Our Solutions
        </div>
      </AnimatedText>

      <div
        style={{
          display: "flex",
          gap: 40,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {offerings.map((item, i) => {
          const delay = 20 + i * 15;
          return (
            <AnimatedText key={i} delay={delay}>
              <div
                style={{
                  width: 230,
                  padding: "35px 25px",
                  border: `1px solid ${TEAL}30`,
                  borderRadius: 8,
                  textAlign: "center",
                  background: `linear-gradient(180deg, ${TEAL}08, transparent)`,
                }}
              >
                <div
                  style={{
                    fontSize: 28,
                    color: TEAL,
                    marginBottom: 15,
                  }}
                >
                  {item.icon}
                </div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    fontFamily: "Roboto, Arial, sans-serif",
                    color: "white",
                  }}
                >
                  {item.label}
                </div>
              </div>
            </AnimatedText>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: CTA (frames 540-750)
const CallToAction: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulse = 0.95 + 0.05 * Math.sin((frame / fps) * Math.PI * 3);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: NAVY,
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${TEAL}15, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />

      <AnimatedText delay={10}>
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            fontFamily: "Roboto, Arial, sans-serif",
            color: "white",
            textAlign: "center",
            marginBottom: 15,
          }}
        >
          From Insight to Action
        </div>
      </AnimatedText>

      <AnimatedText delay={30}>
        <div
          style={{
            fontSize: 24,
            fontFamily: "Roboto, Arial, sans-serif",
            color: GRAY,
            textAlign: "center",
            marginBottom: 45,
          }}
        >
          Transform intelligence into impact
        </div>
      </AnimatedText>

      <AnimatedText delay={50}>
        <div
          style={{
            transform: `scale(${pulse})`,
            padding: "18px 60px",
            background: `linear-gradient(135deg, ${TEAL}, ${BLUE})`,
            borderRadius: 50,
            fontSize: 22,
            fontWeight: 600,
            fontFamily: "Roboto, Arial, sans-serif",
            color: "white",
            letterSpacing: 2,
            boxShadow: `0 0 30px ${TEAL}40`,
          }}
        >
          thequantuminsider.com
        </div>
      </AnimatedText>

      <AnimatedText delay={70}>
        <div
          style={{
            fontSize: 14,
            fontFamily: "Roboto, Arial, sans-serif",
            color: GRAY,
            letterSpacing: 4,
            marginTop: 30,
            textTransform: "uppercase",
          }}
        >
          Powered by Resonance
        </div>
      </AnimatedText>
    </AbsoluteFill>
  );
};

// Crossfade transition wrapper
const CrossFade: React.FC<{
  children: React.ReactNode;
  durationInFrames: number;
}> = ({ children, durationInFrames }) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.ease,
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.ease }
  );

  return (
    <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut) }}>
      {children}
    </AbsoluteFill>
  );
};

// Main composition
export const MyComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>
      <Sequence from={0} durationInFrames={140}>
        <CrossFade durationInFrames={140}>
          <LogoReveal />
        </CrossFade>
      </Sequence>

      <Sequence from={120} durationInFrames={200}>
        <CrossFade durationInFrames={200}>
          <TaglineReveal />
        </CrossFade>
      </Sequence>

      <Sequence from={300} durationInFrames={260}>
        <CrossFade durationInFrames={260}>
          <KeyOfferings />
        </CrossFade>
      </Sequence>

      <Sequence from={540} durationInFrames={360}>
        <CrossFade durationInFrames={360}>
          <CallToAction />
        </CrossFade>
      </Sequence>
    </AbsoluteFill>
  );
};
