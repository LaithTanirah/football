import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { t } = useTranslation();
  const { isRTL } = useDirection();

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

  const getTranslatedStatus = (status: string): string => {
    const upperStatus = status.toUpperCase();
    switch (upperStatus) {
      case "DRAFT":
        return t("leagues.draft");
      case "ACTIVE":
        return t("leagues.active");
      case "COMPLETED":
        return t("leagues.completed");
      default:
        return status;
    }
  };

  return (
    <span
      className={cn(
        "sports-badge border-2 font-bold inline-block",
        getVariant(status),
        isRTL ? "text-end" : "text-start",
        className
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {getTranslatedStatus(status)}
    </span>
  );
}

