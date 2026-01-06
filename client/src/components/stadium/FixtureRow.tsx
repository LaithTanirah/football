import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";

interface FixtureRowProps {
  left?: ReactNode;
  middle: ReactNode;
  right?: ReactNode;
  href?: string;
  className?: string;
}

export function FixtureRow({ left, middle, right, href, className }: FixtureRowProps) {
  const content = (
    <div
      className={cn(
        "card-elevated p-4 flex items-center gap-4 relative group",
        "border-l-4 border-l-primary/50",
        className
      )}
    >
      {left && <div className="flex-shrink-0">{left}</div>}
      <div className="flex-1 min-w-0">{middle}</div>
      {right && <div className="flex-shrink-0">{right}</div>}
      {!right && href && (
        <div className="flex-shrink-0">
          <Button size="sm" variant="outline" className="gap-2">
            <Eye className="h-3 w-3" />
            Open
          </Button>
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link to={href} className="block">{content}</Link>;
  }

  return content;
}

