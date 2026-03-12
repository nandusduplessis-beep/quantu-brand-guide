import { useState, useEffect, useRef } from "react";

const TypographyMotion = () => {
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

  const tagline = "Actionable quantum intelligence";
  const words = tagline.split(" ");

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-lg text-foreground">Typography Animation</h4>
        <button
          onClick={replay}
          className="px-4 py-2 text-sm font-medium bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
        >
          Replay
        </button>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Text reveals use a word-by-word cascade with a subtle upward drift. The gradient underline sweeps in after the text completes, reinforcing the brand color system.
      </p>

      <div className="bg-[#040620] rounded-xl overflow-hidden p-8 flex flex-col items-center justify-center" style={{ minHeight: 280 }}>
        {isPlaying && (
          <div key={iteration} className="text-center space-y-6">
            {/* Word-by-word headline */}
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
              {words.map((word, i) => (
                <span
                  key={i}
                  className="text-3xl md:text-4xl font-bold text-white inline-block"
                  style={{
                    animation: `wordCascade 0.5s ease-out ${i * 0.12}s forwards`,
                    opacity: 0,
                    transform: "translateY(20px)",
                  }}
                >
                  {word}
                </span>
              ))}
            </div>

            {/* Gradient underline sweep */}
            <div className="relative h-1 w-64 md:w-96 mx-auto overflow-hidden rounded-full">
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  background: "linear-gradient(90deg, #0014f0, #0aa0ab, #6dd5ed)",
                  animation: `underlineSweep 0.8s ease-out ${words.length * 0.12 + 0.3}s forwards`,
                  width: "0%",
                }}
              />
            </div>

            {/* Subtitle fade */}
            <p
              className="text-[#bec1c9] text-sm md:text-base tracking-wide"
              style={{
                animation: `subtitleFade 0.6s ease-out ${words.length * 0.12 + 0.8}s forwards`,
                opacity: 0,
              }}
            >
              empowering confident decisions that move the industry forward
            </p>

            {/* CTA button appearance */}
            <div
              style={{
                animation: `ctaAppear 0.5s ease-out ${words.length * 0.12 + 1.2}s forwards`,
                opacity: 0,
                transform: "scale(0.9)",
              }}
            >
              <span className="inline-block px-6 py-2 border border-[#0aa0ab] text-[#0aa0ab] rounded-lg text-sm font-medium">
                Explore Intelligence
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 bg-accent/10 p-4 rounded-lg">
        <p className="text-xs text-muted-foreground font-mono">
          <strong>Pattern:</strong> Word cascade (120ms stagger) + gradient underline sweep + subtitle fade
        </p>
        <p className="text-xs text-muted-foreground font-mono mt-1">
          <strong>Font:</strong> Roboto Bold 36-48px | <strong>Total duration:</strong> ~2.2s | <strong>Use:</strong> Hero sections, video titles
        </p>
      </div>
    </div>
  );
};

export default TypographyMotion;
