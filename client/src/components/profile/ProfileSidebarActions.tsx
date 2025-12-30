import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/store/themeStore";
import { useLocaleStore } from "@/store/localeStore";
import { Plus, Trophy, Search, Moon, Sun, Languages } from "lucide-react";

export function ProfileSidebarActions() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useThemeStore();
  const { locale, setLocale } = useLocaleStore();

  return (
    <>
      {/* Quick Actions */}
      <Card className="p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
        <h2 className="text-xl font-semibold mb-4">{t("profile.quickActions")}</h2>
        <div className="space-y-3">
          <Link to="/teams/create" className="block">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Plus className="h-4 w-4" />
              {t("profile.createTeam")}
            </Button>
          </Link>
          <Link to="/leagues" className="block">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Trophy className="h-4 w-4" />
              {t("profile.joinLeague")}
            </Button>
          </Link>
          <Link to="/pitches" className="block">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Search className="h-4 w-4" />
              {t("profile.browsePitches")}
            </Button>
          </Link>
        </div>
      </Card>

      {/* Preferences */}
      <Card className="p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
        <h2 className="text-xl font-semibold mb-4">{t("profile.preferences")}</h2>
        <div className="space-y-4">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {theme === "dark" ? (
                <Moon className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Sun className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm">{t("profile.theme")}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="gap-2"
            >
              {theme === "dark" ? (
                <>
                  <Moon className="h-3 w-3" />
                  {t("profile.dark")}
                </>
              ) : (
                <>
                  <Sun className="h-3 w-3" />
                  {t("profile.light")}
                </>
              )}
            </Button>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{t("profile.language")}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
              className="gap-2"
            >
              {locale === "ar" ? "العربية" : "English"}
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}

