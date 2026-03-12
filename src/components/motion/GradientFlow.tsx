import { useState } from "react";

const GradientFlow = () => {
  const [activeGradient, setActiveGradient] = useState<"quantum" | "resonance" | "full">("quantum");

  const gradients = {
    quantum: {
      label: "Quantum Gradient",
      css: "linear-gradient(135deg, #0aa0ab 0%, #6dd5ed 50%, #0aa0ab 100%)",
      description: "Teal-to-cyan loop for hero backgrounds and overlays.",
      code: "background: linear-gradient(135deg, #0aa0ab, #6dd5ed);",
    },
    resonance: {
      label: "Resonance Gradient",
      css: "linear-gradient(135deg, #0014f0 0%, #0aa0ab 50%, #0014f0 100%)",
      description: "Blue-to-teal transition for accent elements and CTAs.",
      code: "background: linear-gradient(135deg, #0014f0, #0aa0ab);",
    },
    full: {
      label: "Full Spectrum",
      css: "linear-gradient(135deg, #040620 0%, #0014f0 25%, #0aa0ab 50%, #6dd5ed 75%, #bec1c9 100%)",
      description: "Complete brand palette sweep for dramatic transitions.",
      code: "background: linear-gradient(135deg, #040620, #0014f0, #0aa0ab, #6dd5ed, #bec1c9);",
    },
  };

  const active = gradients[activeGradient];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-lg text-foreground">Gradient Flow Transitions</h4>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Animated gradients serve as dynamic backgrounds for video content. The gradient shifts continuously using CSS background-position animation, creating a fluid, living surface.
      </p>

      <div className="flex gap-2 mb-4">
        {(Object.keys(gradients) as Array<keyof typeof gradients>).map((key) => (
          <button
            key={key}
            onClick={() => setActiveGradient(key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeGradient === key
                ? "bg-primary text-primary-foreground"
                : "bg-accent/20 text-foreground hover:bg-accent/40"
            }`}
          >
            {gradients[key].label}
          </button>
        ))}
      </div>

      <div
        className="rounded-xl overflow-hidden flex items-center justify-center"
        style={{
          height: 200,
          background: active.css,
          backgroundSize: "200% 200%",
          animation: "gradientShift 4s ease infinite",
        }}
      >
        <p className="text-white font-bold text-xl drop-shadow-lg">{active.label}</p>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-accent/10 p-4 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1"><strong>Usage</strong></p>
          <p className="text-sm text-foreground">{active.description}</p>
        </div>
        <div className="bg-accent/10 p-4 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1"><strong>CSS</strong></p>
          <p className="text-sm text-foreground font-mono">{active.code}</p>
          <p className="text-xs text-muted-foreground font-mono mt-1">animation: gradientShift 4s ease infinite;</p>
        </div>
      </div>
    </div>
  );
};

export default GradientFlow;
