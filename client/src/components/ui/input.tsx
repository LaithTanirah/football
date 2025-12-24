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
          'flex min-h-[52px] w-full rounded-lg border border-border bg-input px-4 py-3 text-base text-input-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground placeholder:opacity-60 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_hsl(var(--ring)/0.1)] transition-all disabled:cursor-not-allowed disabled:opacity-50',
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

