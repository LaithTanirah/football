import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case "DRAFT":
        return "bg-primary/10 text-primary border-primary/30";
      case "ACTIVE":
        return "bg-secondary/10 text-secondary border-secondary/30";
      case "COMPLETED":
        return "bg-accent/10 text-accent border-accent/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <span
      className={cn(
        "sports-badge border-2 font-bold",
        getVariant(status),
        className
      )}
    >
      {status}
    </span>
  );
}

