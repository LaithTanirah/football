import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-md bg-gradient-to-r from-blue-500/10 via-blue-400/5 to-blue-500/10 bg-[length:200%_100%] border border-blue-400/30 animate-pulse',
        className
      )}
      style={{
        animation: 'shimmer 2s infinite linear',
      }}
      {...props}
    />
  );
}

export { Skeleton };
