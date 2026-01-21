import { Link } from "react-router-dom";
import { Button } from "@/ui2/components/ui/Button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminQuickActionButtonProps {
  label: string;
  to: string;
  icon: LucideIcon;
  gradient: string;
}

export function AdminQuickActionButton({
  label,
  to,
  icon: Icon,
  gradient,
}: AdminQuickActionButtonProps) {
  return (
    <Link to={to} className="block">
      <Button
        variant="default"
        className={cn(
          "w-full h-auto flex flex-col items-center gap-3 py-5 text-foreground shadow-sm hover:shadow-md transition-all rounded-xl border-2 border-cyan-400/30",
          gradient
        )}
      >
        <Icon className="h-6 w-6" />
        <span className="text-sm font-semibold">{label}</span>
      </Button>
    </Link>
  );
}
