import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  label: string;
}

interface CategoryStripProps {
  categories: Category[];
  selectedId?: string;
  onSelect: (id: string) => void;
  className?: string;
}

export function CategoryStrip({ categories, selectedId, onSelect, className }: CategoryStripProps) {
  return (
    <div className={cn("overflow-x-auto pb-4 mb-6", className)}>
      <div className="flex gap-3 min-w-max">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={cn(
              "px-6 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap border-2",
              selectedId === category.id
                ? "bg-primary text-primary-foreground border-primary shadow-md"
                : "bg-background text-foreground/70 border-border hover:border-primary/50 hover:text-foreground"
            )}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}

