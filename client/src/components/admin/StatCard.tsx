import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  isLoading?: boolean;
  className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, isLoading, className }: StatCardProps) {
  return (
    <Card className={cn('card-elevated', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
        <CardTitle className="text-sm font-medium text-text-muted">{title}</CardTitle>
        {Icon && <Icon className="h-5 w-5 text-text-muted" />}
      </CardHeader>
      <CardContent className="px-6 pb-6">
        {isLoading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <>
            <div className="text-3xl font-bold text-text-primary mb-1">{value}</div>
            {trend && (
              <p className={cn('text-xs mt-1', trend.isPositive ? 'text-brand-green' : 'text-error')}>
                {trend.value}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
