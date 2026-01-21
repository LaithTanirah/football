import { Button } from "@/ui2/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui2/components/ui/Select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/ui2/components/ui/Card";
import { cn } from "@/lib/utils";

interface SquadFormationSelectorProps {
  mode: 5 | 6;
  formationId: string;
  currentFormationName: { en: string; ar: string };
  availableFormations: Array<{ id: string; name: { en: string; ar: string } }>;
  isCaptain: boolean;
  onModeChange: (mode: 5 | 6) => void;
  onFormationChange: (formationId: string) => void;
  locale: "en" | "ar";
  formationLabel: string;
  selectFormationLabel: string;
  fiveASideLabel: string;
  sixASideLabel: string;
}

export function SquadFormationSelector({
  mode,
  formationId,
  currentFormationName,
  availableFormations,
  isCaptain,
  onModeChange,
  onFormationChange,
  locale,
  formationLabel,
  selectFormationLabel,
  fiveASideLabel,
  sixASideLabel,
}: SquadFormationSelectorProps) {
  return (
    <Card className="glass-neon-strong rounded-3xl border-2 border-cyan-400/20 shadow-[0_0_25px_rgba(6,182,212,0.15)]">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl text-foreground">
          {formationLabel}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mode Toggle */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant={mode === 5 ? "default" : "outline"}
            onClick={() => onModeChange(5)}
            disabled={!isCaptain}
            className={cn(
              "flex-1 h-12 font-semibold transition-all",
              mode === 5
                ? "bg-gradient-to-r from-cyan-500/30 to-purple-500/30 border-cyan-400/50 text-foreground shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                : "border-cyan-400/30 text-gray-300 hover:border-cyan-400/50 hover:text-foreground"
            )}
          >
            {fiveASideLabel}
          </Button>
          <Button
            type="button"
            variant={mode === 6 ? "default" : "outline"}
            onClick={() => onModeChange(6)}
            disabled={!isCaptain}
            className={cn(
              "flex-1 h-12 font-semibold transition-all",
              mode === 6
                ? "bg-gradient-to-r from-cyan-500/30 to-purple-500/30 border-cyan-400/50 text-foreground shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                : "border-cyan-400/30 text-gray-300 hover:border-cyan-400/50 hover:text-foreground"
            )}
          >
            {sixASideLabel}
          </Button>
        </div>

        {/* Formation Selector */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-300 dark:text-gray-300 uppercase tracking-wide">
            {selectFormationLabel}
          </label>
          <Select
            value={formationId}
            onValueChange={onFormationChange}
            disabled={!isCaptain}
          >
            <SelectTrigger className="h-12 border-cyan-400/30 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 text-foreground hover:border-cyan-400/50">
              <SelectValue>
                {currentFormationName[locale]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="glass-neon-strong border-cyan-400/30">
              {availableFormations.map((formation) => (
                <SelectItem
                  key={formation.id}
                  value={formation.id}
                  className="text-foreground hover:bg-cyan-500/20 focus:bg-cyan-500/20"
                >
                  {formation.name[locale]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
