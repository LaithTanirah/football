import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/ui2/components/ui/use-toast";
import { Button } from "@/ui2/components/ui/Button";
import { Input } from "@/ui2/components/ui/Input";
import { Label } from "@/ui2/components/ui/Label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui2/components/ui/Card";
import { useDirection } from "@/hooks/useDirection";
import { AuthShell } from "@/components/common/AuthShell";
import { AuthAnimation } from "@/components/common/AuthAnimation";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowLeft } from "lucide-react";

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

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <AuthShell
      animationPanel={
        <AuthAnimation
          title={t("auth.welcomeBack")}
          subtitle={t("auth.loginSubtitle")}
        />
      }
    >
      <Card className={cn(
        "glass-neon-strong rounded-3xl",
        "shadow-md",
        "backdrop-blur-xl",
        "bg-slate-950/40 dark:bg-slate-950/60",
        "p-6 sm:p-8"
      )}>
        <CardHeader className={cn(
          "space-y-2 pb-6",
          isRTL ? "text-right" : "text-left"
        )}>
          <CardTitle className={cn(
            "text-3xl sm:text-4xl font-semibold",
            "text-foreground"
          )}>
            {t("auth.login")}
          </CardTitle>
          <CardDescription className={cn(
            "text-sm opacity-75",
            "text-muted-foreground dark:text-gray-300"
          )}>
            {t("auth.loginSubtitle")}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className={cn("space-y-4", isRTL ? "text-right" : "text-left")}>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-200 dark:text-gray-100">
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
                className={cn(
                  "h-12 rounded-2xl",
                  isRTL && "text-right"
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-200 dark:text-gray-100">
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
                className={cn(
                  "h-12 rounded-2xl",
                  isRTL && "text-right"
                )}
              />
            </div>
          </CardContent>
          <CardFooter className={cn(
            "flex flex-col gap-4 pt-6",
            isRTL ? "text-right" : "text-left"
          )}>
            <Button
              type="submit"
              className={cn(
                "w-full h-12 rounded-2xl text-base font-semibold",
                "bg-gradient-to-r from-cyan-500 to-cyan-600",
                "hover:from-cyan-600 hover:to-cyan-700",
                "text-foreground shadow-soft",
                "hover:shadow-glow",
                "hover:-translate-y-[1px] transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? t("common.loading") : (
                <span className="flex items-center justify-center gap-2">
                  {t("auth.login")}
                  <ArrowIcon className="h-4 w-4" />
                </span>
              )}
            </Button>
            
            {/* Quick Login Buttons for Development */}
            {isDevelopment && (
              <div className={cn(
                "w-full space-y-3 pt-4 border-t border-cyan-400/10",
                "glass-neon-subtle rounded-2xl p-4"
              )}>
                <p className="text-xs text-muted-foreground dark:text-gray-300 text-center mb-2">
                  🛠️ Development Quick Login
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickLogin("admin", "admin123")}
                    disabled={mutation.isPending}
                    className="text-xs h-9 rounded-xl"
                  >
                    Admin
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickLogin("user1", "password123")}
                    disabled={mutation.isPending}
                    className="text-xs h-9 rounded-xl"
                  >
                    User 1
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickLogin("user2", "password123")}
                    disabled={mutation.isPending}
                    className="text-xs h-9 rounded-xl"
                  >
                    User 2
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickLogin("nazzal", "password123")}
                    disabled={mutation.isPending}
                    className="text-xs h-9 rounded-xl"
                  >
                    Nazzal
                  </Button>
                </div>
              </div>
            )}

            <p className={cn(
              "text-center text-sm text-muted-foreground dark:text-gray-300",
              isRTL ? "text-right" : "text-left"
            )}>
              {t("auth.dontHaveAccount")}{" "}
              <Link
                to="/auth/register"
                className={cn(
                  "text-cyan-400 hover:text-cyan-300 font-medium transition-colors",
                  "relative inline-block group",
                  "after:absolute after:bottom-0 after:w-0 after:h-0.5",
                  isRTL ? "after:right-0" : "after:left-0",
                  "after:bg-gradient-to-r after:from-cyan-400 after:to-purple-400",
                  "after:transition-all after:duration-300",
                  "hover:after:w-full"
                )}
              >
                {t("auth.register")}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </AuthShell>
  );
}
