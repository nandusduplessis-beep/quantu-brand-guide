import { useState, useEffect, useRef } from "react";

const LogoReveal = () => {
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
        if (entry.isIntersecting && !isPlaying) {
          setIsPlaying(true);
        }
      },
      { threshold: 0.5 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-lg text-foreground">Logo Reveal Animation</h4>
        <button
          onClick={replay}
          className="px-4 py-2 text-sm font-medium bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
        >
          Replay
        </button>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        The logo reveal uses a staggered hexagon expansion with a teal glow bloom. Each nested hexagon scales in sequentially, followed by the wordmark fading in from below.
      </p>

      <div
        className="relative bg-[#040620] rounded-xl overflow-hidden flex items-center justify-center"
        style={{ height: 320 }}
      >
        {isPlaying && (
          <div key={iteration} className="flex flex-col items-center gap-6">
            {/* Glow backdrop */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                animation: "glowBloom 2s ease-out forwards",
                opacity: 0,
              }}
            >
              <div
                className="w-48 h-48 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(10,160,171,0.3) 0%, transparent 70%)",
                }}
              />
            </div>

            {/* Hexagons */}
            <div className="relative w-28 h-28">
              {[0, 1, 2].map((i) => (
                <svg
                  key={i}
                  viewBox="0 0 100 100"
                  className="absolute inset-0 w-full h-full"
                  style={{
                    animation: `hexReveal 0.6s ease-out ${i * 0.2}s forwards`,
                    opacity: 0,
                    transform: "scale(0.3)",
                  }}
                >
                  <polygon
                    points="50,5 93,27 93,73 50,95 7,73 7,27"
                    fill="none"
                    stroke={i === 0 ? "#0aa0ab" : i === 1 ? "#0aa0ab" : "#6dd5ed"}
                    strokeWidth={i === 0 ? 3 : 2}
                    opacity={1 - i * 0.25}
                    style={{
                      transform: `scale(${1 - i * 0.22})`,
                      transformOrigin: "50px 50px",
                    }}
                  />
                </svg>
              ))}
            </div>

            {/* Wordmark */}
            <div
              className="text-center"
              style={{
                animation: "wordmarkReveal 0.8s ease-out 0.8s forwards",
                opacity: 0,
                transform: "translateY(12px)",
              }}
            >
              <p className="text-white text-xl font-bold tracking-wider">
                THE QUANTUM INSIDER
              </p>
              <p
                className="text-[#0aa0ab] text-xs tracking-widest mt-1"
                style={{
                  animation: "wordmarkReveal 0.6s ease-out 1.2s forwards",
                  opacity: 0,
                }}
              >
                powered by Resonance
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 bg-accent/10 p-4 rounded-lg">
        <p className="text-xs text-muted-foreground font-mono">
          <strong>Timing:</strong> Hexagons: 0s, 0.2s, 0.4s stagger (0.6s each) | Wordmark: 0.8s delay | Tagline: 1.2s delay | Total: ~2s
        </p>
        <p className="text-xs text-muted-foreground font-mono mt-1">
          <strong>Easing:</strong> ease-out cubic | <strong>Background:</strong> Deep Navy #040620
        </p>
      </div>
    </div>
  );
};

export default LogoReveal;
