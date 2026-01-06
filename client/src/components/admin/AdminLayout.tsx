import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/authStore";
import { useDirection } from "@/hooks/useDirection";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { GlobalSearch } from "@/components/admin/GlobalSearch";
import { UserAvatar } from "@/components/UserAvatar";
import { AppLoader } from "@/components/common/AppLoader";
import {
  LayoutDashboard,
  Users,
  UsersRound,
  Trophy,
  MapPin,
  FileText,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import logoImage from "@/assets/Logo.jpg?url";

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function AdminLayout() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Track initial load - hide loader after minimum display time
  useEffect(() => {
    // Show loader for initial load
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 850); // Hide after 850ms (loader shows for 800ms + fade time)
    return () => clearTimeout(timer);
  }, []);

  const navItems: NavItem[] = [
    {
      to: "/admin/overview",
      label: t("admin.nav.overview"),
      icon: LayoutDashboard,
    },
    { to: "/admin/users", label: t("admin.nav.users"), icon: Users },
    { to: "/admin/teams", label: t("admin.nav.teams"), icon: UsersRound },
    { to: "/admin/leagues", label: t("admin.nav.leagues"), icon: Trophy },
    { to: "/admin/pitches", label: t("admin.nav.pitches"), icon: MapPin },
    { to: "/admin/posts", label: t("admin.nav.posts"), icon: FileText },
    { to: "/admin/settings", label: t("admin.nav.settings"), icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login");
  };

  const isActive = (path: string) => {
    if (path === "/admin/overview") {
      return (
        location.pathname === "/admin" ||
        location.pathname === "/admin/overview"
      );
    }
    return location.pathname.startsWith(path);
  };

  // Single source of truth for sidebar width
  const sidebarWidthPx = sidebarCollapsed ? "80px" : "256px";

  return (
    <>
      {/* App Loader */}
      <AppLoader initialLoad={isInitialLoad} />

      {/* Main Layout - Using Flex for stable layout */}
      {/* Do not use gap/justify-between here - sidebar and main must touch with zero gap */}
      {/* RTL: sidebar on right, LTR: sidebar on left */}
      <div
        className="min-h-screen bg-bg-page w-full flex"
        dir={isRTL ? "rtl" : "ltr"}
        style={{
          flexDirection: isRTL ? "row-reverse" : "row",
          gap: 0,
        }}
      >
        {/* Sidebar - Desktop */}
        {/* Width controlled by single style prop - no Tailwind width classes */}
        {/* RTL: sidebar on right (order: 2), LTR: sidebar on left (order: 1) */}
        <aside
          className={cn(
            "hidden lg:flex flex-col bg-bg-surface transition-all duration-300",
            isRTL
              ? "border-s border-border-soft"
              : "border-e border-border-soft"
          )}
          style={{
            width: sidebarWidthPx,
            flex: "0 0 auto",
            position: "sticky",
            top: 0,
            height: "100dvh",
            overflowY: "auto",
            order: isRTL ? 2 : 1,
          }}
        >
          {/* Logo Section */}
          <div
            className={cn(
              "h-16 flex items-center gap-3 px-6 border-b border-border-soft",
              sidebarCollapsed && "justify-center"
            )}
          >
            <div className="flex-shrink-0 w-10 h-10 p-2 rounded-xl bg-white border-2 border-border-soft shadow-sm flex items-center justify-center">
              <img
                src={logoImage}
                alt="PLAYRO LEAGUE"
                className="w-full h-full object-contain"
              />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-bold text-brand-blue leading-tight">
                  PLAYRO
                </span>
                <span className="text-xs font-semibold text-text-muted leading-tight">
                  LEAGUE
                </span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all relative group",
                    active
                      ? "bg-brand-blue text-white shadow-sm"
                      : "text-text-muted hover:bg-bg-surface hover:text-text-primary",
                    sidebarCollapsed && "justify-center px-3"
                  )}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                  {active && !sidebarCollapsed && (
                    <div
                      className={cn(
                        "absolute inset-y-0 w-1 bg-white rounded-r-full",
                        isRTL ? "left-0" : "right-0"
                      )}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Collapse Toggle */}
          <div className="p-4 border-t border-border-soft">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full"
              title={
                sidebarCollapsed
                  ? t("admin.sidebar.expand")
                  : t("admin.sidebar.collapse")
              }
            >
              {sidebarCollapsed ? (
                isRTL ? (
                  <ChevronLeft className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )
              ) : isRTL ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </Button>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay - Fixed positioning, not part of flex layout */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar - Mobile - Fixed positioning, not part of flex layout */}
        <aside
          className={cn(
            "fixed inset-y-0 z-50 w-64 bg-bg-surface border-e border-border-soft transform transition-transform duration-300 lg:hidden",
            isRTL ? "right-0 border-s" : "left-0 border-e",
            sidebarOpen
              ? "translate-x-0"
              : isRTL
              ? "translate-x-full"
              : "-translate-x-full"
          )}
        >
          <div className="h-16 flex items-center justify-between px-6 border-b border-border-soft">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 p-2 rounded-xl bg-white border-2 border-border-soft shadow-sm flex items-center justify-center">
                <img
                  src={logoImage}
                  alt="PLAYRO LEAGUE"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-brand-blue leading-tight">
                  PLAYRO
                </span>
                <span className="text-xs font-semibold text-text-muted leading-tight">
                  LEAGUE
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all relative",
                    active
                      ? "bg-brand-blue text-white shadow-sm"
                      : "text-text-muted hover:bg-bg-surface hover:text-text-primary"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.label}</span>
                  {active && (
                    <div
                      className={cn(
                        "absolute inset-y-0 w-1 bg-white rounded-r-full",
                        isRTL ? "left-0" : "right-0"
                      )}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        {/* Do not use gap/justify-between here - main must touch sidebar with zero gap */}
        {/* RTL: main on left (order: 1), LTR: main on right (order: 2) */}
        <div
          className="flex flex-col relative min-w-0 flex-1"
          style={{
            flex: "1 1 auto",
            minWidth: 0,
            overflowX: "hidden",
            maxWidth: "100%",
            order: isRTL ? 1 : 2,
          }}
        >
          {/* Top Bar */}
          <header
            className="h-16 bg-bg-surface border-b border-border-soft flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 shadow-sm"
            style={{ overflow: "visible" }}
          >
            <div
              className="flex items-center gap-4 flex-1 min-w-0"
              style={{ overflow: "visible" }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex-shrink-0"
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* Global Search */}
              <div
                className="hidden md:block flex-1 min-w-0"
                style={{ overflow: "visible" }}
              >
                <GlobalSearch sidebarCollapsed={sidebarCollapsed} />
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <LanguageSwitcher />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 h-9 cursor-pointer"
                  >
                    <UserAvatar user={user} size="sm" />
                    <span className="hidden sm:inline font-medium">
                      {user?.name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align={isRTL ? "start" : "end"}
                  className="w-56"
                >
                  <DropdownMenuItem asChild>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <User className="h-4 w-4" />
                      {t("profile.title")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      {t("admin.backToSite")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive-foreground bg-destructive/10 hover:bg-destructive/20 focus:bg-destructive/20 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 me-2" />
                    {t("nav.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-bg-page">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
