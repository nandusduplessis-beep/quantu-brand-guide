import { BrandIntro } from "./compositions/BrandIntro";
import { LowerThird } from "./compositions/LowerThird";
import { DataBarChart } from "./compositions/DataBarChart";
import { TypewriterTitle } from "./compositions/TypewriterTitle";
import { HighlightTagline } from "./compositions/HighlightTagline";
import { SocialReel } from "./compositions/SocialReel";
import { PhotoShowcase } from "./compositions/PhotoShowcase";
import { StatCallout } from "./compositions/StatCallout";
import { BRAND } from "./brand";

export type PropFieldType = "text" | "textarea" | "image" | "dataTable";

export type PropFieldDescriptor = {
  key: string;
  label: string;
  type: PropFieldType;
  placeholder?: string;
};

export type CompositionEntry = {
  component: React.FC<any>;
  label: string;
  description: string;
  durationInFrames: number;
  defaultProps: Record<string, any>;
  fields: PropFieldDescriptor[];
};

export type CompositionKey =
  | "BrandIntro"
  | "LowerThird"
  | "DataBarChart"
  | "TypewriterTitle"
  | "HighlightTagline"
  | "SocialReel"
  | "PhotoShowcase"
  | "StatCallout";

export const compositionRegistry: Record<CompositionKey, CompositionEntry> = {
  BrandIntro: {
    component: BrandIntro,
    label: "Brand Intro",
    description: "Animated brand title with tagline reveal",
    durationInFrames: 150,
    defaultProps: {
      title: BRAND.name,
      subtitle: BRAND.tagline,
    },
    fields: [
      { key: "title", label: "Headline", type: "text", placeholder: "Enter headline..." },
      { key: "subtitle", label: "Subtitle", type: "textarea", placeholder: "Enter subtitle..." },
      { key: "backgroundImage", label: "Background Image", type: "image" },
      { key: "logoUrl", label: "Logo", type: "image" },
    ],
  },
  LowerThird: {
    component: LowerThird,
    label: "Lower Third",
    description: "Name and title overlay for video interviews",
    durationInFrames: 150,
    defaultProps: {
      name: "Dr. Jane Smith",
      role: "Quantum Market Intelligence Analyst",
    },
    fields: [
      { key: "name", label: "Name", type: "text", placeholder: "Enter name..." },
      { key: "role", label: "Role / Title", type: "text", placeholder: "Enter role..." },
      { key: "avatarUrl", label: "Avatar Photo", type: "image" },
    ],
  },
  DataBarChart: {
    component: DataBarChart,
    label: "Data Bar Chart",
    description: "Animated bar chart for market data visualization",
    durationInFrames: 120,
    defaultProps: {
      title: "Quantum Computing Market Growth",
      data: [
        { label: "2022", value: 8.6 },
        { label: "2023", value: 12.4 },
        { label: "2024", value: 18.2 },
        { label: "2025", value: 28.9 },
        { label: "2026", value: 42.1 },
      ],
    },
    fields: [
      { key: "title", label: "Chart Title", type: "text", placeholder: "Enter chart title..." },
      { key: "data", label: "Chart Data", type: "dataTable" },
      { key: "backgroundImage", label: "Background Image", type: "image" },
    ],
  },
  TypewriterTitle: {
    component: TypewriterTitle,
    label: "Typewriter Title",
    description: "Typewriter text reveal for headlines",
    durationInFrames: 180,
    defaultProps: {
      text: BRAND.tagline,
    },
    fields: [
      { key: "text", label: "Text", type: "textarea", placeholder: "Enter text to type..." },
      { key: "backgroundImage", label: "Background Image", type: "image" },
    ],
  },
  HighlightTagline: {
    component: HighlightTagline,
    label: "Highlight Tagline",
    description: "Text with animated word highlight effect",
    durationInFrames: 120,
    defaultProps: {
      text: "Empowering confident decisions that move the industry forward.",
      highlightWord: "confident decisions",
    },
    fields: [
      { key: "text", label: "Full Text", type: "textarea", placeholder: "Enter tagline..." },
      { key: "highlightWord", label: "Word to Highlight", type: "text", placeholder: "Which word(s) to highlight..." },
      { key: "backgroundImage", label: "Background Image", type: "image" },
    ],
  },
  SocialReel: {
    component: SocialReel,
    label: "Social Reel",
    description: "Vertical 9:16 reel with headline and badge for LinkedIn/Instagram",
    durationInFrames: 180,
    defaultProps: {
      headline: "The Quantum Era Is Here",
      subline: "Actionable quantum intelligence for enterprise leaders navigating the next decade.",
      badge: "TQI Insight",
    },
    fields: [
      { key: "headline", label: "Headline", type: "text", placeholder: "Main hook line..." },
      { key: "subline", label: "Subline", type: "textarea", placeholder: "Supporting copy..." },
      { key: "badge", label: "Badge Label", type: "text", placeholder: "e.g. TQI Insight" },
      { key: "backgroundImage", label: "Background Image", type: "image" },
      { key: "logoUrl", label: "Logo", type: "image" },
    ],
  },
  PhotoShowcase: {
    component: PhotoShowcase,
    label: "Photo Showcase",
    description: "Ken Burns slideshow with captions — 3 photos, 9 seconds",
    durationInFrames: 270,
    defaultProps: {
      title: "Quantum in Focus",
      photos: [
        { url: "", caption: "The lab where tomorrow begins" },
        { url: "", caption: "Precision at the quantum scale" },
        { url: "", caption: "Intelligence that shapes markets" },
      ],
    },
    fields: [
      { key: "title", label: "Title", type: "text", placeholder: "Showcase title..." },
      { key: "photos", label: "Photos", type: "dataTable" },
      { key: "credit", label: "Photo Credit", type: "text", placeholder: "Photographer / source..." },
    ],
  },
  StatCallout: {
    component: StatCallout,
    label: "Stat Callout",
    description: "Animated number count-up with pulsing rings — 5 seconds",
    durationInFrames: 150,
    defaultProps: {
      statValue: 71,
      statUnit: "%",
      label: "of enterprise CIOs now have quantum on their 2025 roadmap",
      context: "Up from 43% in 2023",
      source: "TQI Enterprise Survey 2024",
    },
    fields: [
      { key: "statValue", label: "Stat Number", type: "text", placeholder: "e.g. 71" },
      { key: "statUnit", label: "Unit", type: "text", placeholder: "e.g. % or B or x" },
      { key: "label", label: "Stat Label", type: "textarea", placeholder: "What the number means..." },
      { key: "context", label: "Context Note", type: "text", placeholder: "e.g. Up from 43% in 2023" },
      { key: "source", label: "Source", type: "text", placeholder: "e.g. TQI Survey 2024" },
      { key: "backgroundImage", label: "Background Image", type: "image" },
    ],
  },
};
