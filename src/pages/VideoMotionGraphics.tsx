import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Film, Layers, Type, Palette, Sparkles, Monitor } from "lucide-react";
import quantumLogo from "@/assets/quantum-logo.png";
import LogoReveal from "@/components/motion/LogoReveal";
import ColorPulse from "@/components/motion/ColorPulse";
import TypographyMotion from "@/components/motion/TypographyMotion";
import GradientFlow from "@/components/motion/GradientFlow";
import ParticleField from "@/components/motion/ParticleField";
import TransitionShowcase from "@/components/motion/TransitionShowcase";

const VideoMotionGraphics = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border shadow-sm">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src={quantumLogo} alt="The Quantum Insider" className="h-8 md:h-10" />
            </div>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Brand Guide
            </button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Hero */}
        <section className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
            <Film className="w-4 h-4" />
            Video & Motion Graphics Guidelines
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Motion Design System
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
            A comprehensive guide to animated brand elements for The Quantum Insider.
            Every motion pattern is designed to reinforce clarity, innovation, and the
            precision of quantum intelligence.
          </p>
        </section>

        {/* Motion Principles */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground border-l-4 border-primary pl-4 mb-3">
            Motion Principles
          </h2>
          <p className="text-muted-foreground mb-8 max-w-4xl">
            All TQI motion design follows these core principles to maintain brand consistency across video, social media, presentations, and web experiences.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: "Purposeful",
                desc: "Every animation serves a function — guiding attention, revealing information, or reinforcing hierarchy. No gratuitous movement.",
              },
              {
                icon: <Layers className="w-6 h-6" />,
                title: "Layered",
                desc: "Animations build progressively, mirroring our hexagonal logo's nested layers. Stagger elements to create depth and rhythm.",
              },
              {
                icon: <Monitor className="w-6 h-6" />,
                title: "Smooth",
                desc: "Use ease-out curves for entrances and ease-in for exits. Avoid linear timing. Transitions should feel natural and fluid.",
              },
              {
                icon: <Play className="w-6 h-6" />,
                title: "Restrained",
                desc: "Motion duration between 0.3s–0.8s for UI elements. Video transitions 0.5s–2s. Never exceed 3s for any single animation.",
              },
            ].map((principle, i) => (
              <div
                key={i}
                className="bg-card p-6 rounded-xl shadow-md border border-border hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                  {principle.icon}
                </div>
                <h3 className="font-bold text-foreground mb-2">{principle.title}</h3>
                <p className="text-sm text-muted-foreground">{principle.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Timing & Easing Reference */}
        <section className="mb-16">
          <div className="bg-card p-6 rounded-xl shadow-md border border-border">
            <h3 className="font-bold text-xl text-foreground mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Timing & Easing Reference
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Element</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Duration</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Easing</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Stagger</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { el: "UI Micro-interactions", dur: "0.15–0.3s", ease: "ease-out", stagger: "—" },
                    { el: "Content entrances", dur: "0.4–0.6s", ease: "ease-out", stagger: "80–120ms" },
                    { el: "Page transitions", dur: "0.3–0.5s", ease: "cubic-bezier(0.4, 0, 0.2, 1)", stagger: "—" },
                    { el: "Logo reveal", dur: "0.6s per layer", ease: "ease-out", stagger: "200ms" },
                    { el: "Video title cards", dur: "0.8–1.2s", ease: "ease-out", stagger: "120ms" },
                    { el: "Background gradients", dur: "3–5s loop", ease: "ease (infinite)", stagger: "—" },
                    { el: "Particle systems", dur: "Continuous", ease: "linear (physics)", stagger: "—" },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-accent/5">
                      <td className="py-3 px-4 text-foreground font-medium">{row.el}</td>
                      <td className="py-3 px-4 text-foreground font-mono text-xs">{row.dur}</td>
                      <td className="py-3 px-4 text-foreground font-mono text-xs">{row.ease}</td>
                      <td className="py-3 px-4 text-muted-foreground">{row.stagger}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Logo Reveal */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground border-l-4 border-primary pl-4 mb-8">
            Brand Animations
          </h2>

          <div className="space-y-12">
            <div className="bg-card p-6 rounded-xl shadow-md border border-border">
              <LogoReveal />
            </div>

            <div className="bg-card p-6 rounded-xl shadow-md border border-border">
              <ColorPulse />
            </div>

            <div className="bg-card p-6 rounded-xl shadow-md border border-border">
              <TypographyMotion />
            </div>
          </div>
        </section>

        {/* Gradient Flows */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground border-l-4 border-primary pl-4 mb-8">
            Dynamic Backgrounds
          </h2>

          <div className="space-y-12">
            <div className="bg-card p-6 rounded-xl shadow-md border border-border">
              <GradientFlow />
            </div>

            <div className="bg-card p-6 rounded-xl shadow-md border border-border">
              <ParticleField />
            </div>
          </div>
        </section>

        {/* Transition Library */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground border-l-4 border-primary pl-4 mb-8">
            Transition Library
          </h2>

          <div className="bg-card p-6 rounded-xl shadow-md border border-border">
            <TransitionShowcase />
          </div>
        </section>

        {/* Video Format Specs */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground border-l-4 border-primary pl-4 mb-3">
            Video Format Specifications
          </h2>
          <p className="text-muted-foreground mb-8 max-w-4xl">
            Standard formats and settings for all TQI video and motion graphics deliverables.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Film className="w-6 h-6" />,
                title: "Social Media",
                specs: [
                  "1080×1080 (Square) — Feed posts",
                  "1080×1920 (9:16) — Stories/Reels",
                  "1920×1080 (16:9) — YouTube/LinkedIn",
                  "Frame rate: 30fps",
                  "Duration: 15–60s",
                  "Format: MP4 (H.264)",
                ],
              },
              {
                icon: <Monitor className="w-6 h-6" />,
                title: "Presentations",
                specs: [
                  "1920×1080 (16:9) — Standard",
                  "3840×2160 (4K) — High-res",
                  "Frame rate: 30fps",
                  "Duration: 3–10s per slide transition",
                  "Format: MP4 or GIF",
                  "Background: Deep Navy preferred",
                ],
              },
              {
                icon: <Palette className="w-6 h-6" />,
                title: "Web Animations",
                specs: [
                  "CSS animations preferred for performance",
                  "Canvas 2D for particle systems",
                  "60fps target (requestAnimationFrame)",
                  "Respect prefers-reduced-motion",
                  "Max file size: 500KB for GIFs",
                  "Use will-change for GPU acceleration",
                ],
              },
            ].map((format, i) => (
              <div key={i} className="bg-card p-6 rounded-xl shadow-md border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                  {format.icon}
                </div>
                <h3 className="font-bold text-foreground mb-4">{format.title}</h3>
                <ul className="space-y-2">
                  {format.specs.map((spec, j) => (
                    <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Do's and Don'ts */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground border-l-4 border-primary pl-4 mb-8">
            Motion Do's & Don'ts
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-xl shadow-md border border-green-500/30">
              <h3 className="font-bold text-lg text-green-600 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Do
              </h3>
              <ul className="space-y-3">
                {[
                  "Use Quantum Teal as the primary motion accent color",
                  "Stagger related elements with 80-200ms delays",
                  "Use ease-out for entrances, ease-in for exits",
                  "Keep animations under 0.8s for UI, under 2s for video",
                  "Include a static fallback for reduced-motion users",
                  "Use the Deep Navy (#040620) background for video content",
                  "Match the hexagonal/layered motif in motion patterns",
                ].map((item, i) => (
                  <li key={i} className="text-sm text-foreground flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-md border border-red-500/30">
              <h3 className="font-bold text-lg text-red-500 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Don't
              </h3>
              <ul className="space-y-3">
                {[
                  "Use bouncy or playful spring animations (too casual for brand)",
                  "Animate everything at once — prioritize focal points",
                  "Use linear easing (feels mechanical and unpolished)",
                  "Exceed 3s for any single animation or transition",
                  "Use colors outside the brand palette in motion elements",
                  "Create looping animations that distract from content",
                  "Use heavy 3D effects or perspective transforms",
                ].map((item, i) => (
                  <li key={i} className="text-sm text-foreground flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="text-center py-12 border-t border-border bg-card">
        <div className="container mx-auto px-4">
          <p className="text-foreground font-semibold mb-2">The Quantum Insider — Motion Design System</p>
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <span>powered by</span>
            <span className="font-bold text-primary">Resonance</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default VideoMotionGraphics;
