import { useTranslation } from "react-i18next";
import { GameHeader } from "../../components/GameHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { Construction } from "lucide-react";

export function GuessPlayerGame() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <GameHeader title={t("games.guessPlayer.title")} />
      <Card>
        <CardContent className="p-12">
          <EmptyState
            icon={<Construction className="h-12 w-12" />}
            title={t("games.guessPlayer.comingSoon")}
            description={t("games.guessPlayer.comingSoonDesc")}
          />
        </CardContent>
      </Card>
    </div>
  );
}

