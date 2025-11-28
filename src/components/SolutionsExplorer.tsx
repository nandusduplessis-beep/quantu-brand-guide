import { useState } from "react";
import iconMarketIntelligence from "@/assets/icon-market-intelligence.png";
import iconEcosystem from "@/assets/icon-ecosystem.png";
import iconAdvisory from "@/assets/icon-advisory.png";
import iconDiligence from "@/assets/icon-diligence.png";
import iconCampaigns from "@/assets/icon-campaigns.png";
import iconMedia from "@/assets/icon-media.png";

interface Solution {
  id: number;
  title: string;
  icon: string;
  definition: string;
  whatItDoes: string[];
  brandConnection: string;
  valueToAudiences: { [key: string]: string };
  outcome: string;
}

const solutionsData: Solution[] = [
  {
    id: 0,
    title: "Quantum Market Intelligence & Competitive Monitoring",
    icon: iconMarketIntelligence,
    definition: "This is TQI's foundational intelligence layer — the heartbeat of our entire ecosystem. It combines real-time data capture, structuring, and contextual analysis to give users a 360° view of quantum activity worldwide.",
    whatItDoes: [
      "Provides live dashboards and data visualizations of the quantum market.",
      "Tracks competitive activity, ecosystem developments, and emerging trends.",
      "Delivers automated alerts and curated briefings tailored to client goals."
    ],
    brandConnection: "This solution embodies TQI's core promise: turning data into direction. It demonstrates the brand's credibility as the source of truth for quantum intelligence.",
    valueToAudiences: {
      "Investors": "Identify growth opportunities and monitor early-stage activity.",
      "Corporate Strategists": "Understand competitor positioning and market timing.",
      "Governments": "Track innovation patterns and policy implications.",
      "Researchers": "See where funding, collaboration, and IP momentum are forming."
    },
    outcome: "TQI becomes synonymous with clarity. This solution transforms complexity into structured intelligence — the first step in confident, data-driven decisions."
  },
  {
    id: 1,
    title: "Quantum Ecosystem & Stakeholder Mapping",
    icon: iconEcosystem,
    definition: "This solution maps the human, institutional, and capital relationships that define the quantum industry. It visualizes how companies, universities, governments, and investors interact.",
    whatItDoes: [
      "Builds dynamic, interactive ecosystem maps and data-driven profiles.",
      "Analyzes flows of talent, funding, partnerships, and IP activity.",
      "Supports governments and corporations in identifying strategic partners or gaps."
    ],
    brandConnection: "Where Market Intelligence delivers clarity through data, Ecosystem Mapping delivers clarity through connection. It expresses TQI's brand role as the Interpreter.",
    valueToAudiences: {
      "Governments & Agencies": "Design or strengthen national quantum ecosystems.",
      "Corporates": "Identify partnership and acquisition opportunities.",
      "Investors": "Discover clusters of innovation and emerging players.",
      "Innovation Hubs": "Understand regional and cross-sector dynamics."
    },
    outcome: "Stakeholders can see their position in the quantum landscape and act with context — transforming insight into strategy, and strategy into collaboration."
  },
  {
    id: 2,
    title: "Strategic Advisory & Market Entry Playbooks",
    icon: iconAdvisory,
    definition: "This is TQI's consultative arm — where intelligence meets execution. Our advisors combine data analysis with deep industry experience to help clients navigate market entry, participation, and expansion.",
    whatItDoes: [
      "Provides tailored go-to-market strategies built on real-time intelligence.",
      "Delivers policy and commercialization roadmaps for governments and corporates.",
      "Uses scenario planning and competitive assessment to guide decision-making."
    ],
    brandConnection: "This solution represents TQI's bespoke solutions promise. It turns intelligence into tangible plans — the bridge between knowing and doing.",
    valueToAudiences: {
      "Corporations": "Develop entry and expansion strategies in quantum markets.",
      "Governments": "Shape national or regional quantum programs.",
      "Investors": "Assess readiness and risk before committing capital."
    },
    outcome: "Clients gain not only understanding but direction — actionable strategies that align data insight with strategic purpose."
  },
  {
    id: 3,
    title: "Technical & Commercial Due Diligence",
    icon: iconDiligence,
    definition: "This solution evaluates quantum startups, technologies, and vendors through both a technical and market lens. It merges TQI's proprietary data with expert evaluation to assess readiness, scalability, and strategic fit.",
    whatItDoes: [
      "Analyzes technology readiness levels (TRLs), IP portfolios, and team capability.",
      "Benchmarks commercial potential and market differentiation.",
      "Delivers comprehensive reports for investors, M&A teams, and corporate procurement."
    ],
    brandConnection: "Due Diligence is where TQI's analytical credibility meets its strategic integrity. It demonstrates that data, when applied with expertise, becomes a safeguard for decision-making.",
    valueToAudiences: {
      "Investors": "Validate technical and commercial viability before investment.",
      "Corporations": "Vet technology partners and acquisition targets.",
      "Governments": "Ensure public investments align with readiness and ROI."
    },
    outcome: "Every evaluation becomes a decision supported by evidence. TQI gives stakeholders the assurance to move forward boldly, with precision and foresight."
  },
  {
    id: 4,
    title: "Strategic Campaigns & Market Activation",
    icon: iconCampaigns,
    definition: "This solution transforms strategy into visibility and engagement. It is the executional layer that brings TQI's intelligence and insight to life through targeted campaigns.",
    whatItDoes: [
      "Designs data-informed campaigns for policy engagement or market education.",
      "Builds go-to-market frameworks and stakeholder alignment strategies.",
      "Leverages TQI's platform and network for trusted distribution and amplification."
    ],
    brandConnection: "This solution expresses TQI's forward momentum. It is where the brand's Explorer archetype becomes most visible — taking insight and translating it into movement.",
    valueToAudiences: {
      "Governments": "Drive awareness of national quantum initiatives.",
      "Corporates": "Position leadership in emerging markets.",
      "Ecosystem Builders": "Activate communities and collaborations."
    },
    outcome: "Insight becomes influence. Strategy becomes progress. Every activation advances quantum adoption — aligning communication with measurable impact."
  },
  {
    id: 5,
    title: "News & Media Platforms",
    icon: iconMedia,
    definition: "This is TQI's public voice and credibility engine. Our media platforms amplify the stories, breakthroughs, and trends shaping the quantum landscape.",
    whatItDoes: [
      "Publishes independent news, interviews, and features across TQI channels.",
      "Integrates editorial coverage with data-backed insights from the platform.",
      "Serves as a trusted amplifier for organizations shaping the quantum agenda."
    ],
    brandConnection: "This solution personifies TQI's belief that information fuels progress when it's clear and credible. It fulfills our commitment to accessibility.",
    valueToAudiences: {
      "Ecosystem Leaders": "Establish thought leadership and share progress.",
      "Readers & Researchers": "Stay informed through credible, data-rich analysis.",
      "Partners": "Align brand visibility with the most trusted voice in quantum media."
    },
    outcome: "TQI becomes the connective tissue of the quantum community — ensuring the flow of ideas, discoveries, and perspectives that drive collective progress."
  }
];

