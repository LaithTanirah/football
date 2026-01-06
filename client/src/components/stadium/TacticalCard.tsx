import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface TacticalCardProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "featured" | "compact";
}

export function TacticalCard({ children, href, onClick, className, variant = "default" }: TacticalCardProps) {
  const baseClasses = "card-elevated p-6 relative";
  const variantClasses = {
    default: "",
    featured: "border-2 border-primary/30 bg-gradient-to-br from-card to-card/50",
    compact: "p-4",
  };

  const content = (
    <div className={cn(baseClasses, variantClasses[variant], className)}>
      {children}
    </div>
  );

  if (href) {
    return (
      <Link to={href} className="block">
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className="block w-full text-left">
        {content}
      </button>
    );
  }

  return content;
}

