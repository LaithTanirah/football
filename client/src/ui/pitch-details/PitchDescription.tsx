import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui2/components/ui/Card";

interface PitchDescriptionProps {
  description?: string;
}

export function PitchDescription({ description }: PitchDescriptionProps) {
  const { t } = useTranslation();
  const { dir } = useDirection();

  if (!description) {
    return null;
  }

  return (
    <section 
      className="animate-fade-in-up"
      style={{ animationDelay: '400ms', animationDuration: '800ms' }}
      dir={dir}
    >
      <Card className="glass-neon-strong rounded-3xl border-2 border-cyan-400/30 overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-foreground text-2xl">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border-2 border-cyan-400/50 flex items-center justify-center">
              <Star className="h-5 w-5 text-cyan-300" />
            </div>
            {t("common.description")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed text-foreground text-lg">
            {description}
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
