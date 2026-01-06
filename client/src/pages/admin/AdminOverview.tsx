import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/admin/PageHeader';
import { LayoutContainer } from '@/components/admin/LayoutContainer';
import { StatCard } from '@/components/admin/StatCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      color: 'text-brand-blue'
    },
    { 
      title: t('admin.stats.teams'), 
      value: statsData?.data.data.teams?.toString() || '0', 
      icon: UsersRound,
      color: 'text-brand-orange'
    },
    { 
      title: t('admin.stats.leagues'), 
      value: statsData?.data.data.leagues?.toString() || '0', 
      icon: Trophy,
      color: 'text-brand-green'
    },
    { 
      title: t('admin.stats.pitches'), 
      value: statsData?.data.data.pitches?.toString() || '0', 
      icon: MapPin,
      color: 'text-brand-blue'
    },
  ];

  // Add posts stat if available
  const postsStat = statsData?.data.data.posts ? {
    title: t('admin.stats.posts') || 'Total Posts',
    value: statsData.data.data.posts.toString(),
    icon: FileText,
    color: 'text-brand-orange'
  } : null;

  const quickActions = [
    { 
      label: t('admin.quickActions.createLeague'), 
      to: '/leagues/create', 
      icon: Trophy,
      color: 'bg-brand-orange hover:bg-brand-orange/90'
    },
    { 
      label: t('admin.quickActions.createTeam'), 
      to: '/teams/create', 
      icon: UsersRound,
      color: 'bg-brand-blue hover:bg-brand-blue/90'
    },
    { 
      label: t('admin.quickActions.addPitch'), 
      to: '/admin/pitches', 
      icon: MapPin,
      color: 'bg-brand-green hover:bg-brand-green/90'
    },
    { 
      label: t('admin.quickActions.manageUsers'), 
      to: '/admin/users', 
      icon: Users,
      color: 'bg-brand-blue hover:bg-brand-blue/90'
    },
  ];

  return (
    <LayoutContainer>
      <PageHeader
        title={t('admin.overview.title')}
        subtitle={t('admin.overview.subtitle')}
        actions={
          <Button asChild>
            <Link to="/admin/users">
              <Plus className="h-4 w-4 me-2" />
              {t('admin.quickActions.manageUsers')}
            </Link>
          </Button>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 px-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={Icon}
              isLoading={isLoading}
            />
          );
        })}
        {postsStat && (
          <StatCard
            key={postsStat.title}
            title={postsStat.title}
            value={postsStat.value}
            icon={postsStat.icon}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Quick Actions */}
      <Card className="card-elevated mx-6 mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-text-primary">{t('admin.quickActions.title')}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.to} to={action.to}>
                  <Button 
                    variant="default" 
                    className={`w-full h-auto flex flex-col items-center gap-3 py-6 ${action.color} text-white shadow-sm hover:shadow-md transition-all`}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-sm font-semibold">{action.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="card-elevated mx-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-text-primary">{t('admin.overview.recentActivity')}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-text-muted text-center">{t('admin.overview.noActivity')}</p>
          </div>
        </CardContent>
      </Card>
    </LayoutContainer>
  );
}
