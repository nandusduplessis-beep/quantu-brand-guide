import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  Img,
  staticFile,
  interpolate,
  spring,
} from "remotion";
import { BRAND, GRADIENTS } from "../lib/brand-colors";
import quantumLogo from "../../assets/quantum-logo.png";

export type AspectRatio = "4:5" | "1:1" | "9:16" | "16:9";

export interface SocialAdProps {
  subject: string;
  body: string;
  cta: string;
  aspectRatio: AspectRatio;
}

const getLayout = (aspectRatio: AspectRatio) => {
  switch (aspectRatio) {
    case "9:16":
      return {
        logoSize: 48,
        subjectSize: 42,
        bodySize: 22,
        ctaSize: 20,
        padding: 60,
        ctaPadding: "16px 40px",
        logoTop: 60,
      };
    case "4:5":
      return {
        logoSize: 52,
        subjectSize: 46,
        bodySize: 24,
        ctaSize: 22,
        padding: 64,
        ctaPadding: "18px 48px",
        logoTop: 56,
      };
    case "1:1":
      return {
        logoSize: 52,
        subjectSize: 44,
        bodySize: 22,
        ctaSize: 20,
        padding: 60,
        ctaPadding: "16px 44px",
        logoTop: 52,
      };
    case "16:9":
      return {
        logoSize: 48,
        subjectSize: 48,
        bodySize: 24,
        ctaSize: 22,
        padding: 80,
        ctaPadding: "18px 52px",
        logoTop: 48,
      };
  }
};

export const SocialAdTemplate: React.FC<SocialAdProps> = ({
  subject,
  body,
  cta,
  aspectRatio,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const layout = getLayout(aspectRatio);

  // Background gradient reveal
  const bgOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Logo fade in
  const logoOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subject slide up + fade
  const subjectOpacity = interpolate(frame, [20, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subjectY = interpolate(frame, [20, 45], [50, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Body fade in
  const bodyOpacity = interpolate(frame, [40, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bodyY = interpolate(frame, [40, 65], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // CTA button slide up
  const ctaScale = spring({
    frame: frame - 60,
    fps,
    config: { damping: 12, stiffness: 80 },
  });
  const ctaOpacity = interpolate(frame, [60, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Accent line draw
  const lineWidth = interpolate(frame, [5, 40], [0, width * 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle gradient pulse in hold phase
  const pulseOpacity = interpolate(
    frame,
    [90, 105, 120],
    [0, 0.08, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        overflow: "hidden",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Dark gradient background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: GRADIENTS.dark,
          opacity: bgOpacity,
        }}
      />

      {/* Subtle pulse overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 30% 70%, ${BRAND.quantumTeal}, transparent 70%)`,
          opacity: pulseOpacity,
        }}
      />

      {/* Accent line */}
      <div
        style={{
          position: "absolute",
          top: layout.logoTop + layout.logoSize + 20,
          left: layout.padding,
          width: lineWidth,
          height: 3,
          background: GRADIENTS.quantum,
          borderRadius: 2,
        }}
      />

      {/* Logo */}
      <div
        style={{
          position: "absolute",
          top: layout.logoTop,
          left: layout.padding,
          opacity: logoOpacity,
        }}
      >
        <Img
          src={quantumLogo}
          style={{ height: layout.logoSize }}
        />
      </div>

      {/* Content container */}
      <div
        style={{
          position: "absolute",
          left: layout.padding,
          right: layout.padding,
          top: "35%",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {/* Subject */}
        <div
          style={{
            opacity: subjectOpacity,
            transform: `translateY(${subjectY}px)`,
            fontSize: layout.subjectSize,
            fontWeight: 700,
            color: BRAND.white,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
          }}
        >
          {subject}
        </div>

        {/* Body */}
        <div
          style={{
            opacity: bodyOpacity,
            transform: `translateY(${bodyY}px)`,
            fontSize: layout.bodySize,
            fontWeight: 400,
            color: BRAND.resonanceGray,
            lineHeight: 1.5,
            maxWidth: aspectRatio === "16:9" ? "60%" : "90%",
          }}
        >
          {body}
        </div>
      </div>

      {/* CTA Button */}
      <div
        style={{
          position: "absolute",
          bottom: layout.padding + 20,
          left: layout.padding,
          opacity: ctaOpacity,
          transform: `scale(${Math.max(0, ctaScale)})`,
        }}
      >
        <div
          style={{
            background: GRADIENTS.quantum,
            color: BRAND.white,
            fontSize: layout.ctaSize,
            fontWeight: 600,
            padding: layout.ctaPadding,
            borderRadius: 8,
            letterSpacing: "0.02em",
          }}
        >
          {cta}
        </div>
      </div>

      {/* Bottom accent bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: GRADIENTS.quantum,
          opacity: bgOpacity,
        }}
      />
    </div>
  );
};
