import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, isLoading } = useAuthStore();
  const { t } = useTranslation();

  // Note: User data is already fetched by App.tsx when route changes
  // No need to fetch again here to avoid infinite loops

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">{t("common.loading")}</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-bg-page flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-section-title text-text-primary">
              {t("admin.accessDenied")}
            </CardTitle>
            <CardDescription className="text-caption">
              {t("admin.accessDeniedDesc")}
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
              Refresh User Data
            </Button>
            <Link to="/">
              <Button className="w-full" variant="default">
                <ArrowLeft className="h-4 w-4 me-2" />
                {t("admin.backToHome")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

