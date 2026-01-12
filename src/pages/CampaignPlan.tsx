import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, FileText, Sparkles, RefreshCw, Download, Save,
  Pencil, Check, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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

// Editable field component
const EditableField = ({ 
  value, 
  onChange, 
  multiline = false,
  label,
  className = ""
}: { 
  value: string; 
  onChange: (val: string) => void; 
  multiline?: boolean;
  label?: string;
  className?: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onChange(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className={`relative ${className}`}>
        {label && <label className="block text-xs font-medium text-slate-500 uppercase mb-1">{label}</label>}
        {multiline ? (
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="min-h-[80px] bg-white border-slate-300 text-slate-900"
            autoFocus
          />
        ) : (
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="bg-white border-slate-300 text-slate-900"
            autoFocus
          />
        )}
        <div className="flex gap-1 mt-2">
          <Button size="sm" onClick={handleSave} className="h-7 px-2 bg-green-600 hover:bg-green-700">
            <Check className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel} className="h-7 px-2">
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`group cursor-pointer hover:bg-slate-100 rounded px-2 py-1 -mx-2 -my-1 transition-colors ${className}`}
      onClick={() => setIsEditing(true)}
    >
      {label && <label className="block text-xs font-medium text-slate-500 uppercase mb-1">{label}</label>}
      <div className="flex items-start gap-2">
        <span className="flex-grow">{value || <span className="text-slate-400 italic">Click to edit</span>}</span>
        <Pencil className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 flex-shrink-0 mt-1" />
      </div>
    </div>
  );
};

// Editable list component
const EditableList = ({ 
  items, 
  onChange, 
  label 
}: { 
  items: string[]; 
  onChange: (items: string[]) => void; 
  label?: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(items.join('\n'));

  const handleSave = () => {
    const newItems = editValue.split('\n').filter(item => item.trim());
    onChange(newItems);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(items.join('\n'));
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div>
        {label && <label className="block text-xs font-medium text-slate-500 uppercase mb-1">{label}</label>}
        <Textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          placeholder="One item per line"
          className="min-h-[100px] bg-white border-slate-300 text-slate-900"
          autoFocus
        />
        <p className="text-xs text-slate-500 mt-1">One item per line</p>
        <div className="flex gap-1 mt-2">
          <Button size="sm" onClick={handleSave} className="h-7 px-2 bg-green-600 hover:bg-green-700">
            <Check className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel} className="h-7 px-2">
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="group cursor-pointer hover:bg-slate-100 rounded px-2 py-1 -mx-2 -my-1 transition-colors"
      onClick={() => setIsEditing(true)}
    >
      {label && <label className="block text-xs font-medium text-slate-500 uppercase mb-1">{label}</label>}
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-slate-700">
            <span className="text-slate-400">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <Pencil className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 mt-2" />
    </div>
  );
};

