import { useState } from 'react';
import { User } from 'lucide-react';
import { generateAvatarUrl, getInitials, getColorFromString } from '@/lib/avatar';
import { cn } from '@/lib/utils';

function adjustBrightness(hsl: string, amount: number): string {
  const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return hsl;
  const [, h, s, l] = match;
  const newL = Math.max(0, Math.min(100, parseInt(l) + amount));
  return `hsl(${h}, ${s}%, ${newL}%)`;
}

interface UserAvatarProps {
  user: {
    name?: string;
    username?: string;
    avatar?: string | null;
  } | null | undefined;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showFallback?: boolean;
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

const iconSizes = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export function UserAvatar({ user, size = 'md', className, showFallback = true }: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);

  if (!user) {
    return (
      <div className={cn('rounded-full bg-muted flex items-center justify-center', sizeClasses[size], className)}>
        <User className={cn('text-muted-foreground', iconSizes[size])} />
      </div>
    );
  }

  const hasAvatar = user.avatar && !imageError;
  const defaultAvatarUrl = generateAvatarUrl(user.name || 'User', user.username || 'user');
  const initials = getInitials(user.name || user.username || 'U');

  if (hasAvatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name || 'User'}
        className={cn('rounded-full object-cover border-2 border-border-soft', sizeClasses[size], className)}
        onError={() => setImageError(true)}
      />
    );
  }

  // Fallback: Generated avatar with initials
  if (showFallback) {
    const color = getColorFromString(user.username || user.name || 'user');
    return (
      <div
        className={cn(
          'rounded-full flex items-center justify-center font-bold text-white border-2 border-border-soft',
          sizeClasses[size],
          className
        )}
        style={{
          background: `linear-gradient(135deg, ${color}, ${adjustBrightness(color, -20)})`,
        }}
      >
        {initials}
      </div>
    );
  }

  return (
    <div className={cn('rounded-full bg-muted flex items-center justify-center', sizeClasses[size], className)}>
      <User className={cn('text-muted-foreground', iconSizes[size])} />
    </div>
  );
}

