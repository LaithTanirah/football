import { Tabs, TabsList, TabsTrigger } from "@/ui2/components/ui/Tabs";
import { cn } from "@/lib/utils";
import { useDirection } from "@/hooks/useDirection";

interface LeagueTabsProps {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  overviewLabel: string;
  teamsLabel: string;
  fixturesLabel: string;
  standingsLabel: string;
  resultsLabel: string;
}

export function LeagueTabs({
  defaultValue = "overview",
  onValueChange,
  children,
  overviewLabel,
  teamsLabel,
  fixturesLabel,
  standingsLabel,
  resultsLabel,
}: LeagueTabsProps) {
  const { isRTL } = useDirection();

  return (
    <Tabs
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      className="w-full"
    >
      <div className="flex justify-center mb-8">
        <TabsList
          className={cn(
            "inline-flex items-center justify-center gap-2 w-full max-w-3xl",
            "glass-neon-subtle border-2 border-cyan-400/30 rounded-3xl p-2",
            "bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5",
            "shadow-[0_0_20px_rgba(6,182,212,0.15)]",
            "h-[64px]"
          )}
        >
          <TabsTrigger
            value="overview"
            className={cn(
              "rounded-2xl font-semibold transition-all h-full px-4 md:px-6 flex-1",
              "flex items-center justify-center",
              "data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/30 data-[state=active]:to-purple-500/30",
              "data-[state=active]:border-2 data-[state=active]:border-cyan-400/50",
              "data-[state=active]:text-foreground data-[state=active]:shadow-[0_0_20px_rgba(6,182,212,0.5)]",
              "data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200",
              "data-[state=inactive]:hover:bg-cyan-500/5"
            )}
          >
            {overviewLabel}
          </TabsTrigger>
          <TabsTrigger
            value="teams"
            className={cn(
              "rounded-2xl font-semibold transition-all h-full px-4 md:px-6 flex-1",
              "flex items-center justify-center",
              "data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/30 data-[state=active]:to-purple-500/30",
              "data-[state=active]:border-2 data-[state=active]:border-cyan-400/50",
              "data-[state=active]:text-foreground data-[state=active]:shadow-[0_0_20px_rgba(6,182,212,0.5)]",
              "data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200",
              "data-[state=inactive]:hover:bg-cyan-500/5"
            )}
          >
            {teamsLabel}
          </TabsTrigger>
          <TabsTrigger
            value="fixtures"
            className={cn(
              "rounded-2xl font-semibold transition-all h-full px-4 md:px-6 flex-1",
              "flex items-center justify-center",
              "data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/30 data-[state=active]:to-purple-500/30",
              "data-[state=active]:border-2 data-[state=active]:border-cyan-400/50",
              "data-[state=active]:text-foreground data-[state=active]:shadow-[0_0_20px_rgba(6,182,212,0.5)]",
              "data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200",
              "data-[state=inactive]:hover:bg-cyan-500/5"
            )}
          >
            {fixturesLabel}
          </TabsTrigger>
          <TabsTrigger
            value="standings"
            className={cn(
              "rounded-2xl font-semibold transition-all h-full px-4 md:px-6 flex-1",
              "flex items-center justify-center",
              "data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/30 data-[state=active]:to-purple-500/30",
              "data-[state=active]:border-2 data-[state=active]:border-cyan-400/50",
              "data-[state=active]:text-foreground data-[state=active]:shadow-[0_0_20px_rgba(6,182,212,0.5)]",
              "data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200",
              "data-[state=inactive]:hover:bg-cyan-500/5"
            )}
          >
            {standingsLabel}
          </TabsTrigger>
          <TabsTrigger
            value="results"
            className={cn(
              "rounded-2xl font-semibold transition-all h-full px-4 md:px-6 flex-1",
              "flex items-center justify-center",
              "data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/30 data-[state=active]:to-purple-500/30",
              "data-[state=active]:border-2 data-[state=active]:border-cyan-400/50",
              "data-[state=active]:text-foreground data-[state=active]:shadow-[0_0_20px_rgba(6,182,212,0.5)]",
              "data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200",
              "data-[state=inactive]:hover:bg-cyan-500/5"
            )}
          >
            {resultsLabel}
          </TabsTrigger>
        </TabsList>
      </div>
      {children}
    </Tabs>
  );
}
