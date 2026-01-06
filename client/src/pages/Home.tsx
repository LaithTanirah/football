import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trophy, Users, Calendar } from "lucide-react";

export function Home() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 page-section">
      <div className="mx-auto max-w-4xl text-center mb-16">
        <h1 className="text-page-title mb-6 text-text-primary">{t("home.title")}</h1>
        <p className="text-body text-text-muted mb-8">
          {t("home.subtitle")}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/pitches">
            <Button size="lg" className="font-bold">{t("home.browsePitches")}</Button>
          </Link>
          <Link to="/teams">
            <Button size="lg" variant="secondary">
              {t("home.findTeams")}
            </Button>
          </Link>
          <Link to="/leagues">
            <Button size="lg" variant="outline">
              {t("home.joinLeagues")}
            </Button>
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <Calendar className="mb-2 h-8 w-8 text-brand-blue" />
            <CardTitle className="text-section-title">{t("home.bookPitches")}</CardTitle>
            <CardDescription className="text-caption">{t("home.bookPitchesDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/pitches">
              <Button variant="outline" className="w-full font-semibold">
                {t("home.browsePitches")}
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Users className="mb-2 h-8 w-8 text-brand-blue" />
            <CardTitle className="text-section-title">{t("home.createTeams")}</CardTitle>
            <CardDescription className="text-caption">{t("home.createTeamsDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/teams">
              <Button variant="outline" className="w-full font-semibold">
                {t("home.findTeams")}
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Trophy className="mb-2 h-8 w-8 text-brand-blue" />
            <CardTitle className="text-section-title">{t("home.joinLeagues")}</CardTitle>
            <CardDescription className="text-caption">{t("home.joinLeaguesDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/leagues">
              <Button variant="outline" className="w-full font-semibold">
                {t("home.joinLeagues")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
