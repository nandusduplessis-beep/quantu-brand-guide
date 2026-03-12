import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
}

const ParticleField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const animFrameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsActive(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const PARTICLE_COUNT = 60;
    const CONNECTION_DIST = 100;

    if (particlesRef.current.length === 0) {
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.3,
      }));
    }

    const particles = particlesRef.current;

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      // Update and draw particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(10, 160, 171, ${p.alpha})`;
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(10, 160, 171, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [isActive]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-lg text-foreground">Quantum Particle Field</h4>
        <span className="px-3 py-1 text-xs font-medium bg-green-500/10 text-green-600 rounded-full">
          Live Canvas
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        An ambient particle network representing quantum interconnectedness. Particles drift and form connections when nearby, creating an organic, data-network feel ideal for video backgrounds and loading states.
      </p>

      <div className="bg-[#040620] rounded-xl overflow-hidden relative">
        <canvas
          ref={canvasRef}
          className="w-full"
          style={{ height: 280 }}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-white/20 text-sm font-medium">Ambient background — no interaction required</p>
        </div>
      </div>

      <div className="mt-4 bg-accent/10 p-4 rounded-lg">
        <p className="text-xs text-muted-foreground font-mono">
          <strong>Rendering:</strong> Canvas 2D, 60 particles | <strong>Connections:</strong> 100px radius threshold
        </p>
        <p className="text-xs text-muted-foreground font-mono mt-1">
          <strong>Color:</strong> Quantum Teal (#0aa0ab) with variable opacity | <strong>Use:</strong> Video backgrounds, live dashboards, hero sections
        </p>
      </div>
    </div>
  );
};

export default ParticleField;
