import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DirectoryTileProps {
  title: string;
  subtitle?: string;
  meta?: ReactNode;
  href: string;
  topGradient?: boolean;
  className?: string;
}

export function DirectoryTile({
  title,
  subtitle,
  meta,
  href,
  topGradient = true,
  className,
}: DirectoryTileProps) {
  const { t } = useTranslation();
  
  return (
    <Link to={href} className="block">
      <div className={cn("card-elevated overflow-hidden", className)}>
        {topGradient && (
          <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
        )}
        <div className="p-6">
          <h3 className="font-bold text-xl mb-2">{title}</h3>
          {subtitle && <p className="text-sm text-muted-foreground mb-3">{subtitle}</p>}
          {meta && <div className="text-sm text-muted-foreground mb-4">{meta}</div>}
          <Button size="sm" variant="outline" className="w-full">
            {t("pitches.viewDetails")}
          </Button>
        </div>
      </div>
    </Link>
  );
}

