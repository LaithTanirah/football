import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useDirection } from '@/hooks/useDirection';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Upload, Image as ImageIcon, X, Link2 } from 'lucide-react';
import { LogoBuilder } from './LogoBuilder';
import { uploadsApi } from '@/lib/api';
import { cn } from '@/lib/utils';

interface TeamLogoUploadProps {
  value?: string;
  onChange: (url: string) => void;
  teamName?: string;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];

export function TeamLogoUpload({ value, onChange, teamName = '' }: TeamLogoUploadProps) {
  const { t } = useTranslation();
  const { dir, isRTL } = useDirection();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [logoBuilderOpen, setLogoBuilderOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [imageError, setImageError] = useState(false);

  // Sync preview with value prop
  useEffect(() => {
    if (value) {
      setPreview(value);
      setImageError(false);
    } else if (!value) {
      setPreview(null);
      setImageError(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const uploadMutation = useMutation({
    mutationFn: uploadsApi.uploadTeamLogo,
    onSuccess: (response) => {
      const url = response.data.data.url;
      // Convert relative URL to absolute if needed
      // If it's already a data URL or absolute URL, use it as-is
      let fullUrl = url;
      if (!url.startsWith('http') && !url.startsWith('data:')) {
        // It's a relative URL, make it absolute
        fullUrl = `${window.location.origin}${url}`;
      }
      onChange(fullUrl);
      setPreview(fullUrl);
      setImageError(false);
      toast({
        title: t('teams.logoUploadSuccess'),
        description: t('teams.logoUploadSuccessDesc'),
      });
    },
    onError: (error: any) => {
      console.error('Upload error:', error);
      
      // Handle authentication errors
      if (error.response?.status === 401) {
        toast({
          title: t('common.error'),
          description: t('teams.uploadAuthError'),
          variant: 'destructive',
        });
        // Optionally redirect to login
        setTimeout(() => {
          navigate('/auth/login');
        }, 2000);
        return;
      }
      
      toast({
        title: t('common.error'),
        description: error.response?.data?.message || t('teams.logoUploadError'),
        variant: 'destructive',
      });
    },
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check authentication
    if (!user) {
      toast({
        title: t('common.error'),
        description: t('teams.uploadAuthError'),
        variant: 'destructive',
      });
      navigate('/auth/login');
      return;
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({
        title: t('teams.invalidFileType'),
        description: t('teams.invalidFileTypeDesc'),
        variant: 'destructive',
      });
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: t('teams.fileTooLarge'),
        description: t('teams.fileTooLargeDesc'),
        variant: 'destructive',
      });
      return;
    }

    // Read file as base64 and show immediate preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      // Show preview immediately before upload
      setPreview(base64);
      setImageError(false);
      // Then upload
      uploadMutation.mutate({ image: base64 });
    };
    reader.onerror = () => {
      toast({
        title: t('common.error'),
        description: t('teams.fileReadError'),
        variant: 'destructive',
      });
    };
    reader.readAsDataURL(file);
  };

  const handleCustomLogoSave = async (imageDataUrl: string) => {
    // Check authentication
    if (!user) {
      toast({
        title: t('common.error'),
        description: t('teams.uploadAuthError'),
        variant: 'destructive',
      });
      navigate('/auth/login');
      return;
    }
    
    // Show preview immediately
    setPreview(imageDataUrl);
    setImageError(false);
    // Then upload
    uploadMutation.mutate({ image: imageDataUrl });
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    onChange(url);
    if (url) {
      setPreview(url);
    }
  };

  const handleRemove = () => {
    onChange('');
    setPreview(null);
    setImageError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4" dir={dir}>
      <Label htmlFor="team-logo-upload" className="block mb-2">{t('teams.teamLogo')}</Label>
      
      <div className="space-y-3">
        {/* Preview */}
        {preview && (
          <div className="relative inline-block">
            {imageError ? (
              <div className="w-24 h-24 rounded-lg border-2 border-border bg-muted flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            ) : (
              <img
                src={preview}
                alt=""
                className="w-24 h-24 rounded-lg object-cover border-2 border-border"
                onError={() => {
                  setImageError(true);
                  console.error('Failed to load logo image:', preview);
                }}
                onLoad={() => setImageError(false)}
              />
            )}
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={handleRemove}
              aria-label={t('teams.removePlayer')}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Upload Options */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMutation.isPending}
            className="flex-1"
            id="team-logo-upload"
          >
            <Upload className={cn('h-4 w-4', isRTL ? 'ml-2' : 'mr-2')} />
            {uploadMutation.isPending ? t('teams.uploading') : t('teams.uploadLogo')}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setLogoBuilderOpen(true)}
            className="flex-1"
          >
            <ImageIcon className={cn('h-4 w-4', isRTL ? 'ml-2' : 'mr-2')} />
            {t('teams.createLogo')}
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_TYPES.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          id="team-logo-file-input"
        />

        {/* URL Input (Advanced) */}
        <div className="space-y-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-sm"
          >
            <Link2 className={cn('h-3 w-3', isRTL ? 'ml-1' : 'mr-1')} />
            {showUrlInput ? t('teams.hideUrlInput') : t('teams.useUrlInstead')}
          </Button>

          {showUrlInput && (
            <Input
              type="url"
              value={value || ''}
              onChange={handleUrlChange}
              placeholder={t('teams.logoUrlPlaceholder')}
            />
          )}
        </div>
      </div>

      <LogoBuilder
        open={logoBuilderOpen}
        onOpenChange={setLogoBuilderOpen}
        onSave={handleCustomLogoSave}
        teamName={teamName}
      />
    </div>
  );
}

