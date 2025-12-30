import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Helper function to translate error messages
const getTranslatedError = (error: any, t: (key: string) => string): string => {
  const errorCode = error?.response?.data?.code;
  const errorMessage = error?.response?.data?.message;

  // Map error codes to translation keys
  const errorCodeMap: Record<string, string> = {
    INVALID_CREDENTIALS: 'auth.invalidCredentials',
    USER_NOT_FOUND: 'auth.invalidCredentials',
    NO_TOKEN: 'auth.loginError',
    INVALID_TOKEN: 'auth.loginError',
  };

  // Check if we have a translation key for this error code
  if (errorCode && errorCodeMap[errorCode]) {
    return t(errorCodeMap[errorCode]);
  }

  // Check if the error message matches common patterns
  if (errorMessage) {
    const lowerMessage = errorMessage.toLowerCase();
    if (lowerMessage.includes('invalid credentials') || lowerMessage.includes('invalid credential')) {
      return t('auth.invalidCredentials');
    }
  }

  // Fallback to generic error
  return t('auth.loginError');
};

export function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setTokenAndUser } = useAuthStore();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      const { user, token } = response.data.data;
      if (token && user) {
        setTokenAndUser(token, user);
        toast({
          title: t("common.success"),
          description: t("auth.loginSuccess"),
        });
        navigate("/pitches");
      } else {
        toast({
          title: t("common.error"),
          description: t("auth.loginError"),
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: t("common.error"),
        description: getTranslatedError(error, t),
        variant: "destructive",
      });
    },
  });

  // Quick login for development
  const handleQuickLogin = (username: string, password: string) => {
    setFormData({ username, password });
    mutation.mutate({ username, password });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-[1200px] px-4 py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-12rem)]">
          {/* Brand Section - Left (Desktop) / Top (Mobile) */}
          <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-6 py-8 lg:py-0">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-5xl">⚽</span>
              <span className="text-3xl font-bold">6-a-Side</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
              {t("home.brandHeadline")}
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              {t("home.brandSubtitle")}
            </p>
            <div 
              className="hidden lg:block w-full h-64 rounded-2xl mt-8"
              style={{
                background: `linear-gradient(135deg, hsl(var(--primary)/0.1), hsl(var(--primary)/0.05))`
              }}
            />
          </div>

          {/* Form Section - Right (Desktop) / Bottom (Mobile) */}
          <div className="flex justify-center lg:justify-end w-full">
            <Card className="w-full max-w-[420px] card-elevated">
              <CardHeader className="space-y-2">
                <CardTitle className="text-2xl">{t("auth.login")}</CardTitle>
                <CardDescription className="text-base">
                  {t("auth.loginSubtitle")}
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium">
                      {t("auth.username")}
                    </Label>
                    <Input
                      id="username"
                      placeholder={t("auth.username")}
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      required
                      className="h-[52px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      {t("auth.password")}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder={t("auth.password")}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                      className="h-[52px]"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 pt-2">
                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-medium"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? t("common.loading") : t("auth.login")}
                  </Button>
                  
                  {/* Quick Login Buttons for Development */}
                  {isDevelopment && (
                    <div className="w-full space-y-2 pt-2 border-t">
                      <p className="text-xs text-muted-foreground text-center mb-2">
                        🛠️ Development Quick Login
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickLogin("admin", "admin123")}
                          disabled={mutation.isPending}
                          className="text-xs"
                        >
                          Admin
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickLogin("user1", "password123")}
                          disabled={mutation.isPending}
                          className="text-xs"
                        >
                          User 1
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickLogin("user2", "password123")}
                          disabled={mutation.isPending}
                          className="text-xs"
                        >
                          User 2
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickLogin("nazzal", "password123")}
                          disabled={mutation.isPending}
                          className="text-xs"
                        >
                          Nazzal
                        </Button>
                      </div>
                    </div>
                  )}

                  <p className="text-center text-sm text-muted-foreground">
                    {t("auth.dontHaveAccount")}{" "}
                    <Link
                      to="/auth/register"
                      className="text-primary hover:underline font-medium"
                    >
                      {t("auth.register")}
                    </Link>
                  </p>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
