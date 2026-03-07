import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  Img,
  interpolate,
  spring,
} from "remotion";
import { BRAND, GRADIENTS } from "../lib/brand-colors";
import quantumLogo from "../../assets/quantum-logo.png";
import type { AspectRatio } from "./SocialAdTemplate";

export interface SolutionShowcaseProps {
  solutionTitle: string;
  definition: string;
  features: string[];
  icon: string;
  aspectRatio: AspectRatio;
}

const getLayout = (aspectRatio: AspectRatio) => {
  switch (aspectRatio) {
    case "9:16":
      return {
        iconSize: 100,
        titleSize: 34,
        defSize: 18,
        featureSize: 18,
        padding: 56,
        iconTop: "15%",
        contentTop: "32%",
      };
    case "4:5":
      return {
        iconSize: 110,
        titleSize: 36,
        defSize: 20,
        featureSize: 19,
        padding: 60,
        iconTop: "12%",
        contentTop: "30%",
      };
    case "1:1":
      return {
        iconSize: 100,
        titleSize: 34,
        defSize: 18,
        featureSize: 17,
        padding: 56,
        iconTop: "10%",
        contentTop: "28%",
      };
    case "16:9":
      return {
        iconSize: 90,
        titleSize: 40,
        defSize: 22,
        featureSize: 20,
        padding: 80,
        iconTop: "12%",
        contentTop: "30%",
      };
  }
};

export const SolutionShowcaseTemplate: React.FC<SolutionShowcaseProps> = ({
  solutionTitle,
  definition,
  features,
  icon,
  aspectRatio,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const layout = getLayout(aspectRatio);

  // Background
  const bgOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Accent line draws across
  const lineProgress = interpolate(frame, [0, 30], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Icon spring scale
  const iconScale = spring({
    frame: frame - 15,
    fps,
    config: { damping: 10, stiffness: 100 },
  });

  // Title fade in
  const titleOpacity = interpolate(frame, [35, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [35, 55], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Definition fade in
  const defOpacity = interpolate(frame, [55, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Features stagger (one every 15 frames starting at frame 75)
  const getFeatureStyle = (index: number) => {
    const start = 75 + index * 15;
    const opacity = interpolate(frame, [start, start + 15], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const x = interpolate(frame, [start, start + 15], [30, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return { opacity, transform: `translateX(${x}px)` };
  };

  // Outro logo + CTA
  const outroOpacity = interpolate(frame, [140, 160], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const outroY = interpolate(frame, [140, 160], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
      {/* Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: GRADIENTS.dark,
          opacity: bgOpacity,
        }}
      />

      {/* Accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${lineProgress}%`,
          height: 4,
          background: GRADIENTS.quantum,
        }}
      />

      {/* Solution Icon */}
      <div
        style={{
          position: "absolute",
          top: layout.iconTop,
          left: layout.padding,
          transform: `scale(${Math.max(0, iconScale)})`,
          transformOrigin: "left center",
        }}
      >
        <Img
          src={icon}
          style={{
            width: layout.iconSize,
            height: layout.iconSize,
            objectFit: "contain",
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          position: "absolute",
          top: layout.contentTop,
          left: layout.padding,
          right: layout.padding,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Title */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontSize: layout.titleSize,
            fontWeight: 700,
            color: BRAND.white,
            lineHeight: 1.2,
          }}
        >
          {solutionTitle}
        </div>

        {/* Definition */}
        <div
          style={{
            opacity: defOpacity,
            fontSize: layout.defSize,
            color: BRAND.resonanceGray,
            lineHeight: 1.5,
            maxWidth: aspectRatio === "16:9" ? "55%" : "95%",
          }}
        >
          {definition}
        </div>

        {/* Features list */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            marginTop: 8,
          }}
        >
          {features.map((feature, i) => (
            <div
              key={i}
              style={{
                ...getFeatureStyle(i),
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                fontSize: layout.featureSize,
                color: BRAND.white,
                lineHeight: 1.4,
              }}
            >
              <span
                style={{
                  color: BRAND.quantumTeal,
                  fontWeight: 700,
                  fontSize: layout.featureSize + 2,
                  flexShrink: 0,
                  marginTop: -1,
                }}
              >
                &#10003;
              </span>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Outro: Logo + Learn more */}
      <div
        style={{
          position: "absolute",
          bottom: layout.padding,
          left: layout.padding,
          right: layout.padding,
          opacity: outroOpacity,
          transform: `translateY(${outroY}px)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Img src={quantumLogo} style={{ height: 36 }} />
        <div
          style={{
            background: GRADIENTS.quantum,
            color: BRAND.white,
            fontSize: 18,
            fontWeight: 600,
            padding: "12px 32px",
            borderRadius: 8,
          }}
        >
          Learn more
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
