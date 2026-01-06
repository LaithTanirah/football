import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatWidgetProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  variant?: "default" | "highlight";
  className?: string;
}

export function StatWidget({ label, value, icon, variant = "default", className }: StatWidgetProps) {
  return (
    <div
      className={cn(
        "card-elevated p-6 text-center",
        variant === "highlight" && "border-2 border-primary/30",
        className
      )}
    >
      {icon && <div className="mb-2 flex justify-center text-primary">{icon}</div>}
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

