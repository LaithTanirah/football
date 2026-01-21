import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/authStore";
import { useDirection } from "@/hooks/useDirection";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { GlobalSearch } from "@/components/admin/GlobalSearch";
import { UserAvatar } from "@/components/UserAvatar";
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
import logoImageSmall from "@/assets/small-icon.jpg?url";
import logoImageLarge from "@/assets/large-icon.jpg?url";

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
      {/* Main Layout - Flexbox for RTL/LTR switching */}
      <div
        className="adminShell w-full"
        dir={isRTL ? "rtl" : "ltr"}
        data-dir={isRTL ? "rtl" : "ltr"}
        data-sidebar-collapsed={sidebarCollapsed ? "true" : "false"}
        data-admin-layout
      >
        {/* Sidebar - Desktop */}
        <aside
          className={cn(
            "adminSidebar glass-strong hidden lg:flex flex-col transition-all duration-300",
            isRTL ? "border-l border-glass-border" : "border-r border-glass-border"
          )}
        >
          {/* Logo Section */}
          <div
            className={cn(
              "flex-shrink-0 flex flex-col border-b border-glass-border py-4",
              isRTL ? "items-end pr-5 pl-4" : "items-start pl-5 pr-4"
            )}
          >
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center mb-2">
              <picture>
                <source media="(min-width: 768px)" srcSet={logoImageLarge} />
              <img
                  src={logoImageSmall}
                alt="PLAYRO LEAGUE"
                className="w-full h-full object-contain"
              />
              </picture>
            </div>
            {!sidebarCollapsed && (
              <div className={cn(
                "flex flex-col",
                isRTL ? "items-end" : "items-start"
              )}>
                <span className="text-sm font-semibold text-foreground leading-tight">
                  PLAYRO
                </span>
                <span className="text-xs text-gray-300 leading-tight">
                  LEAGUE
                </span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 space-y-1" dir={isRTL ? "rtl" : "ltr"}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 relative min-w-0",
                    active
                      ? "glass-strong bg-gradient-to-r from-cyan-500/10 to-purple-500/5 text-foreground shadow-sm glow-blue"
                      : "text-muted-foreground hover:bg-cyan-500/10 hover:text-foreground",
                    sidebarCollapsed && "justify-center px-2",
                    !isRTL && "flex-row",
                    isRTL && "flex-row-reverse"
                  )}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span className="truncate min-w-0 text-start">{item.label}</span>}
                  {active && !sidebarCollapsed && (
                    <div
                      className={cn(
                        "absolute inset-y-0 w-1 bg-foreground",
                        isRTL ? "left-0 rounded-l-full" : "right-0 rounded-r-full"
                      )}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Collapse Toggle */}
          <div className="flex-shrink-0 p-4 border-t border-glass-border">
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

        {/* Sidebar - Mobile - Drawer overlay */}
        <aside
          className={cn(
            "glass-strong fixed inset-y-0 z-50 w-64 border-r border-glass-border transform transition-transform duration-300 lg:hidden overflow-x-hidden",
            isRTL ? "right-0 border-l border-r-0" : "left-0",
            sidebarOpen
              ? "translate-x-0"
              : isRTL
              ? "translate-x-full"
              : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between px-4 border-b border-glass-border relative py-4">
            <div className={cn(
              "absolute inset-0 flex flex-col justify-center",
              isRTL ? "items-end pr-5 pl-4" : "items-start pl-5 pr-4"
            )}>
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center mb-2">
                <picture>
                  <source media="(min-width: 768px)" srcSet={logoImageLarge} />
                <img
                    src={logoImageSmall}
                  alt="PLAYRO LEAGUE"
                  className="w-full h-full object-contain"
                />
                </picture>
              </div>
              <div className={cn(
                "flex flex-col",
                isRTL ? "items-end" : "items-start"
              )}>
                <span className="text-sm font-semibold text-foreground leading-tight">
                  PLAYRO
                </span>
                <span className="text-xs text-gray-300 leading-tight">
                  LEAGUE
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "lg:hidden relative z-10",
                isRTL ? "mr-auto" : "ml-auto"
              )}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-1" dir={isRTL ? "rtl" : "ltr"}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 relative min-w-0",
                    active
                      ? "glass-strong bg-gradient-to-r from-cyan-500/10 to-purple-500/5 text-foreground shadow-sm glow-blue"
                      : "text-gray-300 hover:bg-cyan-500/10 hover:text-foreground",
                    !isRTL && "flex-row",
                    isRTL && "flex-row-reverse"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate min-w-0 text-start">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="adminMain flex flex-col min-w-0 overflow-hidden flex-1">
          {/* Top Bar */}
          <header
            className="glass-strong flex-shrink-0 h-16 border-b border-glass-border flex items-center justify-between px-6 sticky top-0 z-30"
            style={{ overflow: "visible" }}
          >
            <div
              className="flex items-center gap-4 flex-1 min-w-0"
              style={{ overflow: "visible", maxWidth: "100%" }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex-shrink-0"
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* Global Search - Never gets cut off */}
              <div
                className="hidden md:block flex-1 min-w-0 max-w-full"
                style={{ overflow: "visible", width: "100%" }}
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
                      className="flex items-center gap-2 cursor-pointer text-foreground"
                    >
                      <User className="h-4 w-4 text-foreground" />
                      {t("profile.title")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/"
                      className="flex items-center gap-2 cursor-pointer text-foreground"
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
          <main className="adminMainContent flex-1 min-h-0 overflow-y-auto overflow-x-hidden relative">
            <div 
              className="max-w-full p-6" 
              dir={isRTL ? "rtl" : "ltr"}
            >
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
