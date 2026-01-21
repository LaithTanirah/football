import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/admin/PageHeader';
import { LayoutContainer } from '@/components/admin/LayoutContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui2/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui2/components/ui/Tabs';
import { Button } from '@/ui2/components/ui/Button';
import { Label } from '@/ui2/components/ui/Label';
import { Input } from '@/ui2/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui2/components/ui/Select';
import { Badge } from '@/ui2/components/ui/Badge';
import { Switch } from '@/ui2/components/ui/Switch';
import { useLocaleStore } from '@/store/localeStore';
import { Globe, Shield, Bell, Palette, Save } from 'lucide-react';
import { useDirection } from '@/hooks/useDirection';
import { useToast } from '@/ui2/components/ui/use-toast';

export function AdminSettings() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const { toast } = useToast();
  const { locale, setLocale } = useLocaleStore();
  const [defaultLanguage, setDefaultLanguage] = useState(locale);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');
  const [appNameDisplay, setAppNameDisplay] = useState(true);
  const [toastPosition, setToastPosition] = useState('top-right');

  const handleSave = () => {
    setLocale(defaultLanguage);
    toast({
      title: t('common.success'),
      description: t('admin.settings.saveSuccess') || 'Settings saved successfully',
    });
  };

  return (
    <LayoutContainer>
      <PageHeader
        title={t('admin.settings.title')}
        subtitle={t('admin.settings.subtitle')}
        actions={
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 me-2" />
            {t('common.save')}
          </Button>
        }
      />

      <div className="px-6 pb-6">
        <Tabs defaultValue="general" className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">{t('admin.settings.general.title')}</span>
            </TabsTrigger>
            <TabsTrigger value="branding" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">{t('admin.settings.branding.title')}</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">{t('admin.settings.security.title')}</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">{t('admin.settings.notifications.title')}</span>
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card className="glass-neon-strong rounded-2xl border-2 border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <CardHeader>
                <CardTitle className="text-xl font-bold">{t('admin.settings.general.title')}</CardTitle>
                <CardDescription>{t('admin.settings.general.desc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="default-language">{t('admin.settings.general.defaultLanguage')}</Label>
                  <Select value={defaultLanguage} onValueChange={setDefaultLanguage}>
                    <SelectTrigger id="default-language" dir={isRTL ? 'rtl' : 'ltr'}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent dir={isRTL ? 'rtl' : 'ltr'}>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme-mode">{t('admin.settings.general.themeMode')}</Label>
                  <Select value={themeMode} onValueChange={(value: 'light' | 'dark') => setThemeMode(value)}>
                    <SelectTrigger id="theme-mode" dir={isRTL ? 'rtl' : 'ltr'}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent dir={isRTL ? 'rtl' : 'ltr'}>
                      <SelectItem value="light">{t('admin.settings.general.light')}</SelectItem>
                      <SelectItem value="dark">{t('admin.settings.general.dark')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge variant="outline" className="mt-2">
                    {t('admin.settings.comingSoon')}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="app-name-display">{t('admin.settings.general.appNameDisplay')}</Label>
                    <p className="text-sm text-muted-foreground dark:text-gray-300">{t('admin.settings.general.appNameDisplayDesc')}</p>
                  </div>
                  <Switch
                    id="app-name-display"
                    checked={appNameDisplay}
                    onCheckedChange={setAppNameDisplay}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Branding Settings */}
          <TabsContent value="branding" className="space-y-6">
            <Card className="glass-neon-strong rounded-2xl border-2 border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <CardHeader>
                <CardTitle className="text-xl font-bold">{t('admin.settings.branding.title')}</CardTitle>
                <CardDescription>{t('admin.settings.branding.desc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label>{t('admin.settings.branding.logoPreview')}</Label>
                  <div className="flex items-center gap-4 p-4 border-2 border-cyan-400/20 rounded-2xl glass-neon-subtle">
                    <div className="flex-shrink-0 w-16 h-16 p-2 rounded-2xl glass-neon-subtle border-2 border-cyan-400/20 shadow-sm flex items-center justify-center">
                      <img src="/Logo.jpg" alt="PLAYRO LEAGUE" className="w-full h-full object-contain" onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">PLAYRO LEAGUE</p>
                      <p className="text-sm text-muted-foreground dark:text-gray-300">{t('admin.settings.branding.logoReadOnly')}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t('admin.settings.branding.primaryColor')}</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-cyan-500/20 border-2 border-cyan-400/20 shadow-sm" />
                    <div>
                      <p className="font-semibold text-foreground">Playro Blue</p>
                      <p className="text-sm text-muted-foreground dark:text-gray-300">#0080FF</p>
                    </div>
                  </div>
                </div>

                <Badge variant="outline" className="mt-2">
                  {t('admin.settings.comingSoon')}
                </Badge>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card className="glass-neon-strong rounded-2xl border-2 border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <CardHeader>
                <CardTitle className="text-xl font-bold">{t('admin.settings.security.title')}</CardTitle>
                <CardDescription>{t('admin.settings.security.desc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label>{t('admin.settings.security.passwordRules')}</Label>
                  <div className="p-4 border-2 border-cyan-400/20 rounded-2xl glass-neon-subtle space-y-2">
                    <p className="text-sm text-muted-foreground dark:text-gray-300">• Minimum 8 characters</p>
                    <p className="text-sm text-muted-foreground dark:text-gray-300">• At least one uppercase letter</p>
                    <p className="text-sm text-muted-foreground dark:text-gray-300">• At least one lowercase letter</p>
                    <p className="text-sm text-muted-foreground dark:text-gray-300">• At least one number</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t('admin.settings.security.sessionSettings')}</Label>
                  <div className="p-4 border-2 border-cyan-400/20 rounded-2xl glass-neon-subtle">
                    <p className="text-sm text-muted-foreground dark:text-gray-300">{t('admin.settings.security.sessionTimeout')}: 24 hours</p>
                  </div>
                </div>

                <Badge variant="outline" className="mt-2">
                  {t('admin.settings.displayOnly')}
                </Badge>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="glass-neon-strong rounded-2xl border-2 border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <CardHeader>
                <CardTitle className="text-xl font-bold">{t('admin.settings.notifications.title')}</CardTitle>
                <CardDescription>{t('admin.settings.notifications.desc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="toast-position">{t('admin.settings.notifications.toastPosition')}</Label>
                  <Select value={toastPosition} onValueChange={setToastPosition}>
                    <SelectTrigger id="toast-position" dir={isRTL ? 'rtl' : 'ltr'}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent dir={isRTL ? 'rtl' : 'ltr'}>
                      <SelectItem value="top-left">Top Left</SelectItem>
                      <SelectItem value="top-right">Top Right</SelectItem>
                      <SelectItem value="bottom-left">Bottom Left</SelectItem>
                      <SelectItem value="bottom-right">Bottom Right</SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge variant="outline" className="mt-2">
                    {t('admin.settings.comingSoon')}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </LayoutContainer>
  );
}
