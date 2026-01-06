import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/admin/PageHeader';
import { LayoutContainer } from '@/components/admin/LayoutContainer';
import { DataTableToolbar } from '@/components/admin/DataTableToolbar';
import { DataTable } from '@/components/admin/DataTable';
import { RowActionsMenu } from '@/components/admin/RowActionsMenu';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CitySelect } from '@/components/CitySelect';
import { TeamLogoUpload } from '@/components/team/TeamLogoUpload';
import { teamsApi, adminApi, pitchesApi } from '@/lib/api';
import { useDirection } from '@/hooks/useDirection';
import { useToast } from '@/components/ui/use-toast';
import { JORDAN_CITIES, getCityDisplayName } from '@/lib/cities';
import { useLocaleStore } from '@/store/localeStore';

export function AdminTeams() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const { locale } = useLocaleStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<{ id: string; name: string } | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [teamToEdit, setTeamToEdit] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    city: '',
    logoUrl: '',
    preferredPitchId: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'teams', cityFilter, search],
    queryFn: () => teamsApi.getAll({ city: cityFilter && cityFilter !== 'all' ? cityFilter : undefined, search }),
  });

  const { data: pitchesData } = useQuery({
    queryKey: ['pitches'],
    queryFn: () => pitchesApi.getAll(),
    enabled: editDialogOpen,
  });

  const teams = useMemo(() => {
    if (!data?.data.data) return [];
    return data.data.data.map((team: any) => ({
      id: team.id,
      name: team.name,
      city: team.city,
      members: team.memberCount || 0,
      created: team.createdAt ? new Date(team.createdAt).toLocaleDateString() : '-',
      _teamData: team,
    }));
  }, [data]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteTeam(id),
    onSuccess: () => {
      toast({
        title: t('common.success'),
        description: t('admin.teams.deleteSuccess'),
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'teams'] });
      setDeleteConfirmOpen(false);
      setTeamToDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.response?.data?.message || t('admin.teams.deleteError'),
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => teamsApi.update(id, data),
    onSuccess: () => {
      toast({
        title: t('common.success'),
        description: t('admin.teams.updateSuccess'),
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'teams'] });
      queryClient.invalidateQueries({ queryKey: ['team', teamToEdit?.id] });
      setEditDialogOpen(false);
      setTeamToEdit(null);
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.response?.data?.message || t('admin.teams.updateError'),
        variant: 'destructive',
      });
    },
  });

  const handleView = (teamId: string) => {
    navigate(`/teams/${teamId}`);
  };

  const handleEdit = (team: any) => {
    const teamData = team._teamData || team;
    setTeamToEdit(teamData);
    setEditFormData({
      name: teamData.name || '',
      city: teamData.city || '',
      logoUrl: teamData.logoUrl || '',
      preferredPitchId: teamData.preferredPitchId || '',
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (team: any) => {
    setTeamToDelete({ id: team.id, name: team.name });
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!teamToDelete) return;
    deleteMutation.mutate(teamToDelete.id);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamToEdit || !editFormData.name || !editFormData.city) {
      toast({
        title: t('common.error'),
        description: t('teams.fillRequiredFields'),
        variant: 'destructive',
      });
      return;
    }

    updateMutation.mutate({
      id: teamToEdit.id,
      data: {
        name: editFormData.name,
        city: editFormData.city,
        logoUrl: editFormData.logoUrl || undefined,
        preferredPitchId: editFormData.preferredPitchId || undefined,
      },
    });
  };

  const pitches = pitchesData?.data.data || [];

  const columns = [
    { 
      key: 'name', 
      label: t('admin.teams.columns.name'),
      render: (row: any) => <span dir="auto">{row.name}</span>
    },
    { 
      key: 'city', 
      label: t('admin.teams.columns.city'),
      render: (row: any) => <span dir="auto">{getCityDisplayName(row.city, locale)}</span>
    },
    { 
      key: 'members', 
      label: t('admin.teams.columns.members'),
    },
    { 
      key: 'created', 
      label: t('admin.teams.columns.created'),
    },
  ];

  const cityOptions = useMemo(() => {
    // Don't include 'all' here - DataTableToolbar adds it automatically
    return JORDAN_CITIES.map((city) => ({
      value: city.key,
      label: getCityDisplayName(city.key, locale),
    }));
  }, [locale, t]);

  const filters = [
    {
      key: 'city',
      label: t('admin.teams.filters.city'),
      value: cityFilter,
      options: cityOptions,
    },
  ];

  const sortOptions = [
    { value: 'name', label: t('admin.teams.sort.name') },
    { value: 'members', label: t('admin.teams.sort.members') },
    { value: 'created', label: t('admin.teams.sort.created') },
  ];

  return (
    <LayoutContainer>
      <PageHeader
        title={t('admin.teams.title')}
        subtitle={t('admin.teams.subtitle')}
      />

      <div className="px-6 pb-6">
        <DataTableToolbar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={t('admin.teams.searchPlaceholder')}
          filters={filters}
          onFilterChange={(key, value) => {
            if (key === 'city') setCityFilter(value);
          }}
          onFilterRemove={(key) => {
            if (key === 'city') setCityFilter('all');
          }}
          sortOptions={sortOptions}
          resultCount={teams.length}
          primaryAction={
            <Button asChild>
              <Link to="/teams/create">
                <Plus className="h-4 w-4 me-2" />
                {t('admin.teams.create')}
              </Link>
            </Button>
          }
        />

        <DataTable
          columns={columns}
          data={teams}
          isLoading={isLoading}
          emptyMessage={t('admin.teams.empty')}
          emptyDescription={t('admin.teams.emptyDesc')}
          actions={(row) => (
            <RowActionsMenu
              onView={() => handleView(row.id)}
              onEdit={() => handleEdit(row)}
              onDelete={() => handleDelete(row)}
              disabled={deleteMutation.isPending}
            />
          )}
        />
      </div>

      {/* Edit Team Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('admin.teams.editTitle') || 'Edit Team'}</DialogTitle>
            <DialogDescription>
              {t('admin.teams.editSubtitle') || 'Update team information'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">{t('admin.teams.columns.name')} *</Label>
                <Input
                  id="edit-name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  required
                  dir="auto"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-city">{t('admin.teams.columns.city')} *</Label>
                <CitySelect
                  value={editFormData.city}
                  onChange={(value) => setEditFormData({ ...editFormData, city: value })}
                  allowEmpty={false}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-logo">{t('teams.logo') || 'Logo URL'}</Label>
                <Input
                  id="edit-logo"
                  type="url"
                  value={editFormData.logoUrl}
                  onChange={(e) => setEditFormData({ ...editFormData, logoUrl: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  dir="auto"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-pitch">{t('teams.preferredPitch') || 'Preferred Pitch'}</Label>
                <Select
                  value={editFormData.preferredPitchId}
                  onValueChange={(value) => setEditFormData({ ...editFormData, preferredPitchId: value })}
                >
                  <SelectTrigger id="edit-pitch" dir={isRTL ? 'rtl' : 'ltr'}>
                    <SelectValue placeholder={t('teams.selectPitch') || 'Select a pitch'} />
                  </SelectTrigger>
                  <SelectContent dir={isRTL ? 'rtl' : 'ltr'}>
                    <SelectItem value="">{t('common.none') || 'None'}</SelectItem>
                    {pitches.map((pitch: any) => (
                      <SelectItem key={pitch.id} value={pitch.id}>
                        {pitch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                disabled={updateMutation.isPending}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 me-2 animate-spin" />
                    {t('common.loading')}
                  </>
                ) : (
                  t('common.save')
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.teams.deleteConfirmTitle')}</DialogTitle>
            <DialogDescription>
              {t('admin.teams.deleteConfirm')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
              disabled={deleteMutation.isPending}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 me-2 animate-spin" />
                  {t('common.loading')}
                </>
              ) : (
                t('admin.actions.delete')
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </LayoutContainer>
  );
}
