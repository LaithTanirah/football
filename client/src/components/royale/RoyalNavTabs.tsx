import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavTab {
  to: string;
  label: string;
}

interface RoyalNavTabsProps {
  tabs: NavTab[];
  className?: string;
}

export function RoyalNavTabs({ tabs, className }: RoyalNavTabsProps) {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <div className={cn("flex items-center gap-1 bg-muted/30 p-1.5 rounded-lg border border-border/50", className)}>
      {tabs.map((tab) => (
        <Link key={tab.to} to={tab.to}>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-md transition-all",
              isActive(tab.to)
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 font-semibold"
                : "hover:bg-background/50 text-muted-foreground"
            )}
          >
            {tab.label}
          </Button>
        </Link>
      ))}
    </div>
  );
}