const SolutionsExplorer = () => {
  const [activeSolution, setActiveSolution] = useState(0);

  return (
    <section id="solutions" className="mb-20 pt-16 -mt-16 scroll-mt-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
          An Integrated Ecosystem of Solutions
        </h2>
        <p className="text-md text-muted-foreground max-w-3xl mx-auto">
          Our purpose is to empower the advancement of quantum technology by making market intelligence accessible, understandable, and transformative. Select a solution below to explore how we turn intelligence into industry progress.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {solutionsData.map((solution) => (
          <div
            key={solution.id}
            onClick={() => setActiveSolution(solution.id)}
            className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
              activeSolution === solution.id
                ? "border-accent bg-accent/10 shadow-[0_0_15px_rgba(80,199,207,0.4)] -translate-y-1"
                : "border-border bg-card hover:border-accent/50"
            }`}
          >
            <img src={solution.icon} alt="" className="w-16 h-16 mb-4" />
            <h4 className="text-lg font-bold text-foreground">{solution.title}</h4>
          </div>
        ))}
      </div>

      <div className="bg-accent/10 p-8 rounded-2xl shadow-lg border border-accent/20 animate-fade-in">
        <h3 className="text-2xl font-bold text-accent mb-4">
          {solutionsData[activeSolution].title}
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h4 className="font-bold text-lg mb-2 text-accent">Definition & Purpose</h4>
            <p className="text-foreground mb-6">{solutionsData[activeSolution].definition}</p>

            <h4 className="font-bold text-lg mb-2 text-accent">What It Does</h4>
            <ul className="space-y-2 text-foreground mb-6">
              {solutionsData[activeSolution].whatItDoes.map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-secondary mr-2">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h4 className="font-bold text-lg mb-2 text-accent">Brand Connection</h4>
            <p className="text-foreground mb-6">{solutionsData[activeSolution].brandConnection}</p>
          </div>

          <div>
            <div className="bg-card p-6 rounded-xl h-full border border-accent">
              <h4 className="font-bold text-lg mb-3 text-secondary">Value to Audiences</h4>
              <ul className="space-y-3 mb-6">
                {Object.entries(solutionsData[activeSolution].valueToAudiences).map(([key, value]) => (
                  <li key={key} className="flex items-start">
                    <span className="font-semibold text-accent w-1/3">{key}:</span>
                    <span className="text-muted-foreground w-2/3">{value}</span>
                  </li>
                ))}
              </ul>

              <h4 className="font-bold text-lg mb-2 text-accent">Outcome</h4>
              <p className="text-muted-foreground font-medium">{solutionsData[activeSolution].outcome}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionsExplorer;
