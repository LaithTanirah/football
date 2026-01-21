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
import { CitySelect } from "@/components/CitySelect";
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

export function Register() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setTokenAndUser } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    city: "",
  });

  const mutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (response) => {
      const { user, token } = response.data.data;
      if (token && user) {
        setTokenAndUser(token, user);
        toast({
          title: t("common.success"),
          description: t("auth.registerSuccess"),
        });
        navigate("/pitches");
      } else {
        toast({
          title: t("common.error"),
          description: t("auth.registerError"),
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: t("common.error"),
        description: error.response?.data?.message || t("auth.registerError"),
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <AuthShell
      animationPanel={
        <AuthAnimation
          title={t("auth.createAccount")}
          subtitle={t("auth.registerSubtitle")}
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
            {t("auth.register")}
          </CardTitle>
          <CardDescription className={cn(
            "text-sm opacity-75",
            "text-muted-foreground dark:text-gray-300"
          )}>
            {t("auth.registerSubtitle")}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className={cn(
            "space-y-4",
            isRTL ? "text-right" : "text-left"
          )}>
            <div className={cn(
              "grid gap-4",
              "grid-cols-1 md:grid-cols-2"
            )}>
              {/* Row 1: Name + Username */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-200 dark:text-gray-100"
                >
                  {t("auth.name")}
                </Label>
                <Input
                  id="name"
                  placeholder={t("auth.name")}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className={cn(
                    "h-12 rounded-2xl",
                    isRTL && "text-right"
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-sm font-medium text-gray-200 dark:text-gray-100"
                >
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

              {/* Row 2: Email + Phone */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-200 dark:text-gray-100"
                >
                  {t("auth.email")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("auth.email")}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className={cn(
                    "h-12 rounded-2xl",
                    isRTL && "text-right"
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-200 dark:text-gray-100"
                >
                  {t("auth.phone")}
                </Label>
                <Input
                  id="phone"
                  placeholder={t("auth.phone")}
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className={cn(
                    "h-12 rounded-2xl",
                    isRTL && "text-right"
                  )}
                />
              </div>

              {/* Row 3: Password (full width) */}
              <div className="space-y-2 md:col-span-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-200 dark:text-gray-100"
                >
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
                  minLength={6}
                  className={cn(
                    "h-12 rounded-2xl",
                    isRTL && "text-right"
                  )}
                />
              </div>

              {/* Row 4: City (full width) */}
              <div className="space-y-2 md:col-span-2">
                <Label
                  htmlFor="city"
                  className="text-sm font-medium text-gray-200 dark:text-gray-100"
                >
                  {t("auth.city")}
                </Label>
                <CitySelect
                  value={formData.city}
                  onChange={(value) =>
                    setFormData({ ...formData, city: value })
                  }
                  placeholder={t("auth.city")}
                  allowEmpty={true}
                />
              </div>
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
                  {t("auth.register")}
                  <ArrowIcon className="h-4 w-4" />
                </span>
              )}
            </Button>
            <p className={cn(
              "text-center text-sm text-muted-foreground dark:text-gray-300",
              isRTL ? "text-right" : "text-left"
            )}>
              {t("auth.alreadyHaveAccount")}{" "}
              <Link
                to="/auth/login"
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
                {t("auth.login")}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </AuthShell>
  );
}
