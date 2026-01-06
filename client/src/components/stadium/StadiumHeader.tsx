import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StadiumHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: ReactNode;
  };
  className?: string;
}

export function StadiumHeader({ title, subtitle, action, className }: StadiumHeaderProps) {
  return (
    <div className={cn("relative mb-8 pb-6 stadium-glow", className)}>
      <div className="relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-muted-foreground mt-2">{subtitle}</p>
        )}
        {action && (
          <div className="mt-6">
            {action.href ? (
              <Link to={action.href}>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 border border-primary/20 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {action.icon}
                    {action.label}
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </Button>
              </Link>
            ) : (
              <Button
                size="lg"
                onClick={action.onClick}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 border border-primary/20 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {action.icon}
                  {action.label}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </Button>
            )}
          </div>
        )}
      </div>
      <div className="sideline-divider mt-6" />
    </div>
  );
}

