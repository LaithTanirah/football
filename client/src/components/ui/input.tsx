import * as React from 'react';
import { cn } from '@/lib/utils';
import { useDirection } from '@/hooks/useDirection';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const { dir, isRTL } = useDirection();
    return (
      <input
        type={type}
        dir={dir}
        className={cn(
          'flex min-h-[52px] w-full rounded-brand border-2 border-border-soft bg-bg-panel px-4 py-3 text-base text-text-primary ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-muted placeholder:opacity-60 focus-visible:outline-none focus-visible:border-brand-blue focus-visible:ring-2 focus-visible:ring-brand-blue/20 focus-visible:shadow-soft transition-all disabled:cursor-not-allowed disabled:opacity-50',
          isRTL ? 'text-right' : 'text-left',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };

