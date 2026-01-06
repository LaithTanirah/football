import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface SectionBlockProps {
  title: string;
  children: ReactNode;
  seeAllLink?: string;
  seeAllLabel?: string;
  className?: string;
}

export function SectionBlock({ title, children, seeAllLink, seeAllLabel, className }: SectionBlockProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        {seeAllLink && (
                    <Link
            to={seeAllLink}
            className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
          >
            {seeAllLabel || "See all"}
            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}

