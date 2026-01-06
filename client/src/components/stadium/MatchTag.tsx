import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MatchTagProps {
  children: ReactNode;
  variant?: "default" | "accent" | "warning" | "outline";
  className?: string;
}

export function MatchTag({ children, variant = "default", className }: MatchTagProps) {
  return (
    <span
      className={cn(
        "match-tag",
        variant === "accent" && "bg-primary/20 border-primary/50 text-primary",
        variant === "warning" && "bg-warning/20 border-warning/50 text-warning",
        variant === "outline" && "bg-transparent border-border text-foreground",
        className
      )}
    >
      {children}
    </span>
  );
}

