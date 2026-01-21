import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, subtitle, className, children }: PageHeaderProps) {
  return (
    <div className={cn('mb-8 relative z-10', className)}>
      <div className="glass-neon-strong rounded-2xl p-6 md:p-8 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted-foreground dark:text-gray-300 text-lg">
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
