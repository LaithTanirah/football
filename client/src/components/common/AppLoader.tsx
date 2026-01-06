import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import logoImage from "@/assets/Logo.jpg?url";
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

  // Handle initial load - show once on mount if initialLoad is true
  useEffect(() => {
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
    } else if (!initialLoad && hasShownInitialLoad.current && shouldRender) {
      // Safety: if initialLoad becomes false and loader is still showing, hide it
      setIsVisible(false);
      const removeTimer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(removeTimer);
    }
  }, [initialLoad, shouldRender]);

  // Handle route changes (only after initial load was shown)
  useEffect(() => {
    // Skip route change detection until initial load is done
    if (!hasShownInitialLoad.current) {
      prevPathnameRef.current = location.pathname;
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
        "fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg-page transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      aria-busy={isVisible ? "true" : "false"}
      role="status"
      aria-label="Loading"
    >
      {/* Logo */}
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 p-3 rounded-2xl bg-white border-2 border-border-soft shadow-lg flex items-center justify-center">
            <img
              src={logoImage}
              alt="PLAYRO LEAGUE"
              className="w-full h-full object-contain"
            />
          </div>
          {/* Pulsing ring animation */}
          <div className="absolute inset-0 rounded-2xl border-2 border-brand-blue/30 animate-pulse" />
        </div>

        {/* Spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-border-soft rounded-full" />
          <div className="absolute inset-0 border-4 border-transparent border-t-brand-blue rounded-full animate-spin" />
        </div>
      </div>
    </div>
  );
}
