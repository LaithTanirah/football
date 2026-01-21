import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/admin/PageHeader';
import { LayoutContainer } from '@/components/admin/LayoutContainer';
import { DataTableToolbar } from '@/components/admin/DataTableToolbar';
import { DataTable } from '@/components/admin/DataTable';
import { RowActionsMenu } from '@/components/admin/RowActionsMenu';
import { Button } from '@/ui2/components/ui/Button';
import { Plus, Loader2 } from 'lucide-react';
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
import { adminApi } from '@/lib/api';
import { useDirection } from '@/hooks/useDirection';
import { useToast } from '@/ui2/components/ui/use-toast';
import { Badge } from '@/ui2/components/ui/Badge';

export function AdminUsers() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    city: '',
    role: 'USER',
    bio: '',
    avatar: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => adminApi.getUsers(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteUser?.(id) || Promise.reject(new Error('Delete not implemented')),
    onSuccess: () => {
      toast({
        title: t('common.success'),
        description: t('admin.users.deleteSuccess'),
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      queryClient.refetchQueries({ queryKey: ['admin', 'users'] });
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.response?.data?.message || t('admin.users.deleteError'),
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminApi.updateUser(id, data),
    onSuccess: () => {
      toast({
        title: t('common.success'),
        description: t('admin.users.updateSuccess') || 'User updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile', userToEdit?.id] });
      setEditDialogOpen(false);
      setUserToEdit(null);
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.response?.data?.message || t('admin.users.updateError') || 'Failed to update user',
        variant: 'destructive',
      });
    },
  });

  const users = useMemo(() => {
    if (!data?.data.data) return [];
    let filtered = data.data.data;

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (user: any) =>
          user.name?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.username?.toLowerCase().includes(searchLower)
      );
    }

    // Apply city filter
    if (cityFilter && cityFilter !== 'all') {
      filtered = filtered.filter((user: any) => user.city === cityFilter);
    }

    return filtered.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      city: user.city || '-',
      _userData: user,
    }));
  }, [data, search, cityFilter]);

  const handleView = (user: any) => {
    const userData = user._userData || user;
    navigate(`/profile?userId=${userData.id}`);
  };

  const handleEdit = (user: any) => {
    const userData = user._userData || user;
    setUserToEdit(userData);
    setEditFormData({
      name: userData.name || '',
      username: userData.username || '',
      email: userData.email || '',
      phone: userData.phone || '',
      city: userData.city || '',
      role: userData.role || 'USER',
      bio: userData.bio || '',
      avatar: userData.avatar || '',
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToEdit || !editFormData.name || !editFormData.email || !editFormData.username) {
      toast({
        title: t('common.error'),
        description: t('admin.users.fillRequiredFields') || 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    updateMutation.mutate({
      id: userToEdit.id,
      data: {
        name: editFormData.name,
        username: editFormData.username,
        email: editFormData.email,
        phone: editFormData.phone || null,
        city: editFormData.city || null,
        role: editFormData.role,
        bio: editFormData.bio || null,
        avatar: editFormData.avatar || null,
      },
    });
  };

  const handleDelete = (user: any) => {
    setUserToDelete({ id: user.id, name: user.name });
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    deleteMutation.mutate(userToDelete.id);
  };

  const columns = [
    { 
      key: 'name', 
      label: t('admin.users.columns.name'),
      render: (row: any) => <span dir="auto">{row.name}</span>
    },
    { 
      key: 'email', 
      label: t('admin.users.columns.email'),
      render: (row: any) => <span dir="auto">{row.email}</span>
    },
    { 
      key: 'username', 
      label: t('admin.users.columns.username'),
      render: (row: any) => <span dir="auto">{row.username}</span>
    },
    { 
      key: 'role', 
      label: t('admin.users.columns.role'),
      render: (row: any) => (
        <Badge variant={row.role === 'ADMIN' ? 'default' : 'outline'}>
          {row.role}
        </Badge>
      )
    },
    { 
      key: 'city', 
      label: t('admin.users.columns.city'),
      render: (row: any) => <span dir="auto">{row.city}</span>
    },
  ];

  const statusOptions = [
    { value: 'active', label: t('admin.users.status.active') },
    { value: 'inactive', label: t('admin.users.status.inactive') },
  ];

  const cityOptions = [
    { value: 'amman', label: 'Amman' },
    { value: 'irbid', label: 'Irbid' },
  ];

  const filters = [
    {
      key: 'status',
      label: t('admin.users.filters.status'),
      value: statusFilter,
      options: statusOptions,
    },
    {
      key: 'city',
      label: t('admin.users.filters.city'),
      value: cityFilter,
      options: cityOptions,
    },
  ];

  const sortOptions = [
    { value: 'name', label: t('admin.users.sort.name') },
    { value: 'email', label: t('admin.users.sort.email') },
    { value: 'created', label: t('admin.users.sort.created') },
  ];

  return (
    <LayoutContainer>
      <PageHeader
        title={t('admin.users.title')}
        subtitle={t('admin.users.subtitle')}
      />

      <div className="pb-6">
        <DataTableToolbar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={t('admin.users.searchPlaceholder')}
          filters={filters}
          onFilterChange={(key, value) => {
            if (key === 'status') setStatusFilter(value);
            if (key === 'city') setCityFilter(value);
          }}
          onFilterRemove={(key) => {
            if (key === 'status') setStatusFilter('all');
            if (key === 'city') setCityFilter('all');
          }}
          sortOptions={sortOptions}
          resultCount={users.length}
          primaryAction={
            <Button>
              <Plus className="h-4 w-4 me-2" />
              {t('admin.users.create')}
            </Button>
          }
        />

        <DataTable
          columns={columns}
          data={users}
          isLoading={isLoading || deleteMutation.isPending}
          emptyMessage={t('admin.users.empty')}
          emptyDescription={t('admin.users.emptyDesc')}
          actions={(row) => (
            <RowActionsMenu
              onView={() => handleView(row)}
              onEdit={() => handleEdit(row)}
              onDelete={() => handleDelete(row)}
              disabled={deleteMutation.isPending}
            />
          )}
        />
      </div>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('admin.users.editTitle') || 'Edit User'}</DialogTitle>
            <DialogDescription>
              {t('admin.users.editSubtitle') || 'Update user information'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">{t('admin.users.columns.name')} *</Label>
                  <Input
                    id="edit-name"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    required
                    dir="auto"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-username">{t('admin.users.columns.username')} *</Label>
                  <Input
                    id="edit-username"
                    value={editFormData.username}
                    onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                    required
                    dir="auto"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-email">{t('admin.users.columns.email')} *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    required
                    dir="auto"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">{t('admin.users.columns.phone') || 'Phone'}</Label>
                  <Input
                    id="edit-phone"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    dir="auto"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-city">{t('admin.users.columns.city')}</Label>
                  <CitySelect
                    value={editFormData.city}
                    onChange={(value) => setEditFormData({ ...editFormData, city: value })}
                    allowEmpty={true}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-role">{t('admin.users.columns.role')} *</Label>
                  <Select
                    value={editFormData.role}
                    onValueChange={(value) => setEditFormData({ ...editFormData, role: value })}
                  >
                    <SelectTrigger id="edit-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">USER</SelectItem>
                      <SelectItem value="ADMIN">ADMIN</SelectItem>
                      <SelectItem value="PITCH_OWNER">PITCH_OWNER</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-bio">{t('profile.bio') || 'Bio'}</Label>
                <Input
                  id="edit-bio"
                  value={editFormData.bio}
                  onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                  maxLength={250}
                  dir="auto"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-avatar">{t('profile.avatar') || 'Avatar URL'}</Label>
                <Input
                  id="edit-avatar"
                  type="url"
                  value={editFormData.avatar}
                  onChange={(e) => setEditFormData({ ...editFormData, avatar: e.target.value })}
                  placeholder="https://example.com/avatar.png"
                  dir="auto"
                />
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
            <DialogTitle>{t('admin.users.deleteConfirmTitle')}</DialogTitle>
            <DialogDescription>
              {t('admin.users.deleteConfirm')}
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
