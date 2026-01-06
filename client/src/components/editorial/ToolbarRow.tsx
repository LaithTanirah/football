import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ToolbarRowProps {
  children: ReactNode;
  className?: string;
}

export function ToolbarRow({ children, className }: ToolbarRowProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3 py-3 border-b border-border", className)}>
      {children}
    </div>
  );
}



