import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDirection } from '@/hooks/useDirection';
import { cn } from '@/lib/utils';

interface AdminRouteProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class AdminErrorBoundary extends Component<
  { children: ReactNode; t: (key: string) => string; isRTL: boolean },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode; t: (key: string) => string; isRTL: boolean }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Admin Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg-page flex items-center justify-center p-4" dir={this.props.isRTL ? 'rtl' : 'ltr'}>
          <Card className="w-full max-w-md glass-neon-strong">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="h-6 w-6 text-destructive" />
                <CardTitle className="text-section-title text-text-primary">
                  {this.props.t("admin.error.title") || "Something went wrong"}
                </CardTitle>
              </div>
              <CardDescription className="text-caption">
                {this.props.t("admin.error.description") || "An error occurred while loading the admin panel."}
              </CardDescription>
              {this.state.error && (
                <CardDescription className="text-caption mt-2 text-muted-foreground font-mono text-xs">
                  {this.state.error.message}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full"
                variant="default"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
              >
                {this.props.t("admin.error.reload") || "Reload Page"}
              </Button>
              <Link to="/">
                <Button className="w-full" variant="outline">
                  <ArrowLeft className={cn("h-4 w-4", this.props.isRTL ? "ml-2" : "mr-2")} />
                  {this.props.t("admin.backToHome") || "Back to Home"}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, isLoading, fetchUser } = useAuthStore();
  const { t } = useTranslation();
  const { isRTL } = useDirection();

  // Show loading UI instead of null
  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-page flex items-center justify-center" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="text-muted-foreground">{t("common.loading") || "Loading..."}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-bg-page flex items-center justify-center p-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <Card className="w-full max-w-md glass-neon-strong">
          <CardHeader>
            <CardTitle className="text-section-title text-text-primary">
              {t("admin.accessDenied") || "Access Denied"}
            </CardTitle>
            <CardDescription className="text-caption">
              {t("admin.accessDeniedDesc") || "You don't have permission to access this page."}
            </CardDescription>
            <CardDescription className="text-caption mt-2 text-destructive">
              Current role: {user.role || 'NONE'} (Required: ADMIN)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full"
              variant="outline"
              onClick={() => {
                fetchUser();
                window.location.reload();
              }}
            >
              {t("admin.refresh") || "Refresh User Data"}
            </Button>
            <Link to="/">
              <Button className="w-full" variant="default">
                <ArrowLeft className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                {t("admin.backToHome") || "Back to Home"}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AdminErrorBoundary t={t} isRTL={isRTL}>
      {children}
    </AdminErrorBoundary>
  );
}

