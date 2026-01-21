import React from 'react';
import { cn } from '@/lib/utils';
import { useDirection } from '@/hooks/useDirection';

interface AuthShellProps {
  children: React.ReactNode;
  animationPanel: React.ReactNode;
}

export function AuthShell({ children, animationPanel }: AuthShellProps) {
  const { isRTL } = useDirection();

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12 pt-28 md:pt-32">
      <div className="container mx-auto max-w-6xl w-full relative z-10">
        {/* Desktop: 2-column grid, Mobile: 1-column stack */}
        <div className={cn(
          "grid gap-6 md:gap-8 lg:gap-12",
          "grid-cols-1 lg:grid-cols-2",
          "items-center",
          "min-h-[calc(100vh-12rem)]"
        )}>
          {/* Form Column */}
          <div
            className={cn(
              "w-full",
              // Desktop order: LTR = form left (order-1), RTL = form right (order-2)
              // Mobile: always first (order-1)
              isRTL ? "lg:order-2" : "lg:order-1",
              "order-1"
            )}
          >
            {children}
          </div>

          {/* Animation Panel Column */}
          <div
            className={cn(
              "w-full h-full",
              // Desktop order: LTR = animation right (order-2), RTL = animation left (order-1)
              // Mobile: always second (order-2)
              isRTL ? "lg:order-1" : "lg:order-2",
              "order-2",
              // Ensure animation panel has proper height on desktop
              "lg:h-[600px] h-[300px] md:h-[400px]"
            )}
          >
            {animationPanel}
          </div>
        </div>
      </div>
    </div>
  );
}
