import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Lightbulb, Sparkles, RefreshCw, ChevronDown, ChevronUp, Target, MessageSquare, Share2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import quantumLogo from "@/assets/quantum-logo.png";

interface CampaignIdea {
  title: string;
  concept: string;
  keyMessage: string;
  channels: string[];
  tactics: string[];
  whyItWorks: string;
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
  const [expandedIdea, setExpandedIdea] = useState<number | null>(0);
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
        setExpandedIdea(0);
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

  const toggleExpand = (index: number) => {
    setExpandedIdea(expandedIdea === index ? null : index);
  };

  if (!campaignData) {
    return null;
  }

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

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl">
        {/* Hero Section */}
        <section className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 mb-4 shadow-lg shadow-cyan-500/30">
            <Lightbulb className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Campaign Ideas
          </h1>
          <p className="text-cyan-200/80 max-w-2xl mx-auto text-sm">
            AI-powered creative concepts tailored to your brief and brand framework.
          </p>
        </section>

        {/* Campaign Summary Card */}
        <div className="bg-slate-800/60 rounded-xl border border-cyan-500/20 p-5 mb-6 backdrop-blur-sm">
          <h3 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            Campaign Brief Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
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
            <div className="md:col-span-2 lg:col-span-3">
              <span className="text-cyan-400/70">Objective:</span>
              <p className="text-white/90">{campaignData.brief.objective}</p>
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

        {/* Ideas List */}
        {ideas.length > 0 && !isLoading && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                {ideas.length} Campaign Ideas
              </h2>
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

            {ideas.map((idea, index) => (
              <div
                key={index}
                className={`bg-slate-800/60 rounded-xl border transition-all duration-300 ${
                  expandedIdea === index
                    ? 'border-cyan-400 shadow-lg shadow-cyan-500/10'
                    : 'border-cyan-500/20 hover:border-cyan-500/40'
                }`}
              >
                {/* Collapsed Header */}
                <button
                  onClick={() => toggleExpand(index)}
                  className="w-full text-left p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-sm font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="font-semibold text-white text-lg mb-1">{idea.title}</h3>
                        <p className="text-cyan-200/70 text-sm line-clamp-2">{idea.concept}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {expandedIdea === index ? (
                        <ChevronUp className="w-5 h-5 text-cyan-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-cyan-400/60" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded Content */}
                {expandedIdea === index && (
                  <div className="px-5 pb-5 pt-0 border-t border-cyan-500/10 mt-0">
                    <div className="pt-4 space-y-4">
                      {/* Key Message */}
                      <div>
                        <h4 className="text-sm font-medium text-cyan-400 mb-1 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Key Message
                        </h4>
                        <p className="text-white/90 text-sm bg-slate-700/30 rounded-lg p-3 italic">
                          "{idea.keyMessage}"
                        </p>
                      </div>

                      {/* Channels */}
                      <div>
                        <h4 className="text-sm font-medium text-cyan-400 mb-2 flex items-center gap-2">
                          <Share2 className="w-4 h-4" />
                          Recommended Channels
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {idea.channels.map((channel, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-full border border-cyan-500/30"
                            >
                              {channel}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Tactics */}
                      <div>
                        <h4 className="text-sm font-medium text-cyan-400 mb-2">Tactical Recommendations</h4>
                        <ul className="space-y-2">
                          {idea.tactics.map((tactic, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                              {tactic}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Why It Works */}
                      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg p-4 border border-cyan-500/20">
                        <h4 className="text-sm font-medium text-cyan-400 mb-1">Why This Works</h4>
                        <p className="text-white/80 text-sm">{idea.whyItWorks}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default IdeaGeneration;
