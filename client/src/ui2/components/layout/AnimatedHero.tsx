import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { cn } from "@/lib/utils";
import { useDirection } from "@/hooks/useDirection";
import { HeroAnimation } from "@/components/home/HeroAnimation";
import { useTranslation } from "react-i18next";

interface AnimatedHeroProps {
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryActions?: Array<{
    label: string;
    href: string;
  }>;
  className?: string;
}

export function AnimatedHero({
  title,
  description,
  primaryAction,
  secondaryActions,
  className,
}: AnimatedHeroProps) {
  const { isRTL } = useDirection();
  const { t } = useTranslation();

  return (
    <section className={cn("relative z-10 w-full", className)}>
      {/* Single column layout with vertical rhythm */}
      <div className={cn("flex flex-col", isRTL ? "items-end" : "items-start")}>
        {/* Top Area - Compact and Aligned */}
        <div
          className={cn(
            "w-full max-w-[640px] space-y-6",
            isRTL ? "text-end ms-auto" : "text-start"
          )}
        >
          {/* Badge - RTL aware positioning - Force right in RTL */}
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/15 text-cyan-400 text-xs font-semibold w-fit",
              isRTL && "flex-row-reverse"
            )}
            style={isRTL ? { marginRight: "0", marginLeft: "auto" } : {}}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse flex-shrink-0"></span>
            <span>{t("home.welcomeBadge")}</span>
          </div>

          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-[1.1] tracking-tight">
              {title}
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground dark:text-gray-300 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Button Group - Consistent Width and Stack */}
          {(primaryAction || secondaryActions) && (
            <div
              className={cn(
                "flex flex-col gap-3 max-w-[520px]",
                isRTL ? "items-end ms-auto" : "items-start"
              )}
            >
              {primaryAction && (
                <Link to={primaryAction.href} className="w-full">
                  <Button
                    size="lg"
                    className="w-full px-6 py-5 text-base font-bold bg-cyan-500 hover:bg-cyan-600 text-foreground rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    {primaryAction.label}
                  </Button>
                </Link>
              )}
              {secondaryActions?.map((action, index) => (
                <Link key={index} to={action.href} className="w-full">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full px-6 py-5 text-base font-semibold rounded-xl border hover:bg-cyan-500/10 hover:border-cyan-400/20 transition-all duration-300"
                  >
                    {action.label}
                  </Button>
                </Link>
              ))}
            </div>
          )}

          {/* Stats Row - Centered */}
          <div
            className={cn(
              "flex flex-wrap gap-6 pt-4 border-t border-cyan-400/10 justify-center"
            )}
          >
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-cyan-400">
                100+
              </div>
              <div className="text-xs text-muted-foreground dark:text-gray-400">
                {t("home.stats.pitches")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-purple-400">
                50+
              </div>
              <div className="text-xs text-muted-foreground dark:text-gray-400">
                {t("home.stats.teams")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-pink-400">
                20+
              </div>
              <div className="text-xs text-muted-foreground dark:text-gray-400">
                {t("home.stats.leagues")}
              </div>
            </div>
          </div>
        </div>

        {/* Hero Animation - Centered */}
        <div className="w-full mt-8 md:mt-10 flex justify-center">
          <div
            className={cn(
              "w-full",
              "max-w-[520px] h-[260px]", // Desktop sizing
              "md:h-[300px] lg:h-[320px]", // Larger screens
              "md:max-w-[480px] lg:max-w-[520px]"
            )}
          >
            <HeroAnimation className="w-full h-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
