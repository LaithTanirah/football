import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'glass-subtle inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-glass-border bg-gradient-to-r from-playro-blue/20 to-playro-blue/10 text-playro-blue',
        secondary: 'border-glass-border bg-glass-bg text-foreground',
        accent: 'border-glass-border bg-glass-bg text-foreground',
        outline: 'text-foreground border-glass-border bg-transparent',
        success: 'border-glass-border bg-gradient-to-r from-playro-green/20 to-playro-green/10 text-playro-green',
        warning: 'border-glass-border bg-gradient-to-r from-playro-orange/20 to-playro-orange/10 text-playro-orange',
        destructive: 'border-glass-border bg-gradient-to-r from-error/20 to-error/10 text-error',
        // Status variants
        draft: 'border-glass-border bg-glass-bg text-muted-foreground',
        active: 'border-glass-border bg-gradient-to-r from-playro-green/20 to-playro-green/10 text-playro-green',
        completed: 'border-glass-border bg-glass-bg text-muted-foreground',
        // Difficulty variants
        easy: 'border-glass-border bg-gradient-to-r from-playro-green/20 to-playro-green/10 text-playro-green',
        medium: 'border-glass-border bg-gradient-to-r from-playro-orange/20 to-playro-orange/10 text-playro-orange',
        hard: 'border-glass-border bg-gradient-to-r from-error/20 to-error/10 text-error',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

