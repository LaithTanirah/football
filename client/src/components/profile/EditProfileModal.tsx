import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { usersApi } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CitySelect } from "@/components/CitySelect";
import { AvatarUpload } from "./AvatarUpload";
import { AvatarGenerator } from "./AvatarGenerator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JORDAN_CITIES, getCityByKey } from "@/lib/cities";

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileModal({ open, onOpenChange }: EditProfileModalProps) {
  const { t } = useTranslation();
  const { user, setUser, fetchUser } = useAuthStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [city, setCity] = useState<string>("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarMode, setAvatarMode] = useState<"upload" | "generate" | "url">("upload");

  // Helper function to normalize city value (convert name to key if needed)
  const normalizeCityValue = (cityValue: string | undefined | null): string => {
    if (!cityValue || cityValue.trim() === "") return "";
    
    // Check if it's already a valid key
    const cityByKey = getCityByKey(cityValue);
    if (cityByKey) {
      return cityByKey.key;
    }
    
    // Check if it matches any city name (English or Arabic)
    const cityMatch = JORDAN_CITIES.find(
      c => c.en.toLowerCase() === cityValue.toLowerCase() || 
           c.ar === cityValue ||
           c.key.toLowerCase() === cityValue.toLowerCase()
    );
    
    return cityMatch ? cityMatch.key : "";
  };

  useEffect(() => {
    if (user && open) {
      setName(user.name || "");
      setUsername(user.username || "");
      // Normalize city value to ensure it's a valid key
      setCity(normalizeCityValue(user.city));
      setBio((user as any).bio || "");
      setAvatar((user as any).avatar || null);
    }
  }, [user, open]);

  const updateMutation = useMutation({
    mutationFn: usersApi.updateMe,
    onSuccess: async (response) => {
      const updatedUser = response.data.data;
      setUser(updatedUser);
      await fetchUser();
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast({
        title: t("profile.profileUpdated"),
        description: t("profile.profileUpdatedDesc"),
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: t("common.error"),
        description: error.response?.data?.message || t("profile.profileUpdateError"),
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim()) {
      toast({
        title: t("common.error"),
        description: t("teams.fillRequiredFields"),
        variant: "destructive",
      });
      return;
    }

    // Normalize city before sending - ensure it's a valid key or empty
    const normalizedCity = city && city.trim() !== "" ? city.trim() : undefined;
    
    // Validate city key before sending
    if (normalizedCity && !getCityByKey(normalizedCity)) {
      toast({
        title: t("common.error"),
        description: t("profile.profileUpdateError") + " - Invalid city",
        variant: "destructive",
      });
      return;
    }

    updateMutation.mutate({
      name: name.trim(),
      username: username.trim(),
      city: normalizedCity,
      bio: bio.trim() || null,
      avatar: avatar || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("profile.editProfileTitle")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <div className="space-y-4">
            <Label>{t("profile.avatar")}</Label>
            <Tabs value={avatarMode} onValueChange={(v) => setAvatarMode(v as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upload">{t("profile.uploadAvatar")}</TabsTrigger>
                <TabsTrigger value="generate">{t("profile.generateAvatar")}</TabsTrigger>
                <TabsTrigger value="url">{t("profile.useUrl")}</TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="mt-4">
                <AvatarUpload
                  currentAvatar={avatar}
                  onAvatarChange={setAvatar}
                />
              </TabsContent>
              <TabsContent value="generate" className="mt-4">
                <AvatarGenerator
                  name={name || user?.name || ""}
                  username={username || user?.username || ""}
                  onAvatarChange={setAvatar}
                />
              </TabsContent>
              <TabsContent value="url" className="mt-4">
                <div className="space-y-2">
                  <Label htmlFor="avatarUrl">{t("profile.avatarUrl")}</Label>
                  <Input
                    id="avatarUrl"
                    type="url"
                    placeholder={t("profile.avatarUrlPlaceholder")}
                    value={avatar || ""}
                    onChange={(e) => setAvatar(e.target.value || null)}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              {t("profile.fullName")} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("profile.fullNamePlaceholder")}
              required
            />
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">
              {t("profile.username")} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t("profile.usernamePlaceholder")}
              required
            />
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city">{t("profile.city")}</Label>
            <CitySelect
              value={city}
              onChange={setCity}
              placeholder={t("profile.cityPlaceholder")}
              allowEmpty={true}
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">
              {t("profile.bioLabel")} ({t("profile.bioMaxLength")})
            </Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={t("profile.bioPlaceholder")}
              maxLength={250}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground text-end">
              {bio.length}/250
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateMutation.isPending}
            >
              {t("profile.cancel")}
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? t("profile.saving") : t("profile.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

