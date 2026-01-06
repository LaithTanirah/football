import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import logoImage from "@/assets/Logo.jpg?url";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { UserAvatar } from "@/components/UserAvatar";
import { useToast } from "@/components/ui/use-toast";
import {
  Moon,
  Sun,
  LogOut,
  User,
  Menu,
  X,
  Calendar,
  Users,
  Trophy,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const navLinks = [
    { to: "/pitches", label: t("nav.pitches") },
    { to: "/teams", label: t("nav.teams") },
    { to: "/leagues", label: t("nav.leagues") },
    { to: "/community", label: t("community.title") },
    { to: "/games", label: t("games.title") },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-border-soft bg-bg-page/98 backdrop-blur-sm shadow-soft">
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
        {/* Left: Logo + Brand - PLAYRO LEAGUE */}
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-90 transition-opacity group"
        >
          {/* Logo Container - Premium Styling */}
          <div className="flex-shrink-0 w-10 h-10 p-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-soft flex items-center justify-center">
          <img
            src={logoImage}
            alt="PLAYRO LEAGUE"
              className="w-full h-full object-contain"
          />
          </div>
          {/* Brand Text - Readable on Dark */}
          <span className="hidden sm:inline-block text-lg font-bold text-white tracking-wide group-hover:text-slate-100 transition-colors drop-shadow-sm">
            PLAYRO LEAGUE
          </span>
        </Link>

        {/* Center: Bold Navigation Tabs with Blue Underline */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "relative flex flex-col items-center justify-center pb-3 px-1 group",
                "transition-colors"
              )}
            >
              <span
                className={cn(
                  "text-base font-bold transition-colors",
                  isActive(link.to)
                    ? "text-brand-blue"
                    : "text-text-muted hover:text-text-primary"
                )}
              >
                {link.label}
              </span>
              {isActive(link.to) && (
                <span className="absolute bottom-0 inset-x-0 h-1 bg-brand-blue rounded-full" />
              )}
            </Link>
          ))}
        </div>

        {/* Right: Language + Theme + User - Compact and Clean */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          {user ? (
            <>
              {/* Desktop User Menu - Clean Avatar Chip */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden md:flex items-center gap-2 cursor-pointer"
                  >
                    <UserAvatar user={user} size="sm" />
                    <span className="hidden lg:inline font-semibold">
                      {user.name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{t("nav.myAccount")}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4" />
                      {t("profile.title")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/me/bookings" className="flex items-center gap-2 cursor-pointer">
                      <Calendar className="h-4 w-4" />
                      {t("nav.myBookings")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/teams" className="flex items-center gap-2 cursor-pointer">
                      <Users className="h-4 w-4" />
                      {t("nav.teams")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/leagues" className="flex items-center gap-2 cursor-pointer">
                      <Trophy className="h-4 w-4" />
                      {t("nav.leagues")}
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "ADMIN" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center gap-2 cursor-pointer">
                          <Settings className="h-4 w-4" />
                          {t("nav.adminPanel")}
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="!text-destructive-foreground !bg-destructive hover:!bg-destructive/90 focus:!bg-destructive focus:!text-destructive-foreground data-[highlighted]:!bg-destructive/90 data-[highlighted]:!text-destructive-foreground transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 me-2 !text-destructive-foreground" />
                    {t("nav.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </>
          ) : (
            <Link to="/auth/login">
              <Button
                size="sm"
                className="bg-brand-orange hover:bg-brand-orange/90 text-text-invert font-bold shadow-brand"
              >
                {t("nav.login")}
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu - Bottom Sheet Style */}
      {mobileMenuOpen && user && (
        <div className="md:hidden border-t-2 border-border-soft bg-bg-page shadow-medium">
          <div className="container mx-auto max-w-7xl px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-brand text-sm font-bold transition-all relative",
                  isActive(link.to)
                    ? "text-brand-blue bg-brand-blue/10 border-l-4 border-brand-blue"
                    : "text-text-muted hover:text-text-primary hover:bg-bg-surface"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t my-2" />
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm hover:bg-muted"
            >
              {t("profile.title")}
            </Link>
            <Link
              to="/me/bookings"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm hover:bg-muted"
            >
              {t("nav.myBookings")}
            </Link>
            <Link
              to="/teams"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm hover:bg-muted"
            >
              {t("nav.teams")}
            </Link>
            <Link
              to="/leagues"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm hover:bg-muted"
            >
              {t("nav.leagues")}
            </Link>
            {user.role === "ADMIN" && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm hover:bg-muted"
              >
                {t("nav.adminPanel")}
              </Link>
            )}
            <div className="border-t my-2" />
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 rounded-md text-sm text-destructive hover:bg-muted"
            >
              {t("nav.logout")}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
