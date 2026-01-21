import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminFiltersBar } from '@/components/admin/AdminFiltersBar';
import { AdminTable } from '@/components/admin/AdminTable';
import { RowActionsMenu } from '@/components/admin/RowActionsMenu';
import { Button } from '@/ui2/components/ui/Button';
import { Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/ui2/components/ui/Dialog';
import { Input } from '@/ui2/components/ui/Input';
import { Label } from '@/ui2/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui2/components/ui/Select';
import { CitySelect } from '@/components/CitySelect';
import { leaguesApi, adminApi } from '@/lib/api';
import { useDirection } from '@/hooks/useDirection';
import { useToast } from '@/ui2/components/ui/use-toast';

export function AdminLeagues() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [leagueToDelete, setLeagueToDelete] = useState<{ id: string; name: string } | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [leagueToEdit, setLeagueToEdit] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    city: '',
    season: '',
    startDate: '',
    status: 'DRAFT' as 'DRAFT' | 'ACTIVE' | 'FINISHED',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'leagues', statusFilter, search],
    queryFn: () => leaguesApi.getAll({ 
      status: statusFilter !== 'all' ? statusFilter : undefined, 
      search: search || undefined 
    }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteLeague?.(id) || Promise.reject(new Error('Delete not implemented')),
    onSuccess: () => {
      toast({
        title: t('common.success'),
        description: t('admin.leagues.deleteSuccess'),
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'leagues'] });
      queryClient.invalidateQueries({ queryKey: ['leagues'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      queryClient.refetchQueries({ queryKey: ['admin', 'leagues'] });
      setDeleteConfirmOpen(false);
      setLeagueToDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.response?.data?.message || t('admin.leagues.deleteError'),
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminApi.updateLeague(id, data),
    onSuccess: () => {
      toast({
        title: t('common.success'),
        description: t('admin.leagues.updateSuccess') || 'League updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'leagues'] });
      queryClient.invalidateQueries({ queryKey: ['league', leagueToEdit?.id] });
      setEditDialogOpen(false);
      setLeagueToEdit(null);
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.response?.data?.message || t('admin.leagues.updateError') || 'Failed to update league',
        variant: 'destructive',
      });
    },
  });

  const handleView = (leagueId: string) => {
    navigate(`/leagues/${leagueId}`);
  };

  const handleEdit = (league: any) => {
    const leagueData = league._leagueData || league;
    setLeagueToEdit(leagueData);
    setEditFormData({
      name: leagueData.name || '',
      city: leagueData.city || '',
      season: leagueData.season || '',
      startDate: leagueData.startDate ? new Date(leagueData.startDate).toISOString().split('T')[0] : '',
      status: (leagueData.status || 'DRAFT') as 'DRAFT' | 'ACTIVE' | 'FINISHED',
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leagueToEdit || !editFormData.name || !editFormData.city) {
      toast({
        title: t('common.error'),
        description: t('admin.leagues.fillRequiredFields') || 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    updateMutation.mutate({
      id: leagueToEdit.id,
      data: {
        name: editFormData.name,
        city: editFormData.city,
        season: editFormData.season || null,
        startDate: editFormData.startDate || null,
        status: editFormData.status,
      },
    });
  };

  const handleDelete = (league: any) => {
    setLeagueToDelete({ id: league.id, name: league.name });
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!leagueToDelete) return;
    deleteMutation.mutate(leagueToDelete.id);
  };

  const leagues = useMemo(() => {
    if (!data?.data.data) return [];
    return data.data.data.map((league: any) => ({
      id: league.id,
      name: league.name,
      city: league.city,
      teams: league.teamCount || 0,
      status: league.status || 'DRAFT',
      created: league.createdAt ? new Date(league.createdAt).toLocaleDateString() : '-',
      _leagueData: league,
    }));
  }, [data]);

  const columns = [
    { key: 'name', label: t('admin.leagues.columns.name'), className: isRTL ? 'text-right' : 'text-left' },
    { key: 'city', label: t('admin.leagues.columns.city'), className: isRTL ? 'text-right' : 'text-left' },
    { key: 'teams', label: t('admin.leagues.columns.teams'), className: isRTL ? 'text-right' : 'text-left' },
    { key: 'status', label: t('admin.leagues.columns.status'), className: isRTL ? 'text-right' : 'text-left' },
    { key: 'created', label: t('admin.leagues.columns.created'), className: isRTL ? 'text-right' : 'text-left' },
  ];

  const statusOptions = [
    { value: 'all', label: t('common.all') },
    { value: 'DRAFT', label: t('admin.leagues.status.draft') },
    { value: 'ACTIVE', label: t('admin.leagues.status.active') },
    { value: 'COMPLETED', label: t('admin.leagues.status.finished') },
  ];

  const filters = [
    {
      key: 'status',
      label: t('admin.leagues.filters.status'),
      value: statusFilter || 'all',
      options: statusOptions,
    },
  ];

  const sortOptions = [
    { value: 'name', label: t('admin.leagues.sort.name') },
    { value: 'teams', label: t('admin.leagues.sort.teams') },
    { value: 'created', label: t('admin.leagues.sort.created') },
  ];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 overflow-x-hidden">
      <AdminPageHeader
        title={t('admin.leagues.title')}
        subtitle={t('admin.leagues.subtitle')}
        actions={
          <Button asChild>
            <Link to="/leagues/create">
              <Plus className="h-4 w-4 me-2" />
              {t('admin.leagues.create')}
            </Link>
          </Button>
        }
      />

      <AdminFiltersBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('admin.leagues.searchPlaceholder')}
        filters={filters}
        onFilterChange={(key, value) => {
          if (key === 'status') setStatusFilter(value === 'all' ? '' : value);
        }}
        onFilterRemove={(key) => {
          if (key === 'status') setStatusFilter('');
        }}
        sortOptions={sortOptions}
      />

      <AdminTable
        columns={columns}
        data={leagues}
        isLoading={isLoading || deleteMutation.isPending}
        emptyMessage={t('admin.leagues.empty')}
        emptyDescription={t('admin.leagues.emptyDesc')}
        actions={(row) => (
          <RowActionsMenu
            onView={() => handleView(row.id)}
            onEdit={() => handleEdit(row)}
            onDelete={() => handleDelete(row)}
            disabled={deleteMutation.isPending}
          />
        )}
      />

      {/* Edit League Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('admin.leagues.editTitle') || 'Edit League'}</DialogTitle>
            <DialogDescription>
              {t('admin.leagues.editSubtitle') || 'Update league information'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-league-name">{t('admin.leagues.columns.name')} *</Label>
                  <Input
                    id="edit-league-name"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-league-city">{t('admin.leagues.columns.city')} *</Label>
                  <CitySelect
                    value={editFormData.city}
                    onChange={(value) => setEditFormData({ ...editFormData, city: value })}
                    allowEmpty={false}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-league-season">{t('leagues.season') || 'Season'}</Label>
                  <Input
                    id="edit-league-season"
                    value={editFormData.season}
                    onChange={(e) => setEditFormData({ ...editFormData, season: e.target.value })}
                    placeholder="2024-2025"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-league-startDate">{t('leagues.startDate') || 'Start Date'}</Label>
                  <Input
                    id="edit-league-startDate"
                    type="date"
                    value={editFormData.startDate}
                    onChange={(e) => setEditFormData({ ...editFormData, startDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-league-status">{t('admin.leagues.columns.status')} *</Label>
                <Select
                  value={editFormData.status}
                  onValueChange={(value) => setEditFormData({ ...editFormData, status: value as 'DRAFT' | 'ACTIVE' | 'COMPLETED' })}
                >
                  <SelectTrigger id="edit-league-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">{t('admin.leagues.status.draft') || 'Draft'}</SelectItem>
                    <SelectItem value="ACTIVE">{t('admin.leagues.status.active') || 'Active'}</SelectItem>
                    <SelectItem value="COMPLETED">{t('admin.leagues.status.finished') || 'Completed'}</SelectItem>
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
        <DialogContent className="relative">
          {deleteMutation.isPending && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
              </div>
            </div>
          )}
          <DialogHeader>
            <DialogTitle>{t('admin.leagues.deleteConfirmTitle')}</DialogTitle>
            <DialogDescription>
              {t('admin.leagues.deleteConfirm')}
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
    </div>
  );
}

