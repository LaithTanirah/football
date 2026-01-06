import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SpotlightPanelProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function SpotlightPanel({ title, children, className }: SpotlightPanelProps) {
  return (
    <div className={cn("card-elevated p-6 sticky top-24", className)}>
      <h3 className="text-lg font-bold mb-4 pb-2 border-b border-border">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

