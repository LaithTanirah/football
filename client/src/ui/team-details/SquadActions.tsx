import { Loader2, RotateCcw, Save } from "lucide-react";
import { Button } from "@/ui2/components/ui/Button";
import { cn } from "@/lib/utils";
import { useDirection } from "@/hooks/useDirection";

interface SquadActionsProps {
  isCaptain: boolean;
  isSaving: boolean;
  onSave: () => void;
  onReset: () => void;
  saveLabel: string;
  resetLabel: string;
  loadingLabel: string;
}

export function SquadActions({
  isCaptain,
  isSaving,
  onSave,
  onReset,
  saveLabel,
  resetLabel,
  loadingLabel,
}: SquadActionsProps) {
  const { isRTL } = useDirection();

  if (!isCaptain) return null;

  return (
    <div className="flex gap-4">
      <Button
        onClick={onSave}
        disabled={isSaving}
        className={cn(
          "h-12 px-6 font-semibold",
          "bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700",
          "border-2 border-cyan-400/50 text-foreground",
          "shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]",
          "transition-all"
        )}
      >
        {isSaving ? (
          <>
            <Loader2 className={cn("h-4 w-4 animate-spin", isRTL ? "ml-2" : "mr-2")} />
            {loadingLabel}
          </>
        ) : (
          <>
            <Save className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
            {saveLabel}
          </>
        )}
      </Button>
      <Button
        variant="outline"
        onClick={onReset}
        disabled={isSaving}
        className={cn(
          "h-12 px-6 font-semibold",
          "border-2 border-cyan-400/30 text-gray-300",
          "hover:border-cyan-400/50 hover:text-foreground hover:bg-cyan-500/10",
          "transition-all"
        )}
      >
        <RotateCcw className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
        {resetLabel}
      </Button>
    </div>
  );
}
