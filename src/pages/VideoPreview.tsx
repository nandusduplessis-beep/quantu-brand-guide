import { useState } from "react";
import { Link } from "react-router-dom";
import { Player } from "@remotion/player";
import { ArrowLeft, Film, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import quantumLogo from "@/assets/quantum-logo.png";
import { SocialAdTemplate, type AspectRatio } from "@/remotion/compositions/SocialAdTemplate";
import { SolutionShowcaseTemplate } from "@/remotion/compositions/SolutionShowcaseTemplate";

import iconMarketIntelligence from "@/assets/icon-market-intelligence.png";
import iconEcosystem from "@/assets/icon-ecosystem.png";
import iconAdvisory from "@/assets/icon-advisory.png";
import iconDiligence from "@/assets/icon-diligence.png";
import iconCampaigns from "@/assets/icon-campaigns.png";
import iconMedia from "@/assets/icon-media.png";

const SAMPLE_ADS = [
  { subject: "Beyond the headlines", body: "You know TQI for news. 200+ organizations know us for intelligence.", cta: "See the platform" },
  { subject: "See what they see", body: "Headlines report. Intelligence decides.", cta: "Explore solutions" },
  { subject: "The engine beneath", body: "News is the surface. Intelligence is the infrastructure.", cta: "Request briefing" },
  { subject: "Who's next", body: "Real-time funding, patents, talent moves.", cta: "Track the market" },
  { subject: "Leaders choose", body: "Join 200+ organizations accessing quantum intelligence.", cta: "Get started" },
];

const SOLUTIONS = [
  {
    title: "Quantum Market Intelligence & Competitive Monitoring",
    definition: "TQI's foundational intelligence layer — combining real-time data capture, structuring, and contextual analysis for a 360° view of quantum activity worldwide.",
    features: ["Live dashboards and data visualizations of the quantum market", "Competitive activity tracking and emerging trend monitoring", "Automated alerts and curated briefings tailored to client goals"],
    icon: iconMarketIntelligence,
  },
  {
    title: "Quantum Ecosystem & Stakeholder Mapping",
    definition: "Maps the human, institutional, and capital relationships that define the quantum industry. Visualizes how companies, universities, governments, and investors interact.",
    features: ["Dynamic, interactive ecosystem maps and data-driven profiles", "Analysis of talent, funding, partnerships, and IP flows", "Strategic partner identification and gap analysis"],
    icon: iconEcosystem,
  },
  {
    title: "Strategic Advisory & Market Entry Playbooks",
    definition: "TQI's consultative arm — where intelligence meets execution. Advisors combine data analysis with deep industry experience.",
    features: ["Tailored go-to-market strategies built on real-time intelligence", "Policy and commercialization roadmaps", "Scenario planning and competitive assessment"],
    icon: iconAdvisory,
  },
  {
    title: "Technical & Commercial Due Diligence",
    definition: "Evaluates quantum startups, technologies, and vendors through both a technical and market lens with proprietary data.",
    features: ["Technology readiness level and IP portfolio analysis", "Commercial potential benchmarking", "Comprehensive reports for investors, M&A teams, and procurement"],
    icon: iconDiligence,
  },
  {
    title: "Strategic Campaigns & Market Activation",
    definition: "Transforms strategy into visibility and engagement — the executional layer that brings intelligence and insight to life.",
    features: ["Data-informed campaigns for policy engagement or market education", "Go-to-market frameworks and stakeholder alignment", "Platform and network leveraged for trusted distribution"],
    icon: iconCampaigns,
  },
  {
    title: "News & Media Platforms",
    definition: "TQI's public voice and credibility engine — amplifying stories, breakthroughs, and trends shaping the quantum landscape.",
    features: ["Independent news, interviews, and features across TQI channels", "Editorial coverage integrated with data-backed insights", "Trusted amplifier for organizations shaping the quantum agenda"],
    icon: iconMedia,
  },
];

const ASPECT_CONFIGS: { label: string; ratio: AspectRatio; width: number; height: number }[] = [
  { label: "4:5", ratio: "4:5", width: 1080, height: 1350 },
  { label: "1:1", ratio: "1:1", width: 1080, height: 1080 },
  { label: "9:16", ratio: "9:16", width: 1080, height: 1920 },
  { label: "16:9", ratio: "16:9", width: 1920, height: 1080 },
];

const VideoPreview = () => {
  const [activeTab, setActiveTab] = useState("social");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("4:5");

  // Social Ad state
  const [subject, setSubject] = useState(SAMPLE_ADS[0].subject);
  const [body, setBody] = useState(SAMPLE_ADS[0].body);
  const [cta, setCta] = useState(SAMPLE_ADS[0].cta);

  // Solution state
  const [selectedSolution, setSelectedSolution] = useState(0);
  const [solutionTitle, setSolutionTitle] = useState(SOLUTIONS[0].title);
  const [solutionDef, setSolutionDef] = useState(SOLUTIONS[0].definition);
  const [solutionFeatures, setSolutionFeatures] = useState(SOLUTIONS[0].features.join("\n"));

  const currentAspect = ASPECT_CONFIGS.find((a) => a.ratio === aspectRatio)!;

  const handleSelectAd = (index: number) => {
    setSubject(SAMPLE_ADS[index].subject);
    setBody(SAMPLE_ADS[index].body);
    setCta(SAMPLE_ADS[index].cta);
  };

  const handleSelectSolution = (index: number) => {
    setSelectedSolution(index);
    setSolutionTitle(SOLUTIONS[index].title);
    setSolutionDef(SOLUTIONS[index].definition);
    setSolutionFeatures(SOLUTIONS[index].features.join("\n"));
  };

  // Calculate player dimensions to fit the preview area
  const getPlayerStyle = () => {
    const maxWidth = 560;
    const maxHeight = 620;
    const videoAspect = currentAspect.width / currentAspect.height;

    let displayWidth = maxWidth;
    let displayHeight = displayWidth / videoAspect;

    if (displayHeight > maxHeight) {
      displayHeight = maxHeight;
      displayWidth = displayHeight * videoAspect;
    }

    return { width: displayWidth, height: displayHeight };
  };

  const playerSize = getPlayerStyle();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              <Link to="/">
                <img src={quantumLogo} alt="TQI" className="h-7" />
              </Link>
              <span className="text-slate-300">|</span>
              <span className="text-sm font-medium text-slate-600">Motion Graphics Studio</span>
            </div>
            <Link
              to="/"
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Controls */}
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="social" className="flex-1 gap-2">
                  <Film className="w-4 h-4" />
                  Social Ad
                </TabsTrigger>
                <TabsTrigger value="solution" className="flex-1 gap-2">
                  <Layers className="w-4 h-4" />
                  Solution Showcase
                </TabsTrigger>
              </TabsList>

              {/* Aspect Ratio Picker */}
              <div className="flex gap-2 mt-4">
                {ASPECT_CONFIGS.map((config) => (
                  <Button
                    key={config.ratio}
                    variant={aspectRatio === config.ratio ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAspectRatio(config.ratio)}
                    className={aspectRatio === config.ratio ? "bg-cyan-600 hover:bg-cyan-700" : ""}
                  >
                    {config.label}
                  </Button>
                ))}
              </div>

              {/* Social Ad Controls */}
              <TabsContent value="social" className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-2">
                    Presets
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SAMPLE_ADS.map((ad, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSelectAd(i)}
                        className="text-xs"
                      >
                        {ad.subject}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-1">
                    Subject
                  </label>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-1">
                    Body
                  </label>
                  <Textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="bg-white min-h-[80px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-1">
                    CTA
                  </label>
                  <Input
                    value={cta}
                    onChange={(e) => setCta(e.target.value)}
                    className="bg-white"
                  />
                </div>
              </TabsContent>

              {/* Solution Showcase Controls */}
              <TabsContent value="solution" className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-2">
                    Select Solution
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {SOLUTIONS.map((sol, i) => (
                      <Button
                        key={i}
                        variant={selectedSolution === i ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSelectSolution(i)}
                        className={`text-xs text-left justify-start h-auto py-2 ${
                          selectedSolution === i ? "bg-cyan-600 hover:bg-cyan-700" : ""
                        }`}
                      >
                        {sol.title.length > 35 ? sol.title.slice(0, 35) + "..." : sol.title}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-1">
                    Title
                  </label>
                  <Input
                    value={solutionTitle}
                    onChange={(e) => setSolutionTitle(e.target.value)}
                    className="bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-1">
                    Definition
                  </label>
                  <Textarea
                    value={solutionDef}
                    onChange={(e) => setSolutionDef(e.target.value)}
                    className="bg-white min-h-[80px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-1">
                    Features (one per line)
                  </label>
                  <Textarea
                    value={solutionFeatures}
                    onChange={(e) => setSolutionFeatures(e.target.value)}
                    className="bg-white min-h-[100px]"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
              <strong>Tip:</strong> Use <code className="bg-amber-100 px-1 rounded">npm run remotion:studio</code> for
              the full Remotion Studio experience, or <code className="bg-amber-100 px-1 rounded">npm run remotion:render</code> to
              export as MP4 (requires ffmpeg).
            </div>
          </div>

          {/* Right: Player Preview */}
          <div className="flex flex-col items-center">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 inline-block">
              <div className="text-xs text-slate-500 uppercase font-medium mb-3 text-center">
                {activeTab === "social" ? "Social Ad" : "Solution Showcase"} — {aspectRatio}
              </div>
              {activeTab === "social" ? (
                <Player
                  component={SocialAdTemplate}
                  inputProps={{
                    subject,
                    body,
                    cta,
                    aspectRatio,
                  }}
                  durationInFrames={120}
                  fps={30}
                  compositionWidth={currentAspect.width}
                  compositionHeight={currentAspect.height}
                  style={{
                    width: playerSize.width,
                    height: playerSize.height,
                  }}
                  controls
                  loop
                />
              ) : (
                <Player
                  component={SolutionShowcaseTemplate}
                  inputProps={{
                    solutionTitle,
                    definition: solutionDef,
                    features: solutionFeatures.split("\n").filter((f) => f.trim()),
                    icon: SOLUTIONS[selectedSolution].icon,
                    aspectRatio,
                  }}
                  durationInFrames={180}
                  fps={30}
                  compositionWidth={currentAspect.width}
                  compositionHeight={currentAspect.height}
                  style={{
                    width: playerSize.width,
                    height: playerSize.height,
                  }}
                  controls
                  loop
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoPreview;
