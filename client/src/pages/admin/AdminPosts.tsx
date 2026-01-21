import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminFiltersBar } from '@/components/admin/AdminFiltersBar';
import { AdminTable } from '@/components/admin/AdminTable';
import { RowActionsMenu } from '@/components/admin/RowActionsMenu';
import { Button } from '@/ui2/components/ui/Button';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/ui2/components/ui/Dialog';
import { Textarea } from '@/ui2/components/ui/Textarea';
import { Label } from '@/ui2/components/ui/Label';
import { Input } from '@/ui2/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui2/components/ui/Select';
import { postsApi, adminApi } from '@/lib/api';
import { useDirection } from '@/hooks/useDirection';
import { useToast } from '@/ui2/components/ui/use-toast';

export function AdminPosts() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<{ id: string; title: string } | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState({
    content: '',
    mediaType: 'NONE' as 'NONE' | 'IMAGE' | 'VIDEO',
    mediaUrl: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'posts', search],
    queryFn: () => postsApi.getAll({ search: search || undefined, limit: 100 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => postsApi.delete(id),
    onSuccess: () => {
      toast({
        title: t('common.success'),
        description: t('admin.posts.deleteSuccess'),
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      queryClient.refetchQueries({ queryKey: ['admin', 'posts'] });
      setDeleteConfirmOpen(false);
      setPostToDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.response?.data?.message || t('admin.posts.deleteError'),
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminApi.updatePost(id, data),
    onSuccess: () => {
      toast({
        title: t('common.success'),
        description: t('admin.posts.updateSuccess') || 'Post updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setEditDialogOpen(false);
      setPostToEdit(null);
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.response?.data?.message || t('admin.posts.updateError') || 'Failed to update post',
        variant: 'destructive',
      });
    },
  });

  const handleView = (postId: string) => {
    navigate(`/community/post/${postId}`);
  };

  const handleEdit = (post: any) => {
    const postData = post._postData || post;
    setPostToEdit(postData);
    setEditFormData({
      content: postData.content || '',
      mediaType: postData.mediaType || 'NONE',
      mediaUrl: postData.mediaUrl || '',
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postToEdit || !editFormData.content) {
      toast({
        title: t('common.error'),
        description: t('admin.posts.fillRequiredFields') || 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    updateMutation.mutate({
      id: postToEdit.id,
      data: {
        content: editFormData.content,
        mediaType: editFormData.mediaType,
        mediaUrl: editFormData.mediaUrl || null,
      },
    });
  };

  const handleDelete = (post: any) => {
    setPostToDelete({ id: post.id, title: post.title });
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!postToDelete) return;
    deleteMutation.mutate(postToDelete.id);
  };

  const posts = useMemo(() => {
    if (!data?.data.data) return [];
    return data.data.data.map((post: any) => ({
      id: post.id,
      title: post.content?.substring(0, 50) + (post.content?.length > 50 ? '...' : '') || '-',
      author: post.authorName || post.authorUsername || '-',
      created: post.createdAt ? new Date(post.createdAt).toLocaleDateString() : '-',
      likes: post.likesCount || 0,
      _postData: post,
    }));
  }, [data]);

  const columns = [
    { key: 'title', label: t('admin.posts.columns.title'), className: isRTL ? 'text-right' : 'text-left' },
    { key: 'author', label: t('admin.posts.columns.author'), className: isRTL ? 'text-right' : 'text-left' },
    { key: 'created', label: t('admin.posts.columns.created'), className: isRTL ? 'text-right' : 'text-left' },
    { key: 'likes', label: t('admin.posts.columns.likes'), className: isRTL ? 'text-right' : 'text-left' },
  ];

  const sortOptions = [
    { value: 'created', label: t('admin.posts.sort.created') },
    { value: 'likes', label: t('admin.posts.sort.likes') },
  ];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 overflow-x-hidden">
      <AdminPageHeader
        title={t('admin.posts.title')}
        subtitle={t('admin.posts.subtitle')}
      />

      <AdminFiltersBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('admin.posts.searchPlaceholder')}
        sortOptions={sortOptions}
      />

      <AdminTable
        columns={columns}
        data={posts}
        isLoading={isLoading || deleteMutation.isPending}
        emptyMessage={t('admin.posts.empty')}
        emptyDescription={t('admin.posts.emptyDesc')}
        actions={(row) => (
          <RowActionsMenu
            onView={() => handleView(row.id)}
            onEdit={() => handleEdit(row)}
            onDelete={() => handleDelete(row)}
            disabled={deleteMutation.isPending}
          />
        )}
      />

      {/* Edit Post Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('admin.posts.editTitle') || 'Edit Post'}</DialogTitle>
            <DialogDescription>
              {t('admin.posts.editSubtitle') || 'Update post content'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-post-content">{t('community.post.content') || 'Content'} *</Label>
                <Textarea
                  id="edit-post-content"
                  value={editFormData.content}
                  onChange={(e) => setEditFormData({ ...editFormData, content: e.target.value })}
                  rows={6}
                  required
                  maxLength={5000}
                />
                <p className="text-xs text-muted-foreground dark:text-gray-300 text-end">
                  {editFormData.content.length}/5000
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-post-mediaType">{t('community.post.mediaType') || 'Media Type'}</Label>
                  <Select
                    value={editFormData.mediaType}
                    onValueChange={(value) => setEditFormData({ ...editFormData, mediaType: value as 'NONE' | 'IMAGE' | 'VIDEO' })}
                  >
                    <SelectTrigger id="edit-post-mediaType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NONE">{t('common.none') || 'None'}</SelectItem>
                      <SelectItem value="IMAGE">{t('common.image') || 'Image'}</SelectItem>
                      <SelectItem value="VIDEO">{t('common.video') || 'Video'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {editFormData.mediaType !== 'NONE' && (
                  <div className="space-y-2">
                    <Label htmlFor="edit-post-mediaUrl">{t('community.post.mediaUrl') || 'Media URL'}</Label>
                    <Input
                      id="edit-post-mediaUrl"
                      type="url"
                      value={editFormData.mediaUrl}
                      onChange={(e) => setEditFormData({ ...editFormData, mediaUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                )}
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
            <DialogTitle>{t('admin.posts.deleteConfirmTitle')}</DialogTitle>
            <DialogDescription>
              {t('admin.posts.deleteConfirm')}
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

