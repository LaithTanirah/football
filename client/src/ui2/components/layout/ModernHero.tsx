import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';

interface ModernHeroProps {
  title: string;
  description: string;
  imageUrl?: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryActions?: Array<{
    label: string;
    href: string;
  }>;
  className?: string;
}

export function ModernHero({
  title,
  description,
  imageUrl,
  primaryAction,
  secondaryActions,
  className,
}: ModernHeroProps) {
  return (
    <section className={cn('relative z-10 py-16 md:py-24 lg:py-32', className)}>
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-5xl">
          {/* Large Hero Card with Image and Reduced Neon */}
          <div className="glass-neon relative overflow-hidden rounded-3xl p-8 md:p-12 lg:p-16 border border-cyan-400/40">
            {/* Background Image */}
            {imageUrl && (
              <div className="absolute inset-0 z-0">
                <img
                  src={imageUrl}
                  alt=""
                  className="w-full h-full object-cover opacity-20 dark:opacity-15"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 via-pink-600/10 to-purple-600/10" />
              </div>
            )}
            
            {/* Content */}
            <div className="relative z-10 text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 text-foreground tracking-tight leading-tight">
                {title}
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground dark:text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
                {description}
              </p>
              
              {/* Action Buttons */}
              {(primaryAction || secondaryActions) && (
                <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                  {secondaryActions?.map((action, index) => (
                    <Link key={index} to={action.href}>
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="min-w-[160px] md:min-w-[180px] text-base md:text-lg px-6 md:px-8 py-6 md:py-7"
                      >
                        {action.label}
                      </Button>
                    </Link>
                  ))}
                  {primaryAction && (
                    <Link to={primaryAction.href}>
                      <Button 
                        size="lg" 
                        className="min-w-[160px] md:min-w-[180px] text-base md:text-lg px-6 md:px-8 py-6 md:py-7 bg-cyan-500 hover:bg-cyan-600"
                      >
                        {primaryAction.label}
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
