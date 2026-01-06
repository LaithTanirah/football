import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActionItem {
  icon: ReactNode;
  label?: string;
  count?: number;
  onClick: () => void;
  active?: boolean;
  variant?: "default" | "danger";
}

interface ActionPillBarProps {
  actions: ActionItem[];
  className?: string;
}

export function ActionPillBar({ actions, className }: ActionPillBarProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {actions.map((action, index) => (
        <Button
          key={index}
          variant="ghost"
          size="sm"
          onClick={action.onClick}
          className={cn(
            "rounded-full px-3 py-1.5 h-auto gap-2",
            action.active && "bg-primary/10 text-primary border border-primary/20",
            action.variant === "danger" && "text-destructive hover:text-destructive hover:bg-destructive/10"
          )}
        >
          {action.icon}
          {action.label && <span className="text-sm font-medium">{action.label}</span>}
          {action.count !== undefined && (
            <span className="text-sm font-medium">{action.count}</span>
          )}
        </Button>
      ))}
    </div>
  );
}

