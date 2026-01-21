import * as React from 'react';
import { cn } from '@/lib/utils';
import { useDirection } from '@/hooks/useDirection';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const { dir, isRTL } = useDirection();
    return (
      <textarea
        dir={dir}
        className={cn(
          'glass-neon-subtle flex min-h-[100px] w-full rounded-lg bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:border-cyan-400/80 focus-visible:shadow-[0_0_20px_rgba(6,182,212,0.5),0_0_40px_rgba(236,72,153,0.3)] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
          isRTL ? 'text-right' : 'text-left',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
