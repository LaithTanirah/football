import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PosterHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: ReactNode;
    variant?: "orange" | "green";
  };
  className?: string;
}

export function PosterHeader({ title, subtitle, action, className }: PosterHeaderProps) {
  const actionVariant = action?.variant || "orange";
  
  return (
    <div className={cn("match-header-bg rounded-brand p-8 md:p-12 mb-8 relative overflow-hidden border-2 border-border-soft", className)}>
      {/* Angled background shapes inspired by logo arrow - Blue/Cyan */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-blue/8 to-transparent transform rotate-12 translate-x-16 -translate-y-16" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-brand-cyan/8 to-transparent transform -rotate-12 -translate-x-12 translate-y-12" />
      
      <div className="relative z-10">
        <h1 className="text-page-title mb-3 tracking-tight text-text-primary">{title}</h1>
        {subtitle && (
          <p className="text-body text-text-muted mb-6 max-w-2xl">{subtitle}</p>
        )}
        {action && (
          <div>
            {action.href ? (
              <Link to={action.href}>
                <Button 
                  size="lg" 
                  className={cn(
                    "font-bold text-base px-8 py-6 shadow-brand hover:shadow-medium transition-all",
                    actionVariant === "orange" 
                      ? "bg-brand-orange hover:bg-brand-orange/90 text-text-invert" 
                      : "bg-brand-green hover:bg-brand-green/90 text-text-invert"
                  )}
                >
                  {action.icon && <span className="me-2">{action.icon}</span>}
                  {action.label}
                </Button>
              </Link>
            ) : (
              <Button 
                size="lg" 
                onClick={action.onClick} 
                className={cn(
                  "font-bold text-base px-8 py-6 shadow-brand hover:shadow-medium transition-all",
                  actionVariant === "orange" 
                    ? "bg-brand-orange hover:bg-brand-orange/90 text-text-invert" 
                    : "bg-brand-green hover:bg-brand-green/90 text-text-invert"
                )}
              >
                {action.icon && <span className="me-2">{action.icon}</span>}
                {action.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Export as MatchHeader for backward compatibility
export { PosterHeader as MatchHeader };

