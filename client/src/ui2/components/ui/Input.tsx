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
          'glass-neon-subtle flex h-11 w-full rounded-xl bg-background px-4 py-2.5 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'text-gray-200 dark:text-gray-100',
          'placeholder:text-gray-400 dark:placeholder:text-gray-500',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:border-cyan-400/80 focus-visible:shadow-[0_0_20px_rgba(6,182,212,0.5),0_0_40px_rgba(236,72,153,0.3)]',
          'disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
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
