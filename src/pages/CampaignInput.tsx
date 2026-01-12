import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp, Plus, X, HelpCircle, Calendar, Upload, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import FileUpload from "@/components/FileUpload";
import quantumLogo from "@/assets/quantum-logo.png";

type FrameworkOption = "use" | "emphasise" | "ignore";

interface FrameworkSelection {
  purpose: FrameworkOption;
  brandArchetypes: FrameworkOption;
  toneBehavior: FrameworkOption;
  communicationPrinciples: FrameworkOption;
  visualIdentity: FrameworkOption;
  coreValues: FrameworkOption;
  solutionsOfferings: FrameworkOption;
}

interface UploadedFile {
  name: string;
  url: string;
  type: string;
  size: number;
}

interface CampaignBrief {
  campaignName: string;
  objective: string;
  selectedICPs: string[];
  selectedSolutions: string[];
  consumerTakeout: string;
  jobToBeDone: string;
  insight: string;
  whyDoingCampaign: string;
  additionalInfo: string;
  campaignType: "demand" | "lead" | "";
  budgetLevel: string;
  contentSourceType: "url" | "upload" | "";
  contentSourceUrl: string;
  contentSourceFiles: UploadedFile[];
  referenceUrls: string[];
  referenceFiles: UploadedFile[];
  campaignPeriodType: "dates" | "duration" | "";
  startDate: string;
  endDate: string;
  duration: string;
}

const frameworkElements = [
  { key: "purpose", label: "Purpose", tooltip: "Your brand's core reason for being." },
  { key: "brandArchetypes", label: "Brand Archetypes", tooltip: "Sage wisdom meets Explorer momentum." },
  { key: "toneBehavior", label: "Tone & Behavior", tooltip: "How we speak and act." },
  { key: "communicationPrinciples", label: "Communication Principles", tooltip: "Be accessible, data-driven, enabling." },
  { key: "visualIdentity", label: "Visual Identity", tooltip: "Quantum teal gradients and clean typography." },
  { key: "coreValues", label: "Core Values", tooltip: "Accessible, Data-Driven, Enable." },
  { key: "solutionsOfferings", label: "Solutions & Offerings", tooltip: "Six core solutions." },
] as const;

const icpOptions = [
  { id: "investors", label: "Investors & VCs", description: "Venture capitalists and quantum tech investors" },
  { id: "enterprise", label: "Enterprise Decision Makers", description: "CTOs, CIOs, and technology leaders" },
  { id: "researchers", label: "Research & Academia", description: "Scientists and research institutions" },
  { id: "startups", label: "Quantum Startups", description: "Emerging quantum technology companies" },
  { id: "government", label: "Government & Policy", description: "Public sector and regulatory bodies" },
];

const solutionOptions = [
  { id: "market-intelligence", label: "Quantum Market Intelligence & Competitive Monitoring", description: "Data, reports & market analysis" },
  { id: "ecosystem", label: "Quantum Ecosystem & Stakeholder Mapping", description: "Events, community & networking" },
  { id: "advisory", label: "Strategic Advisory & Market Entry Playbooks", description: "Strategic consulting & guidance" },
  { id: "due-diligence", label: "Technical & Commercial Due Diligence", description: "Investment analysis & validation" },
  { id: "campaigns", label: "Strategic Campaigns & Market Activation", description: "Marketing & promotional services" },
  { id: "media", label: "News & Media Platforms", description: "News, content & editorial coverage" },
];

const fieldTooltips = {
  campaignName: { tip: "A memorable name that captures the essence.", example: "e.g., 'Q1 Quantum Awareness Push'" },
  objective: { tip: "The primary goal—be specific and measurable.", example: "e.g., 'Generate 50 qualified leads by Q2'" },
  consumerTakeout: { tip: "The single thought they should remember.", example: "e.g., 'TQI is the most trusted source'" },
  jobToBeDone: { tip: "The task your campaign helps accomplish.", example: "e.g., 'Help investors validate investments'" },
  insight: { tip: "The key observation driving this campaign.", example: "e.g., 'Decision-makers lack reliable data'" },
  whyDoingCampaign: { tip: "The strategic reason for launching now.", example: "e.g., 'Capitalize on growing interest'" },
  additionalInfo: { tip: "Any other context or ideas.", example: "e.g., 'Align with upcoming conference'" },
  contentSource: { tip: "Primary content that will fuel this campaign.", example: "Paste a URL or upload a document" },
  references: { tip: "Optional inspiration or reference materials.", example: "Competitor campaigns, design references" },
};

