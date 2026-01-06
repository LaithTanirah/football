import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EditProfileModal } from "./EditProfileModal";
import { generateAvatarUrl, getInitials } from "@/lib/avatar";
import { getCityDisplayName, getCityByKey, JORDAN_CITIES } from "@/lib/cities";
import { useLocaleStore } from "@/store/localeStore";
import { Edit, LogOut, MapPin } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface ProfileHeaderCardProps {
  user: {
    id: string;
    name: string;
    username: string;
    city?: string;
    role: string;
    avatar?: string;
  };
  isViewingOtherUser?: boolean;
}

export function ProfileHeaderCard({ user, isViewingOtherUser = false }: ProfileHeaderCardProps) {
  const { t } = useTranslation();
  const { logout } = useAuthStore();
  const { locale } = useLocaleStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [editModalOpen, setEditModalOpen] = useState(false);

  const avatarUrl = user.avatar || generateAvatarUrl(user.name, user.username);
  
  // Handle city display - could be a key or a name
  const getCityDisplay = (city: string | undefined): string | null => {
    if (!city) return null;
    // Check if it's a valid key
    const cityByKey = getCityByKey(city);
    if (cityByKey) {
      return getCityDisplayName(city, locale);
    }
    // If not a key, check if it matches any city name
    const cityMatch = JORDAN_CITIES.find(
      c => c.en.toLowerCase() === city.toLowerCase() || c.ar === city
    );
    if (cityMatch) {
      return locale === 'ar' ? cityMatch.ar : cityMatch.en;
    }
    // Otherwise, return the city as-is
    return city;
  };
  
  const cityDisplay = getCityDisplay(user.city);

  const handleLogout = async () => {
    await logout();
    toast({
      title: t("common.success"),
      description: t("nav.logout"),
    });
    navigate("/");
  };

  const getRoleBadges = () => {
    const badges = [];
    if (user.role === "ADMIN") {
      badges.push(
        <Badge key="admin" variant="default" className="bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30">
          {t("profile.role.admin")}
        </Badge>
      );
    }
    if (user.role === "PITCH_OWNER") {
      badges.push(
        <Badge key="owner" variant="default" className="bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30">
          {t("profile.role.owner")}
        </Badge>
      );
    }
    // Note: Captain/Player roles would come from team memberships, not user role
    return badges;
  };

  return (
    <>
      <Card className={cn(
        "p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm",
        isViewingOtherUser && "border-2 border-brand-blue/30 bg-gradient-to-br from-card/50 via-brand-blue/5 to-brand-cyan/5 shadow-lg"
      )}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Left: Avatar + Info */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className={cn(
                "rounded-2xl overflow-hidden border-2 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center",
                isViewingOtherUser ? "w-32 h-32 border-brand-blue/40 shadow-lg" : "w-24 h-24 border-border/50"
              )}>
                {user.avatar ? (
                  <img
                    src={avatarUrl}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to generated avatar on error
                      const target = e.target as HTMLImageElement;
                      target.src = generateAvatarUrl(user.name, user.username);
                    }}
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-3xl font-bold text-primary"
                    style={{
                      background: `linear-gradient(135deg, ${generateAvatarUrl(user.name, user.username).includes('hsl') ? 'hsl(200, 65%, 55%)' : '#3b82f6'}, ${generateAvatarUrl(user.name, user.username).includes('hsl') ? 'hsl(220, 65%, 45%)' : '#1e40af'})`,
                    }}
                  >
                    {getInitials(user.name)}
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className={cn(
                  "font-bold mb-1",
                  isViewingOtherUser ? "text-3xl text-text-primary" : "text-2xl"
                )}>
                  {user.name}
                </h1>
                {isViewingOtherUser && (
                  <Badge variant="outline" className="bg-brand-blue/10 text-brand-blue border-brand-blue/30">
                    {t("profile.viewingProfile") || "Viewing Profile"}
                  </Badge>
                )}
              </div>
              <p className={cn(
                "mb-3",
                isViewingOtherUser ? "text-base text-text-muted font-medium" : "text-muted-foreground"
              )}>
                @{user.username}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {cityDisplay && (
                  <Badge variant="outline" className={cn(
                    "gap-1",
                    isViewingOtherUser && "border-brand-cyan/40 bg-brand-cyan/10"
                  )}>
                    <MapPin className="h-3 w-3" />
                    {cityDisplay}
                  </Badge>
                )}
                {getRoleBadges()}
              </div>
            </div>
          </div>

          {/* Right: Actions - Only show for own profile */}
          {!isViewingOtherUser && (
            <div className="flex items-center gap-3 flex-shrink-0">
              <Button
                variant="outline"
                onClick={() => setEditModalOpen(true)}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                {t("profile.editProfile")}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-destructive hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </Card>

      <EditProfileModal open={editModalOpen} onOpenChange={setEditModalOpen} />
    </>
  );
}

