import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
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

interface CampaignBrief {
  campaignName: string;
  objective: string;
  audience: string;
  consumerTakeout: string;
  jobToBeDone: string;
  campaignType: "demand" | "lead" | "";
  budgetLevel: string;
  blogToVideo: boolean;
}

const frameworkElements = [
  { key: "purpose", label: "Purpose" },
  { key: "brandArchetypes", label: "Brand Archetypes" },
  { key: "toneBehavior", label: "Tone & Behavior" },
  { key: "communicationPrinciples", label: "Communication Principles" },
  { key: "visualIdentity", label: "Visual Identity" },
  { key: "coreValues", label: "Core Values" },
  { key: "solutionsOfferings", label: "Solutions & Offerings" },
] as const;

const CampaignInput = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [frameworkSelection, setFrameworkSelection] = useState<FrameworkSelection>({
    purpose: "use",
    brandArchetypes: "use",
    toneBehavior: "use",
    communicationPrinciples: "use",
    visualIdentity: "use",
    coreValues: "use",
    solutionsOfferings: "use",
  });

  const [brief, setBrief] = useState<CampaignBrief>({
    campaignName: "",
    objective: "",
    audience: "",
    consumerTakeout: "",
    jobToBeDone: "",
    campaignType: "",
    budgetLevel: "",
    blogToVideo: false,
  });

  const handleFrameworkChange = (key: keyof FrameworkSelection, value: FrameworkOption) => {
    setFrameworkSelection((prev) => ({ ...prev, [key]: value }));
  };

  const handleBriefChange = (key: keyof CampaignBrief, value: string | boolean) => {
    setBrief((prev) => ({ ...prev, [key]: value }));
  };

  const validateAndContinue = () => {
    const requiredFields: { key: keyof CampaignBrief; label: string }[] = [
      { key: "campaignName", label: "Campaign name" },
      { key: "objective", label: "Objective" },
      { key: "audience", label: "Audience / ICP" },
      { key: "campaignType", label: "Campaign type" },
      { key: "budgetLevel", label: "Budget level" },
    ];

    const missingFields = requiredFields.filter((field) => !brief[field.key]);

    if (missingFields.length > 0) {
      toast({
        title: "Missing required fields",
        description: `Please fill in: ${missingFields.map((f) => f.label).join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    navigate("/campaign/ideas", {
      state: { frameworkSelection, brief },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border shadow-sm">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link to="/">
                <img src={quantumLogo} alt="The Quantum Insider" className="h-8 md:h-10" />
              </Link>
            </div>
            <Link
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Brand Framework
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-4xl">
        {/* Intro */}
        <section className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Campaign Input
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start a new campaign using your brand framework. Choose which parts of the framework
            to use, emphasise, or ignore for this campaign.
          </p>
        </section>

        {/* Section A: Brand Framework Selection */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-foreground border-l-4 border-primary pl-4 mb-6">
            A. Brand Framework Selection
          </h2>
          <div className="bg-card rounded-xl border border-border p-6 shadow-md">
            <div className="space-y-4">
              {frameworkElements.map((element) => (
                <div
                  key={element.key}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-b border-border last:border-b-0"
                >
                  <Label className="font-medium text-foreground min-w-[200px]">
                    {element.label}
                  </Label>
                  <RadioGroup
                    value={frameworkSelection[element.key]}
                    onValueChange={(value) =>
                      handleFrameworkChange(element.key, value as FrameworkOption)
                    }
                    className="flex flex-wrap gap-2 sm:gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="use" id={`${element.key}-use`} />
                      <Label htmlFor={`${element.key}-use`} className="text-sm cursor-pointer">
                        Use as normal
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="emphasise" id={`${element.key}-emphasise`} />
                      <Label
                        htmlFor={`${element.key}-emphasise`}
                        className="text-sm cursor-pointer"
                      >
                        Emphasise / focus this
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ignore" id={`${element.key}-ignore`} />
                      <Label htmlFor={`${element.key}-ignore`} className="text-sm cursor-pointer">
                        Do not use
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section B: Campaign Brief Basics */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-foreground border-l-4 border-primary pl-4 mb-6">
            B. Campaign Brief Basics
          </h2>
          <div className="bg-card rounded-xl border border-border p-6 shadow-md space-y-6">
            {/* Campaign Name */}
            <div className="space-y-2">
              <Label htmlFor="campaignName" className="font-medium">
                Campaign name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="campaignName"
                placeholder="Enter campaign name"
                value={brief.campaignName}
                onChange={(e) => handleBriefChange("campaignName", e.target.value)}
              />
            </div>

            {/* Objective */}
            <div className="space-y-2">
              <Label htmlFor="objective" className="font-medium">
                Objective <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="objective"
                placeholder="What is the primary goal of this campaign?"
                value={brief.objective}
                onChange={(e) => handleBriefChange("objective", e.target.value)}
                rows={3}
              />
            </div>

            {/* Audience / ICP */}
            <div className="space-y-2">
              <Label htmlFor="audience" className="font-medium">
                Audience / ICP <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="audience"
                placeholder="Who is the target audience for this campaign?"
                value={brief.audience}
                onChange={(e) => handleBriefChange("audience", e.target.value)}
                rows={3}
              />
            </div>

            {/* Consumer Takeout */}
            <div className="space-y-2">
              <Label htmlFor="consumerTakeout" className="font-medium">
                Consumer takeout
              </Label>
              <Input
                id="consumerTakeout"
                placeholder="What should the audience think or feel after seeing this?"
                value={brief.consumerTakeout}
                onChange={(e) => handleBriefChange("consumerTakeout", e.target.value)}
              />
            </div>

            {/* Job to be Done */}
            <div className="space-y-2">
              <Label htmlFor="jobToBeDone" className="font-medium">
                Job to be done
              </Label>
              <Textarea
                id="jobToBeDone"
                placeholder="What task or problem does this campaign help the audience accomplish?"
                value={brief.jobToBeDone}
                onChange={(e) => handleBriefChange("jobToBeDone", e.target.value)}
                rows={3}
              />
            </div>

            {/* Campaign Type */}
            <div className="space-y-2">
              <Label className="font-medium">
                Campaign type <span className="text-destructive">*</span>
              </Label>
              <RadioGroup
                value={brief.campaignType}
                onValueChange={(value) => handleBriefChange("campaignType", value)}
                className="flex flex-col sm:flex-row gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="demand" id="type-demand" />
                  <Label htmlFor="type-demand" className="cursor-pointer">
                    Demand generation
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lead" id="type-lead" />
                  <Label htmlFor="type-lead" className="cursor-pointer">
                    Lead generation
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Budget Level */}
            <div className="space-y-2">
              <Label htmlFor="budgetLevel" className="font-medium">
                Budget level <span className="text-destructive">*</span>
              </Label>
              <Select
                value={brief.budgetLevel}
                onValueChange={(value) => handleBriefChange("budgetLevel", value)}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Select budget" />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Blog to Video */}
            <div className="flex items-center justify-between py-2">
              <Label htmlFor="blogToVideo" className="font-medium cursor-pointer">
                Blog-to-video?
              </Label>
              <Switch
                id="blogToVideo"
                checked={brief.blogToVideo}
                onCheckedChange={(checked) => handleBriefChange("blogToVideo", checked)}
              />
            </div>
          </div>
        </section>

        {/* Continue Button */}
        <div className="flex justify-center">
          <Button
            onClick={validateAndContinue}
            size="lg"
            className="px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Continue to idea generation
          </Button>
        </div>
      </main>
    </div>
  );
};

export default CampaignInput;
