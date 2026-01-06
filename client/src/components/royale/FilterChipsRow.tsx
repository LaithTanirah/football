import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilterChip {
  label: string;
  value: string;
  onRemove: () => void;
}

interface FilterChipsRowProps {
  chips: FilterChip[];
  onClearAll?: () => void;
  className?: string;
}

export function FilterChipsRow({ chips, onClearAll, className }: FilterChipsRowProps) {
  if (chips.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2 mb-4", className)}>
      {chips.map((chip) => (
        <div
          key={chip.value}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-sm border border-border"
        >
          <span>{chip.label}</span>
          <button
            onClick={chip.onRemove}
            className="hover:bg-muted-foreground/20 rounded-full p-0.5 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
      {onClearAll && chips.length > 1 && (
        <Button variant="ghost" size="sm" onClick={onClearAll} className="h-7 text-xs">
          Clear all
        </Button>
      )}
    </div>
  );
}

