import { useEffect, useRef } from "react";

/**
 * NeonBackground - Animated background decor component
 * Renders floating neon shapes and particles behind content
 */
export function NeonBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particle system
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      opacity: number;
    }

    const particles: Particle[] = [];
    const particleCount = 30;

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 3 + 1,
        color: i % 3 === 0 ? "rgba(0, 255, 255, 0.3)" : i % 3 === 1 ? "rgba(255, 0, 255, 0.3)" : "rgba(138, 43, 226, 0.3)",
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle with glow
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: "screen" }}
      aria-hidden="true"
    />
  );
}

/**
 * FloatingNeonShapes - Static floating neon shapes
 * Alternative to canvas-based animation (lighter weight)
 */
export function FloatingNeonShapes() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Floating circles */}
      <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-gradient-to-br from-cyan-500/10 to-transparent blur-3xl animate-pulse" />
      <div className="absolute top-[15%] right-[10%] w-48 h-48 rounded-full bg-gradient-to-br from-magenta-500/10 to-transparent blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-[15%] left-[8%] w-56 h-56 rounded-full bg-gradient-to-br from-violet-500/10 to-transparent blur-3xl animate-pulse delay-2000" />
      <div className="absolute bottom-[20%] right-[5%] w-52 h-52 rounded-full bg-gradient-to-br from-cyan-500/10 to-transparent blur-3xl animate-pulse delay-3000" />
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-gradient-to-br from-magenta-500/10 to-transparent blur-3xl animate-pulse delay-500" />
    </div>
  );
}
