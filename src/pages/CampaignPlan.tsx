import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, FileText, Sparkles, RefreshCw, Target, MessageSquare, 
  Calendar, Layers, AlertTriangle, DollarSign, Download, ChevronDown, 
  ChevronUp, CheckCircle2, Megaphone, Clock, Package
} from "lucide-react";
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

interface CampaignBrief {
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
}

interface CampaignPlanData {
  campaign_overview: {
    platform_name: string;
    tagline: string;
    big_idea: string;
    success_metrics: string[];
  };
  messaging_framework: {
    primary_message: string;
    supporting_messages: string[];
    call_to_action: string;
    elevator_pitch: string;
  };
  channels: Array<{
    channel: string;
    role: string;
    tactics: string[];
    content_types: string[];
    priority: 'high' | 'medium' | 'low';
  }>;
  timeline: {
    total_duration: string;
    phases: Array<{
      phase_name: string;
      duration: string;
      focus: string;
      key_activities: string[];
      deliverables: string[];
    }>;
  };
  assets: Array<{
    asset_name: string;
    asset_type: string;
    description: string;
    channel: string;
    priority: 'must-have' | 'nice-to-have';
  }>;
  budget_allocation: {
    level: string;
    recommendation: string;
    breakdown: Array<{
      category: string;
      percentage: number;
      notes: string;
    }>;
  };
  risks_and_mitigations: Array<{
    risk: string;
    mitigation: string;
  }>;
}

interface LocationState {
  brief: CampaignBrief;
  frameworkSelection: Record<string, string>;
  selectedIdea: CampaignIdea;
}

