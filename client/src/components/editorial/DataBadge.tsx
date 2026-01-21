import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface DataBadgeProps {
  children: ReactNode;
  variant?: "default" | "outline" | "secondary";
  className?: string;
}

export function DataBadge({ children, variant = "outline", className }: DataBadgeProps) {
  return (
    <Badge variant={variant} className={cn("text-xs font-normal", className)}>
      {children}
    </Badge>
  );
}




