import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { leaguesApi } from '@/lib/api';
import { useToast } from '@/ui2/components/ui/use-toast';
import { Button } from '@/ui2/components/ui/Button';
import { Input } from '@/ui2/components/ui/Input';
import { Label } from '@/ui2/components/ui/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui2/components/ui/Card';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CitySelect } from '@/components/CitySelect';
import { CustomDatePicker } from '@/components/CustomDatePicker';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useAuthStore } from '@/store/authStore';
import styles from '@/components/SlotPicker.module.css';

export function CreateLeague() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    city: user?.city || '',
    season: '',
    startDate: null as Date | null,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const createMutation = useMutation({
    mutationFn: leaguesApi.create,
    onSuccess: (response) => {
      const leagueId = response.data.data.league.id;
      
      // Invalidate league queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['leagues'] });
      queryClient.invalidateQueries({ queryKey: ['league', leagueId] });
      queryClient.invalidateQueries({ queryKey: ['standings', leagueId] });
      
      toast({
        title: t('common.success'),
        description: t('leagues.leagueCreated'),
      });
      navigate(`/leagues/${leagueId}`);
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.response?.data?.message || t('leagues.leagueCreateError'),
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.city) {
      toast({
        title: t('leagues.validationError'),
        description: t('leagues.fillRequiredFields'),
        variant: 'destructive',
      });
      return;
    }

    createMutation.mutate({
      name: formData.name,
      city: formData.city,
      season: formData.season || undefined,
      startDate: formData.startDate ? format(formData.startDate, 'yyyy-MM-dd') : undefined,
    });
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 pt-20 md:pt-24 pb-8 page-section">
      <Breadcrumbs
        items={[
          { label: t('nav.leagues'), href: '/leagues' },
          { label: t('leagues.createLeague') },
        ]}
        className="mb-6"
      />

      <Card className="glass-neon-strong rounded-3xl shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground">{t('leagues.createNewLeague')}</CardTitle>
          <CardDescription className="text-muted-foreground dark:text-gray-300">{t('leagues.createLeagueSubtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">
                {t('leagues.leagueName')} *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('leagues.leagueNamePlaceholder')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">
                {t('common.city')} *
              </Label>
              <CitySelect
                value={formData.city}
                onChange={(value) => setFormData({ ...formData, city: value })}
                placeholder={t('admin.selectCity')}
                required
                allowEmpty={false}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="season">{t('leagues.seasonOptional')}</Label>
              <Input
                id="season"
                value={formData.season}
                onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                placeholder={t('leagues.seasonPlaceholder')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">{t('leagues.startDateOptional')}</Label>
              <div className={styles.inputWrap} style={{ position: 'relative' }} ref={dateInputRef}>
                {formData.startDate && !showDatePicker && (
                  <span className={styles.inputDisplayValue}>
                    {format(formData.startDate, 'MMM d, yyyy')}
                  </span>
                )}
                <input
                  id="startDate"
                  type="text"
                  readOnly
                  value={formData.startDate ? format(formData.startDate, 'MMM d, yyyy') : ''}
                  onClick={() => setShowDatePicker(true)}
                  onFocus={() => setShowDatePicker(true)}
                  className={styles.input}
                  placeholder={t('pitchDetail.selectDate', 'Select Date')}
                />
                <button
                  type="button"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className={styles.inputIconBtn}
                  aria-label="Open calendar"
                >
                  <Calendar className="h-4 w-4" />
                </button>
                {showDatePicker && dateInputRef.current && (
                  <CustomDatePicker
                    selectedDate={formData.startDate}
                    onDateChange={(date) => {
                      setFormData({ ...formData, startDate: date });
                      setShowDatePicker(false);
                    }}
                    minDate={new Date()}
                    onClose={() => setShowDatePicker(false)}
                    anchorElement={dateInputRef.current}
                  />
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-cyan-400/10">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/leagues')}
                className="flex-1 font-semibold"
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={createMutation.isPending} className="flex-1 font-bold bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-foreground shadow-soft hover:shadow-glow">
                {createMutation.isPending ? t('common.creating') : t('leagues.createLeague')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

