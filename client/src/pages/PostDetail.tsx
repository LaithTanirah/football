import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { useLocaleStore } from '@/store/localeStore';
import { useToast } from '@/ui2/components/ui/use-toast';
import { postsApi } from '@/lib/api';
import { Skeleton } from '@/ui2/components/ui/Skeleton';
import { EmptyState } from '@/components/EmptyState';
import { PostDetailUI } from '@/ui/post-details';
import { Card, CardContent } from '@/ui2/components/ui/Card';

export function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const { locale } = useLocaleStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [commentContent, setCommentContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [page, setPage] = useState(1);

  const { data: postData, isLoading: postLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postsApi.getById(id!),
    enabled: !!id,
  });

  const { data: commentsData, isLoading: commentsLoading } = useQuery({
    queryKey: ['postComments', id, page],
    queryFn: () => postsApi.getComments(id!, { page, limit: 20 }),
    enabled: !!id,
  });

  const post = postData?.data.data;
  const comments = commentsData?.data.data || [];

  const createCommentMutation = useMutation({
    mutationFn: (content: string) => postsApi.createComment(id!, { content }),
    onSuccess: () => {
      setCommentContent('');
      queryClient.invalidateQueries({ queryKey: ['postComments', id] });
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      toast({
        title: t('common.success'),
        description: t('community.comment.createdSuccess'),
      });
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('community.comment.createError'),
        variant: 'destructive',
      });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => postsApi.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postComments', id] });
      toast({
        title: t('common.success'),
        description: t('community.comment.deletedSuccess'),
      });
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('community.comment.deleteError'),
        variant: 'destructive',
      });
    },
  });

  const handleSubmitComment = () => {
    if (!user) {
      toast({
        title: t('community.post.loginRequired'),
        description: t('community.post.loginRequiredDesc'),
        variant: 'default',
      });
      return;
    }

    if (!commentContent.trim()) {
      return;
    }

    createCommentMutation.mutate(commentContent.trim());
  };

  const handleDeleteComment = (commentId: string) => {
    if (!confirm(t('community.comment.deleteConfirm'))) {
      return;
    }
    deleteCommentMutation.mutate(commentId);
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast({
      title: t('common.success'),
      description: 'Link copied to clipboard',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  if (postLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 pt-20 md:pt-24 pb-8 md:pb-12">
        <Skeleton className="h-64 w-full mb-4" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto max-w-4xl px-4 pt-20 md:pt-24 pb-8 md:pb-12">
        <Card className="glass-neon-strong rounded-2xl border-2 border-cyan-400/20">
          <CardContent className="py-12 text-center">
            <EmptyState
              title="Post not found"
              description="The post you're looking for doesn't exist."
              action={{
                label: t('common.back'),
                href: '/community',
              }}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <PostDetailUI
      post={post}
      comments={comments}
      commentsLoading={commentsLoading}
      commentsTotal={commentsData?.data.pagination?.total || 0}
      user={user}
      commentContent={commentContent}
      onCommentChange={setCommentContent}
      copied={copied}
      onCopyLink={handleCopyLink}
      onSubmitComment={handleSubmitComment}
      onDeleteComment={handleDeleteComment}
      onDeletePost={() => navigate('/community')}
      isSubmittingComment={createCommentMutation.isPending}
      isDeletingComment={deleteCommentMutation.isPending}
      breadcrumbLabel={t('community.title')}
      backLabel={t('common.back')}
      copyLinkLabel="Copy Link"
      copiedLabel="Copied"
      commentsLabel={t('community.post.comments')}
      placeholderLabel={t('community.comment.placeholder')}
      postLabel={t('community.comment.post')}
      postingLabel={t('community.comment.posting')}
      loginRequiredDescLabel={t('community.post.loginRequiredDesc')}
      loginLabel={t('nav.login')}
      noCommentsLabel={t('community.comment.noComments')}
      noCommentsDescLabel={t('community.comment.noCommentsDesc')}
      deleteConfirmLabel={t('community.comment.deleteConfirm')}
      postNotFoundLabel="Post not found"
      postNotFoundDescLabel="The post you're looking for doesn't exist."
    />
  );
}

