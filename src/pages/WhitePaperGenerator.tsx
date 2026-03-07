import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Upload,
  BookOpen,
  Sparkles,
  FileDown,
  BarChart3,
  Zap,
  ChevronRight,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import FileUpload from "@/components/FileUpload";
import { supabase } from "@/integrations/supabase/client";
import quantumLogo from "@/assets/quantum-logo.png";
import {
  templates,
  contentModes,
  type WhitePaperTemplate,
  type ContentMode,
} from "@/lib/whitepaper-templates";

interface UploadedFile {
  name: string;
  url: string;
  type: string;
  size: number;
}

const templateIcons: Record<string, React.ReactNode> = {
  "executive-whitepaper": <FileText className="w-6 h-6" />,
  "technical-deep-dive": <BarChart3 className="w-6 h-6" />,
  "lead-magnet": <Zap className="w-6 h-6" />,
  "industry-brief": <FileDown className="w-6 h-6" />,
  "research-report": <BookOpen className="w-6 h-6" />,
};

const modeIcons: Record<ContentMode, React.ReactNode> = {
  "direct-copy": <FileText className="w-5 h-5" />,
  condense: <Sparkles className="w-5 h-5" />,
  "lead-magnet": <Zap className="w-5 h-5" />,
};

const WhitePaperGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedTemplate, setSelectedTemplate] =
    useState<WhitePaperTemplate | null>(null);
  const [contentMode, setContentMode] = useState<ContentMode | "">("");
  const [title, setTitle] = useState("");
  const [sourceType, setSourceType] = useState<"paste" | "upload">("paste");
  const [pastedContent, setPastedContent] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const canProceedStep1 = selectedTemplate !== null;
  const canProceedStep2 = contentMode !== "";
  const canProceedStep3 =
    title.trim() !== "" &&
    (sourceType === "paste"
      ? pastedContent.trim().length > 50
      : uploadedFiles.length > 0);

  const handleGenerate = async () => {
    if (!selectedTemplate || !contentMode || !canProceedStep3) return;

    setIsGenerating(true);

    try {
      let content = pastedContent;

      // If files were uploaded, fetch their content
      if (sourceType === "upload" && uploadedFiles.length > 0) {
        // For uploaded files, we pass the URL — the edge function or client
        // would need to fetch the file content. For now, we'll notify the user
        // to paste content if file parsing isn't available.
        content = `[Uploaded file: ${uploadedFiles.map((f) => f.name).join(", ")}]\n\nFile URL(s): ${uploadedFiles.map((f) => f.url).join("\n")}`;
      }

      const { data, error } = await supabase.functions.invoke(
        "generate-whitepaper",
        {
          body: {
            content,
            template: selectedTemplate,
            contentMode,
            title,
            additionalInstructions: additionalInstructions || undefined,
          },
        }
      );

      if (error) {
        throw new Error(error.message || "Failed to generate white paper");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (!data?.whitepaper) {
        throw new Error("No white paper data received");
      }

      toast({
        title: "White paper generated!",
        description: `"${data.whitepaper.title}" is ready to preview.`,
      });

      navigate("/whitepaper/preview", {
        state: {
          whitepaper: data.whitepaper,
          template: selectedTemplate,
          contentMode,
        },
      });
    } catch (err) {
      console.error("Generation error:", err);
      toast({
        title: "Generation failed",
        description:
          err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
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
              to="/"
              className="flex items-center gap-2 text-cyan-300 hover:text-white text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Framework
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-6xl">
        {/* Title */}
        <section className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            White Paper & Lead Magnet Generator
          </h1>
          <p className="text-cyan-200/80 max-w-2xl mx-auto text-sm">
            Upload your content, choose a template, and generate a branded TQI
            document in minutes.
          </p>
        </section>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[
            { num: 1, label: "Template" },
            { num: 2, label: "Mode" },
            { num: 3, label: "Content" },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (s.num === 1) setStep(1);
                  if (s.num === 2 && canProceedStep1) setStep(2);
                  if (s.num === 3 && canProceedStep1 && canProceedStep2)
                    setStep(3);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  step === s.num
                    ? "bg-cyan-500 text-slate-900"
                    : step > s.num
                      ? "bg-cyan-500/30 text-cyan-300"
                      : "bg-slate-700/50 text-slate-400"
                }`}
              >
                {step > s.num ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center text-xs">
                    {s.num}
                  </span>
                )}
                {s.label}
              </button>
              {i < 2 && (
                <ChevronRight className="w-4 h-4 text-slate-500" />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Template Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white mb-4">
              Choose a Template
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`text-left p-5 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                    selectedTemplate?.id === template.id
                      ? "bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/20"
                      : "bg-slate-800/60 border-slate-600/50 hover:border-cyan-500/50"
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className={`p-2 rounded-lg ${
                        selectedTemplate?.id === template.id
                          ? "bg-cyan-500 text-slate-900"
                          : "bg-slate-700 text-cyan-400"
                      }`}
                    >
                      {templateIcons[template.id]}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-sm">
                        {template.name}
                      </h3>
                      <span className="text-xs text-cyan-400">
                        {template.pageEstimate}
                      </span>
                    </div>
                    {selectedTemplate?.id === template.id && (
                      <Check className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {template.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {template.sections
                      .filter((s) => s.required)
                      .slice(0, 4)
                      .map((s) => (
                        <span
                          key={s.id}
                          className="text-xs px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-300"
                        >
                          {s.name}
                        </span>
                      ))}
                    {template.sections.filter((s) => s.required).length > 4 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-300">
                        +
                        {template.sections.filter((s) => s.required).length - 4}{" "}
                        more
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {selectedTemplate && (
              <div className="flex justify-center mt-6">
                <Button
                  onClick={() => setStep(2)}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-900 font-semibold hover:from-cyan-400 hover:to-cyan-300 shadow-lg shadow-cyan-500/30"
                >
                  Continue with {selectedTemplate.name}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Content Mode */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setStep(1)}
                className="text-cyan-400 hover:text-cyan-300 text-sm"
              >
                Template: {selectedTemplate?.name}
              </button>
              <ChevronRight className="w-4 h-4 text-slate-500" />
              <span className="text-white font-semibold text-sm">
                Processing Mode
              </span>
            </div>

            <h2 className="text-lg font-semibold text-white mb-4">
              How should we process your content?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {contentModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setContentMode(mode.id)}
                  className={`text-left p-6 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                    contentMode === mode.id
                      ? "bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/20"
                      : "bg-slate-800/60 border-slate-600/50 hover:border-cyan-500/50"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`p-2 rounded-lg ${
                        contentMode === mode.id
                          ? "bg-cyan-500 text-slate-900"
                          : "bg-slate-700 text-cyan-400"
                      }`}
                    >
                      {modeIcons[mode.id]}
                    </div>
                    <h3 className="font-semibold text-white text-sm">
                      {mode.name}
                    </h3>
                    {contentMode === mode.id && (
                      <Check className="w-5 h-5 text-cyan-400 ml-auto" />
                    )}
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {mode.description}
                  </p>
                </button>
              ))}
            </div>

            {contentMode && (
              <div className="flex justify-center mt-6">
                <Button
                  onClick={() => setStep(3)}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-900 font-semibold hover:from-cyan-400 hover:to-cyan-300 shadow-lg shadow-cyan-500/30"
                >
                  Continue to content upload
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Content Upload & Generate */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <button
                onClick={() => setStep(1)}
                className="text-cyan-400 hover:text-cyan-300 text-sm"
              >
                {selectedTemplate?.name}
              </button>
              <ChevronRight className="w-4 h-4 text-slate-500" />
              <button
                onClick={() => setStep(2)}
                className="text-cyan-400 hover:text-cyan-300 text-sm"
              >
                {contentModes.find((m) => m.id === contentMode)?.name}
              </button>
              <ChevronRight className="w-4 h-4 text-slate-500" />
              <span className="text-white font-semibold text-sm">
                Upload Content
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main content area */}
              <div className="lg:col-span-2 space-y-4">
                {/* Title */}
                <div className="bg-slate-800/60 rounded-xl border border-cyan-500/20 p-5">
                  <Label className="font-medium text-white/90 mb-2 block">
                    Document Title{" "}
                    <span className="text-cyan-300">*</span>
                  </Label>
                  <Input
                    placeholder="e.g., The State of Quantum Computing 2026"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-slate-700/50 border-cyan-500/30 text-white placeholder:text-slate-400"
                  />
                </div>

                {/* Source Content */}
                <div className="bg-slate-800/60 rounded-xl border border-cyan-500/20 p-5">
                  <Label className="font-medium text-white/90 mb-3 block">
                    Source Content{" "}
                    <span className="text-cyan-300">*</span>
                  </Label>

                  {/* Toggle */}
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => setSourceType("paste")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        sourceType === "paste"
                          ? "bg-cyan-500 text-slate-900"
                          : "bg-slate-700/50 text-white/70 hover:bg-slate-700"
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      Paste Text
                    </button>
                    <button
                      onClick={() => setSourceType("upload")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        sourceType === "upload"
                          ? "bg-cyan-500 text-slate-900"
                          : "bg-slate-700/50 text-white/70 hover:bg-slate-700"
                      }`}
                    >
                      <Upload className="w-4 h-4" />
                      Upload File
                    </button>
                  </div>

                  {sourceType === "paste" ? (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Paste your document content here — from a Word doc, Google Doc, report, book chapter, or any text source..."
                        value={pastedContent}
                        onChange={(e) => setPastedContent(e.target.value)}
                        rows={16}
                        className="bg-slate-700/50 border-cyan-500/30 text-white placeholder:text-slate-400 font-mono text-sm"
                      />
                      <p className="text-xs text-slate-500">
                        {pastedContent.length > 0
                          ? `${pastedContent.split(/\s+/).filter(Boolean).length} words`
                          : "Minimum 50 characters required"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <FileUpload
                        files={uploadedFiles}
                        onFilesChange={setUploadedFiles}
                        folder="whitepaper-source"
                        multiple={false}
                        accept=".pdf,.doc,.docx,.txt,.rtf"
                        maxSizeMB={30}
                      />
                      <div className="bg-slate-700/30 rounded-lg p-3 border border-cyan-500/10">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-slate-400">
                            For best results, paste your content as text. File
                            upload works with PDF, DOC, DOCX, TXT, and RTF
                            files up to 30MB.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Template Summary */}
                <div className="bg-slate-800/60 rounded-xl border border-cyan-500/20 p-5">
                  <h3 className="text-sm font-semibold text-white mb-3">
                    Generation Summary
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-cyan-500/20">
                        {templateIcons[selectedTemplate?.id || ""]}
                      </div>
                      <div>
                        <p className="text-white font-medium text-xs">
                          {selectedTemplate?.name}
                        </p>
                        <p className="text-slate-400 text-xs">
                          {selectedTemplate?.pageEstimate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-cyan-500/20">
                        {modeIcons[contentMode as ContentMode]}
                      </div>
                      <div>
                        <p className="text-white font-medium text-xs">
                          {
                            contentModes.find((m) => m.id === contentMode)
                              ?.name
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sections Preview */}
                <div className="bg-slate-800/60 rounded-xl border border-cyan-500/20 p-5">
                  <h3 className="text-sm font-semibold text-white mb-3">
                    Output Sections
                  </h3>
                  <div className="space-y-1.5">
                    {selectedTemplate?.sections.map((section) => (
                      <div
                        key={section.id}
                        className="flex items-center gap-2 text-xs"
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            section.required
                              ? "bg-cyan-400"
                              : "bg-slate-500"
                          }`}
                        />
                        <span
                          className={
                            section.required
                              ? "text-white/80"
                              : "text-slate-500"
                          }
                        >
                          {section.name}
                        </span>
                        {!section.required && (
                          <span className="text-slate-600 text-[10px]">
                            optional
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Instructions */}
                <div className="bg-slate-800/60 rounded-xl border border-cyan-500/20 p-5">
                  <Label className="font-medium text-white/90 mb-2 block text-sm">
                    Additional Instructions
                  </Label>
                  <Textarea
                    placeholder="Any specific tone, emphasis, or formatting preferences..."
                    value={additionalInstructions}
                    onChange={(e) =>
                      setAdditionalInstructions(e.target.value)
                    }
                    rows={3}
                    className="bg-slate-700/50 border-cyan-500/30 text-white placeholder:text-slate-400 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex justify-center mt-8">
              <Button
                onClick={handleGenerate}
                disabled={!canProceedStep3 || isGenerating}
                size="lg"
                className="px-10 py-4 text-base font-semibold bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-900 hover:from-cyan-400 hover:to-cyan-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/40 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating your {selectedTemplate?.name}...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate {selectedTemplate?.name}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default WhitePaperGenerator;
