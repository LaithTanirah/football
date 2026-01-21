import { TrendingUp } from "lucide-react";
import { Button } from "@/ui2/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/ui2/components/ui/Card";
import { cn } from "@/lib/utils";

interface CommunityFiltersProps {
  city: string;
  userCity?: string | null;
  onCityChange: (city: string) => void;
  allCitiesLabel: string;
  myCityLabel: string;
  quickFiltersLabel: string;
}

export function CommunityFilters({
  city,
  userCity,
  onCityChange,
  allCitiesLabel,
  myCityLabel,
  quickFiltersLabel,
}: CommunityFiltersProps) {
  return (
    <Card className="glass-neon-strong rounded-2xl border-2 border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2 font-bold text-foreground">
          <TrendingUp className="h-4 w-4 text-cyan-400" />
          {quickFiltersLabel}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-1.5">
        <Button
          variant={city === "" ? "default" : "outline"}
          size="sm"
          className={cn(
            "w-full justify-start font-semibold transition-all h-10",
            city === ""
              ? "bg-gradient-to-r from-cyan-500/30 to-purple-500/30 border-cyan-400/50 text-foreground shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              : "border-cyan-400/30 text-gray-300 hover:border-cyan-400/50 hover:text-foreground hover:bg-cyan-500/5"
          )}
          onClick={() => {
            onCityChange("");
          }}
        >
          {allCitiesLabel}
        </Button>
        {userCity && (
          <Button
            variant={city === userCity ? "default" : "outline"}
            size="sm"
            className={cn(
              "w-full justify-start font-semibold transition-all h-10",
              city === userCity
                ? "bg-gradient-to-r from-cyan-500/30 to-purple-500/30 border-cyan-400/50 text-foreground shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                : "border-cyan-400/30 text-gray-300 hover:border-cyan-400/50 hover:text-foreground hover:bg-cyan-500/5"
            )}
            onClick={() => {
              onCityChange(userCity);
            }}
          >
            {myCityLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
