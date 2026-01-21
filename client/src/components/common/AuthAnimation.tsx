import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useDirection } from '@/hooks/useDirection';
import { useLocaleStore } from '@/store/localeStore';
import styles from './AuthAnimation.module.css';

interface AuthAnimationProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function AuthAnimation({ title, subtitle, className }: AuthAnimationProps) {
  const { isRTL, dir } = useDirection();
  const { locale } = useLocaleStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const animationGroupRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - top) / height - 0.5; // -0.5 to 0.5
      setMousePosition({ x, y });
      containerRef.current.style.setProperty('--mx', x.toString());
      containerRef.current.style.setProperty('--my', y.toString());
    }
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
    if (containerRef.current) {
      containerRef.current.style.setProperty('--mx', '0');
      containerRef.current.style.setProperty('--my', '0');
    }
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleReducedMotionChange = () => {
      if (containerRef.current) {
        containerRef.current.classList.toggle(styles.reducedMotion, mediaQuery.matches);
      }
    };

    mediaQuery.addEventListener('change', handleReducedMotionChange);
    handleReducedMotionChange(); // Set initial state

    return () => mediaQuery.removeEventListener('change', handleReducedMotionChange);
  }, []);

  return (
    <div
      ref={containerRef}
      dir={dir}
      lang={locale}
      className={cn(
        "relative w-full h-full flex flex-col items-center justify-center rounded-3xl overflow-hidden p-6 md:p-8",
        "glass-neon-strong border border-cyan-400/30 dark:border-cyan-400/40",
        "shadow-[0_0_30px_rgba(6,182,212,0.15)] dark:shadow-[0_0_40px_rgba(6,182,212,0.25)]",
        styles.authAnimationContainer,
        className
      )}
      style={{
        '--parallax-x': `${mousePosition.x * 8}px`,
        '--parallax-y': `${mousePosition.y * 8}px`,
      } as React.CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Tactical Grid Background */}
      <div
        className={cn("absolute inset-0 opacity-[0.04] dark:opacity-[0.08]", styles.gridBackground)}
        style={{
          maskImage: 'radial-gradient(circle at center, black 70%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 70%, transparent 100%)',
        }}
      />

      {/* Soft Spotlight Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className={cn("w-[300px] h-[300px] rounded-full blur-3xl opacity-20 dark:opacity-30", styles.spotlightGlow)}
          style={{
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, rgba(168, 85, 247, 0.3) 50%, transparent 70%)',
            transform: 'translate(var(--parallax-x), var(--parallax-y))',
            willChange: 'transform',
          }}
        />
      </div>

      {/* Main Animation Group - Isolated for RTL mirroring */}
      <div
        ref={animationGroupRef}
        className="relative w-full h-full flex items-center justify-center"
        style={{
          transform: `translate(var(--parallax-x), var(--parallax-y)) ${isRTL ? 'scaleX(-1)' : ''}`,
          willChange: 'transform',
        }}
      >
        {/* Orbiting Ring 1 (Cyan) */}
        <div
          className={cn("absolute w-[200px] h-[200px] rounded-full border border-cyan-400/30", styles.ringSpin1)}
          style={{
            boxShadow: '0 0 15px rgba(6, 182, 212, 0.2), inset 0 0 15px rgba(6, 182, 212, 0.1)',
            transform: `scaleY(0.8) rotate(var(--ring-rotation-1, 0deg))`,
            willChange: 'transform',
          }}
        />

        {/* Orbiting Ring 2 (Purple, tilted) */}
        <div
          className={cn("absolute w-[220px] h-[220px] rounded-full border border-purple-400/30", styles.ringSpin2)}
          style={{
            boxShadow: '0 0 15px rgba(168, 85, 247, 0.2), inset 0 0 15px rgba(168, 85, 247, 0.1)',
            transform: `scaleY(0.75) rotateX(30deg) rotate(var(--ring-rotation-2, 0deg))`,
            willChange: 'transform',
          }}
        />

        {/* Floating Orb (Gradient Blob) */}
        <div
          className={cn("relative w-32 h-32 rounded-full", styles.orbFloat)}
          style={{
            willChange: 'transform, filter',
            filter: 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.3)) drop-shadow(0 0 30px rgba(168, 85, 247, 0.2))',
          }}
        >
          {/* Outer Glow */}
          <div
            className="absolute inset-0 rounded-full blur-xl"
          style={{
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.5) 0%, rgba(168, 85, 247, 0.4) 50%, transparent 70%)',
          }}
          />

          {/* Main Orb */}
          <div
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(6, 182, 212, 0.8), rgba(168, 85, 247, 0.7), rgba(236, 72, 153, 0.6))',
              boxShadow: `
                0 0 25px rgba(6, 182, 212, 0.5),
                0 0 50px rgba(168, 85, 247, 0.4),
                inset 0 0 15px rgba(255, 255, 255, 0.15)
              `,
            }}
          >
            {/* Football Pattern (Simplified SVG) */}
            <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
              <path d="M50 10 L70 25 L70 50 L50 65 L30 50 L30 25 Z" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
              <path d="M50 65 L70 80 L70 95 L50 98 L30 95 L30 80 Z" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
              <path d="M50 10 L50 65" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
              <path d="M70 25 L30 50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
              <path d="M70 50 L30 25" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
              <circle cx="50" cy="50" r="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
            </svg>

            {/* Scanline Effect */}
            <div className={cn("absolute inset-0", styles.scanline)} />
          </div>
        </div>
      </div>

      {/* Floating Football Particles */}
      {Array.from({ length: 12 }).map((_, i) => {
        const size = Math.random() * 3 + 2; // 2px to 5px
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const delay = Math.random() * 4;

        return (
          <div
            key={i}
            className={cn(
              "absolute rounded-full",
              styles.particle,
              styles[`particleDrift${i % 6}` as keyof typeof styles]
            )}
            style={{
              left: `${startX}%`,
              top: `${startY}%`,
              width: `${size}px`,
              height: `${size}px`,
              background: `radial-gradient(circle, rgba(6, 182, 212, 0.6), transparent)`,
              boxShadow: `0 0 ${size * 1.5}px rgba(6, 182, 212, 0.5)`,
              animationDelay: `${delay}s`,
              willChange: 'transform, opacity',
            }}
          />
        );
      })}

      {/* Text Content - Isolated from animation transform */}
      <div 
        className={cn(
          "relative z-10 mt-auto pt-6 w-full",
          isRTL ? "text-right" : "text-left"
        )}
        style={{
          direction: isRTL ? 'rtl' : 'ltr',
          unicodeBidi: 'plaintext',
          textAlign: 'start',
        } as React.CSSProperties}
      >
        <div
          style={{
            direction: isRTL ? 'rtl' : 'ltr',
            unicodeBidi: 'plaintext',
          } as React.CSSProperties}
        >
          <h2 
            className={cn(
              "text-2xl md:text-3xl font-bold mb-2",
              "bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            )}
            style={{
              direction: isRTL ? 'rtl' : 'ltr',
              unicodeBidi: 'plaintext',
            } as React.CSSProperties}
          >
            {title}
          </h2>
          {subtitle && (
            <p 
              className="text-sm md:text-base text-muted-foreground dark:text-gray-300 opacity-80"
              style={{
                direction: isRTL ? 'rtl' : 'ltr',
                unicodeBidi: 'plaintext',
              } as React.CSSProperties}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