const CampaignPlan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const state = location.state as LocationState | null;

  const [plan, setPlan] = useState<CampaignPlanData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    messaging: true,
    channels: true,
    timeline: true,
    assets: true,
    budget: true,
    risks: true,
  });

  useEffect(() => {
    if (!state?.selectedIdea || !state?.brief) {
      toast({
        title: "No idea selected",
        description: "Please select a campaign idea first.",
        variant: "destructive",
      });
      navigate("/campaign/ideas");
    }
  }, [state, navigate, toast]);

  const generatePlan = async () => {
    if (!state) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-campaign-plan', {
        body: {
          brief: state.brief,
          frameworkSelection: state.frameworkSelection,
          selectedIdea: state.selectedIdea,
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to generate plan');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.plan) {
        setPlan(data.plan);
        toast({
          title: "Plan generated!",
          description: "Your campaign plan is ready for review.",
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      console.error('Error generating plan:', error);
      toast({
        title: "Generation failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleExport = () => {
    if (!plan || !state) return;

    const exportData = {
      campaignBrief: state.brief,
      selectedIdea: state.selectedIdea,
      campaignPlan: plan,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${plan.campaign_overview.platform_name || 'campaign'}-plan.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Exported!",
      description: "Campaign plan exported successfully.",
    });
  };

  if (!state) {
    return null;
  }

  const SectionHeader = ({ 
    icon: Icon, 
    title, 
    section, 
    color = "cyan" 
  }: { 
    icon: any; 
    title: string; 
    section: string;
    color?: string;
  }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-4 hover:bg-slate-700/20 transition-colors rounded-t-xl"
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg bg-${color}-500/20 flex items-center justify-center`}>
          <Icon className={`w-5 h-5 text-${color}-400`} />
        </div>
        <h3 className="font-semibold text-white text-lg">{title}</h3>
      </div>
      {expandedSections[section] ? (
        <ChevronUp className="w-5 h-5 text-cyan-400" />
      ) : (
        <ChevronDown className="w-5 h-5 text-cyan-400/60" />
      )}
    </button>
  );

  const PriorityBadge = ({ priority }: { priority: string }) => {
    const colors = {
      high: 'bg-red-500/20 text-red-300 border-red-500/30',
      medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      low: 'bg-green-500/20 text-green-300 border-green-500/30',
      'must-have': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      'nice-to-have': 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    };
    return (
      <span className={`text-xs px-2 py-1 rounded-full border ${colors[priority as keyof typeof colors] || colors.medium}`}>
        {priority}
      </span>
    );
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
              to="/campaign/ideas"
              state={location.state}
              className="flex items-center gap-2 text-cyan-300 hover:text-white text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Ideas
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
        {/* Hero Section */}
        <section className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 mb-4 shadow-lg shadow-cyan-500/30">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Campaign Plan
          </h1>
          <p className="text-cyan-200/80 max-w-2xl mx-auto text-sm">
            Comprehensive execution plan with messaging, channels, timeline, and assets.
          </p>
        </section>

        {/* Selected Idea Summary */}
        <div className="bg-slate-800/60 rounded-xl border border-cyan-500/20 p-5 mb-6 backdrop-blur-sm">
          <h3 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            Selected Campaign Idea
          </h3>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-grow">
              <h4 className="text-lg font-semibold text-white">{state.selectedIdea.idea_name}</h4>
              <p className="text-cyan-200/70 text-sm italic mt-1">"{state.selectedIdea.core_thought}"</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-cyan-400/70">On-Brief Score:</span>
              <span className={`text-lg font-bold ${
                state.selectedIdea.on_brief_score >= 8 ? 'text-green-400' : 
                state.selectedIdea.on_brief_score >= 6 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {state.selectedIdea.on_brief_score}/10
              </span>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        {!plan && !isLoading && (
          <div className="flex justify-center mb-8">
            <Button
              onClick={generatePlan}
              disabled={isLoading}
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-8 py-6 text-lg shadow-lg shadow-cyan-500/30 transition-all hover:shadow-cyan-400/40"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Full Campaign Plan
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
            <p className="text-cyan-200/80 mt-4 text-sm">Building your campaign plan...</p>
            <p className="text-cyan-200/50 mt-1 text-xs">This may take a moment</p>
          </div>
        )}

        {/* Campaign Plan Content */}
        {plan && !isLoading && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                {plan.campaign_overview.platform_name}
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
                  onClick={generatePlan}
                  variant="outline"
                  size="sm"
                  className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 hover:text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
              </div>
            </div>

            {/* Campaign Overview */}
            <div className="bg-slate-800/60 rounded-xl border border-cyan-500/20 overflow-hidden">
              <SectionHeader icon={Target} title="Campaign Overview" section="overview" />
              {expandedSections.overview && (
                <div className="p-5 pt-0 space-y-4">
                  <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg p-4 border border-cyan-500/20">
                    <p className="text-2xl font-bold text-white mb-2">{plan.campaign_overview.tagline}</p>
                    <p className="text-cyan-200/80">{plan.campaign_overview.big_idea}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-cyan-400 mb-2">Success Metrics</h4>
                    <div className="flex flex-wrap gap-2">
                      {plan.campaign_overview.success_metrics.map((metric, i) => (
                        <span key={i} className="bg-slate-700/50 text-white/90 text-sm px-3 py-1 rounded-full">
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Messaging Framework */}
            <div className="bg-slate-800/60 rounded-xl border border-cyan-500/20 overflow-hidden">
              <SectionHeader icon={MessageSquare} title="Messaging Framework" section="messaging" />
              {expandedSections.messaging && (
                <div className="p-5 pt-0 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-cyan-400 mb-2">Primary Message</h4>
                    <p className="text-xl font-semibold text-white">{plan.messaging_framework.primary_message}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-cyan-400 mb-2">Supporting Messages</h4>
                    <ul className="space-y-2">
                      {plan.messaging_framework.supporting_messages.map((msg, i) => (
                        <li key={i} className="flex items-start gap-2 text-white/80">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                          {msg}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-cyan-400 mb-2">Call to Action</h4>
                      <p className="text-white font-semibold">{plan.messaging_framework.call_to_action}</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-cyan-400 mb-2">Elevator Pitch</h4>
                      <p className="text-white/80 text-sm">{plan.messaging_framework.elevator_pitch}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Channels */}
            <div className="bg-slate-800/60 rounded-xl border border-cyan-500/20 overflow-hidden">
              <SectionHeader icon={Megaphone} title="Channels & Tactics" section="channels" />
              {expandedSections.channels && (
                <div className="p-5 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {plan.channels.map((channel, i) => (
                      <div key={i} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white">{channel.channel}</h4>
                          <PriorityBadge priority={channel.priority} />
                        </div>
                        <p className="text-cyan-200/70 text-sm mb-3">{channel.role}</p>
                        <div className="space-y-2">
                          <div>
                            <span className="text-xs text-cyan-400/70 uppercase">Tactics</span>
                            <ul className="mt-1 space-y-1">
                              {channel.tactics.map((tactic, j) => (
                                <li key={j} className="text-white/80 text-sm flex items-start gap-1">
                                  <span className="text-cyan-400">•</span> {tactic}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="bg-slate-800/60 rounded-xl border border-cyan-500/20 overflow-hidden">
              <SectionHeader icon={Calendar} title="Timeline" section="timeline" />
              {expandedSections.timeline && (
                <div className="p-5 pt-0">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span className="text-white font-medium">Total Duration: {plan.timeline.total_duration}</span>
                  </div>
                  <div className="space-y-4">
                    {plan.timeline.phases.map((phase, i) => (
                      <div key={i} className="relative pl-6 border-l-2 border-cyan-500/30">
                        <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-cyan-500" />
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-white">{phase.phase_name}</h4>
                            <span className="text-cyan-400 text-sm">{phase.duration}</span>
                          </div>
                          <p className="text-cyan-200/70 text-sm mb-3">{phase.focus}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <span className="text-xs text-cyan-400/70 uppercase">Key Activities</span>
                              <ul className="mt-1 space-y-1">
                                {phase.key_activities.map((activity, j) => (
                                  <li key={j} className="text-white/80 text-sm flex items-start gap-1">
                                    <span className="text-cyan-400">•</span> {activity}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <span className="text-xs text-cyan-400/70 uppercase">Deliverables</span>
                              <ul className="mt-1 space-y-1">
                                {phase.deliverables.map((deliverable, j) => (
                                  <li key={j} className="text-white/80 text-sm flex items-start gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-green-400 mt-0.5" /> {deliverable}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Assets */}
            <div className="bg-slate-800/60 rounded-xl border border-cyan-500/20 overflow-hidden">
              <SectionHeader icon={Package} title="Assets Required" section="assets" />
              {expandedSections.assets && (
                <div className="p-5 pt-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-600/30">
                          <th className="text-left py-2 px-3 text-cyan-400 font-medium">Asset</th>
                          <th className="text-left py-2 px-3 text-cyan-400 font-medium">Type</th>
                          <th className="text-left py-2 px-3 text-cyan-400 font-medium">Channel</th>
                          <th className="text-left py-2 px-3 text-cyan-400 font-medium">Priority</th>
                        </tr>
                      </thead>
                      <tbody>
                        {plan.assets.map((asset, i) => (
                          <tr key={i} className="border-b border-slate-700/30 hover:bg-slate-700/20">
                            <td className="py-3 px-3">
                              <p className="text-white font-medium">{asset.asset_name}</p>
                              <p className="text-white/60 text-xs mt-0.5">{asset.description}</p>
                            </td>
                            <td className="py-3 px-3 text-white/80">{asset.asset_type}</td>
                            <td className="py-3 px-3 text-white/80">{asset.channel}</td>
                            <td className="py-3 px-3"><PriorityBadge priority={asset.priority} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Budget Allocation */}
            <div className="bg-slate-800/60 rounded-xl border border-cyan-500/20 overflow-hidden">
              <SectionHeader icon={DollarSign} title="Budget Allocation" section="budget" />
              {expandedSections.budget && (
                <div className="p-5 pt-0 space-y-4">
                  <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-lg p-4 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-cyan-400">Budget Level:</span>
                      <span className="text-white font-semibold capitalize">{plan.budget_allocation.level}</span>
                    </div>
                    <p className="text-white/80">{plan.budget_allocation.recommendation}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {plan.budget_allocation.breakdown.map((item, i) => (
                      <div key={i} className="bg-slate-700/30 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-medium">{item.category}</span>
                          <span className="text-cyan-400 font-bold">{item.percentage}%</span>
                        </div>
                        <p className="text-white/60 text-xs">{item.notes}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Risks & Mitigations */}
            <div className="bg-slate-800/60 rounded-xl border border-cyan-500/20 overflow-hidden">
              <SectionHeader icon={AlertTriangle} title="Risks & Mitigations" section="risks" />
              {expandedSections.risks && (
                <div className="p-5 pt-0">
                  <div className="space-y-3">
                    {plan.risks_and_mitigations.map((item, i) => (
                      <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-700/20 rounded-lg p-4">
                        <div>
                          <span className="text-xs text-red-400/70 uppercase flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Risk
                          </span>
                          <p className="text-white/90 mt-1">{item.risk}</p>
                        </div>
                        <div>
                          <span className="text-xs text-green-400/70 uppercase flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Mitigation
                          </span>
                          <p className="text-white/90 mt-1">{item.mitigation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CampaignPlan;
