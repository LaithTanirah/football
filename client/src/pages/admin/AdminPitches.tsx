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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CitySelect } from '@/components/CitySelect';
import { pitchesApi, adminApi } from '@/lib/api';
import { useDirection } from '@/hooks/useDirection';
import { useToast } from '@/components/ui/use-toast';
import { JORDAN_CITIES, getCityDisplayName } from '@/lib/cities';
import { useLocaleStore } from '@/store/localeStore';

export function AdminPitches() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const { locale } = useLocaleStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [pitchToDelete, setPitchToDelete] = useState<{ id: string; name: string } | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [pitchToEdit, setPitchToEdit] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    city: '',
    address: '',
    indoor: false,
    description: '',
    pricePerHour: 0,
    openTime: '08:00',
    closeTime: '22:00',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'pitches', cityFilter, search],
    queryFn: () => pitchesApi.getAll({ city: cityFilter !== 'all' ? cityFilter : undefined, search }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deletePitch?.(id) || Promise.reject(new Error('Delete not implemented')),
    onSuccess: () => {
      toast({
        title: t('common.success'),
        description: t('admin.pitches.deleteSuccess'),
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'pitches'] });
      setDeleteConfirmOpen(false);
      setPitchToDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.response?.data?.message || t('admin.pitches.deleteError'),
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminApi.updatePitch(id, data),
    onSuccess: () => {
      toast({
        title: t('common.success'),
        description: t('admin.pitches.updateSuccess') || 'Pitch updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'pitches'] });
      queryClient.invalidateQueries({ queryKey: ['pitch', pitchToEdit?.id] });
      setEditDialogOpen(false);
      setPitchToEdit(null);
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.response?.data?.message || t('admin.pitches.updateError') || 'Failed to update pitch',
        variant: 'destructive',
      });
    },
  });

  const pitches = useMemo(() => {
    if (!data?.data.data) return [];
    return data.data.data.map((pitch: any) => ({
      id: pitch.id,
      name: pitch.name || pitch.nameEn,
      city: pitch.city || pitch.cityEn,
      price: `${pitch.pricePerHour || 0} JD`,
      status: 'Active',
      _pitchData: pitch,
    }));
  }, [data]);

  const handleView = (pitchId: string) => {
    navigate(`/pitches/${pitchId}`);
  };

  const handleEdit = (pitch: any) => {
    const pitchData = pitch._pitchData || pitch;
    setPitchToEdit(pitchData);
    setEditFormData({
      name: pitchData.name || '',
      city: pitchData.city || '',
      address: pitchData.address || '',
      indoor: pitchData.indoor || false,
      description: pitchData.description || '',
      pricePerHour: pitchData.pricePerHour || 0,
      openTime: pitchData.openTime ? pitchData.openTime.substring(0, 5) : '08:00',
      closeTime: pitchData.closeTime ? pitchData.closeTime.substring(0, 5) : '22:00',
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pitchToEdit || !editFormData.name || !editFormData.city || !editFormData.address) {
      toast({
        title: t('common.error'),
        description: t('admin.pitches.fillRequiredFields') || 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    updateMutation.mutate({
      id: pitchToEdit.id,
      data: {
        name: editFormData.name,
        city: editFormData.city,
        address: editFormData.address,
        indoor: editFormData.indoor,
        description: editFormData.description || undefined,
        pricePerHour: editFormData.pricePerHour,
        openTime: editFormData.openTime,
        closeTime: editFormData.closeTime,
      },
    });
  };

  const handleDelete = (pitch: any) => {
    setPitchToDelete({ id: pitch.id, name: pitch.name });
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!pitchToDelete) return;
    deleteMutation.mutate(pitchToDelete.id);
  };

  const columns = [
    { 
      key: 'name', 
      label: t('admin.pitches.columns.name'),
      render: (row: any) => <span dir="auto">{row.name}</span>
    },
    { 
      key: 'city', 
      label: t('admin.pitches.columns.city'),
      render: (row: any) => <span dir="auto">{getCityDisplayName(row.city, locale)}</span>
    },
    { 
      key: 'price', 
      label: t('admin.pitches.columns.price'),
    },
    { 
      key: 'status', 
      label: t('admin.pitches.columns.status'),
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
      label: t('admin.pitches.filters.city'),
      value: cityFilter,
      options: cityOptions,
    },
  ];

  const sortOptions = [
    { value: 'name', label: t('admin.pitches.sort.name') },
    { value: 'price', label: t('admin.pitches.sort.price') },
    { value: 'city', label: t('admin.pitches.sort.city') },
  ];

  return (
    <LayoutContainer>
      <PageHeader
        title={t('admin.pitches.title')}
        subtitle={t('admin.pitches.subtitle')}
      />

      <div className="pb-6">
        <DataTableToolbar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={t('admin.pitches.searchPlaceholder')}
          filters={filters}
          onFilterChange={(key, value) => {
            if (key === 'city') setCityFilter(value);
          }}
          onFilterRemove={(key) => {
            if (key === 'city') setCityFilter('all');
          }}
          sortOptions={sortOptions}
          resultCount={pitches.length}
          primaryAction={
            <Button>
              <Plus className="h-4 w-4 me-2" />
              {t('admin.pitches.create')}
            </Button>
          }
        />

        <DataTable
          columns={columns}
          data={pitches}
          isLoading={isLoading}
          emptyMessage={t('admin.pitches.empty')}
          emptyDescription={t('admin.pitches.emptyDesc')}
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

      {/* Edit Pitch Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('admin.pitches.editTitle') || 'Edit Pitch'}</DialogTitle>
            <DialogDescription>
              {t('admin.pitches.editSubtitle') || 'Update pitch information'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-pitch-name">{t('admin.pitches.columns.name')} *</Label>
                <Input
                  id="edit-pitch-name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  required
                  dir="auto"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-pitch-city">{t('admin.pitches.columns.city')} *</Label>
                  <CitySelect
                    value={editFormData.city}
                    onChange={(value) => setEditFormData({ ...editFormData, city: value })}
                    allowEmpty={false}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-pitch-price">{t('admin.pitches.columns.price')} *</Label>
                  <Input
                    id="edit-pitch-price"
                    type="number"
                    min="0"
                    value={editFormData.pricePerHour}
                    onChange={(e) => setEditFormData({ ...editFormData, pricePerHour: parseInt(e.target.value) || 0 })}
                    required
                    dir="auto"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-pitch-address">{t('pitches.address') || 'Address'} *</Label>
                <Input
                  id="edit-pitch-address"
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                  required
                  dir="auto"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-pitch-description">{t('pitches.description') || 'Description'}</Label>
                <Textarea
                  id="edit-pitch-description"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  rows={3}
                  dir="auto"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-pitch-indoor">{t('pitches.indoor') || 'Indoor'}</Label>
                  <Select
                    value={editFormData.indoor ? 'true' : 'false'}
                    onValueChange={(value) => setEditFormData({ ...editFormData, indoor: value === 'true' })}
                  >
                    <SelectTrigger id="edit-pitch-indoor" dir={isRTL ? 'rtl' : 'ltr'}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent dir={isRTL ? 'rtl' : 'ltr'}>
                      <SelectItem value="false">{t('common.no') || 'No'}</SelectItem>
                      <SelectItem value="true">{t('common.yes') || 'Yes'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-pitch-openTime">{t('pitches.openTime') || 'Open Time'}</Label>
                  <Input
                    id="edit-pitch-openTime"
                    type="time"
                    value={editFormData.openTime}
                    onChange={(e) => setEditFormData({ ...editFormData, openTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-pitch-closeTime">{t('pitches.closeTime') || 'Close Time'}</Label>
                  <Input
                    id="edit-pitch-closeTime"
                    type="time"
                    value={editFormData.closeTime}
                    onChange={(e) => setEditFormData({ ...editFormData, closeTime: e.target.value })}
                  />
                </div>
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
            <DialogTitle>{t('admin.pitches.deleteConfirmTitle')}</DialogTitle>
            <DialogDescription>
              {t('admin.pitches.deleteConfirm')}
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
