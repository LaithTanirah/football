import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AuroraHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: ReactNode;
  };
  contextRow?: ReactNode;
  className?: string;
}

export function AuroraHeader({ title, subtitle, action, contextRow, className }: AuroraHeaderProps) {
  return (
    <div className={cn("relative mb-8 pb-6 aurora-overlay rounded-lg p-8", className)}>
      <div className="relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-muted-foreground mt-2">{subtitle}</p>
        )}
        {action && (
          <div className="mt-6">
            {action.href ? (
              <Link to={action.href}>
                <Button size="lg" className="btn-glossy text-primary-foreground">
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  {action.label}
                </Button>
              </Link>
            ) : (
              <Button size="lg" onClick={action.onClick} className="btn-glossy text-primary-foreground">
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </Button>
            )}
          </div>
        )}
        {contextRow && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {contextRow}
          </div>
        )}
      </div>
    </div>
  );
}

