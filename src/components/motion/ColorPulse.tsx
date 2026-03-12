import { useState, useEffect, useRef } from "react";

const brandColors = [
  { name: "Quantum Teal", hex: "#0aa0ab", hsl: "186 90% 35%" },
  { name: "Deep Navy", hex: "#040620", hsl: "237 89% 7%" },
  { name: "Neutral Gray", hex: "#bec1c9", hsl: "220 13% 76%" },
  { name: "Resonance Blue", hex: "#0014f0", hsl: "230 100% 47%" },
];

const ColorPulse = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [iteration, setIteration] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const replay = () => {
    setIsPlaying(false);
    setTimeout(() => {
      setIteration((i) => i + 1);
      setIsPlaying(true);
    }, 50);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isPlaying) setIsPlaying(true);
      },
      { threshold: 0.3 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-lg text-foreground">Color Palette Motion</h4>
        <button
          onClick={replay}
          className="px-4 py-2 text-sm font-medium bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
        >
          Replay
        </button>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Brand colors animate in with a sweep-and-pulse pattern. Each swatch slides in from the left with a subtle scale bounce, establishing visual rhythm.
      </p>

      <div className="bg-[#040620] rounded-xl overflow-hidden p-8" style={{ minHeight: 240 }}>
        {isPlaying && (
          <div key={iteration} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {brandColors.map((color, i) => (
              <div
                key={color.hex}
                className="flex flex-col items-center"
                style={{
                  animation: `colorSwipeIn 0.5s ease-out ${i * 0.15}s forwards`,
                  opacity: 0,
                  transform: "translateX(-20px) scale(0.9)",
                }}
              >
                <div
                  className="w-full aspect-square rounded-lg shadow-lg relative overflow-hidden"
                  style={{ backgroundColor: color.hex }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      animation: `colorPulseGlow 2s ease-in-out ${0.8 + i * 0.15}s infinite`,
                      background: `radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)`,
                      opacity: 0,
                    }}
                  />
                  {color.name === "Deep Navy" && (
                    <div className="absolute inset-0 border border-white/20 rounded-lg" />
                  )}
                </div>
                <p
                  className="text-white text-xs font-medium mt-2 text-center"
                  style={{
                    animation: `colorLabelFade 0.4s ease-out ${0.5 + i * 0.15}s forwards`,
                    opacity: 0,
                  }}
                >
                  {color.name}
                </p>
                <p
                  className="text-white/50 text-xs font-mono"
                  style={{
                    animation: `colorLabelFade 0.4s ease-out ${0.6 + i * 0.15}s forwards`,
                    opacity: 0,
                  }}
                >
                  {color.hex}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 bg-accent/10 p-4 rounded-lg">
        <p className="text-xs text-muted-foreground font-mono">
          <strong>Pattern:</strong> Slide-in from left + scale bounce | <strong>Stagger:</strong> 150ms between swatches
        </p>
        <p className="text-xs text-muted-foreground font-mono mt-1">
          <strong>Pulse:</strong> Radial glow breathes on 2s loop | <strong>Use:</strong> Presentations, social media intros
        </p>
      </div>
    </div>
  );
};

export default ColorPulse;