const CampaignInput = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [brandFocusOpen, setBrandFocusOpen] = useState(false);
  const [allICPs, setAllICPs] = useState(false);
  const [allSolutions, setAllSolutions] = useState(false);

  const [frameworkSelection, setFrameworkSelection] = useState<FrameworkSelection>({
    purpose: "use", brandArchetypes: "use", toneBehavior: "use", communicationPrinciples: "use",
    visualIdentity: "use", coreValues: "use", solutionsOfferings: "use",
  });

  const [brief, setBrief] = useState<CampaignBrief>({
    campaignName: "TQI Brand Equity: Trusted Intelligence Partner",
    objective: "Increase brand awareness and position TQI as the definitive source for quantum industry intelligence among investors and enterprise decision-makers, measured by 40% increase in organic traffic and 25% uplift in brand recall surveys",
    selectedICPs: ["investors", "enterprise"],
    selectedSolutions: ["market-intelligence", "media", "advisory"],
    consumerTakeout: "TQI delivers the most comprehensive and actionable quantum intelligence ecosystem—from Market Intelligence reports to Due Diligence services",
    jobToBeDone: "Establish TQI as the indispensable partner for anyone navigating the quantum technology landscape, whether investing, adopting, or strategizing",
    insight: "The quantum industry is maturing rapidly, but stakeholders lack a unified, trusted source that combines media coverage, market data, advisory expertise, and investment diligence under one roof",
    whyDoingCampaign: "With quantum computing reaching commercial inflection points, TQI needs to cement its position as the full-service intelligence platform before competitors fragment the market",
    additionalInfo: "Focus on TQI's unique service offerings: Market Intelligence (data & reports), Media (news & content), Campaigns (marketing services), Advisory (consulting), Due Diligence (investment analysis), and Ecosystem (events & community). Highlight how these services work together as an integrated platform.",
    campaignType: "demand",
    budgetLevel: "high",
    contentSourceType: "",
    contentSourceUrl: "",
    contentSourceFiles: [],
    referenceUrls: [""],
    referenceFiles: [],
    campaignPeriodType: "duration",
    startDate: "",
    endDate: "",
    duration: "6-months",
  });

  const handleFrameworkChange = (key: keyof FrameworkSelection, value: FrameworkOption) => setFrameworkSelection((prev) => ({ ...prev, [key]: value }));
  const handleBriefChange = (key: keyof CampaignBrief, value: string | boolean | string[] | UploadedFile[]) => setBrief((prev) => ({ ...prev, [key]: value }));
  const handleICPToggle = (icpId: string) => {
    const newSelection = brief.selectedICPs.includes(icpId) ? brief.selectedICPs.filter((id) => id !== icpId) : [...brief.selectedICPs, icpId];
    handleBriefChange("selectedICPs", newSelection);
  };
  const handleSolutionToggle = (solutionId: string) => {
    const newSelection = brief.selectedSolutions.includes(solutionId) ? brief.selectedSolutions.filter((id) => id !== solutionId) : [...brief.selectedSolutions, solutionId];
    handleBriefChange("selectedSolutions", newSelection);
  };
  const addReferenceUrl = () => handleBriefChange("referenceUrls", [...brief.referenceUrls, ""]);
  const updateReferenceUrl = (index: number, value: string) => { const newUrls = [...brief.referenceUrls]; newUrls[index] = value; handleBriefChange("referenceUrls", newUrls); };
  const removeReferenceUrl = (index: number) => { const newUrls = brief.referenceUrls.filter((_, i) => i !== index); handleBriefChange("referenceUrls", newUrls.length > 0 ? newUrls : [""]); };

  const validateAndContinue = () => {
    const requiredFields = [{ key: "campaignName" as const, label: "Campaign name" }, { key: "objective" as const, label: "Objective" }, { key: "campaignType" as const, label: "Campaign type" }, { key: "budgetLevel" as const, label: "Budget level" }];
    const missingFields = requiredFields.filter((f) => !brief[f.key]);
    if (!allICPs && brief.selectedICPs.length === 0) missingFields.push({ key: "selectedICPs" as any, label: "Target ICP selection" });
    if (missingFields.length > 0) { toast({ title: "Please complete required fields", description: missingFields.map((f) => f.label).join(", "), variant: "destructive" }); return; }
    navigate("/campaign/ideas", { state: { frameworkSelection, brief: { ...brief, selectedICPs: allICPs ? ["all"] : brief.selectedICPs } } });
  };

  const TooltipLabel = ({ label, required, tooltipKey }: { label: string; required?: boolean; tooltipKey: keyof typeof fieldTooltips }) => (
    <div className="flex items-center gap-2">
      <Label className="font-medium text-white/90">{label} {required && <span className="text-cyan-300">*</span>}</Label>
      <Tooltip><TooltipTrigger asChild><HelpCircle className="w-4 h-4 text-cyan-400/60 hover:text-cyan-300 cursor-help" /></TooltipTrigger>
        <TooltipContent className="max-w-xs bg-slate-800 border-cyan-500/30 text-white"><p className="font-medium mb-1">{fieldTooltips[tooltipKey].tip}</p><p className="text-cyan-300 text-xs">{fieldTooltips[tooltipKey].example}</p></TooltipContent></Tooltip>
    </div>
  );

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900">
        <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-lg border-b border-cyan-500/20">
          <nav className="container mx-auto px-4 sm:px-6 lg:px-8"><div className="flex items-center justify-between h-14">
            <Link to="/"><img src={quantumLogo} alt="TQI" className="h-7" /></Link>
            <Link to="/" className="flex items-center gap-2 text-cyan-300 hover:text-white text-sm"><ArrowLeft className="w-4 h-4" />Back to Framework</Link>
          </div></nav>
        </header>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-6xl">
          <section className="text-center mb-6"><h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Let's craft your next campaign</h1><p className="text-cyan-200/80 max-w-2xl mx-auto text-sm">Your brand framework powers the intelligence behind every idea.</p></section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {/* Campaign Essentials */}
              <div className="bg-slate-800/60 rounded-xl border border-cyan-500/20 p-5 backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-900 text-xs font-bold flex items-center justify-center">1</span>Campaign Essentials</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5"><TooltipLabel label="Campaign Name" required tooltipKey="campaignName" /><Input placeholder="e.g., Q1 Quantum Awareness Push" value={brief.campaignName} onChange={(e) => handleBriefChange("campaignName", e.target.value)} className="bg-slate-700/50 border-cyan-500/30 text-white placeholder:text-slate-400" /></div>
                  <div className="space-y-1.5"><Label className="font-medium text-white/90">Campaign Type <span className="text-cyan-300">*</span></Label><RadioGroup value={brief.campaignType} onValueChange={(v) => handleBriefChange("campaignType", v)} className="flex gap-4"><div className="flex items-center space-x-2"><RadioGroupItem value="demand" id="type-demand" className="border-cyan-500/50 text-cyan-400" /><Label htmlFor="type-demand" className="cursor-pointer text-white/80 text-sm">Demand gen</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="lead" id="type-lead" className="border-cyan-500/50 text-cyan-400" /><Label htmlFor="type-lead" className="cursor-pointer text-white/80 text-sm">Lead gen</Label></div></RadioGroup></div>
                  <div className="space-y-1.5"><Label className="font-medium text-white/90">Budget Level <span className="text-cyan-300">*</span></Label><Select value={brief.budgetLevel} onValueChange={(v) => handleBriefChange("budgetLevel", v)}><SelectTrigger className="bg-slate-700/50 border-cyan-500/30 text-white"><SelectValue placeholder="Select budget" /></SelectTrigger><SelectContent className="bg-slate-800 border-cyan-500/30"><SelectItem value="low" className="text-white hover:bg-cyan-500/20">Low</SelectItem><SelectItem value="medium" className="text-white hover:bg-cyan-500/20">Medium</SelectItem><SelectItem value="high" className="text-white hover:bg-cyan-500/20">High</SelectItem></SelectContent></Select></div>
                  <div className="space-y-1.5"><Label className="font-medium text-white/90 flex items-center gap-2"><Calendar className="w-4 h-4 text-cyan-400" />Campaign Period <span className="text-slate-500 text-xs">(optional)</span></Label><Select value={brief.campaignPeriodType} onValueChange={(v) => handleBriefChange("campaignPeriodType", v)}><SelectTrigger className="bg-slate-700/50 border-cyan-500/30 text-white"><SelectValue placeholder="Select period type" /></SelectTrigger><SelectContent className="bg-slate-800 border-cyan-500/30"><SelectItem value="dates" className="text-white hover:bg-cyan-500/20">Specific dates</SelectItem><SelectItem value="duration" className="text-white hover:bg-cyan-500/20">Duration length</SelectItem></SelectContent></Select></div>
                  {brief.campaignPeriodType === "dates" && <><div className="space-y-1.5"><Label className="font-medium text-white/90 text-sm">Start Date</Label><Input type="date" value={brief.startDate} onChange={(e) => handleBriefChange("startDate", e.target.value)} className="bg-slate-700/50 border-cyan-500/30 text-white" /></div><div className="space-y-1.5"><Label className="font-medium text-white/90 text-sm">End Date</Label><Input type="date" value={brief.endDate} onChange={(e) => handleBriefChange("endDate", e.target.value)} className="bg-slate-700/50 border-cyan-500/30 text-white" /></div></>}
                  {brief.campaignPeriodType === "duration" && <div className="space-y-1.5 md:col-span-2"><Label className="font-medium text-white/90 text-sm">Duration</Label><Select value={brief.duration} onValueChange={(v) => handleBriefChange("duration", v)}><SelectTrigger className="bg-slate-700/50 border-cyan-500/30 text-white w-full md:w-48"><SelectValue placeholder="Select duration" /></SelectTrigger><SelectContent className="bg-slate-800 border-cyan-500/30"><SelectItem value="1-week" className="text-white hover:bg-cyan-500/20">1 week</SelectItem><SelectItem value="2-weeks" className="text-white hover:bg-cyan-500/20">2 weeks</SelectItem><SelectItem value="1-month" className="text-white hover:bg-cyan-500/20">1 month</SelectItem><SelectItem value="3-months" className="text-white hover:bg-cyan-500/20">3 months</SelectItem><SelectItem value="6-months" className="text-white hover:bg-cyan-500/20">6 months</SelectItem><SelectItem value="ongoing" className="text-white hover:bg-cyan-500/20">Ongoing</SelectItem></SelectContent></Select></div>}
                </div>
                <div className="space-y-1.5 mt-4"><TooltipLabel label="Objective" required tooltipKey="objective" /><Textarea placeholder="e.g., Generate 50 qualified leads from enterprise CTOs by end of Q2" value={brief.objective} onChange={(e) => handleBriefChange("objective", e.target.value)} rows={2} className="bg-slate-700/50 border-cyan-500/30 text-white placeholder:text-slate-400" /></div>
              </div>

              {/* Target Audience */}
              <div className="bg-slate-800/60 rounded-xl border border-cyan-500/20 p-5 backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-900 text-xs font-bold flex items-center justify-center">2</span>Target Audience</h2>
                <div className="flex items-center gap-3 mb-4"><Switch checked={allICPs} onCheckedChange={setAllICPs} className="data-[state=checked]:bg-cyan-500" /><Label className="text-white/90 text-sm">Target all ICPs</Label></div>
                {!allICPs && <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{icpOptions.map((icp) => (<div key={icp.id} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${brief.selectedICPs.includes(icp.id) ? "bg-cyan-500/20 border-cyan-400" : "bg-slate-700/30 border-slate-600 hover:border-cyan-500/50"}`} onClick={() => handleICPToggle(icp.id)}><Checkbox checked={brief.selectedICPs.includes(icp.id)} className="mt-0.5 border-cyan-500/50 data-[state=checked]:bg-cyan-500" /><div><p className="text-white text-sm font-medium">{icp.label}</p><p className="text-slate-400 text-xs">{icp.description}</p></div></div>))}</div>}
              </div>

              {/* Solutions */}
              <div className="bg-slate-800/60 rounded-xl border border-cyan-500/20 p-5 backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-900 text-xs font-bold flex items-center justify-center">3</span>Solutions to Highlight</h2>
                <div className="flex items-center gap-3 mb-4"><Switch checked={allSolutions} onCheckedChange={setAllSolutions} className="data-[state=checked]:bg-cyan-500" /><Label className="text-white/90 text-sm">Feature all solutions</Label></div>
                {!allSolutions && <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{solutionOptions.map((solution) => (<div key={solution.id} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${brief.selectedSolutions.includes(solution.id) ? "bg-cyan-500/20 border-cyan-400" : "bg-slate-700/30 border-slate-600 hover:border-cyan-500/50"}`} onClick={() => handleSolutionToggle(solution.id)}><Checkbox checked={brief.selectedSolutions.includes(solution.id)} className="mt-0.5 border-cyan-500/50 data-[state=checked]:bg-cyan-500" /><div><p className="text-white text-sm font-medium">{solution.label}</p><p className="text-slate-400 text-xs">{solution.description}</p></div></div>))}</div>}
              </div>

              {/* Strategic Context */}
              <div className="bg-slate-800/60 rounded-xl border border-cyan-500/20 p-5 backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-900 text-xs font-bold flex items-center justify-center">4</span>Strategic Context</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5"><TooltipLabel label="Consumer Takeout" tooltipKey="consumerTakeout" /><Input placeholder="The single thought they should remember..." value={brief.consumerTakeout} onChange={(e) => handleBriefChange("consumerTakeout", e.target.value)} className="bg-slate-700/50 border-cyan-500/30 text-white placeholder:text-slate-400" /></div>
                  <div className="space-y-1.5"><TooltipLabel label="Key Insight" tooltipKey="insight" /><Input placeholder="The observation driving this campaign..." value={brief.insight} onChange={(e) => handleBriefChange("insight", e.target.value)} className="bg-slate-700/50 border-cyan-500/30 text-white placeholder:text-slate-400" /></div>
                  <div className="space-y-1.5 md:col-span-2"><TooltipLabel label="Job to be Done" tooltipKey="jobToBeDone" /><Textarea placeholder="What task or problem does this campaign help accomplish?" value={brief.jobToBeDone} onChange={(e) => handleBriefChange("jobToBeDone", e.target.value)} rows={2} className="bg-slate-700/50 border-cyan-500/30 text-white placeholder:text-slate-400" /></div>
                  <div className="space-y-1.5 md:col-span-2"><TooltipLabel label="Why Are We Doing This Campaign?" tooltipKey="whyDoingCampaign" /><Textarea placeholder="The strategic reason for launching this campaign now..." value={brief.whyDoingCampaign} onChange={(e) => handleBriefChange("whyDoingCampaign", e.target.value)} rows={2} className="bg-slate-700/50 border-cyan-500/30 text-white placeholder:text-slate-400" /></div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Content Source */}
              <div className="bg-slate-800/60 rounded-xl border border-cyan-500/20 p-5 backdrop-blur-sm">
                <div className="flex items-start gap-2 mb-3">
                  <h3 className="text-sm font-semibold text-white">Campaign Content Source</h3>
                  <Tooltip>
                    <TooltipTrigger asChild><HelpCircle className="w-4 h-4 text-cyan-400/60 hover:text-cyan-300 cursor-help" /></TooltipTrigger>
                    <TooltipContent className="max-w-xs bg-slate-800 border-cyan-500/30 text-white">
                      <p className="font-medium mb-1">{fieldTooltips.contentSource.tip}</p>
                      <p className="text-cyan-300 text-xs">{fieldTooltips.contentSource.example}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex gap-2 mb-3">
                  <button onClick={() => handleBriefChange("contentSourceType", "url")} className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${brief.contentSourceType === "url" ? "bg-cyan-500 text-slate-900" : "bg-slate-700/50 text-white/70 hover:bg-slate-700"}`}>
                    <LinkIcon className="w-4 h-4" />URL
                  </button>
                  <button onClick={() => handleBriefChange("contentSourceType", "upload")} className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${brief.contentSourceType === "upload" ? "bg-cyan-500 text-slate-900" : "bg-slate-700/50 text-white/70 hover:bg-slate-700"}`}>
                    <Upload className="w-4 h-4" />Upload
                  </button>
                </div>
                {brief.contentSourceType === "url" && (
                  <Input 
                    placeholder="https://blog.quantuminsider.com/..." 
                    value={brief.contentSourceUrl} 
                    onChange={(e) => handleBriefChange("contentSourceUrl", e.target.value)} 
                    className="bg-slate-700/50 border-cyan-500/30 text-white placeholder:text-slate-400" 
                  />
                )}
                {brief.contentSourceType === "upload" && (
                  <FileUpload
                    files={brief.contentSourceFiles}
                    onFilesChange={(files) => handleBriefChange("contentSourceFiles", files)}
                    folder="content-source"
                    multiple={false}
                  />
                )}
              </div>

              {/* References */}
              <div className="bg-slate-800/60 rounded-xl border border-cyan-500/20 p-5 backdrop-blur-sm">
                <div className="flex items-start gap-2 mb-3">
                  <h3 className="text-sm font-semibold text-white">Reference Materials</h3>
                  <span className="text-slate-500 text-xs">(optional)</span>
                  <Tooltip>
                    <TooltipTrigger asChild><HelpCircle className="w-4 h-4 text-cyan-400/60 hover:text-cyan-300 cursor-help ml-auto" /></TooltipTrigger>
                    <TooltipContent className="max-w-xs bg-slate-800 border-cyan-500/30 text-white">
                      <p className="font-medium mb-1">{fieldTooltips.references.tip}</p>
                      <p className="text-cyan-300 text-xs">{fieldTooltips.references.example}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="space-y-2">
                  {brief.referenceUrls.map((url, i) => (
                    <div key={i} className="flex gap-2">
                      <Input 
                        placeholder="https://..." 
                        value={url} 
                        onChange={(e) => updateReferenceUrl(i, e.target.value)} 
                        className="bg-slate-700/50 border-cyan-500/30 text-white placeholder:text-slate-400 text-sm" 
                      />
                      {brief.referenceUrls.length > 1 && (
                        <button onClick={() => removeReferenceUrl(i)} className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={addReferenceUrl} className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm transition-colors">
                    <Plus className="w-4 h-4" />Add URL
                  </button>
                </div>
                <div className="mt-3">
                  <FileUpload
                    files={brief.referenceFiles}
                    onFilesChange={(files) => handleBriefChange("referenceFiles", files)}
                    folder="references"
                    multiple={true}
                  />
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-slate-800/60 rounded-xl border border-cyan-500/20 p-5 backdrop-blur-sm">
                <TooltipLabel label="Additional Information" tooltipKey="additionalInfo" />
                <Textarea 
                  placeholder="Any other context, constraints, or creative ideas..." 
                  value={brief.additionalInfo} 
                  onChange={(e) => handleBriefChange("additionalInfo", e.target.value)} 
                  rows={3} 
                  className="bg-slate-700/50 border-cyan-500/30 text-white placeholder:text-slate-400 mt-2" 
                />
              </div>

              {/* Brand Focus */}
              <Collapsible open={brandFocusOpen} onOpenChange={setBrandFocusOpen}>
                <CollapsibleTrigger asChild>
                  <button className="w-full flex items-center justify-between bg-slate-800/60 rounded-xl border border-cyan-500/20 p-4 text-left hover:bg-slate-800/80 transition-colors">
                    <span className="text-sm font-semibold text-white">Adjust Brand Focus</span>
                    {brandFocusOpen ? <ChevronUp className="w-5 h-5 text-cyan-400" /> : <ChevronDown className="w-5 h-5 text-cyan-400" />}
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <div className="bg-slate-800/60 rounded-xl border border-cyan-500/20 p-4 space-y-3">
                    {frameworkElements.map((el) => (
                      <div key={el.key} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-white/80 text-xs">{el.label}</span>
                          <Tooltip>
                            <TooltipTrigger asChild><HelpCircle className="w-3 h-3 text-cyan-400/50 hover:text-cyan-300 cursor-help" /></TooltipTrigger>
                            <TooltipContent className="max-w-xs bg-slate-800 border-cyan-500/30 text-white text-xs">{el.tooltip}</TooltipContent>
                          </Tooltip>
                        </div>
                        <Select value={frameworkSelection[el.key]} onValueChange={(v) => handleFrameworkChange(el.key, v as FrameworkOption)}>
                          <SelectTrigger className="w-28 h-7 bg-slate-700/50 border-cyan-500/30 text-white text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent className="bg-slate-800 border-cyan-500/30">
                            <SelectItem value="use" className="text-white text-xs hover:bg-cyan-500/20">Use</SelectItem>
                            <SelectItem value="emphasise" className="text-white text-xs hover:bg-cyan-500/20">Emphasise</SelectItem>
                            <SelectItem value="ignore" className="text-white text-xs hover:bg-cyan-500/20">Ignore</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Button onClick={validateAndContinue} size="lg" className="px-10 py-4 text-base font-semibold bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-900 hover:from-cyan-400 hover:to-cyan-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/40 hover:scale-105 transition-all duration-300">
              Continue to idea generation
            </Button>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
};

export default CampaignInput;
