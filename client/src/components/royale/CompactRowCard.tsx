import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CompactRowCardProps {
  left?: ReactNode;
  middle: ReactNode;
  right?: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function CompactRowCard({ left, middle, right, href, onClick, className }: CompactRowCardProps) {
  const content = (
    <div
      className={cn(
        "card-elevated p-4 flex items-center gap-4 group",
        className
      )}
    >
      {left && <div className="flex-shrink-0">{left}</div>}
      <div className="flex-1 min-w-0">{middle}</div>
      {right && <div className="flex-shrink-0">{right}</div>}
    </div>
  );

  if (href) {
    return <Link to={href} className="block">{content}</Link>;
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

