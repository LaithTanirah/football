import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

export function AdminPageHeader({
  title,
  subtitle,
  actions,
  className,
}: AdminPageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6",
        className
      )}
    >
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-gray-300 dark:text-gray-300 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>
      )}
    </div>
  );
}
