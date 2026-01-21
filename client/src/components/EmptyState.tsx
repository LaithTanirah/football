import { ReactNode } from 'react';
import { Button } from '@/ui2/components/ui/Button';
import { Card, CardContent } from '@/ui2/components/ui/Card';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <Card className={cn('glass-neon-strong', className)}>
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        {icon && <div className="mb-4 text-muted-foreground dark:text-gray-300 opacity-60">{icon}</div>}
        <h3 className="mb-2 text-2xl font-bold text-foreground">{title}</h3>
        {description && <p className="mb-6 max-w-sm text-sm text-muted-foreground dark:text-gray-300">{description}</p>}
        {action && (
          <>
            {action.href ? (
              <Button asChild>
                <a href={action.href}>{action.label}</a>
              </Button>
            ) : (
              <Button onClick={action.onClick}>{action.label}</Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

