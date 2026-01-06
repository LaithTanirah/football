import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface ListRowCardProps {
  left?: ReactNode;
  middle: ReactNode;
  right?: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function ListRowCard({ left, middle, right, href, onClick, className }: ListRowCardProps) {
  const content = (
    <Card className={cn("p-4 hover:shadow-md transition-all", className)}>
      <div className="flex items-center gap-4">
        {left && <div className="flex-shrink-0">{left}</div>}
        <div className="flex-1 min-w-0">{middle}</div>
        {right && <div className="flex-shrink-0">{right}</div>}
      </div>
    </Card>
  );

  if (href) {
    return <Link to={href}>{content}</Link>;
  }

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full text-left">
        {content}
      </button>
    );
  }

  return content;
}



