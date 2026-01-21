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
          'glass-subtle flex h-11 w-full rounded-xl border border-glass-border px-4 py-2.5 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:bg-glass-hover focus-visible:border-glass-border disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
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

