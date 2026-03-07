export interface WhitePaperTemplate {
  id: string;
  name: string;
  description: string;
  category: "white-paper" | "lead-magnet" | "report";
  pageEstimate: string;
  sections: TemplateSection[];
  coverStyle: CoverStyle;
  layoutStyle: LayoutStyle;
}

export interface TemplateSection {
  id: string;
  name: string;
  required: boolean;
  description: string;
  maxWords?: number;
}

export interface CoverStyle {
  gradient: string;
  accentPosition: "top" | "left" | "diagonal";
  logoPlacement: "top-left" | "top-center" | "bottom-center";
  titleSize: "lg" | "xl" | "2xl";
}

export interface LayoutStyle {
  columns: 1 | 2;
  sidebarAccent: boolean;
  pullQuotes: boolean;
  dataCallouts: boolean;
  headerStyle: "gradient-bar" | "underline" | "numbered";
}

export const templates: WhitePaperTemplate[] = [
  {
    id: "executive-whitepaper",
    name: "Executive White Paper",
    description:
      "Full-length authoritative document for C-suite and senior decision-makers. Data-rich with strategic depth, designed to position TQI as the definitive source on a topic.",
    category: "white-paper",
    pageEstimate: "8-12 pages",
    sections: [
      { id: "cover", name: "Cover Page", required: true, description: "Title, subtitle, author, date, TQI branding" },
      { id: "executive-summary", name: "Executive Summary", required: true, description: "High-level overview of key findings and recommendations", maxWords: 300 },
      { id: "introduction", name: "Introduction & Context", required: true, description: "Why this topic matters now and who should care" },
      { id: "market-landscape", name: "Market Landscape", required: true, description: "Current state, key players, data points and trends" },
      { id: "analysis", name: "Deep Analysis", required: true, description: "Core argument with supporting data, charts, and expert perspectives" },
      { id: "implications", name: "Strategic Implications", required: true, description: "What this means for decision-makers and stakeholders" },
      { id: "recommendations", name: "Recommendations", required: true, description: "Actionable next steps and strategic guidance" },
      { id: "methodology", name: "Methodology & Sources", required: false, description: "Data sources, research approach, citations" },
      { id: "about", name: "About TQI", required: true, description: "Company overview, services, and call to action" },
    ],
    coverStyle: {
      gradient: "linear-gradient(135deg, #040620 0%, #0aa0ab 100%)",
      accentPosition: "diagonal",
      logoPlacement: "top-left",
      titleSize: "2xl",
    },
    layoutStyle: {
      columns: 1,
      sidebarAccent: true,
      pullQuotes: true,
      dataCallouts: true,
      headerStyle: "gradient-bar",
    },
  },
  {
    id: "technical-deep-dive",
    name: "Technical Deep Dive",
    description:
      "In-depth technical analysis for researchers, engineers, and technical decision-makers. Emphasizes methodology, data visualization, and technical accuracy.",
    category: "white-paper",
    pageEstimate: "10-15 pages",
    sections: [
      { id: "cover", name: "Cover Page", required: true, description: "Title, technical subtitle, publication series" },
      { id: "abstract", name: "Abstract", required: true, description: "Technical summary of scope, methods, and conclusions", maxWords: 200 },
      { id: "introduction", name: "Introduction", required: true, description: "Problem statement, scope, and objectives" },
      { id: "background", name: "Technical Background", required: true, description: "State of the art, prior work, foundational concepts" },
      { id: "methodology", name: "Methodology", required: true, description: "Research approach, data collection, analytical framework" },
      { id: "findings", name: "Key Findings", required: true, description: "Detailed results with data tables, charts, and technical analysis" },
      { id: "discussion", name: "Discussion", required: true, description: "Interpretation of findings, limitations, and comparisons" },
      { id: "future-outlook", name: "Future Outlook", required: false, description: "Emerging trends, predictions, and areas for further research" },
      { id: "references", name: "References & Appendix", required: true, description: "Citations, technical appendices, glossary" },
      { id: "about", name: "About TQI", required: true, description: "Company overview and research capabilities" },
    ],
    coverStyle: {
      gradient: "linear-gradient(180deg, #040620 0%, #0014f0 50%, #0aa0ab 100%)",
      accentPosition: "top",
      logoPlacement: "top-left",
      titleSize: "xl",
    },
    layoutStyle: {
      columns: 2,
      sidebarAccent: false,
      pullQuotes: false,
      dataCallouts: true,
      headerStyle: "numbered",
    },
  },
  {
    id: "lead-magnet",
    name: "Lead Magnet",
    description:
      "Short, high-impact gated content designed to capture leads. Punchy, visual, and action-oriented with a clear CTA. Perfect for top-of-funnel engagement.",
    category: "lead-magnet",
    pageEstimate: "3-5 pages",
    sections: [
      { id: "cover", name: "Cover Page", required: true, description: "Eye-catching title and value proposition" },
      { id: "hook", name: "The Hook", required: true, description: "Opening stat, question, or bold claim that grabs attention", maxWords: 100 },
      { id: "problem", name: "The Problem", required: true, description: "What challenge your audience faces", maxWords: 200 },
      { id: "key-insights", name: "Key Insights", required: true, description: "3-5 numbered takeaways with supporting data points", maxWords: 500 },
      { id: "solution", name: "The Solution", required: true, description: "How TQI helps solve this problem", maxWords: 200 },
      { id: "cta", name: "Call to Action", required: true, description: "Clear next step — demo, consultation, report download", maxWords: 100 },
    ],
    coverStyle: {
      gradient: "linear-gradient(135deg, #0aa0ab 0%, #6dd5ed 100%)",
      accentPosition: "left",
      logoPlacement: "top-center",
      titleSize: "2xl",
    },
    layoutStyle: {
      columns: 1,
      sidebarAccent: false,
      pullQuotes: true,
      dataCallouts: true,
      headerStyle: "gradient-bar",
    },
  },
  {
    id: "industry-brief",
    name: "Industry Brief",
    description:
      "Concise briefing document for time-pressed executives. Summarizes a market development, investment trend, or technology milestone with TQI commentary.",
    category: "report",
    pageEstimate: "2-4 pages",
    sections: [
      { id: "cover", name: "Header Block", required: true, description: "Title, date, category tag, TQI branding" },
      { id: "situation", name: "Situation Overview", required: true, description: "What happened and why it matters", maxWords: 200 },
      { id: "data-snapshot", name: "Data Snapshot", required: true, description: "Key metrics, market figures, comparative data" },
      { id: "tqi-perspective", name: "TQI Perspective", required: true, description: "Expert analysis and strategic interpretation", maxWords: 300 },
      { id: "what-to-watch", name: "What to Watch", required: true, description: "Forward-looking signals and indicators", maxWords: 200 },
      { id: "cta", name: "Learn More", required: true, description: "Link to full report or consultation booking", maxWords: 50 },
    ],
    coverStyle: {
      gradient: "linear-gradient(90deg, #040620 0%, #0aa0ab 100%)",
      accentPosition: "left",
      logoPlacement: "top-left",
      titleSize: "xl",
    },
    layoutStyle: {
      columns: 1,
      sidebarAccent: true,
      pullQuotes: false,
      dataCallouts: true,
      headerStyle: "underline",
    },
  },
  {
    id: "research-report",
    name: "Research Report",
    description:
      "Comprehensive market research report with extensive data, charts, and analysis. Ideal for repurposing existing long-form research into branded TQI format.",
    category: "report",
    pageEstimate: "12-20 pages",
    sections: [
      { id: "cover", name: "Cover Page", required: true, description: "Report title, edition, date range, TQI research series branding" },
      { id: "table-of-contents", name: "Table of Contents", required: true, description: "Auto-generated section navigation" },
      { id: "executive-summary", name: "Executive Summary", required: true, description: "Report highlights and key takeaways", maxWords: 400 },
      { id: "market-overview", name: "Market Overview", required: true, description: "Industry size, growth, segmentation, and regional breakdown" },
      { id: "competitive-landscape", name: "Competitive Landscape", required: true, description: "Key players, market share, positioning analysis" },
      { id: "technology-analysis", name: "Technology Analysis", required: true, description: "Technical trends, maturity assessment, innovation pipeline" },
      { id: "investment-landscape", name: "Investment Landscape", required: false, description: "Funding trends, M&A activity, investor sentiment" },
      { id: "use-cases", name: "Use Cases & Applications", required: false, description: "Real-world implementations and case studies" },
      { id: "forecast", name: "Market Forecast", required: true, description: "Projections, scenarios, and growth drivers" },
      { id: "conclusions", name: "Conclusions & Outlook", required: true, description: "Summary of findings and strategic recommendations" },
      { id: "methodology", name: "Methodology", required: true, description: "Research approach, data sources, limitations" },
      { id: "about", name: "About TQI", required: true, description: "Company overview, related reports, contact information" },
    ],
    coverStyle: {
      gradient: "linear-gradient(135deg, #040620 0%, #0014f0 100%)",
      accentPosition: "diagonal",
      logoPlacement: "top-left",
      titleSize: "2xl",
    },
    layoutStyle: {
      columns: 1,
      sidebarAccent: true,
      pullQuotes: true,
      dataCallouts: true,
      headerStyle: "numbered",
    },
  },
];

export type ContentMode = "direct-copy" | "condense" | "lead-magnet";

export const contentModes: { id: ContentMode; name: string; description: string }[] = [
  {
    id: "direct-copy",
    name: "Direct Transpose",
    description: "Takes your existing content and maps it directly into the selected template structure, preserving the original text while reformatting it into TQI brand styling.",
  },
  {
    id: "condense",
    name: "Condense & Summarize",
    description: "Takes a long-form document (book, report, article) and condenses it into a shorter white paper or brief, extracting key insights and restructuring for impact.",
  },
  {
    id: "lead-magnet",
    name: "Lead Magnet Extract",
    description: "Extracts the most compelling data points and insights from your document and creates a short, punchy lead magnet designed to drive downloads and capture leads.",
  },
];
