import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EditorialHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
    icon?: ReactNode;
  };
  className?: string;
}

export function EditorialHeader({ title, subtitle, action, className }: EditorialHeaderProps) {
  const ActionButton = action?.href ? (
    <a href={action.href}>
      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
        {action.icon && <span className="me-2">{action.icon}</span>}
        {action.label}
      </Button>
    </a>
  ) : action?.onClick ? (
    <Button onClick={action.onClick} className="bg-primary hover:bg-primary/90 text-primary-foreground">
      {action.icon && <span className="me-2">{action.icon}</span>}
      {action.label}
    </Button>
  ) : null;

  return (
    <div className={cn("mb-8", className)}>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl">{subtitle}</p>
          )}
        </div>
        {ActionButton && <div className="flex-shrink-0">{ActionButton}</div>}
      </div>
    </div>
  );
}

