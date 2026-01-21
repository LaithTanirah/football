import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useDirection } from '@/hooks/useDirection';
import styles from './HeroAnimation.module.css';

export function HeroAnimation({ className }: { className?: string }) {
  const { isRTL } = useDirection();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !isHovering) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const x = ((e.clientX - centerX) / rect.width) * 6; // Max 6px parallax
      const y = ((e.clientY - centerY) / rect.height) * 6;
      
      setMousePos({ x, y });
    };

    if (isHovering) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isHovering]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-full flex items-center justify-center rounded-3xl overflow-hidden",
        "glass-neon-strong",
        "shadow-md",
        "bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5",
        "dark:from-cyan-500/10 dark:via-purple-500/10 dark:to-pink-500/10",
        "p-5 md:p-6",
        "animationContainer",
        className
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setMousePos({ x: 0, y: 0 });
      }}
      style={{
        transform: isRTL ? 'scaleX(-1)' : 'none',
      }}
    >
      {/* Tactical Grid Backdrop with Gradient Mask */}
      <div 
        className="absolute inset-0 opacity-[0.08] dark:opacity-[0.12]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse 80% 80% at center, black 40%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at center, black 40%, transparent 70%)',
        }}
      />
      
      {/* Dotted Nodes */}
      <div 
        className="absolute inset-0 opacity-[0.06] dark:opacity-[0.1]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(6, 182, 212, 0.4) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 70% 70% at center, black 30%, transparent 65%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at center, black 30%, transparent 65%)',
        }}
      />

      {/* Soft Neon Spotlight Glow Behind Ball */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className={cn("w-[220px] h-[220px] rounded-full blur-3xl opacity-20 dark:opacity-30", styles.ballFloat)}
          style={{
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, rgba(168, 85, 247, 0.2) 50%, transparent 70%)',
          }}
        />
      </div>

      {/* Main Container for Ball and Rings with Parallax */}
      <div 
        className="relative w-full h-full flex items-center justify-center"
        style={{
          transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
          transition: isHovering ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        {/* Orbiting Ring 1 - Cyan */}
        <div
          className={cn("absolute w-[200px] h-[200px] rounded-full border border-cyan-400/15 dark:border-cyan-400/18", styles.ringSpin1)}
          style={{
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.3), inset 0 0 20px rgba(6, 182, 212, 0.1)',
            filter: 'blur(0.5px)',
          }}
        />

        {/* Orbiting Ring 2 - Magenta (Tilted) */}
        <div
          className={cn("absolute w-[180px] h-[180px] rounded-full border border-pink-400/15 dark:border-pink-400/18", styles.ringSpin2)}
          style={{
            boxShadow: '0 0 20px rgba(236, 72, 153, 0.3), inset 0 0 20px rgba(236, 72, 153, 0.1)',
            filter: 'blur(0.5px)',
          }}
        />

        {/* Glowing Neon Football Core */}
        <div
          className={cn("relative w-28 h-28 rounded-full", styles.ballFloat)}
          style={{
            willChange: 'transform',
          }}
        >
          {/* Outer Glow */}
          <div 
            className="absolute inset-0 rounded-full blur-xl"
            style={{
              background: 'radial-gradient(circle, rgba(6, 182, 212, 0.6) 0%, rgba(168, 85, 247, 0.4) 50%, rgba(236, 72, 153, 0.3) 70%, transparent 85%)',
            }}
          />
          
          {/* Main Ball */}
          <div 
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(6, 182, 212, 0.9), rgba(168, 85, 247, 0.7), rgba(236, 72, 153, 0.5))',
              boxShadow: `
                0 0 30px rgba(6, 182, 212, 0.6),
                0 0 60px rgba(168, 85, 247, 0.4),
                0 0 90px rgba(236, 72, 153, 0.2),
                inset 0 0 20px rgba(255, 255, 255, 0.2)
              `,
            }}
          >
            {/* Football Pattern Overlay */}
            <svg className="w-full h-full" viewBox="0 0 100 100" style={{ opacity: 0.4 }}>
              {/* Hex pattern hints */}
              <path
                d="M 50 10 L 65 20 L 70 35 L 65 50 L 50 60 L 35 50 L 30 35 Z"
                fill="none"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="0.8"
              />
              <path
                d="M 50 40 L 65 50 L 70 65 L 65 80 L 50 90 L 35 80 L 30 65 Z"
                fill="none"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="0.8"
              />
              {/* Pentagon hints */}
              <path
                d="M 50 15 L 68 28 L 62 50 L 38 50 L 32 28 Z"
                fill="none"
                stroke="rgba(255, 255, 255, 0.25)"
                strokeWidth="0.6"
              />
              <path
                d="M 50 85 L 32 72 L 38 50 L 62 50 L 68 72 Z"
                fill="none"
                stroke="rgba(255, 255, 255, 0.25)"
                strokeWidth="0.6"
              />
              {/* Center circle */}
              <circle cx="50" cy="50" r="6" fill="rgba(255, 255, 255, 0.2)" />
            </svg>
            
            {/* Scanline Effect */}
            <div 
              className={cn("absolute inset-0", styles.scanline)}
              style={{
                background: 'linear-gradient(135deg, transparent 40%, rgba(6, 182, 212, 0.3) 50%, transparent 60%)',
                width: '200%',
                height: '2px',
              }}
            />
          </div>
        </div>
      </div>

      {/* Kick Trail Accent */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: isHovering ? 0.4 : 0.15 }}
      >
        <path
          d="M 20 60 Q 40 30, 60 50 T 80 40"
          fill="none"
          stroke="rgba(6, 182, 212, 0.6)"
          strokeWidth="2"
          strokeDasharray="8 4"
          className={styles.trailDash}
          style={{
            filter: 'blur(1px)',
          }}
        />
      </svg>

      {/* Floating Neon Particles */}
      {Array.from({ length: 18 }).map((_, i) => {
        const startX = 15 + (i * 8) % 70; // Spread across width, stay inside
        const startY = 15 + (i * 12) % 70; // Spread across height, stay inside
        const size = i % 3 === 0 ? 'w-1.5 h-1.5' : i % 3 === 1 ? 'w-2 h-2' : 'w-1 h-1';
        
        return (
          <div
            key={i}
            className={cn(
              "absolute rounded-full",
              size,
              styles[`particle${i}` as keyof typeof styles]
            )}
            style={{
              left: `${startX}%`,
              top: `${startY}%`,
              background: `radial-gradient(circle, rgba(6, 182, 212, 0.9), rgba(168, 85, 247, 0.6), transparent)`,
              boxShadow: '0 0 8px rgba(6, 182, 212, 0.6), 0 0 12px rgba(168, 85, 247, 0.4)',
              willChange: 'transform, opacity',
            }}
          />
        );
      })}
    </div>
  );
}
