import { useTranslation } from "react-i18next";
import { Calendar, Users, Trophy, ArrowRight, CheckCircle2 } from "lucide-react";
import { AnimatedHero } from "@/ui2/components/layout/AnimatedHero";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui2/components/ui/Card";
import { Button } from "@/ui2/components/ui/Button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useDirection } from "@/hooks/useDirection";

export function Home() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();

  const features = [
    {
      icon: Calendar,
      title: t("home.bookPitches"),
      description: t("home.bookPitchesDesc"),
      href: "/pitches",
      benefits: [
        t("home.features.booking.bullets.easy"),
        t("home.features.booking.bullets.realtime"),
        t("home.features.booking.bullets.instant"),
      ],
      color: "cyan",
      gradient: "from-cyan-400 via-cyan-500 to-cyan-600",
    },
    {
      icon: Users,
      title: t("home.createTeams"),
      description: t("home.createTeamsDesc"),
      href: "/teams",
      benefits: [
        t("home.features.teams.bullets.management"),
        t("home.features.teams.bullets.profiles"),
        t("home.features.teams.bullets.history"),
      ],
      color: "purple",
      gradient: "from-purple-400 via-purple-500 to-pink-500",
    },
    {
      icon: Trophy,
      title: t("home.joinLeagues"),
      description: t("home.joinLeaguesDesc"),
      href: "/leagues",
      benefits: [
        t("home.features.leagues.bullets.competitive"),
        t("home.features.leagues.bullets.leaderboards"),
        t("home.features.leagues.bullets.rewards"),
      ],
      color: "pink",
      gradient: "from-pink-400 via-pink-500 to-cyan-400",
    },
  ];

  const colorClasses = {
    cyan: {
      border: "border-cyan-400/15 dark:border-cyan-400/18",
      iconBg: "bg-cyan-500/30 dark:bg-cyan-500/20",
      iconColor: "text-cyan-600 dark:text-cyan-400 fill-cyan-600 dark:fill-cyan-400",
      checkColor: "text-cyan-600 dark:text-cyan-400 fill-cyan-600 dark:fill-cyan-400",
      hoverGlow: "hover:shadow-lg",
    },
    purple: {
      border: "border-purple-400/60 dark:border-purple-400/40",
      iconBg: "bg-purple-500/30 dark:bg-purple-500/20",
      iconColor: "text-purple-600 dark:text-purple-400 fill-purple-600 dark:fill-purple-400",
      checkColor: "text-purple-600 dark:text-purple-400 fill-purple-600 dark:fill-purple-400",
      hoverGlow: "hover:shadow-lg",
    },
    pink: {
      border: "border-pink-400/15 dark:border-pink-400/18",
      iconBg: "bg-pink-500/30 dark:bg-pink-500/20",
      iconColor: "text-pink-600 dark:text-pink-400 fill-pink-600 dark:fill-pink-400",
      checkColor: "text-pink-600 dark:text-pink-400 fill-pink-600 dark:fill-pink-400",
      hoverGlow: "hover:shadow-lg",
    },
  };

  return (
    <div className="w-full relative min-h-screen">
      {/* Main Container: 2-column layout on desktop, stacked on mobile */}
      <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-10 pt-20 md:pt-24 pb-12 md:pb-16">
        <div className={cn(
          "grid gap-10 lg:gap-16",
          "grid-cols-1", // Mobile: single column
          "lg:grid-cols-[1fr_1fr]", // Desktop: equal columns that swap
          "items-start" // Align to start for baseline alignment
        )}>
          {/* HERO COLUMN - Swaps position based on direction */}
          <main className={cn(
            "order-1", // Mobile: always first
            isRTL ? "lg:order-1" : "lg:order-2" // RTL: left (order-1), LTR: right (order-2)
          )}>
            <AnimatedHero
              title={t("home.title")}
              description={t("home.subtitle")}
              primaryAction={{
                label: t("home.browsePitches"),
                href: "/pitches",
              }}
              secondaryActions={[
                {
                  label: t("home.joinLeagues"),
                  href: "/leagues",
                },
                {
                  label: t("home.findTeams"),
                  href: "/teams",
                },
              ]}
            />
          </main>

          {/* CTA CARDS COLUMN - Swaps position based on direction */}
          <aside className={cn(
            "order-2", // Mobile: always second
            isRTL ? "lg:order-2" : "lg:order-1", // RTL: right (order-2), LTR: left (order-1)
            "lg:sticky lg:top-20 lg:self-start" // Sticky on desktop, aligned with hero
          )}>
            {/* Section Header - Aligned with Hero Title Baseline */}
            <div className={cn(
              "mb-6 md:mb-8 max-w-[520px]",
              isRTL ? "text-end ms-auto" : "text-start"
            )}>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground dark:text-foregroundmb-2 leading-tight">
                {t("home.featuresTitle")}
              </h2>
              <p className="text-sm md:text-base text-muted-foreground dark:text-gray-300">
                {t("home.featuresDesc")}
              </p>
            </div>

            {/* CTA Cards - Vertical Stack, Reduced Height */}
            <div className={cn(
              "flex flex-col gap-5 lg:gap-6 max-w-[520px]",
              isRTL ? "ms-auto" : "me-auto"
            )}>
              {features.map((feature, index) => {
                const Icon = feature.icon;
                const colors = colorClasses[feature.color as keyof typeof colorClasses];
                
                return (
                  <Link key={index} to={feature.href} className="block">
                    <Card 
                      className={cn(
                        "glass-neon-strong rounded-2xl transition-all duration-300",
                        "hover:-translate-y-0.5",
                        colors.border,
                        colors.hoverGlow,
                        "flex flex-col min-h-[180px] md:min-h-[200px] relative",
                        "shadow-md hover:shadow-xl",
                        "cursor-pointer group"
                      )}
                    >
                      {/* Subtle Gradient Border Glow */}
                      <div className={cn(
                        "absolute inset-0 rounded-2xl opacity-30 pointer-events-none",
                        `bg-gradient-to-r ${feature.gradient} blur-sm`
                      )} style={{ zIndex: 0 }} />
                      
                      <CardHeader className={cn(
                        "space-y-3 pb-3 flex-1 p-5 md:p-6 relative z-10",
                        isRTL ? "text-end" : "text-start"
                      )}>
                        {/* Icon Badge - Left in RTL, Right in LTR */}
                        <div className={cn(
                          "absolute top-5 w-14 h-14 rounded-xl flex items-center justify-center border",
                          colors.iconBg,
                          colors.border,
                          "shadow-md z-20",
                          isRTL ? "left-5" : "right-5"
                        )}>
                          <Icon className={cn("h-7 w-7", colors.iconColor)} />
                        </div>
                        
                        {/* Title and Description Container - Positioned on the right in RTL */}
                        <div className={cn(
                          "flex flex-col",
                          isRTL ? "items-end" : "items-start"
                        )}>
                          <CardTitle className={cn(
                            "text-xl md:text-2xl font-bold text-foreground dark:text-foregroundleading-tight",
                            isRTL ? "pr-0 pl-16 text-right ml-auto" : "pl-0 pr-16 text-left"
                          )}>
                            {feature.title}
                          </CardTitle>
                          
                          <CardDescription className={cn(
                            "text-sm md:text-base leading-relaxed text-muted-foreground dark:text-gray-300",
                            isRTL ? "text-right pr-0 pl-16 ml-auto" : "text-left pl-0 pr-16"
                          )}>
                            {feature.description}
                          </CardDescription>
                        </div>

                        {/* Benefits List - Smaller and Subtle */}
                        <ul className={cn(
                          "space-y-1.5 pt-1",
                          isRTL ? "text-end" : "text-start"
                        )}>
                          {feature.benefits.map((benefit, idx) => (
                            <li key={idx} className={cn(
                              "flex items-center gap-2 text-xs text-muted-foreground dark:text-gray-400 opacity-80",
                              isRTL ? "flex-row-reverse justify-end" : "justify-start"
                            )}>
                              <CheckCircle2 className={cn("h-3.5 w-3.5 flex-shrink-0", colors.checkColor)} />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </CardHeader>
                      
                      {/* Button Container - Always visible at bottom */}
                      <CardContent className="pt-0 pb-6 px-5 md:px-6 mt-auto relative z-10">
                        <Button 
                          variant="outline" 
                          className={cn(
                            "w-full group border border-cyan-400/15 hover:bg-cyan-500/10 hover:border-cyan-400/20",
                            "flex items-center justify-center gap-2 text-sm font-medium h-10 rounded-lg",
                            "transition-all duration-300",
                            "hover:shadow-md",
                            "relative overflow-hidden",
                            isRTL ? "flex-row-reverse" : ""
                          )}
                          onClick={(e) => e.preventDefault()} // Prevent double navigation
                        >
                          <span className="relative z-10">{t("home.getStarted")}</span>
                          <ArrowRight className={cn(
                            "h-4 w-4 transition-transform duration-300 relative z-10",
                            isRTL ? "group-hover:-translate-x-0.5 rotate-180" : "group-hover:translate-x-0.5"
                          )} />
                          {/* Button Inner Glow on Hover */}
                          <span className="absolute inset-0 bg-gradient-to-r from-cyan-500/15 via-transparent to-cyan-500/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
