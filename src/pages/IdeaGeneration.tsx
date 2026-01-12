import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Lightbulb } from "lucide-react";
import quantumLogo from "@/assets/quantum-logo.png";

const IdeaGeneration = () => {
  const location = useLocation();
  const campaignData = location.state;

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
              to="/campaign/input"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Campaign Input
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-4xl">
        <section className="text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <Lightbulb className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Idea Generation
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            This page is under construction. Campaign ideas based on your brief and brand
            framework selections will be generated here.
          </p>

          {campaignData?.brief?.campaignName && (
            <div className="bg-card rounded-xl border border-border p-6 shadow-md text-left max-w-md mx-auto">
              <h3 className="font-semibold text-foreground mb-2">Campaign Summary</h3>
              <p className="text-muted-foreground">
                <strong>Name:</strong> {campaignData.brief.campaignName}
              </p>
              {campaignData.brief.objective && (
                <p className="text-muted-foreground mt-1">
                  <strong>Objective:</strong> {campaignData.brief.objective}
                </p>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default IdeaGeneration;
