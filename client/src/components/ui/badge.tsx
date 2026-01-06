import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border-2 px-3 py-1 text-xs font-bold transition-colors uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-brand-blue text-text-invert',
        secondary: 'border-transparent bg-brand-green text-text-invert',
        accent: 'border-transparent bg-brand-orange text-text-invert',
        cyan: 'border-transparent bg-brand-cyan text-text-invert',
        outline: 'border-border-strong text-text-primary bg-bg-panel',
        success: 'border-transparent bg-success text-success-foreground',
        warning: 'border-transparent bg-warning text-warning-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
        // Status variants
        draft: 'border-transparent bg-muted text-muted-foreground',
        active: 'border-transparent bg-brand-green text-text-invert',
        completed: 'border-transparent bg-brand-orange text-text-invert',
        // Difficulty variants
        easy: 'border-transparent bg-brand-green text-text-invert',
        medium: 'border-transparent bg-brand-orange text-text-invert',
        hard: 'border-transparent bg-destructive text-destructive-foreground',
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

