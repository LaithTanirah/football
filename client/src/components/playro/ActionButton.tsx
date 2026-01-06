import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActionButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ActionButton({ children, onClick, href, variant = "primary", size = "md", className }: ActionButtonProps) {
  const baseClasses = variant === "primary" ? "btn-action" : "";
  const sizeClasses = {
    sm: "h-9 px-4 text-sm",
    md: "h-10 px-6",
    lg: "h-12 px-8 text-base",
  };

  if (href) {
    return (
      <a href={href} className={cn(baseClasses, sizeClasses[size], className)}>
        {children}
      </a>
    );
  }

  return (
    <Button
      onClick={onClick}
      variant={variant === "outline" ? "outline" : "default"}
      size={size}
      className={cn(baseClasses, className)}
    >
      {children}
    </Button>
  );
}

