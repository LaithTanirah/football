import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { LayoutContainer } from '@/components/admin/LayoutContainer';
import { AdminPageHeader, AdminStatCard, AdminQuickActionButton } from '@/ui/admin';
import { Button } from '@/ui2/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui2/components/ui/Card';
import { Users, UsersRound, Trophy, MapPin, FileText, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminApi } from '@/lib/api';

export function AdminOverview() {
  const { t } = useTranslation();

  const { data: statsData, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => adminApi.getStats(),
  });

  const stats = [
    { 
      title: t('admin.stats.users'), 
      value: statsData?.data.data.users?.toString() || '0', 
      icon: Users,
      color: 'text-cyan-400'
    },
    { 
      title: t('admin.stats.teams'), 
      value: statsData?.data.data.teams?.toString() || '0', 
      icon: UsersRound,
      color: 'text-purple-400'
    },
    { 
      title: t('admin.stats.leagues'), 
      value: statsData?.data.data.leagues?.toString() || '0', 
      icon: Trophy,
      color: 'text-pink-400'
    },
    { 
      title: t('admin.stats.pitches'), 
      value: statsData?.data.data.pitches?.toString() || '0', 
      icon: MapPin,
      color: 'text-cyan-400'
    },
  ];

  // Add posts stat if available
  const postsStat = statsData?.data.data.posts ? {
    title: t('admin.stats.posts') || 'Total Posts',
    value: statsData.data.data.posts.toString(),
    icon: FileText,
    color: 'text-purple-400'
  } : null;

  const quickActions = [
    { 
      label: t('admin.quickActions.createLeague'), 
      to: '/leagues/create', 
      icon: Trophy,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
    },
    { 
      label: t('admin.quickActions.createTeam'), 
      to: '/teams/create', 
      icon: UsersRound,
      color: 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700'
    },
    { 
      label: t('admin.quickActions.addPitch'), 
      to: '/admin/pitches', 
      icon: MapPin,
      color: 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600'
    },
    { 
      label: t('admin.quickActions.manageUsers'), 
      to: '/admin/users', 
      icon: Users,
      color: 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700'
    },
  ];

  return (
    <LayoutContainer>
      <AdminPageHeader
        title={t('admin.overview.title')}
        subtitle={t('admin.overview.subtitle')}
        actions={
          <Button asChild className="glass-neon-strong text-foreground">
            <Link to="/admin/users">
              <Plus className="h-4 w-4 me-2" />
              {t('admin.quickActions.manageUsers')}
            </Link>
          </Button>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <AdminStatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={Icon}
              isLoading={isLoading}
              iconColor={stat.color}
            />
          );
        })}
        {postsStat && (
          <AdminStatCard
            key={postsStat.title}
            title={postsStat.title}
            value={postsStat.value}
            icon={postsStat.icon}
            isLoading={isLoading}
            iconColor={postsStat.color}
          />
        )}
      </div>

      {/* Quick Actions */}
      <Card className="glass-neon-strong rounded-2xl mb-6 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-foreground">
            {t('admin.quickActions.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <AdminQuickActionButton
                  key={action.to}
                  label={action.label}
                  to={action.to}
                  icon={Icon}
                  gradient={action.color}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="glass-neon-strong rounded-2xl shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-foreground">
            {t('admin.overview.recentActivity')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-gray-300 dark:text-gray-300 text-center">
              {t('admin.overview.noActivity')}
            </p>
          </div>
        </CardContent>
      </Card>
    </LayoutContainer>
  );
}
