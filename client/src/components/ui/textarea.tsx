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
          'flex min-h-[80px] w-full rounded-brand border-2 border-border-soft bg-bg-panel px-4 py-3 text-base ring-offset-background placeholder:text-text-muted placeholder:opacity-60 focus-visible:outline-none focus-visible:border-brand-blue focus-visible:ring-2 focus-visible:ring-brand-blue/20 focus-visible:shadow-soft disabled:cursor-not-allowed disabled:opacity-50',
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

