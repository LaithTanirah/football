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
  return (
    <div className={cn("mb-8", className)}>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">{title}</h1>
      {subtitle && (
        <p className="text-muted-foreground mb-6 max-w-2xl">{subtitle}</p>
      )}
      {action && (
        <div>
          {action.href ? (
            <Link to={action.href}>
              <Button size="lg">
                {action.icon && <span className="me-2">{action.icon}</span>}
                {action.label}
              </Button>
            </Link>
          ) : (
            <Button size="lg" onClick={action.onClick}>
              {action.icon && <span className="me-2">{action.icon}</span>}
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Export as MatchHeader for backward compatibility
export { PosterHeader as MatchHeader };

