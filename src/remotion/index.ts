import React from "react";
import { Composition } from "remotion";
import { SocialAdTemplate } from "./compositions/SocialAdTemplate";
import { SolutionShowcaseTemplate } from "./compositions/SolutionShowcaseTemplate";
import iconMarketIntelligence from "../assets/icon-market-intelligence.png";

const ASPECT_RATIOS = [
  { id: "4x5", width: 1080, height: 1350, label: "4:5" as const },
  { id: "1x1", width: 1080, height: 1080, label: "1:1" as const },
  { id: "9x16", width: 1080, height: 1920, label: "9:16" as const },
  { id: "16x9", width: 1920, height: 1080, label: "16:9" as const },
] as const;

const socialAdDefaults = {
  subject: "Beyond the headlines",
  body: "You know TQI for news. 200+ organizations know us for intelligence.",
  cta: "See the platform",
};

const solutionDefaults = {
  solutionTitle: "Quantum Market Intelligence & Competitive Monitoring",
  definition:
    "TQI's foundational intelligence layer — combining real-time data capture, structuring, and contextual analysis for a 360° view of quantum activity worldwide.",
  features: [
    "Live dashboards and data visualizations of the quantum market",
    "Competitive activity tracking and emerging trend monitoring",
    "Automated alerts and curated briefings tailored to client goals",
  ],
  icon: iconMarketIntelligence,
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {ASPECT_RATIOS.map(({ id, width, height, label }) => (
        <React.Fragment key={`social-${id}`}>
          <Composition
            id={`SocialAd-${id}`}
            component={SocialAdTemplate}
            durationInFrames={120}
            fps={30}
            width={width}
            height={height}
            defaultProps={{
              ...socialAdDefaults,
              aspectRatio: label,
            }}
          />
        </React.Fragment>
      ))}
      {ASPECT_RATIOS.map(({ id, width, height, label }) => (
        <React.Fragment key={`solution-${id}`}>
          <Composition
            id={`SolutionShowcase-${id}`}
            component={SolutionShowcaseTemplate}
            durationInFrames={180}
            fps={30}
            width={width}
            height={height}
            defaultProps={{
              ...solutionDefaults,
              aspectRatio: label,
            }}
          />
        </React.Fragment>
      ))}
    </>
  );
};
