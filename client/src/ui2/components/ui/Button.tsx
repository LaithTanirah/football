import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-cyan-500 text-foreground hover:bg-cyan-600 shadow-md hover:shadow-lg transition-shadow',
        destructive: 'bg-red-500 text-foreground hover:bg-red-600 shadow-md hover:shadow-lg',
        outline: 'border border-cyan-400/18 dark:border-cyan-400/20 bg-transparent text-foreground hover:bg-cyan-500/10 hover:border-cyan-400/25 transition-all',
        secondary: 'bg-purple-500 text-foreground hover:bg-purple-600 shadow-md hover:shadow-lg',
        ghost: 'text-foreground hover:bg-cyan-500/10 hover:text-foreground',
        link: 'text-blue-500 dark:text-blue-400 underline-offset-4 hover:underline hover:text-blue-600 dark:hover:text-blue-300',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-lg px-4 text-xs',
        lg: 'h-12 md:h-14 rounded-xl px-6 md:px-8 text-base md:text-lg font-semibold',
        icon: 'h-11 w-11 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
