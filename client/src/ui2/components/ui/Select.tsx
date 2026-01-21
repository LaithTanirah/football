import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDirection } from '@/hooks/useDirection';

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;

const SelectValue = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Value>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value>
>(({ className, ...props }, ref) => {
  const { dir, isRTL } = useDirection();
  return (
    <SelectPrimitive.Value
      ref={ref}
      dir={dir}
      className={cn(
        'block truncate flex-1 min-w-0',
        'text-gray-200 dark:text-gray-100',
        isRTL ? 'text-right' : 'text-left',
        className
      )}
      {...props}
    />
  );
});
SelectValue.displayName = SelectPrimitive.Value.displayName;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  const { dir, isRTL } = useDirection();
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      dir={dir}
      className={cn(
        'glass-neon-subtle flex h-11 w-full items-center justify-between rounded-lg bg-background px-4 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:border-cyan-400/80 focus:shadow-[0_0_20px_rgba(6,182,212,0.5),0_0_40px_rgba(236,72,153,0.3)] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
        'text-gray-200 dark:text-gray-100',
        isRTL ? 'flex-row-reverse justify-between text-right' : 'justify-between text-left',
        '[&>span]:line-clamp-1 [&>span]:flex-1 [&>span]:min-w-0 [&>span[data-placeholder]]:text-gray-400 dark:text-gray-400 [&>span:not([data-placeholder])]:text-gray-200 dark:[&>span:not([data-placeholder])]:text-gray-100',
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn('flex cursor-default items-center justify-center py-1 border-b border-cyan-400/20', className)}
    {...props}
  >
    <ChevronUp className="h-4 w-4 text-cyan-400/60" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn('flex cursor-default items-center justify-center py-1.5 border-t-2 border-cyan-400/50 dark:border-cyan-400/60 bg-slate-900/30 dark:bg-slate-800/30', className)}
    {...props}
  >
    <ChevronDown className="h-4 w-4 text-cyan-400/80" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => {
  const { dir, isRTL } = useDirection();
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        dir={dir}
        className={cn(
          'glass-neon-strong relative z-[200] max-h-96 min-w-[8rem] rounded-lg border-2 border-cyan-400/50 dark:border-cyan-400/60 text-popover-foreground shadow-[0_0_20px_rgba(6,182,212,0.3),inset_0_0_0_1px_rgba(6,182,212,0.2)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          isRTL && 'text-right',
          className
        )}
        position={position}
        sideOffset={4}
        collisionPadding={8}
        avoidCollisions={true}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            'p-1 pb-2 overflow-y-auto overflow-x-hidden',
            position === 'popper' &&
              'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
          )}
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(6, 182, 212, 0.3) transparent',
          }}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => {
  const { dir, isRTL } = useDirection();
  return (
    <SelectPrimitive.Label
      ref={ref}
      dir={dir}
      className={cn(
        'py-1.5 text-sm font-semibold',
        isRTL ? 'pr-8 pl-2 text-right' : 'pl-8 pr-2 text-left',
        className
      )}
      {...props}
    />
  );
});
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => {
  const { dir, isRTL } = useDirection();
  return (
    <SelectPrimitive.Item
      ref={ref}
      dir={dir}
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 text-sm outline-none',
        'text-gray-200 dark:text-gray-100',
        'focus:bg-cyan-500/30 focus:text-cyan-100 hover:bg-cyan-500/20 hover:text-cyan-100',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors',
        isRTL ? 'pr-8 pl-2 text-right' : 'pl-8 pr-2 text-left',
        className
      )}
      {...props}
    >
      <span className={cn(
        'absolute flex h-3.5 w-3.5 items-center justify-center',
        isRTL ? 'right-2' : 'left-2'
      )}>
        <SelectPrimitive.ItemIndicator>
          <Check className="h-4 w-4 text-cyan-300" />
        </SelectPrimitive.ItemIndicator>
      </span>

      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-cyan-400/20', className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
