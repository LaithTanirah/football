import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { postsApi, pitchesApi, teamsApi, uploadsApi } from '@/lib/api';
import { useToast } from '@/ui2/components/ui/use-toast';
import { Button } from '@/ui2/components/ui/Button';
import { Input } from '@/ui2/components/ui/Input';
import { Label } from '@/ui2/components/ui/Label';
import { Textarea } from '@/ui2/components/ui/Textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui2/components/ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui2/components/ui/Select';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CitySelect } from '@/components/CitySelect';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

export function CreatePost() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    content: '',
    city: '', // Start with empty, user can select if needed
    pitchId: '',
    teamId: '',
    mediaType: 'none' as 'none' | 'image',
    mediaUrl: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Get user's teams for tagging
  const { data: teamsData } = useQuery({
    queryKey: ['userTeams'],
    queryFn: () => teamsApi.getAll(),
    enabled: !!user,
  });

  const { data: pitchesData } = useQuery({
    queryKey: ['pitches'],
    queryFn: () => pitchesApi.getAll(),
  });

  const teams = teamsData?.data.data || [];
  const pitches = pitchesData?.data.data || [];

  // Filter teams to only show teams user is a member of
  const userTeams = teams.filter((team: any) => {
    // This is a simplified check - in a real app, you'd check team membership
    return true; // For now, show all teams
  });

  const uploadImageMutation = useMutation({
    mutationFn: (image: string) => uploadsApi.uploadTeamLogo({ image }),
    onSuccess: (response) => {
      const url = response.data.data.url;
      setFormData(prev => ({
        ...prev,
        mediaType: 'image',
        mediaUrl: url,
      }));
      toast({
        title: t('common.success'),
        description: 'Image uploaded successfully',
      });
    },
    onError: (error: any) => {
      // Reset image state on upload failure
      setImagePreview(null);
      setFormData(prev => ({
        ...prev,
        mediaType: 'none',
        mediaUrl: '',
      }));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      toast({
        title: t('common.error'),
        description: error.response?.data?.message || 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const createPostMutation = useMutation({
    mutationFn: postsApi.create,
    onSuccess: (response) => {
      toast({
        title: t('common.success'),
        description: t('community.post.createdSuccess'),
      });
      navigate(`/community/post/${response.data.data.id}`);
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.response?.data?.message || t('community.post.createError'),
        variant: 'destructive',
      });
    },
  });

  const handleFileSelect = async (file: File) => {
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({
        title: t('community.post.invalidImageType'),
        description: t('community.post.invalidImageType'),
        variant: 'destructive',
      });
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: t('community.post.imageTooLarge'),
        description: t('community.post.imageTooLarge'),
        variant: 'destructive',
      });
      return;
    }

    // Read file as base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImagePreview(base64);
      uploadImageMutation.mutate(base64);
    };
    reader.onerror = () => {
      toast({
        title: t('common.error'),
        description: 'Failed to read file',
        variant: 'destructive',
      });
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      mediaType: 'none',
      mediaUrl: '',
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim()) {
      toast({
        title: t('common.error'),
        description: 'Content is required',
        variant: 'destructive',
      });
      return;
    }

    if (formData.content.length > 5000) {
      toast({
        title: t('common.error'),
        description: 'Content is too long (max 5000 characters)',
        variant: 'destructive',
      });
      return;
    }

    // Validate that if mediaType is 'image', mediaUrl must be present
    if (formData.mediaType === 'image' && (!formData.mediaUrl || !formData.mediaUrl.trim())) {
      toast({
        title: t('common.error'),
        description: 'Please wait for image upload to complete or remove the image',
        variant: 'destructive',
      });
      return;
    }

    // If image preview exists but upload hasn't completed, wait
    if (imagePreview && !formData.mediaUrl && uploadImageMutation.isPending) {
      toast({
        title: t('common.error'),
        description: 'Please wait for image upload to complete',
        variant: 'destructive',
      });
      return;
    }

    // Prepare payload - ensure empty strings become undefined
    const payload: any = {
      content: formData.content.trim(),
      mediaType: formData.mediaType,
    };

    // Only include city if it has a non-empty value and is not the placeholder
    const cityValue = formData.city?.trim();
    if (cityValue && cityValue !== '' && cityValue !== '__ALL__') {
      payload.city = cityValue;
    }
    // If city is empty or placeholder, don't include it in payload at all

    // Only include pitchId if it has a value
    if (formData.pitchId && formData.pitchId !== '__NONE__' && formData.pitchId !== '') {
      payload.pitchId = formData.pitchId;
    }

    // Only include teamId if it has a value
    if (formData.teamId && formData.teamId !== '__NONE__' && formData.teamId !== '') {
      payload.teamId = formData.teamId;
    }

    // If mediaType is 'image', mediaUrl must be included
    if (formData.mediaType === 'image') {
      if (!formData.mediaUrl || !formData.mediaUrl.trim()) {
        toast({
          title: t('common.error'),
          description: 'Image URL is required when media type is image',
          variant: 'destructive',
        });
        return;
      }
      payload.mediaUrl = formData.mediaUrl.trim();
    } else {
      // If mediaType is 'none', don't include mediaUrl
      payload.mediaType = 'none';
    }

    console.log('Creating post with payload:', payload);
    createPostMutation.mutate(payload);
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6 page-section">
      <Breadcrumbs
        items={[
          { label: t('community.title'), to: '/community' },
          { label: t('community.createPost') },
        ]}
        className="mb-6"
      />

      <Card className="glass-neon-strong rounded-3xl shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground">{t('community.createPost')}</CardTitle>
          <CardDescription className="text-muted-foreground dark:text-gray-300">{t('community.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">{t('community.post.content')}</Label>
              <Textarea
                id="content"
                placeholder={t('community.post.contentPlaceholder')}
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={6}
                maxLength={5000}
                required
              />
              <div className="text-sm text-muted-foreground dark:text-gray-300 text-right">
                {t('community.post.charCount', { count: formData.content.length })}
              </div>
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label>{t('community.post.city')}</Label>
              <CitySelect
                value={formData.city}
                onChange={(value) => setFormData(prev => ({ ...prev, city: value }))}
                placeholder={t('community.post.city')}
                allowEmpty={true}
              />
            </div>

            {/* Tag Pitch */}
            <div className="space-y-2">
              <Label>{t('community.post.tagPitch')}</Label>
              <Select
                value={formData.pitchId || '__NONE__'}
                onValueChange={(value) =>
                  setFormData(prev => ({ ...prev, pitchId: value === '__NONE__' ? '' : value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('community.post.tagPitch')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__NONE__">{t('common.all')}</SelectItem>
                  {pitches.map((pitch: any) => (
                    <SelectItem key={pitch.id} value={pitch.id}>
                      {pitch.nameAr || pitch.nameEn || pitch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tag Team */}
            {userTeams.length > 0 && (
              <div className="space-y-2">
                <Label>{t('community.post.tagTeam')}</Label>
                <Select
                  value={formData.teamId || '__NONE__'}
                  onValueChange={(value) =>
                    setFormData(prev => ({ ...prev, teamId: value === '__NONE__' ? '' : value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('community.post.tagTeam')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__NONE__">{t('common.all')}</SelectItem>
                    {userTeams.map((team: any) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>{t('community.post.uploadImage')}</Label>
              {!imagePreview && !formData.mediaUrl ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={cn(
                    'border border-dashed rounded-2xl glass-neon-subtle border-cyan-400/15 p-8 text-center cursor-pointer transition-colors',
                    isDragging
                      ? 'border-cyan-400/20 bg-cyan-500/5'
                      : 'border-cyan-400/12 hover:border-cyan-400/18'
                  )}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    {t('community.post.dragDrop')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, WEBP (max 5MB)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview || formData.mediaUrl || ''}
                    alt="Preview"
                    className="w-full h-auto max-h-96 rounded-2xl object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                    disabled={uploadImageMutation.isPending}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  {uploadImageMutation.isPending && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl backdrop-blur-sm">
                      <p className="text-foreground">{t('common.loading')}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex gap-4 justify-end pt-6 border-t border-cyan-400/10">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/community')}
                className="font-semibold"
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={createPostMutation.isPending || uploadImageMutation.isPending}
                className="font-bold bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-foreground shadow-soft hover:shadow-glow"
              >
                {createPostMutation.isPending
                  ? t('community.post.creating')
                  : t('community.post.create')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

