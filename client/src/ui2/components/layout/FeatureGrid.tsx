import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  action: {
    label: string;
    href: string;
  };
  accentColor?: 'blue' | 'purple' | 'pink';
}

interface FeatureGridProps {
  features: Feature[];
  className?: string;
}

const accentColors = {
  blue: {
    bg: 'bg-cyan-500/15',
    border: 'border-cyan-400/40',
    icon: 'text-cyan-300',
    shadow: 'shadow-[0_0_10px_rgba(6,182,212,0.2)]',
  },
  purple: {
    bg: 'bg-purple-500/12',
    border: 'border-purple-400/35',
    icon: 'text-purple-300',
    shadow: 'shadow-[0_0_10px_rgba(168,85,247,0.2)]',
  },
  pink: {
    bg: 'bg-pink-500/12',
    border: 'border-pink-400/35',
    icon: 'text-pink-300',
    shadow: 'shadow-[0_0_10px_rgba(236,72,153,0.2)]',
  },
};

export function FeatureGrid({ features, className }: FeatureGridProps) {
  return (
    <section className={cn('relative z-10 py-12 md:py-20', className)}>
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const colors = accentColors[feature.accentColor || (index % 3 === 0 ? 'blue' : index % 3 === 1 ? 'purple' : 'pink')];
            const Icon = feature.icon;
            
            return (
              <Card key={index} className="card-hover-neon flex flex-col h-full">
                <CardHeader className="flex-1 pb-4">
                  <div className={cn(
                    'w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border',
                    colors.bg,
                    colors.border,
                    colors.shadow
                  )}>
                    <Icon className={cn('h-8 w-8', colors.icon)} />
                  </div>
                  <CardTitle className="text-xl md:text-2xl font-bold mb-3">{feature.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Link to={feature.action.href}>
                    <Button variant="outline" className="w-full py-6 text-base hover:bg-cyan-500/10">
                      {feature.action.label}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
