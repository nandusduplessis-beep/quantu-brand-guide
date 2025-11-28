import { useState, useEffect } from "react";
import SolutionsExplorer from "@/components/SolutionsExplorer";
import BrandCampaign from "@/components/BrandCampaign";
import CollectiveImpact from "@/components/CollectiveImpact";
import { EmailPopup } from "@/components/EmailPopup";
import { useToast } from "@/hooks/use-toast";
import quantumLogo from "@/assets/quantum-logo.png";
import iconMarketIntelligence from "@/assets/icon-market-intelligence.png";
import iconEcosystem from "@/assets/icon-ecosystem.png";
import iconAdvisory from "@/assets/icon-advisory.png";
import iconDiligence from "@/assets/icon-diligence.png";
import iconCampaigns from "@/assets/icon-campaigns.png";
import iconMedia from "@/assets/icon-media.png";
import iconThink from "@/assets/icon-think.png";
import iconFeel from "@/assets/icon-feel.png";
import iconDo from "@/assets/icon-do.png";

interface ArchetypeData {
  title: string;
  purpose: string;
  motto: string;
  expression: string;
}

interface ToneItem {
  element: string;
  sage: string;
  explorer: string;
}

interface StructureData {
  purpose: string;
  message: string;
}

const Index = () => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("identity");
  const [activeArchetype, setActiveArchetype] = useState<'sage' | 'explorer'>('sage');
  const [activeStructure, setActiveStructure] = useState<'what' | 'how' | 'solutions' | 'why'>('what');
  const [activeTab, setActiveTab] = useState<'tagline' | 'role' | 'summary'>('tagline');

  const copyColor = (color: string, name: string) => {
    navigator.clipboard.writeText(color);
    toast({
      title: "Color copied!",
      description: `${name} (${color}) copied to clipboard`,
    });
  };

  const appData = {
    archetypes: {
      sage: {
        title: "The Sage",
        purpose: "Help the world make sense of complexity.",
        motto: "'The truth will set you free — if you know how to use it.'",
        expression: "Objective, contextual, intelligent; credibility through clarity, not assertion.",
      },
      explorer: {
        title: "The Explorer",
        purpose: "Expand horizons and move industries forward.",
        motto: "'Don't tell me the world is limited; show me what's next.'",
        expression: "Curious, open, forward-looking; turns potential into tangible progress.",
      },
    },
    tone: [
      { element: "Voice", sage: "Calm, informed, analytical.", explorer: "Confident, energizing, forward-leaning." },
      { element: "Message", sage: "Grounded in data, validated by expertise.", explorer: "Focused on opportunity, progress, and potential." },
      { element: "Behavior", sage: "Clarifies, contextualizes, connects dots.", explorer: "Inspires, accelerates, enables action." },
      { element: "Audience Relationship", sage: "Mentor and guide.", explorer: "Catalyst and partner." },
    ],
    structure: {
      what: { purpose: "Deliver actionable market intelligence for deep tech decision-makers.", message: "Provide clarity and confidence for quantum technology decisions." },
      how: { purpose: "Combine real-time data with expert insight.", message: "A hybrid model that connects intelligence, context, and advisory expertise." },
      solutions: { purpose: "Six core solutions from Quantum Market Intelligence to News and Media platforms.", message: "A coherent progression: see, map, plan, validate, activate, amplify." },
      why: { purpose: "Move the quantum industry forward.", message: "Enable progress through confident, informed leadership." },
    },
    narrative: [
      "The Quantum Insider delivers <strong>market intelligence for deep tech decision-makers</strong> — providing the <strong>clarity and confidence</strong> to make the critical decisions shaping the future of quantum technology.",
      "We combine <strong>real-time data intelligence with strategic expertise</strong> to help organizations move from complexity to clarity and from insight to action. Our hybrid model unites a continuously updated data platform, deep domain expertise, and industry-informed advisory to guide research, investment, and commercialization decisions across the global quantum ecosystem.",
      "Every initiative is designed to transform intelligence into impact, ensuring that insight not only informs but <strong>advances the industry.</strong> Because in a field defined by potential and uncertainty, progress depends on decisions made with clarity, context, and confidence. That's what The Quantum Insider delivers — actionable quantum intelligence and bespoke solutions that move the industry forward.",
    ],
    definitions: {
      intro: "The Quantum Insider connects the global quantum ecosystem through <strong>actionable intelligence and bespoke solutions</strong> — helping decision-makers inside and beyond the field make quantum mainstream and build a better future for all.",
      tagline: "<strong>Actionable quantum intelligence and bespoke solutions</strong> — empowering confident decisions that move the industry forward.",
      role: "The Quantum Insider acts as the global <strong>interpreter and catalyst</strong> for the quantum industry — bringing <strong>understanding, direction, and momentum</strong> to a technology that will redefine our future.",
      summary: "The Quantum Insider connects the global quantum ecosystem through <strong>actionable intelligence and bespoke solutions</strong> — helping decision-makers inside and beyond the field make quantum mainstream and build a better future for all.",
    },
    perspective: "The Quantum Insider <strong>bridges every part of the global quantum ecosystem</strong> — connecting innovators, investors, and institutions through intelligence, context, and collaboration. By making complex information clear, actionable, and aligned with real-world goals, TQI ensures that quantum becomes not just a field of research, but a <strong>driver of mainstream technological progress.</strong> We believe quantum is critical to a better future for all — and our role is to help the world get there with clarity and confidence.",
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      let current = "identity";

      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop <= 100) {
          current = section.getAttribute("id") || "identity";
        }
      });

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border shadow-sm">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src={quantumLogo} alt="The Quantum Insider" className="h-8 md:h-10" />
            </div>
            <div className="hidden md:flex items-baseline space-x-1">
              {[
                { id: "identity", label: "Core Identity" },
                { id: "strategy", label: "Strategy" },
                { id: "messaging", label: "Messaging" },
                { id: "perspective", label: "Perspective" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    activeSection === item.id
                      ? "text-primary font-semibold border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Introduction */}
        <section className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">Interactive Brand Framework</h2>
          <p
            className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: appData.definitions.intro }}
          />
        </section>

        {/* Section 1: Core Identity */}
        <section id="identity" className="mb-20 pt-16 -mt-16 scroll-mt-16">
          <h3 className="text-2xl md:text-4xl font-bold text-foreground border-l-4 border-primary pl-4 mb-3 animate-slide-in">
            I. Core Identity & Foundation
          </h3>
          <p className="text-muted-foreground mb-8 max-w-4xl">
            This section defines the fundamental essence of The Quantum Insider. It explores our purpose, our personality through brand archetypes, and how that personality translates into our tone and behavior. This is the 'who we are' at our core.
          </p>

          <div className="bg-card p-6 rounded-xl shadow-md mb-8 border border-border hover:shadow-lg transition-shadow">
            <h4 className="font-bold text-xl text-foreground mb-2">Purpose</h4>
            <p className="text-lg text-foreground">
              Empowering quantum tech advancement by making market intelligence <strong>accessible and understandable.</strong>
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-md border border-border hover:shadow-lg transition-shadow">
            <h4 className="font-bold text-xl text-foreground mb-4">Brand Archetype: The Sage with the Explorer Edge</h4>
            <p className="text-muted-foreground mb-6">
              Our brand personality is a blend of two archetypes. The Sage provides our core of truth and understanding, while The Explorer adds a layer of discovery and forward momentum. Select an archetype below to explore its role.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col space-y-4 md:col-span-1">
                <button
                  onClick={() => setActiveArchetype("sage")}
                  className={`text-left p-4 rounded-lg font-semibold transition-all duration-300 ${
                    activeArchetype === "sage"
                      ? "bg-primary text-primary-foreground shadow-lg scale-105"
                      : "bg-background text-primary border border-muted hover:bg-accent"
                  }`}
                >
                  The Sage
                </button>
                <button
                  onClick={() => setActiveArchetype("explorer")}
                  className={`text-left p-4 rounded-lg font-semibold transition-all duration-300 ${
                    activeArchetype === "explorer"
                      ? "bg-primary text-primary-foreground shadow-lg scale-105"
                      : "bg-background text-primary border border-muted hover:bg-accent"
                  }`}
                >
                  The Explorer
                </button>
              </div>
              <div className="md:col-span-2 bg-accent/20 p-6 rounded-lg border border-border animate-fade-in">
                <h5 className="font-bold text-lg text-foreground mb-2">{appData.archetypes[activeArchetype].title}</h5>
                <div className="space-y-3">
                  <p>
                    <strong className="text-muted-foreground">Purpose:</strong> {appData.archetypes[activeArchetype].purpose}
                  </p>
                  <p>
                    <strong className="text-muted-foreground">Motto:</strong> <em className="text-muted-foreground">{appData.archetypes[activeArchetype].motto}</em>
                  </p>
                  <p>
                    <strong className="text-muted-foreground">Expression:</strong> {appData.archetypes[activeArchetype].expression}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-md mt-8 border border-border hover:shadow-lg transition-shadow">
            <h4 className="font-bold text-xl text-foreground mb-4">Tone and Behavior</h4>
            <p className="text-muted-foreground mb-4">
              Our tone balances Sage intelligence with Explorer momentum—informing with authority while inspiring possibility. This grid shows how our dual archetype guides our communication.
            </p>
            <div className="bg-accent/10 p-4 rounded-lg mb-6 border-l-4 border-primary">
              <p className="text-sm text-foreground">
                <strong>Communication Principles:</strong> Be accessible and clear. Be data-driven and insightful. Be enabling and forward-thinking. Every message empowers audiences with knowledge that drives innovation.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {appData.tone.map((item, idx) => (
                <div key={idx} className="bg-accent/20 p-4 rounded-lg border border-border hover:bg-accent/30 transition-colors">
                  <h5 className="font-semibold text-foreground mb-3">{item.element}</h5>
                  <div className="text-left space-y-2 text-sm">
                    <p>
                      <strong className="text-primary">Sage:</strong> {item.sage}
                    </p>
                    <p>
                      <strong className="text-accent-foreground">Explorer:</strong> {item.explorer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Visual Identity Section */}
        <section className="mb-20">
          <h3 className="text-2xl md:text-4xl font-bold text-foreground border-l-4 border-primary pl-4 mb-3 animate-slide-in">
            Visual Identity
          </h3>
          <p className="text-muted-foreground mb-8 max-w-4xl">
            Our visual identity reflects our commitment to clarity, innovation, and accessibility. Every design element—from our logo to our color palette—is purposefully crafted to communicate quantum intelligence with confidence and sophistication.
          </p>

          {/* Logo & Symbolism */}
          <div className="bg-card p-6 rounded-xl shadow-md mb-8 border border-border hover:shadow-lg transition-shadow">
            <h4 className="font-bold text-xl text-foreground mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Logo & Brand Mark
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-center bg-accent/10 p-8 rounded-lg">
                <img src={quantumLogo} alt="The Quantum Insider Logo" className="max-h-24 w-auto" />
              </div>
              <div className="space-y-3">
                <p className="text-foreground">
                  <strong>Symbolism:</strong> The Resonance logo features three nested hexagons representing the integration of emerging technology sectors, layered intelligence gathering, and expanding accessibility of complex information.
                </p>
                <p className="text-muted-foreground text-sm">
                  The hexagonal motif symbolizes strength and interconnectedness, paired with bold typography that reflects our modern, data-driven approach to quantum intelligence.
                </p>
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div className="bg-card p-6 rounded-xl shadow-md mb-8 border border-border hover:shadow-lg transition-shadow">
            <h4 className="font-bold text-xl text-foreground mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Color Palette
            </h4>
            <p className="text-muted-foreground mb-6">
              We use classic black and white for our primary colors, contrasted by cool and warm tones. Our Quantum teal represents innovation and clarity, while Resonance colors provide depth and authority.
            </p>
            
            <div className="space-y-6">
              {/* Quantum Colors */}
              <div>
                <h5 className="font-semibold text-foreground mb-3">Quantum Insider Primary</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="group cursor-pointer" onClick={() => copyColor('#0aa0ab', 'Quantum Teal')}>
                    <div className="h-24 rounded-lg shadow-md transition-all hover:scale-105 hover:shadow-xl" style={{ backgroundColor: '#0aa0ab' }}></div>
                    <p className="text-sm font-mono mt-2 text-foreground">#0aa0ab</p>
                    <p className="text-xs text-muted-foreground">Quantum Teal</p>
                    <p className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">Click to copy</p>
                  </div>
                  <div className="group cursor-pointer" onClick={() => copyColor('#040620', 'Deep Navy')}>
                    <div className="h-24 rounded-lg shadow-md transition-all hover:scale-105 hover:shadow-xl" style={{ backgroundColor: '#040620' }}></div>
                    <p className="text-sm font-mono mt-2 text-foreground">#040620</p>
                    <p className="text-xs text-muted-foreground">Deep Navy</p>
                    <p className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">Click to copy</p>
                  </div>
                  <div className="group cursor-pointer" onClick={() => copyColor('#bec1c9', 'Neutral Gray')}>
                    <div className="h-24 rounded-lg shadow-md border border-border transition-all hover:scale-105 hover:shadow-xl" style={{ backgroundColor: '#bec1c9' }}></div>
                    <p className="text-sm font-mono mt-2 text-foreground">#bec1c9</p>
                    <p className="text-xs text-muted-foreground">Neutral Gray</p>
                    <p className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">Click to copy</p>
                  </div>
                  <div className="group cursor-pointer" onClick={() => copyColor('#0014f0', 'Resonance Blue')}>
                    <div className="h-24 rounded-lg shadow-md transition-all hover:scale-105 hover:shadow-xl" style={{ backgroundColor: '#0014f0' }}></div>
                    <p className="text-sm font-mono mt-2 text-foreground">#0014f0</p>
                    <p className="text-xs text-muted-foreground">Resonance Blue</p>
                    <p className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">Click to copy</p>
                  </div>
                </div>
              </div>

              {/* Gradient Examples */}
              <div>
                <h5 className="font-semibold text-foreground mb-3">Signature Gradients</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-24 rounded-lg shadow-md transition-all hover:scale-105 hover:shadow-xl" 
                       style={{ background: 'linear-gradient(135deg, #0aa0ab, #6dd5ed)' }}>
                    <div className="h-full flex items-center justify-center">
                      <p className="text-white font-semibold">Quantum Gradient</p>
                    </div>
                  </div>
                  <div className="h-24 rounded-lg shadow-md transition-all hover:scale-105 hover:shadow-xl" 
                       style={{ background: 'linear-gradient(135deg, #0014f0, #0aa0ab)' }}>
                    <div className="h-full flex items-center justify-center">
                      <p className="text-white font-semibold">Resonance Gradient</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="bg-card p-6 rounded-xl shadow-md mb-8 border border-border hover:shadow-lg transition-shadow">
            <h4 className="font-bold text-xl text-foreground mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Typography System
            </h4>
            <p className="text-muted-foreground mb-6">
              Our font choice embodies professionalism and timelessness with legible and distinct characters. Roboto provides a pleasant reading experience through substantial and inviting content.
            </p>
            
            <div className="space-y-6">
              <div className="bg-accent/10 p-6 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Headings - Roboto Bold</p>
                <h1 className="text-4xl font-bold text-foreground mb-2">ABCDEFGHIJKLMNOPQRSTUVWXYZ</h1>
                <p className="text-muted-foreground text-sm">abcdefghijklmnopqrstuvwxyz 1234567890</p>
              </div>
              <div className="bg-accent/10 p-6 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Body Text - Roboto Regular</p>
                <p className="text-lg text-foreground">
                  The Quantum Insider delivers market intelligence for deep tech decision-makers — providing the clarity and confidence to make critical decisions shaping the future of quantum technology.
                </p>
              </div>
              
              {/* Typography Scale */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-accent/10 p-4 rounded-lg">
                  <p className="text-4xl font-bold text-foreground">Large Heading</p>
                  <p className="text-xs text-muted-foreground mt-1">48px / Bold</p>
                </div>
                <div className="bg-accent/10 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-foreground">Medium Title</p>
                  <p className="text-xs text-muted-foreground mt-1">24px / Bold</p>
                </div>
                <div className="bg-accent/10 p-4 rounded-lg">
                  <p className="text-lg text-foreground">Body Large</p>
                  <p className="text-xs text-muted-foreground mt-1">18px / Regular</p>
                </div>
                <div className="bg-accent/10 p-4 rounded-lg">
                  <p className="text-base text-foreground">Body Regular</p>
                  <p className="text-xs text-muted-foreground mt-1">16px / Regular</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Principles */}
          <div className="bg-card p-6 rounded-xl shadow-md border border-border hover:shadow-lg transition-shadow">
            <h4 className="font-bold text-xl text-foreground mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Visual Design Principles
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-accent/10 p-5 rounded-lg border-l-4 border-primary">
                <h5 className="font-semibold text-foreground mb-2">Clarity First</h5>
                <p className="text-sm text-muted-foreground">
                  Every visual element serves to simplify complex quantum concepts, making them immediately understandable.
                </p>
              </div>
              <div className="bg-accent/10 p-5 rounded-lg border-l-4 border-primary">
                <h5 className="font-semibold text-foreground mb-2">Data Visualization</h5>
                <p className="text-sm text-muted-foreground">
                  Clean, informative graphics that transform data into actionable insights with precision and elegance.
                </p>
              </div>
              <div className="bg-accent/10 p-5 rounded-lg border-l-4 border-primary">
                <h5 className="font-semibold text-foreground mb-2">Professional Warmth</h5>
                <p className="text-sm text-muted-foreground">
                  Balanced aesthetics that convey authority while remaining approachable and human-centered.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="mb-20">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">Core Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card p-8 rounded-xl shadow-md border border-border hover:shadow-lg transition-all hover:scale-105">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h4 className="font-bold text-xl text-foreground mb-3 text-center">Accessible</h4>
              <p className="text-muted-foreground text-center">
                We break down barriers to understanding complex technologies, translating quantum concepts into understandable language.
              </p>
            </div>
            <div className="bg-card p-8 rounded-xl shadow-md border border-border hover:shadow-lg transition-all hover:scale-105">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="font-bold text-xl text-foreground mb-3 text-center">Data-Driven</h4>
              <p className="text-muted-foreground text-center">
                We harness the power of AI and real-time data analytics to deliver precise, actionable intelligence backed by robust data.
              </p>
            </div>
            <div className="bg-card p-8 rounded-xl shadow-md border border-border hover:shadow-lg transition-all hover:scale-105">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-bold text-xl text-foreground mb-3 text-center">Enable</h4>
              <p className="text-muted-foreground text-center">
                We empower organizations to thrive in the quantum landscape with knowledge that drives innovation and confident decision-making.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Strategy */}
        <section id="strategy" className="mb-20 pt-16 -mt-16 scroll-mt-16">
          <h3 className="text-2xl md:text-4xl font-bold text-foreground border-l-4 border-primary pl-4 mb-3 animate-slide-in">
            II. Strategic Context & Application
          </h3>
          <p className="text-muted-foreground mb-8 max-w-4xl">
            Here, we define our strategic position. This includes our specific role within the broader Resonance ecosystem, the implications of that role, and the framework for how we deliver our value to the market. This is the 'where we fit' and 'what we do'.
          </p>

          <div className="bg-card p-6 rounded-xl shadow-md mb-8 border border-border hover:shadow-lg transition-shadow">
            <h4 className="font-bold text-xl text-foreground mb-4">Brand Role in the Ecosystem</h4>
            <p className="text-muted-foreground mb-6">
              The Quantum Insider exists within the Resonance ecosystem - bridging the gap between complex emerging technologies and industry decision-makers. This diagram illustrates our distinct but complementary roles.
            </p>
            <div className="flex flex-col md:flex-row gap-6 items-stretch">
              <div className="flex-1 bg-accent/20 border-2 border-accent p-6 rounded-xl text-center hover:scale-105 transition-transform">
                <h5 className="font-bold text-lg text-foreground">Resonance (Parent)</h5>
                <p className="text-2xl font-semibold text-primary my-2">The Architect</p>
                <p className="text-muted-foreground mb-3">
                  Designs clarity across deep tech sectors (AI, Space, Climate, Quantum).
                </p>
                <p className="text-sm text-muted-foreground italic">
                  "Empowering global industries by making emerging tech universally accessible through our innovative intelligence ecosystem."
                </p>
              </div>
              <div className="flex-1 bg-primary/10 border-2 border-primary p-6 rounded-xl text-center hover:scale-105 transition-transform">
                <h5 className="font-bold text-lg text-foreground">TQI (Quantum Insider)</h5>
                <p className="text-2xl font-semibold text-primary my-2">The Interpreter</p>
                <p className="text-muted-foreground mb-3">
                  Makes quantum understandable, actionable, and commercially relevant.
                </p>
                <p className="text-sm text-primary font-semibold">powered by Resonance</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-md mb-8 border border-border hover:shadow-lg transition-shadow">
            <h4 className="font-bold text-xl text-foreground mb-4">Structure Overview (What We Deliver)</h4>
            <p className="text-muted-foreground mb-6">
              Our value is delivered through a structured, multi-layered approach. Click on each quadrant below to see how we progress from insight to action and enable confident leadership in the quantum industry.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="md:col-span-2 bg-accent/20 p-6 rounded-lg border border-border flex flex-col justify-center animate-fade-in">
                <h5 className="font-bold text-lg text-foreground mb-2">Purpose</h5>
                <p className="text-muted-foreground mb-4">{appData.structure[activeStructure].purpose}</p>
                <h5 className="font-bold text-lg text-foreground mb-2">Core Message</h5>
                <p className="text-muted-foreground">{appData.structure[activeStructure].message}</p>
              </div>
              <div className="md:col-span-3 grid grid-cols-2 gap-4">
                {(["what", "how", "solutions", "why"] as const).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveStructure(key)}
                    className={`rounded-lg p-6 flex items-center justify-center text-center font-semibold transition-all duration-300 ${
                      activeStructure === key
                        ? "bg-primary text-primary-foreground shadow-xl scale-105"
                        : "bg-accent/30 text-foreground hover:bg-accent/50 hover:scale-102"
                    }`}
                  >
                    {key === "what" && "What we do"}
                    {key === "how" && "How we do it"}
                    {key === "solutions" && "Solutions"}
                    {key === "why" && "Why it matters"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Messaging */}
        <section id="messaging" className="mb-20 pt-16 -mt-16 scroll-mt-16">
          <h3 className="text-2xl md:text-4xl font-bold text-foreground border-l-4 border-primary pl-4 mb-3 animate-slide-in">
            III. External Messaging & Definitions
          </h3>
          <p className="text-muted-foreground mb-8 max-w-4xl">
            This section provides the specific language we use to communicate our brand. It includes our core narrative and a series of concise definitions for different contexts. This is 'how we talk' about ourselves.
          </p>

          <div className="bg-card p-6 rounded-xl shadow-md mb-8 border border-border hover:shadow-lg transition-shadow">
            <h4 className="font-bold text-xl text-foreground mb-4">Brand Narrative</h4>
            <div className="space-y-4 text-foreground">
              {appData.narrative.map((paragraph, idx) => (
                <p key={idx} dangerouslySetInnerHTML={{ __html: paragraph }} />
              ))}
            </div>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-md border border-border hover:shadow-lg transition-shadow">
            <h4 className="font-bold text-xl text-foreground mb-4">Key Definitions</h4>
            <p className="text-muted-foreground mb-6">These are our core messaging statements, tailored for different uses. Click a tab to view each one.</p>
            <div className="flex border-b border-border mb-4">
              {(["tagline", "role", "summary"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-6 font-semibold border-b-2 transition-all duration-300 ${
                    activeTab === tab
                      ? "bg-accent text-foreground border-primary"
                      : "bg-transparent text-muted-foreground border-transparent hover:text-foreground"
                  }`}
                >
                  {tab === "tagline" && "Tagline"}
                  {tab === "role" && "One-Line Role"}
                  {tab === "summary" && "Final Summary"}
                </button>
              ))}
            </div>
            <div className="p-6 bg-accent/20 rounded-lg animate-fade-in">
              <p className="text-lg text-foreground" dangerouslySetInnerHTML={{ __html: appData.definitions[activeTab] }} />
            </div>
          </div>
        </section>

        {/* Section 4: Perspective */}
        <section id="perspective" className="pt-16 -mt-16 scroll-mt-16 mb-12">
          <h3 className="text-2xl md:text-4xl font-bold text-foreground border-l-4 border-primary pl-4 mb-3 animate-slide-in">
            IV. Defining Perspective
          </h3>
          <p className="text-muted-foreground mb-8 max-w-4xl">
            This is our ultimate vision. It encapsulates our belief in the future of quantum technology and our role in helping the world realize that future with clarity and confidence. It's our 'north star'.
          </p>
          <div className="bg-gradient-to-br from-primary to-accent p-8 md:p-12 rounded-xl shadow-2xl">
            <p className="text-xl md:text-2xl leading-relaxed text-primary-foreground" dangerouslySetInnerHTML={{ __html: appData.perspective }} />
          </div>
        </section>

        {/* Section 5: Solutions Explorer */}
        <SolutionsExplorer />

        {/* Section 6: Brand Campaign */}
        <BrandCampaign />

        {/* Section 7: Collective Impact */}
        <CollectiveImpact />
      </main>

      <footer className="text-center py-12 border-t border-border bg-card">
        <div className="container mx-auto px-4">
          <p className="text-foreground font-semibold mb-2">The Quantum Insider - Interactive Brand Framework</p>
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <span>powered by</span>
            <span className="font-bold text-primary">Resonance</span>
          </p>
        </div>
      </footer>

      <EmailPopup />
    </div>
  );
};

export default Index;
