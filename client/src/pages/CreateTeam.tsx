import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { teamsApi, pitchesApi } from '@/lib/api';
import { useToast } from '@/ui2/components/ui/use-toast';
import { Button } from '@/ui2/components/ui/Button';
import { Input } from '@/ui2/components/ui/Input';
import { Label } from '@/ui2/components/ui/Label';
import { Textarea } from '@/ui2/components/ui/Textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui2/components/ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui2/components/ui/Select';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CitySelect } from '@/components/CitySelect';
import { TeamLogoUpload } from '@/components/team/TeamLogoUpload';
import { useAuthStore } from '@/store/authStore';

export function CreateTeam() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    city: user?.city || '',
    logoUrl: '',
    preferredPitchId: '',
  });

  const { data: pitchesData } = useQuery({
    queryKey: ['pitches'],
    queryFn: () => pitchesApi.getAll(),
  });

  const pitches = pitchesData?.data.data || [];

  const createMutation = useMutation({
    mutationFn: teamsApi.create,
    onSuccess: (response) => {
      // Invalidate teams queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      
      toast({
        title: t('teams.teamCreatedSuccess'),
        description: t('teams.teamCreatedSuccessDesc'),
      });
      
      // Navigate to the team detail page
      // The response structure is { data: { team: {...}, captain: {...}, preferredPitch: {...} } }
      const teamId = response.data.data?.team?.id;
      if (teamId) {
        navigate(`/teams/${teamId}`);
      } else {
        // Fallback: navigate to teams list if ID is missing
        console.error('Team ID not found in response:', response.data);
        navigate('/teams');
      }
    },
    onError: (error: any) => {
      console.error('Create team error:', error);
      toast({
        title: t('common.error'),
        description: error.response?.data?.message || t('teams.teamCreateError'),
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.city) {
      toast({
        title: t('teams.validationError'),
        description: t('teams.fillRequiredFields'),
        variant: 'destructive',
      });
      return;
    }

    createMutation.mutate({
      name: formData.name,
      city: formData.city,
      logoUrl: formData.logoUrl || undefined,
      preferredPitchId: formData.preferredPitchId || undefined,
    });
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 pt-20 md:pt-24 pb-8 page-section">
      <Breadcrumbs
        items={[
          { label: t('teams.title'), href: '/teams' },
          { label: t('teams.createTeam') },
        ]}
        className="mb-6"
      />

      <Card className="glass-neon-strong rounded-3xl shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground">{t('teams.createNewTeam')}</CardTitle>
          <CardDescription className="text-muted-foreground dark:text-gray-300">{t('teams.createTeamSubtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* Basics Section */}
            <div className="flex flex-col gap-6">
              <div className="pb-2 border-b border-cyan-400/10">
                <h3 className="text-lg font-bold text-foreground">{t('teams.teamName')}</h3>
                <p className="text-sm text-muted-foreground dark:text-gray-300 mt-1">{t('teams.createTeamSubtitle')}</p>
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-foreground">
                    {t('teams.teamName')} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t('teams.teamNamePlaceholder')}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="city" className="text-sm font-semibold text-foreground">
                    {t('teams.city')} <span className="text-destructive">*</span>
                  </Label>
                  <CitySelect
                    value={formData.city}
                    onChange={(value) => setFormData({ ...formData, city: value })}
                    placeholder={t('teams.cityPlaceholder')}
                    required
                    allowEmpty={false}
                  />
                </div>
              </div>
            </div>

            {/* Logo Section */}
            <div className="flex flex-col gap-6">
              <div className="pb-2 border-b border-cyan-400/10">
                <h3 className="text-lg font-bold text-foreground">{t('teams.teamLogo')}</h3>
                <p className="text-sm text-muted-foreground dark:text-gray-300 mt-1">{t('teams.uploadLogo')}</p>
              </div>
              <div className="flex flex-col gap-2">
                <TeamLogoUpload
                  value={formData.logoUrl}
                  onChange={(url) => setFormData({ ...formData, logoUrl: url })}
                  teamName={formData.name}
                />
              </div>
            </div>

            {/* Location Section */}
            <div className="flex flex-col gap-6">
              <div className="pb-2 border-b border-cyan-400/10">
                <h3 className="text-lg font-bold text-foreground">{t('teams.preferredPitch')}</h3>
                <p className="text-sm text-muted-foreground dark:text-gray-300 mt-1">{t('teams.preferredPitch')}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="preferredPitch" className="text-sm font-semibold text-foreground">
                  {t('teams.preferredPitch')}
                </Label>
                <Select
                  value={formData.preferredPitchId || 'none'}
                  onValueChange={(value) => setFormData({ ...formData, preferredPitchId: value === 'none' ? '' : value })}
                >
                  <SelectTrigger id="preferredPitch">
                    <SelectValue placeholder={t('teams.selectPitch')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{t('teams.none')}</SelectItem>
                    {pitches.map((pitch: any) => (
                      <SelectItem key={pitch.id} value={pitch.id}>
                        {pitch.name} - {pitch.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-cyan-400/10">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/teams')}
                className="flex-1 font-semibold"
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={createMutation.isPending} className="flex-1 font-bold bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-foreground shadow-soft hover:shadow-glow">
                {createMutation.isPending ? t('teams.creating') : t('teams.createTeam')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

