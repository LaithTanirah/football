import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDirection } from '@/hooks/useDirection';

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => {
  const { dir, isRTL } = useDirection();
  return (
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      dir={dir}
      className={cn(
        'flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none text-foreground focus:bg-cyan-500/20 focus:text-foreground data-[state=open]:bg-cyan-500/20 transition-colors',
        inset && (isRTL ? 'pr-8' : 'pl-8'),
        className
      )}
      {...props}
    >
      {children}
      <ChevronRight className={cn("h-4 w-4", isRTL ? "mr-auto rotate-180" : "ml-auto")} />
    </DropdownMenuPrimitive.SubTrigger>
  );
});
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => {
  const { dir } = useDirection();
  return (
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      dir={dir}
      className={cn(
        'glass-neon-strong z-50 min-w-[8rem] overflow-hidden rounded-lg p-1 text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      {...props}
    />
  );
});
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, avoidCollisions = true, collisionPadding = 8, style, ...props }, ref) => {
  const { dir } = useDirection();
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        dir={dir}
        sideOffset={sideOffset}
        avoidCollisions={avoidCollisions}
        collisionPadding={collisionPadding}
        className={cn(
          'glass-neon-strong z-[200] min-w-[8rem] max-w-[16rem] rounded-xl border-2 border-cyan-400/50 dark:border-cyan-400/60 p-1 text-foreground shadow-[0_0_20px_rgba(6,182,212,0.3),0_0_40px_rgba(0,255,255,0.2),inset_0_0_0_1px_rgba(6,182,212,0.2)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          className
        )}
        style={{
          maxWidth: 'min(16rem, calc(100vw - 16px))',
          color: 'hsl(var(--foreground))',
          ...style,
        }}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
});
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => {
  const { dir, isRTL } = useDirection();
  return (
    <DropdownMenuPrimitive.Item
      ref={ref}
      dir={dir}
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors text-foreground focus:bg-cyan-500/30 focus:text-foreground hover:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        inset && (isRTL ? 'pr-8' : 'pl-8'),
        className
      )}
      {...props}
    />
  );
});
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => {
  const { dir, isRTL } = useDirection();
  return (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      dir={dir}
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm py-1.5 text-sm outline-none transition-colors text-foreground focus:bg-cyan-500/20 focus:text-foreground hover:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        isRTL ? 'pr-8 pl-2' : 'pl-8 pr-2',
        className
      )}
      checked={checked}
      {...props}
    >
      <span className={cn(
        'absolute flex h-3.5 w-3.5 items-center justify-center',
        isRTL ? 'right-2' : 'left-2'
      )}>
        <DropdownMenuPrimitive.ItemIndicator>
          <Check className="h-4 w-4 text-cyan-300" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
});
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => {
  const { dir, isRTL } = useDirection();
  return (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      dir={dir}
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm py-1.5 text-sm outline-none transition-colors text-foreground focus:bg-cyan-500/20 focus:text-foreground hover:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        isRTL ? 'pr-8 pl-2' : 'pl-8 pr-2',
        className
      )}
      {...props}
    >
      <span className={cn(
        'absolute flex h-3.5 w-3.5 items-center justify-center',
        isRTL ? 'right-2' : 'left-2'
      )}>
        <DropdownMenuPrimitive.ItemIndicator>
          <Circle className="h-2 w-2 fill-current text-cyan-300" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
});
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => {
  const { dir, isRTL } = useDirection();
  return (
    <DropdownMenuPrimitive.Label
      ref={ref}
      dir={dir}
      className={cn('px-2 py-1.5 text-sm font-semibold text-foreground', inset && (isRTL ? 'pr-8' : 'pl-8'), className)}
      {...props}
    />
  );
});
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-cyan-400/20', className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  const { isRTL } = useDirection();
  return <span className={cn('text-xs tracking-widest opacity-60 text-foreground', isRTL ? 'mr-auto' : 'ml-auto', className)} {...props} />;
};
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
