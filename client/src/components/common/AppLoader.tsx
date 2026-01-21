import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import logoImageSmall from "@/assets/small-icon.jpg?url";
import logoImageLarge from "@/assets/large-icon.jpg?url";
import { cn } from "@/lib/utils";

interface AppLoaderProps {
  initialLoad?: boolean;
}

export function AppLoader({ initialLoad = false }: AppLoaderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const location = useLocation();
  const prevPathnameRef = useRef(location.pathname);
  const hasShownInitialLoad = useRef(false);
  const isMountedRef = useRef(false);

  // Safety: Maximum timeout to ensure loader always hides (2 seconds max)
  useEffect(() => {
    if (shouldRender) {
      const maxTimer = setTimeout(() => {
        setIsVisible(false);
        setShouldRender(false);
      }, 2000);
      return () => clearTimeout(maxTimer);
    }
  }, [shouldRender]);

  // Handle initial load - show once on mount
  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      
      if (initialLoad && !hasShownInitialLoad.current) {
        hasShownInitialLoad.current = true;
        setShouldRender(true);
        setIsVisible(true);
        
        // Always hide after 800ms, regardless of state changes
        const hideTimer = setTimeout(() => {
          setIsVisible(false);
        }, 800);
        
        const removeTimer = setTimeout(() => {
          setShouldRender(false);
        }, 1100); // 800ms + 300ms fade
        
        return () => {
          clearTimeout(hideTimer);
          clearTimeout(removeTimer);
        };
      } else {
        // Mark initial load as done so route changes can work
        hasShownInitialLoad.current = true;
        prevPathnameRef.current = location.pathname;
      }
    }
  }, [initialLoad]);

  // Handle route changes (only after component is mounted and initial load is done)
  useEffect(() => {
    // Skip route change detection until component is mounted
    if (!isMountedRef.current) {
      prevPathnameRef.current = location.pathname;
      return;
    }

    // Skip if this is the initial pathname (handled by initial load)
    if (!hasShownInitialLoad.current && prevPathnameRef.current === location.pathname) {
      return;
    }

    // Route change detected
    if (prevPathnameRef.current !== location.pathname) {
      prevPathnameRef.current = location.pathname;
      
      // Show loader on route change
      setShouldRender(true);
      setIsVisible(true);

      // Hide after 300ms
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          setShouldRender(false);
        }, 300);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-500",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 27, 75, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
      }}
      aria-busy={isVisible ? "true" : "false"}
      role="status"
      aria-label="Loading"
    >
      {/* Animated Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, transparent 70%)',
            animation: 'pulse 4s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)',
            animation: 'pulse 4s ease-in-out infinite 2s',
          }}
        />
      </div>

      {/* Main Loader Content */}
      <div className="relative flex flex-col items-center gap-8 z-10">
        {/* Logo Container with Rotating Rings */}
        <div className="relative flex items-center justify-center">
          {/* Outer Rotating Ring */}
          <div 
            className="absolute w-40 h-40 md:w-48 md:h-48 rounded-full border border-cyan-400/20"
            style={{
              animation: 'spin 8s linear infinite',
              boxShadow: '0 0 30px rgba(6, 182, 212, 0.2), inset 0 0 30px rgba(6, 182, 212, 0.1)',
            }}
          />
          
          {/* Middle Rotating Ring (Counter-clockwise) */}
          <div 
            className="absolute w-32 h-32 md:w-40 md:h-40 rounded-full border border-purple-400/20"
            style={{
              animation: 'spin 6s linear infinite reverse',
              boxShadow: '0 0 25px rgba(168, 85, 247, 0.2), inset 0 0 25px rgba(168, 85, 247, 0.1)',
            }}
          />

          {/* Inner Pulsing Ring */}
          <div 
            className="absolute w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-cyan-400/40"
            style={{
              animation: 'pulse 2s ease-in-out infinite',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)',
            }}
          />

          {/* Logo with Glassmorphism Container */}
          <div 
            className="relative w-20 h-20 md:w-28 md:h-28 p-3 md:p-4 rounded-2xl flex items-center justify-center backdrop-blur-xl"
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 40px rgba(6, 182, 212, 0.2)',
              animation: 'float 3s ease-in-out infinite',
            }}
          >
            <picture>
              <source media="(min-width: 768px)" srcSet={logoImageLarge} />
              <img
                src={logoImageSmall}
                alt="PLAYRO LEAGUE"
                className="w-full h-full object-contain relative z-10"
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.5))',
                }}
              />
            </picture>
            
            {/* Shimmer Effect */}
            <div 
              className="absolute inset-0 rounded-2xl opacity-30"
              style={{
                background: 'linear-gradient(135deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%)',
                backgroundSize: '200% 200%',
                animation: 'shimmer 3s linear infinite',
              }}
            />
          </div>
        </div>

        {/* Loading Text with Dots Animation */}
        <div className="flex items-center gap-2">
          <span className="text-sm md:text-base font-medium text-gray-300 tracking-wider">
            LOADING
          </span>
          <div className="flex gap-1">
            <span 
              className="w-1 h-1 rounded-full bg-cyan-400"
              style={{ animation: 'bounce 1.4s ease-in-out infinite' }}
            />
            <span 
              className="w-1 h-1 rounded-full bg-purple-400"
              style={{ animation: 'bounce 1.4s ease-in-out infinite 0.2s' }}
            />
            <span 
              className="w-1 h-1 rounded-full bg-pink-400"
              style={{ animation: 'bounce 1.4s ease-in-out infinite 0.4s' }}
            />
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.4;
          }
          50% { 
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px);
          }
          50% { 
            transform: translateY(-10px);
          }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes bounce {
          0%, 80%, 100% { 
            transform: translateY(0);
            opacity: 0.5;
          }
          40% { 
            transform: translateY(-8px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