const CampaignPlan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const state = location.state as LocationState | null;

  const [plan, setPlan] = useState<CampaignPlanData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

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
        setHasChanges(false);
        toast({
          title: "Plan generated!",
          description: "Your campaign plan is ready for review and editing.",
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

  const updatePlan = (path: string, value: any) => {
    if (!plan) return;
    
    const keys = path.split('.');
    const newPlan = JSON.parse(JSON.stringify(plan));
    let current: any = newPlan;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (key.includes('[')) {
        const [arrKey, indexStr] = key.split('[');
        const index = parseInt(indexStr.replace(']', ''));
        current = current[arrKey][index];
      } else {
        current = current[key];
      }
    }
    
    const lastKey = keys[keys.length - 1];
    if (lastKey.includes('[')) {
      const [arrKey, indexStr] = lastKey.split('[');
      const index = parseInt(indexStr.replace(']', ''));
      current[arrKey][index] = value;
    } else {
      current[lastKey] = value;
    }
    
    setPlan(newPlan);
    setHasChanges(true);
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

  const handleSave = () => {
    toast({
      title: "Saved!",
      description: "Your changes have been saved locally.",
    });
    setHasChanges(false);
  };

  if (!state) {
    return null;
  }

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
              <span className="text-sm font-medium text-slate-600">Campaign Plan</span>
            </div>
            <div className="flex items-center gap-3">
              {hasChanges && (
                <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">Unsaved changes</span>
              )}
              <Link
                to="/campaign/ideas"
                state={location.state}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Ideas
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        {/* Document Header */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Internal Document</p>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                {state.selectedIdea.idea_name}
              </h1>
              <p className="text-slate-600 italic">"{state.selectedIdea.core_thought}"</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">On-Brief Score</p>
              <p className={`text-2xl font-bold ${
                state.selectedIdea.on_brief_score >= 8 ? 'text-green-600' : 
                state.selectedIdea.on_brief_score >= 6 ? 'text-amber-600' : 'text-red-600'
              }`}>
                {state.selectedIdea.on_brief_score}/10
              </p>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        {!plan && !isLoading && (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center shadow-sm">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Generate Campaign Plan</h2>
            <p className="text-slate-600 text-sm mb-6">
              Create a detailed, editable campaign plan based on your selected idea.
            </p>
            <Button
              onClick={generatePlan}
              disabled={isLoading}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Plan
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center shadow-sm">
            <div className="animate-spin w-8 h-8 border-2 border-cyan-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-slate-600">Generating your campaign plan...</p>
            <p className="text-slate-400 text-sm mt-1">This may take a moment</p>
          </div>
        )}

        {/* Campaign Plan Document */}
        {plan && !isLoading && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex items-center justify-end gap-3">
              <Button
                onClick={handleSave}
                variant="outline"
                size="sm"
                disabled={!hasChanges}
                className="border-slate-300"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button
                onClick={handleExport}
                variant="outline"
                size="sm"
                className="border-slate-300"
              >
                <Download className="w-4 h-4 mr-2" />
                Export JSON
              </Button>
              <Button
                onClick={generatePlan}
                variant="outline"
                size="sm"
                className="border-slate-300"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
            </div>

            {/* Section 1: Overview */}
            <section className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">
                1. Campaign Overview
              </h2>
              <div className="space-y-4">
                <EditableField
                  label="Campaign Name"
                  value={plan.campaign_overview.platform_name}
                  onChange={(val) => updatePlan('campaign_overview.platform_name', val)}
                  className="text-xl font-semibold text-slate-900"
                />
                <EditableField
                  label="Tagline"
                  value={plan.campaign_overview.tagline}
                  onChange={(val) => updatePlan('campaign_overview.tagline', val)}
                  className="text-lg text-slate-700"
                />
                <EditableField
                  label="Big Idea"
                  value={plan.campaign_overview.big_idea}
                  onChange={(val) => updatePlan('campaign_overview.big_idea', val)}
                  multiline
                  className="text-slate-700"
                />
                <EditableList
                  label="Success Metrics"
                  items={plan.campaign_overview.success_metrics}
                  onChange={(items) => updatePlan('campaign_overview.success_metrics', items)}
                />
              </div>
            </section>

            {/* Section 2: Messaging Framework */}
            <section className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">
                2. Messaging Framework
              </h2>
              <div className="space-y-4">
                <EditableField
                  label="Primary Message"
                  value={plan.messaging_framework.primary_message}
                  onChange={(val) => updatePlan('messaging_framework.primary_message', val)}
                  className="text-lg font-medium text-slate-900"
                />
                <EditableList
                  label="Supporting Messages"
                  items={plan.messaging_framework.supporting_messages}
                  onChange={(items) => updatePlan('messaging_framework.supporting_messages', items)}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <EditableField
                      label="Call to Action"
                      value={plan.messaging_framework.call_to_action}
                      onChange={(val) => updatePlan('messaging_framework.call_to_action', val)}
                      className="font-medium text-slate-900"
                    />
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <EditableField
                      label="Elevator Pitch"
                      value={plan.messaging_framework.elevator_pitch}
                      onChange={(val) => updatePlan('messaging_framework.elevator_pitch', val)}
                      multiline
                      className="text-slate-700 text-sm"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Channels & Tactics */}
            <section className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">
                3. Channels & Tactics
              </h2>
              <div className="space-y-4">
                {plan.channels.map((channel, i) => (
                  <div key={i} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <EditableField
                        value={channel.channel}
                        onChange={(val) => {
                          const newChannels = [...plan.channels];
                          newChannels[i] = { ...newChannels[i], channel: val };
                          updatePlan('channels', newChannels);
                        }}
                        className="text-base font-semibold text-slate-900"
                      />
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        channel.priority === 'high' ? 'bg-red-100 text-red-700' :
                        channel.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {channel.priority} priority
                      </span>
                    </div>
                    <EditableField
                      label="Role"
                      value={channel.role}
                      onChange={(val) => {
                        const newChannels = [...plan.channels];
                        newChannels[i] = { ...newChannels[i], role: val };
                        updatePlan('channels', newChannels);
                      }}
                      className="text-slate-600 text-sm mb-3"
                    />
                    <EditableList
                      label="Tactics"
                      items={channel.tactics}
                      onChange={(items) => {
                        const newChannels = [...plan.channels];
                        newChannels[i] = { ...newChannels[i], tactics: items };
                        updatePlan('channels', newChannels);
                      }}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Section 4: Timeline */}
            <section className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">
                4. Timeline
              </h2>
              <div className="mb-4">
                <EditableField
                  label="Total Duration"
                  value={plan.timeline.total_duration}
                  onChange={(val) => updatePlan('timeline.total_duration', val)}
                  className="font-medium text-slate-900"
                />
              </div>
              <div className="space-y-4">
                {plan.timeline.phases.map((phase, i) => (
                  <div key={i} className="border-l-4 border-cyan-500 pl-4 py-2">
                    <div className="flex items-center gap-3 mb-2">
                      <EditableField
                        value={phase.phase_name}
                        onChange={(val) => {
                          const newPhases = [...plan.timeline.phases];
                          newPhases[i] = { ...newPhases[i], phase_name: val };
                          updatePlan('timeline.phases', newPhases);
                        }}
                        className="font-semibold text-slate-900"
                      />
                      <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded">
                        {phase.duration}
                      </span>
                    </div>
                    <EditableField
                      label="Focus"
                      value={phase.focus}
                      onChange={(val) => {
                        const newPhases = [...plan.timeline.phases];
                        newPhases[i] = { ...newPhases[i], focus: val };
                        updatePlan('timeline.phases', newPhases);
                      }}
                      className="text-slate-600 text-sm mb-2"
                    />
                    <EditableList
                      label="Key Activities"
                      items={phase.key_activities}
                      onChange={(items) => {
                        const newPhases = [...plan.timeline.phases];
                        newPhases[i] = { ...newPhases[i], key_activities: items };
                        updatePlan('timeline.phases', newPhases);
                      }}
                    />
                    <div className="mt-2">
                      <EditableList
                        label="Deliverables"
                        items={phase.deliverables}
                        onChange={(items) => {
                          const newPhases = [...plan.timeline.phases];
                          newPhases[i] = { ...newPhases[i], deliverables: items };
                          updatePlan('timeline.phases', newPhases);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 5: Assets */}
            <section className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">
                5. Required Assets
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 px-2 font-medium text-slate-600">Asset</th>
                      <th className="text-left py-2 px-2 font-medium text-slate-600">Type</th>
                      <th className="text-left py-2 px-2 font-medium text-slate-600">Channel</th>
                      <th className="text-left py-2 px-2 font-medium text-slate-600">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plan.assets.map((asset, i) => (
                      <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-2 px-2">
                          <div className="font-medium text-slate-900">{asset.asset_name}</div>
                          <div className="text-xs text-slate-500">{asset.description}</div>
                        </td>
                        <td className="py-2 px-2 text-slate-600">{asset.asset_type}</td>
                        <td className="py-2 px-2 text-slate-600">{asset.channel}</td>
                        <td className="py-2 px-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            asset.priority === 'must-have' 
                              ? 'bg-cyan-100 text-cyan-700' 
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {asset.priority}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 6: Budget */}
            <section className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">
                6. Budget Allocation
              </h2>
              <div className="mb-4">
                <p className="text-xs font-medium text-slate-500 uppercase mb-1">Budget Level</p>
                <p className="font-medium text-slate-900">{plan.budget_allocation.level}</p>
              </div>
              <EditableField
                label="Recommendation"
                value={plan.budget_allocation.recommendation}
                onChange={(val) => updatePlan('budget_allocation.recommendation', val)}
                multiline
                className="text-slate-700 mb-4"
              />
              <div className="space-y-2">
                {plan.budget_allocation.breakdown.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-100">
                    <div className="w-1/3 font-medium text-slate-900">{item.category}</div>
                    <div className="w-16 text-right font-semibold text-cyan-600">{item.percentage}%</div>
                    <div className="flex-grow text-slate-600 text-sm">{item.notes}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 7: Risks */}
            <section className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">
                7. Risks & Mitigations
              </h2>
              <div className="space-y-3">
                {plan.risks_and_mitigations.map((item, i) => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="text-xs font-medium text-red-600 uppercase mb-1">Risk</p>
                      <EditableField
                        value={item.risk}
                        onChange={(val) => {
                          const newRisks = [...plan.risks_and_mitigations];
                          newRisks[i] = { ...newRisks[i], risk: val };
                          updatePlan('risks_and_mitigations', newRisks);
                        }}
                        className="text-slate-700"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-green-600 uppercase mb-1">Mitigation</p>
                      <EditableField
                        value={item.mitigation}
                        onChange={(val) => {
                          const newRisks = [...plan.risks_and_mitigations];
                          newRisks[i] = { ...newRisks[i], mitigation: val };
                          updatePlan('risks_and_mitigations', newRisks);
                        }}
                        className="text-slate-700"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Document Footer */}
            <div className="text-center text-xs text-slate-400 py-4">
              <p>Internal Document • Last generated {new Date().toLocaleDateString()}</p>
              <p className="mt-1">Click on any text to edit</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CampaignPlan;
