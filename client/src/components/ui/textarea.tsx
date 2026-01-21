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
          'glass-subtle flex min-h-[100px] w-full rounded-xl border border-glass-border px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:bg-glass-hover focus-visible:border-glass-border disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
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

