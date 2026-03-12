import { useState } from "react";

const transitions = [
  {
    name: "Fade & Rise",
    description: "Standard content entrance. Elements fade in while rising 10-20px.",
    cssAnimation: "fadeRise 0.6s ease-out forwards",
    timing: "0.6s ease-out",
    usage: "Section headings, cards, body content",
  },
  {
    name: "Scale Pop",
    description: "Attention-grabbing entrance for interactive elements like buttons and icons.",
    cssAnimation: "scalePop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
    timing: "0.4s spring-like",
    usage: "Buttons, icons, badges, CTAs",
  },
  {
    name: "Slide In Left",
    description: "Directional entrance suggesting forward progress and flow.",
    cssAnimation: "slideInLeft 0.5s ease-out forwards",
    timing: "0.5s ease-out",
    usage: "Navigation items, list entries, side panels",
  },
  {
    name: "Blur Resolve",
    description: "Content becomes clear from a blurred state, implying focus and clarity.",
    cssAnimation: "blurResolve 0.8s ease-out forwards",
    timing: "0.8s ease-out",
    usage: "Hero images, data reveals, emphasis moments",
  },
];

const TransitionShowcase = () => {
  const [playing, setPlaying] = useState<number | null>(null);
  const [iterations, setIterations] = useState<number[]>(transitions.map(() => 0));

  const playTransition = (index: number) => {
    setPlaying(null);
    const newIterations = [...iterations];
    newIterations[index]++;
    setIterations(newIterations);
    setTimeout(() => setPlaying(index), 50);
  };

  return (
    <div>
      <h4 className="font-bold text-lg text-foreground mb-2">Transition Library</h4>
      <p className="text-sm text-muted-foreground mb-6">
        Standard motion patterns for all TQI video and web content. Click each transition to preview. These ensure visual consistency across all animated brand touchpoints.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {transitions.map((t, i) => (
          <div key={i} className="bg-card border border-border rounded-xl overflow-hidden">
            {/* Preview area */}
            <div
              className="bg-[#040620] h-32 flex items-center justify-center cursor-pointer hover:bg-[#060830] transition-colors"
              onClick={() => playTransition(i)}
            >
              {playing === i ? (
                <div
                  key={iterations[i]}
                  className="px-6 py-3 bg-[#0aa0ab] text-white font-semibold rounded-lg"
                  style={{
                    animation: t.cssAnimation,
                    opacity: 0,
                  }}
                >
                  {t.name}
                </div>
              ) : (
                <p className="text-white/40 text-sm">Click to preview</p>
              )}
            </div>
            {/* Info */}
            <div className="p-4">
              <h5 className="font-semibold text-foreground mb-1">{t.name}</h5>
              <p className="text-xs text-muted-foreground mb-2">{t.description}</p>
              <div className="flex gap-2">
                <span className="text-xs font-mono bg-accent/10 px-2 py-1 rounded text-muted-foreground">
                  {t.timing}
                </span>
                <span className="text-xs bg-primary/10 px-2 py-1 rounded text-primary">
                  {t.usage}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransitionShowcase;
