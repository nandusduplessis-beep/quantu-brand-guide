import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Lightbulb, Sparkles, RefreshCw, Target, MessageSquare, Share2, CheckCircle2, ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import quantumLogo from "@/assets/quantum-logo.png";

interface CampaignIdea {
  idea_name: string;
  idea_summary: string;
  core_thought: string;
  key_visual_prompt: string;
  on_brief_score: number;
  on_brief_justification: string;
}

interface CampaignData {
  frameworkSelection: Record<string, string>;
  brief: {
    campaignName: string;
    objective: string;
    campaignType: string;
    budgetLevel: string;
    selectedICPs: string[];
    consumerTakeout?: string;
    insight?: string;
    jobToBeDone?: string;
    whyDoingCampaign?: string;
    additionalInfo?: string;
  };
}

const IdeaGeneration = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const campaignData = location.state as CampaignData | null;

  const [ideas, setIdeas] = useState<CampaignIdea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<number | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  useEffect(() => {
    if (!campaignData?.brief) {
      toast({
        title: "No campaign data",
        description: "Please fill in the campaign brief first.",
        variant: "destructive",
      });
      navigate("/campaign/input");
    }
  }, [campaignData, navigate, toast]);

  const generateIdeas = async () => {
    if (!campaignData) return;

    setIsLoading(true);
    setSelectedIdea(null);
    try {
      const { data, error } = await supabase.functions.invoke('generate-campaign-ideas', {
        body: {
          brief: campaignData.brief,
          frameworkSelection: campaignData.frameworkSelection,
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to generate ideas');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.ideas && Array.isArray(data.ideas)) {
        setIdeas(data.ideas);
        setHasGenerated(true);
        toast({
          title: "Ideas generated!",
          description: `${data.ideas.length} campaign ideas are ready for review.`,
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      console.error('Error generating ideas:', error);
      toast({
        title: "Generation failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectIdea = (index: number) => {
    setSelectedIdea(selectedIdea === index ? null : index);
  };

  const handleProceedToPlan = () => {
    if (selectedIdea === null) {
      toast({
        title: "Select an idea",
        description: "Please select one of the campaign ideas to proceed.",
        variant: "destructive",
      });
      return;
    }

    // Navigate to campaign plan generation (placeholder for now)
    toast({
      title: "Coming soon!",
      description: "Full campaign plan generation will be available soon.",
    });
  };

  const handleExport = () => {
    if (ideas.length === 0) return;

    const exportData = {
      campaignBrief: campaignData?.brief,
      generatedIdeas: ideas,
      selectedIdea: selectedIdea !== null ? ideas[selectedIdea] : null,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${campaignData?.brief.campaignName || 'campaign'}-ideas.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Exported!",
      description: "Campaign ideas exported successfully.",
    });
  };

  if (!campaignData) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return 'from-green-500/20 to-green-600/10 border-green-500/30';
    if (score >= 6) return 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30';
    return 'from-red-500/20 to-red-600/10 border-red-500/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-lg border-b border-cyan-500/20">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link to="/">
              <img src={quantumLogo} alt="TQI" className="h-7" />
            </Link>
            <Link
              to="/campaign/input"
              className="flex items-center gap-2 text-cyan-300 hover:text-white text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Brief
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 mb-4 shadow-lg shadow-cyan-500/30">
            <Lightbulb className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Campaign Ideas
          </h1>
          <p className="text-cyan-200/80 max-w-2xl mx-auto text-sm">
            Compare AI-powered creative concepts and select one to develop into a full campaign plan.
          </p>
        </section>

        {/* Campaign Summary Card */}
        <div className="bg-slate-800/60 rounded-xl border border-cyan-500/20 p-5 mb-6 backdrop-blur-sm max-w-4xl mx-auto">
          <h3 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            Campaign Brief Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-cyan-400/70">Campaign:</span>
              <p className="text-white font-medium">{campaignData.brief.campaignName}</p>
            </div>
            <div>
              <span className="text-cyan-400/70">Type:</span>
              <p className="text-white font-medium capitalize">{campaignData.brief.campaignType} generation</p>
            </div>
            <div>
              <span className="text-cyan-400/70">Budget:</span>
              <p className="text-white font-medium capitalize">{campaignData.brief.budgetLevel}</p>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        {!hasGenerated && (
          <div className="flex justify-center mb-8">
            <Button
              onClick={generateIdeas}
              disabled={isLoading}
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-8 py-6 text-lg shadow-lg shadow-cyan-500/30 transition-all hover:shadow-cyan-400/40"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Generating Ideas...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Campaign Ideas
                </>
              )}
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-cyan-500/30 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-cyan-400 animate-bounce" />
              </div>
            </div>
            <p className="text-cyan-200/80 mt-4 text-sm">Crafting creative concepts...</p>
          </div>
        )}

        {/* Ideas Comparison Grid */}
        {ideas.length > 0 && !isLoading && (
          <>
            <div className="flex items-center justify-between mb-6 max-w-7xl mx-auto">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                Compare {ideas.length} Ideas
              </h2>
              <div className="flex gap-3">
                <Button
                  onClick={handleExport}
                  variant="outline"
                  size="sm"
                  className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 hover:text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button
                  onClick={generateIdeas}
                  variant="outline"
                  size="sm"
                  className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 hover:text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
              </div>
            </div>

            {/* Side-by-Side Comparison Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 max-w-7xl mx-auto">
              {ideas.map((idea, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectIdea(index)}
                  className={`relative bg-slate-800/60 rounded-xl border-2 transition-all duration-300 cursor-pointer flex flex-col ${
                    selectedIdea === index
                      ? 'border-cyan-400 shadow-lg shadow-cyan-500/20 ring-2 ring-cyan-400/30'
                      : 'border-cyan-500/20 hover:border-cyan-500/40'
                  }`}
                >
                  {/* Selection Badge */}
                  {selectedIdea === index && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      SELECTED
                    </div>
                  )}

                  {/* Idea Number & Name */}
                  <div className="p-5 border-b border-cyan-500/10">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center text-lg">
                        {index + 1}
                      </span>
                      <h3 className="font-semibold text-white text-lg leading-tight">{idea.idea_name}</h3>
                    </div>
                  </div>

                  {/* Core Thought */}
                  <div className="p-5 border-b border-cyan-500/10">
                    <h4 className="text-xs font-medium text-cyan-400 mb-2 flex items-center gap-2 uppercase tracking-wide">
                      <MessageSquare className="w-3 h-3" />
                      Core Thought
                    </h4>
                    <p className="text-white/90 text-sm bg-slate-700/30 rounded-lg p-3 italic">
                      "{idea.core_thought}"
                    </p>
                  </div>

                  {/* Summary */}
                  <div className="p-5 border-b border-cyan-500/10 flex-grow">
                    <h4 className="text-xs font-medium text-cyan-400 mb-2 uppercase tracking-wide">Summary</h4>
                    <p className="text-white/80 text-sm">{idea.idea_summary}</p>
                  </div>

                  {/* Visual Concept */}
                  <div className="p-5 border-b border-cyan-500/10">
                    <h4 className="text-xs font-medium text-cyan-400 mb-2 flex items-center gap-2 uppercase tracking-wide">
                      <Share2 className="w-3 h-3" />
                      Visual Concept
                    </h4>
                    <p className="text-white/70 text-sm bg-slate-700/20 rounded-lg p-3 border border-cyan-500/10">
                      {idea.key_visual_prompt}
                    </p>
                  </div>

                  {/* On-Brief Score */}
                  <div className={`p-5 rounded-b-xl bg-gradient-to-r ${getScoreBgColor(idea.on_brief_score)} border-t`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-medium text-cyan-400 uppercase tracking-wide">On-Brief Score</h4>
                      <span className={`text-2xl font-bold ${getScoreColor(idea.on_brief_score)}`}>
                        {idea.on_brief_score}/10
                      </span>
                    </div>
                    <p className="text-white/70 text-xs leading-relaxed">{idea.on_brief_justification}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-lg border-t border-cyan-500/20 -mx-4 px-4 py-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="text-sm text-cyan-200/70">
                  {selectedIdea !== null ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      Selected: <strong className="text-white">{ideas[selectedIdea].idea_name}</strong>
                    </span>
                  ) : (
                    <span>Click on an idea to select it for the full campaign plan</span>
                  )}
                </div>
                <Button
                  onClick={handleProceedToPlan}
                  disabled={selectedIdea === null}
                  className={`px-6 py-2 font-semibold transition-all ${
                    selectedIdea !== null
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                      : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Generate Full Campaign Plan
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default IdeaGeneration;
