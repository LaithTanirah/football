import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface ScoreSummaryProps {
  title: string;
  score: number;
  total?: number;
  bestScore?: number;
  bestScoreLabel?: string;
}

export function ScoreSummary({
  title,
  score,
  total,
  bestScore,
  bestScoreLabel,
}: ScoreSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-2">
          {score}
          {total !== undefined && ` / ${total}`}
        </div>
        {bestScore !== undefined && bestScoreLabel && (
          <div className="text-sm text-muted-foreground">
            {bestScoreLabel}: {bestScore}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

