import { cn } from "@/lib/utils";

interface Category {
  id: string;
  label: string;
}

interface GamesCategoryFilterProps {
  categories: Category[];
  selectedId?: string;
  onSelect: (id: string) => void;
  className?: string;
}

export function GamesCategoryFilter({
  categories,
  selectedId,
  onSelect,
  className,
}: GamesCategoryFilterProps) {
  return (
    <div className={cn("overflow-x-auto pb-4 mb-6", className)}>
      <div className="flex gap-2 min-w-max">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={cn(
              "px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap border-2",
              selectedId === category.id
                ? "bg-gradient-to-r from-cyan-500/30 to-purple-500/30 border-cyan-400/50 text-foreground shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                : "glass-neon-subtle border-cyan-400/20 text-gray-300 hover:border-cyan-400/40 hover:text-foreground"
            )}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}
