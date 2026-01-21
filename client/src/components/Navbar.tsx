import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, Sun, Moon, LogIn, LogOut, User, Calendar, Users, Trophy, Settings } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useLocaleStore } from "@/store/localeStore";
import { useThemeStore } from "@/store/themeStore";
import { Button } from "@/ui2/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui2/components/ui/DropdownMenu";
import { UserAvatar } from "@/components/UserAvatar";
import { useToast } from "@/ui2/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useDirection } from "@/hooks/useDirection";

export function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { locale, setLocale } = useLocaleStore();
  const { theme, toggleTheme } = useThemeStore();
  
  // Get text color based on theme
  const textColor = theme === 'dark' ? 'hsl(220 9% 95%)' : 'hsl(220 13% 18%)';
  const { toast } = useToast();
  const { isRTL } = useDirection();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sticky scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    toast({
      title: t("common.success"),
      description: t("auth.logoutSuccess"),
    });
    navigate("/");
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  // Nav links - same order in both languages
  const navLinks = useMemo(() => [
    { to: "/pitches", label: t("nav.pitches") },
    { to: "/teams", label: t("nav.teams") },
    { to: "/leagues", label: t("nav.leagues") },
    { to: "/community", label: t("community.title") },
    { to: "/games", label: t("games.title") },
  ], [t]);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] w-full transition-all duration-300 overflow-visible",
        isScrolled
          ? "bg-white/98 dark:bg-slate-950/90 backdrop-blur-xl border-b border-cyan-400/15 dark:border-cyan-400/18 shadow-md"
          : "bg-white/90 dark:bg-slate-950/50 backdrop-blur-xl border-b border-cyan-400/12 dark:border-cyan-400/15"
      )}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={cn(
          "flex items-center justify-between min-h-[72px] py-3",
          "glass-neon-subtle rounded-2xl px-4 sm:px-6",
          "bg-white/70 dark:bg-transparent backdrop-blur-md",
          "shadow-sm",
          "overflow-visible"
        )}>
          {/* Logo Area */}
          <Link
            to="/"
            className={cn(
              "flex items-center gap-2 sm:gap-3",
              "hover:opacity-80 transition-opacity"
            )}
          >
            <div className="text-xl sm:text-2xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              PLAYRO
            </div>
            <div className="hidden sm:block text-xs sm:text-sm font-semibold text-muted-foreground dark:text-gray-300">
              LEAGUE
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div 
            className={cn(
              "hidden md:flex items-center gap-1 lg:gap-2"
            )}
          >
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    "text-muted-foreground dark:text-gray-400",
                    active
                      ? "text-foreground"
                      : "hover:text-foreground dark:hover:text-foreground",
                    "group"
                  )}
                >
                  <span className="relative z-10">{link.label}</span>
                  {/* Animated Underline */}
                  <span
                    className={cn(
                      "absolute bottom-1 h-0.5 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400",
                      "transition-all duration-300 origin-center",
                      isRTL ? "right-3 left-3" : "left-3 right-3",
                      active
                        ? "scale-x-100 opacity-100"
                        : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-60"
                    )}
                  />
                  {/* Active Glow Background */}
                  {active && (
                    <span
                      className="absolute inset-0 rounded-lg bg-cyan-500/10 dark:bg-cyan-500/15 blur-sm"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Side Controls */}
          <div className={cn(
            "flex items-center gap-2 sm:gap-3",
            isRTL ? "flex-row-reverse" : ""
          )}>
            {/* Language Switch - Compact Segmented Control */}
            <div className={cn(
              "hidden sm:flex items-center gap-1 p-1 rounded-xl h-11",
              "glass-neon-subtle"
            )}>
              <button
                onClick={() => setLocale("en")}
                className={cn(
                  "px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 h-full",
                  locale === "en"
                    ? "bg-cyan-500/10 text-cyan-400 dark:text-cyan-300"
                    : "text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-foreground"
                )}
              >
                EN
              </button>
              <button
                onClick={() => setLocale("ar")}
                className={cn(
                  "px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 h-full",
                  locale === "ar"
                    ? "bg-cyan-500/10 text-cyan-400 dark:text-cyan-300"
                    : "text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-foreground"
                )}
              >
                AR
              </button>
            </div>

            {/* Theme Toggle - Icon Button */}
            <button
              onClick={toggleTheme}
              className={cn(
                "hidden sm:flex items-center justify-center w-11 h-11 rounded-xl",
                "glass-neon-subtle",
                "text-muted-foreground dark:text-gray-400",
                "hover:text-foreground dark:hover:text-foreground hover:bg-cyan-500/10",
                "transition-all duration-200"
              )}
              aria-label={theme === "dark" ? t("nav.switchToLight") : t("nav.switchToDark")}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {/* Login / User Menu */}
            {user ? (
              <>
                {/* Desktop User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        "hidden md:flex items-center gap-2 px-4 py-2 rounded-xl h-11",
                        "glass-neon-subtle",
                        "text-sm font-medium text-muted-foreground dark:text-gray-300",
                        "hover:text-foreground dark:hover:text-foreground hover:bg-cyan-500/10",
                        "transition-all duration-200"
                      )}
                    >
                      <UserAvatar user={user} size="sm" />
                      <span className="hidden lg:inline">{user.name || user.email}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-56" style={{ color: textColor }}>
                    <DropdownMenuLabel className="text-foreground" style={{ color: textColor }}>
                      {t("nav.myAccount")}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link 
                        to="/profile" 
                        className="flex items-center gap-2 cursor-pointer text-foreground"
                        style={{ color: textColor }}
                      >
                        <User className="h-4 w-4 text-foreground" style={{ color: textColor }} />
                        <span style={{ color: textColor }}>{t("profile.title")}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link 
                        to="/me/bookings" 
                        className="flex items-center gap-2 cursor-pointer text-foreground"
                        style={{ color: textColor }}
                      >
                        <Calendar className="h-4 w-4 text-foreground" style={{ color: textColor }} />
                        <span style={{ color: textColor }}>{t("nav.myBookings")}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link 
                        to="/teams" 
                        className="flex items-center gap-2 cursor-pointer text-foreground"
                        style={{ color: textColor }}
                      >
                        <Users className="h-4 w-4 text-foreground" style={{ color: textColor }} />
                        <span style={{ color: textColor }}>{t("nav.teams")}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link 
                        to="/leagues" 
                        className="flex items-center gap-2 cursor-pointer text-foreground"
                        style={{ color: textColor }}
                      >
                        <Trophy className="h-4 w-4 text-foreground" style={{ color: textColor }} />
                        <span style={{ color: textColor }}>{t("nav.leagues")}</span>
                      </Link>
                    </DropdownMenuItem>
                    {user.role === "ADMIN" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link 
                            to="/admin" 
                            className="flex items-center gap-2 cursor-pointer text-foreground"
                            style={{ color: textColor }}
                          >
                            <Settings className="h-4 w-4 text-foreground" style={{ color: textColor }} />
                            <span style={{ color: textColor }}>{t("nav.adminPanel")}</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="!text-red-400 !bg-red-500/10 hover:!bg-red-500/20 focus:!bg-red-500/20 data-[highlighted]:!bg-red-500/20 transition-colors cursor-pointer"
                    >
                      <LogOut className={cn("h-4 w-4 !text-red-400", isRTL ? "ml-2" : "mr-2")} />
                      {t("nav.logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className={cn(
                    "md:hidden flex items-center justify-center w-11 h-11 rounded-xl",
                    "glass-neon-subtle",
                    "text-muted-foreground dark:text-gray-400",
                    "hover:text-foreground dark:hover:text-foreground hover:bg-cyan-500/10",
                    "transition-all duration-200"
                  )}
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/login">
                  <Button
                    size="sm"
                    className="hidden sm:flex h-11 px-5 text-sm font-semibold bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-foreground rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <LogIn className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                    {t("nav.login")}
                  </Button>
                </Link>
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className={cn(
                    "md:hidden flex items-center justify-center w-11 h-11 rounded-xl",
                    "glass-neon-subtle",
                    "text-muted-foreground dark:text-gray-400",
                    "hover:text-foreground dark:hover:text-foreground hover:bg-cyan-500/10",
                    "transition-all duration-200"
                  )}
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className={cn(
              "md:hidden mt-2 rounded-2xl p-4",
              "glass-neon-strong",
              "shadow-md"
            )}
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                      active
                        ? "bg-cyan-500/10 text-cyan-400 dark:text-cyan-300"
                        : "text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-foreground hover:bg-cyan-500/10"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              {user && (
                <>
                  <div className="border-t border-cyan-400/10 my-2" />
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-foreground hover:bg-cyan-500/10 transition-all duration-200"
                  >
                    {t("profile.title")}
                  </Link>
                  <Link
                    to="/me/bookings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-foreground hover:bg-cyan-500/10 transition-all duration-200"
                  >
                    {t("nav.myBookings")}
                  </Link>
                  {user.role === "ADMIN" && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-foreground hover:bg-cyan-500/10 transition-all duration-200"
                    >
                      {t("nav.adminPanel")}
                    </Link>
                  )}
                  <div className="border-t border-cyan-400/10 my-2" />
                  <button
                    onClick={handleLogout}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-200 text-start"
                  >
                    {t("nav.logout")}
                  </button>
                </>
              )}
              {/* Mobile Language & Theme */}
              <div className="flex items-center gap-2 pt-2 border-t border-cyan-400/10">
                <div className="flex items-center gap-1 flex-1">
                  <button
                    onClick={() => setLocale("en")}
                    className={cn(
                      "flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200",
                      locale === "en"
                        ? "bg-cyan-500/20 text-cyan-400 dark:text-cyan-300"
                        : "text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-foreground"
                    )}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLocale("ar")}
                    className={cn(
                      "flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200",
                      locale === "ar"
                        ? "bg-cyan-500/20 text-cyan-400 dark:text-cyan-300"
                        : "text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-foreground"
                    )}
                  >
                    AR
                  </button>
                </div>
                <button
                  onClick={toggleTheme}
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-xl",
                    "glass-neon-subtle",
                    "text-muted-foreground dark:text-gray-400",
                    "hover:text-foreground dark:hover:text-foreground hover:bg-cyan-500/10"
                  )}
                >
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </button>
              </div>
              {/* Mobile Login Button */}
              {!user && (
                <Link to="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    className="w-full mt-2 h-10 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-foreground rounded-xl"
                  >
                    <LogIn className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                    {t("nav.login")}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
