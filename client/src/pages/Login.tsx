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
import { useDirection } from "@/hooks/useDirection";
import logoImage from "@/assets/Logo.jpg?url";
import { cn } from "@/lib/utils";

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
  const { t, i18n } = useTranslation();
  const { isRTL } = useDirection();
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
    <div className="min-h-screen bg-bg-page">
      <div className="container mx-auto max-w-[1200px] px-4 py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-12rem)]">
          {/* Brand Section - Left (Desktop) / Top (Mobile) */}
          <div 
            className={cn(
              "flex flex-col justify-center items-center lg:items-start py-8 lg:py-0",
              isRTL ? "text-right" : "text-left"
            )}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <div className="flex flex-col gap-8 w-full">
              {/* Logo Badge - Premium Brand Presentation */}
              <div className="hidden lg:flex flex-col items-center justify-center gap-6">
                {/* Outer container with glow effect */}
                <div className="relative flex justify-center items-center">
                  {/* Subtle glow behind logo */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full bg-brand-blue/20 blur-3xl" />
                    <div className="absolute w-40 h-40 rounded-full bg-brand-cyan/15 blur-2xl" />
                  </div>
                  
                  {/* Logo Badge - Premium White Badge */}
                  <div className="relative bg-white rounded-2xl px-6 py-5 shadow-lg border border-slate-200/80 flex items-center justify-center">
                    <img
                      src={logoImage}
                      alt="PLAYRO LEAGUE"
                      className="max-h-[140px] w-auto object-contain"
                    />
                  </div>
                </div>
                
                {/* Brand Name */}
                <span className="text-2xl font-bold text-text-primary tracking-wide">
                  PLAYRO LEAGUE
                </span>

                {/* Brand Tagline - Centered below logo */}
                <p className="text-base text-text-muted text-center max-w-md">
                  {t("home.brandHeadline")}
                </p>
              </div>

              {/* Mobile Logo Badge - Smaller */}
              <div className="lg:hidden flex flex-col items-center justify-center gap-4">
                <div className="relative flex justify-center items-center">
                  {/* Mobile glow */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-brand-blue/20 blur-2xl" />
                  </div>
                  
                  {/* Mobile Logo Badge */}
                  <div className="relative bg-white rounded-xl px-4 py-3 shadow-md border border-slate-200/80 flex items-center justify-center">
                    <img
                      src={logoImage}
                      alt="PLAYRO LEAGUE"
                      className="max-h-[80px] w-auto object-contain"
                    />
                  </div>
                </div>
                <span className="text-xl font-bold text-text-primary tracking-wide">
                  PLAYRO LEAGUE
                </span>

                {/* Brand Tagline - Centered below logo (Mobile) */}
                <p className="text-sm text-text-muted text-center max-w-xs px-4">
                  {t("home.brandHeadline")}
                </p>
              </div>
            </div>
          </div>

          {/* Form Section - Right (Desktop) / Bottom (Mobile) */}
          <div className="flex justify-center lg:justify-end w-full">
            <Card className="w-full max-w-[420px]">
              <CardHeader className="space-y-2">
                <CardTitle className="text-section-title">{t("auth.login")}</CardTitle>
                <CardDescription className="text-caption">
                  {t("auth.loginSubtitle")}
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-semibold text-text-primary">
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-semibold text-text-primary">
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
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 pt-2">
                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-bold"
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

                  <p className="text-center text-sm text-text-muted">
                    {t("auth.dontHaveAccount")}{" "}
                    <Link
                      to="/auth/register"
                      className="text-brand-blue hover:underline font-semibold"
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
