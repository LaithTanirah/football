import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border-2 px-3 py-1 text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-cyan-400/80 bg-cyan-500/25 text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.5),0_0_40px_rgba(236,72,153,0.3)]',
        secondary: 'border-purple-400/70 bg-purple-500/20 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)]',
        accent: 'border-pink-400/70 bg-pink-500/20 text-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.4)]',
        outline: 'text-foreground dark:text-foregroundborder-cyan-400/60 bg-transparent hover:bg-cyan-500/15 hover:border-cyan-400/80',
        success: 'border-green-400/70 bg-green-500/20 text-green-300 shadow-[0_0_15px_rgba(34,197,94,0.4)]',
        warning: 'border-yellow-400/70 bg-yellow-500/20 text-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.4)]',
        destructive: 'border-red-400/70 bg-red-500/20 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.4)]',
        // Status variants
        draft: 'border-gray-400/50 bg-gray-500/20 text-gray-300',
        active: 'border-green-400/70 bg-green-500/20 text-green-300 shadow-[0_0_15px_rgba(34,197,94,0.4)]',
        completed: 'border-gray-400/50 bg-gray-500/20 text-gray-300',
        // Difficulty variants
        easy: 'border-green-400/70 bg-green-500/20 text-green-300 shadow-[0_0_15px_rgba(34,197,94,0.4)]',
        medium: 'border-yellow-400/70 bg-yellow-500/20 text-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.4)]',
        hard: 'border-red-400/70 bg-red-500/20 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.4)]',
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
