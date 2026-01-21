import { ReactNode } from 'react';
import { Card, CardContent } from '@/ui2/components/ui/Card';
import { Skeleton } from '@/ui2/components/ui/Skeleton';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  message?: string;
  className?: string;
  skeletonCount?: number;
}

export function LoadingState({ message, className, skeletonCount = 3 }: LoadingStateProps) {
  return (
    <Card className={cn('glass-neon-strong', className)}>
      <CardContent className="flex flex-col items-center justify-center py-16">
        {message && <p className="mb-4 text-sm text-muted-foreground">{message}</p>}
        <div className="space-y-2 w-full max-w-md">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
