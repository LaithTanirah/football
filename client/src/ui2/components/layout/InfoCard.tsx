import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  accentColor?: 'blue' | 'green' | 'purple' | 'pink';
  className?: string;
}

const accentColors = {
  blue: {
    bg: 'from-cyan-500/25 to-cyan-500/15',
    iconBg: 'bg-cyan-500/25 dark:bg-cyan-500/25',
    iconColor: 'text-cyan-600 dark:text-cyan-300 fill-cyan-600 dark:fill-cyan-300',
    border: 'border-cyan-400/50',
  },
  green: {
    bg: 'from-green-500/20 to-green-500/10',
    iconBg: 'bg-green-500/20 dark:bg-green-500/20',
    iconColor: 'text-green-600 dark:text-green-400 fill-green-600 dark:fill-green-400',
    border: 'border-green-400/30',
  },
  purple: {
    bg: 'from-purple-500/25 to-purple-500/15',
    iconBg: 'bg-purple-500/25 dark:bg-purple-500/25',
    iconColor: 'text-purple-600 dark:text-purple-300 fill-purple-600 dark:fill-purple-300',
    border: 'border-purple-400/50',
  },
  pink: {
    bg: 'from-pink-500/25 to-pink-500/15',
    iconBg: 'bg-pink-500/25 dark:bg-pink-500/25',
    iconColor: 'text-pink-600 dark:text-pink-300 fill-pink-600 dark:fill-pink-300',
    border: 'border-pink-400/50',
  },
};

export function InfoCard({ icon: Icon, label, value, accentColor = 'blue', className }: InfoCardProps) {
  const colors = accentColors[accentColor];

  return (
    <Card className={cn('glass-neon-strong rounded-2xl bg-gradient-to-br border-2', colors.bg, colors.border, className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-muted-foreground dark:text-gray-300">
              {label}
            </p>
            <p className="text-2xl md:text-3xl font-bold text-foreground">
              {value}
            </p>
          </div>
          <div className={cn('rounded-2xl p-3 border', colors.iconBg, colors.border)}>
            <Icon className={cn('h-6 w-6', colors.iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
