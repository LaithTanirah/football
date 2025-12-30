import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/ui/use-toast';
import { postsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { EmptyState } from '@/components/EmptyState';
import {
  Heart,
  MessageCircle,
  ArrowLeft,
  Trash2,
  Copy,
  Check,
} from 'lucide-react';
import { generateAvatarUrl } from '@/lib/avatar';
import { formatTimeAgo } from '@/lib/timeAgo';
import { useLocaleStore } from '@/store/localeStore';
import { cn } from '@/lib/utils';
import { PostCard } from '@/components/PostCard';

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
      <div className="container mx-auto max-w-4xl px-4 py-6">
        <Skeleton className="h-64 w-full mb-4" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-6">
        <EmptyState
          title="Post not found"
          description="The post you're looking for doesn't exist."
          action={{
            label: t('common.back'),
            href: '/community',
          }}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 page-section">
      <Breadcrumbs
        items={[
          { label: t('community.title'), to: '/community' },
          { label: t('community.post.open') },
        ]}
        className="mb-6"
      />

      <div className="mb-4">
        <Link to="/community">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t('common.back')}
          </Button>
        </Link>
      </div>

      {/* Post */}
      <PostCard post={post} />

      {/* Copy Link */}
      <div className="mt-4 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="gap-2"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy Link
            </>
          )}
        </Button>
      </div>

      {/* Comments Section */}
      <Card className="mt-6 p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          {t('community.post.comments')} ({commentsData?.data.pagination?.total || 0})
        </h2>

        {/* Comment Form */}
        {user ? (
          <div className="mb-6 space-y-3">
            <Textarea
              placeholder={t('community.comment.placeholder')}
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              rows={3}
              maxLength={1000}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSubmitComment}
                disabled={!commentContent.trim() || createCommentMutation.isPending}
              >
                {createCommentMutation.isPending
                  ? t('community.comment.posting')
                  : t('community.comment.post')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 rounded-lg bg-muted text-center">
            <p className="text-sm text-muted-foreground mb-2">
              {t('community.post.loginRequiredDesc')}
            </p>
            <Link to="/auth/login">
              <Button size="sm">{t('nav.login')}</Button>
            </Link>
          </div>
        )}

        {/* Comments List */}
        {commentsLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>{t('community.comment.noComments')}</p>
            <p className="text-sm">{t('community.comment.noCommentsDesc')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment: any) => {
              const isAuthor = user?.id === comment.authorId;
              const avatarUrl = generateAvatarUrl(comment.authorName, comment.authorUsername);
              const timeAgo = formatTimeAgo(comment.createdAt, locale);

              return (
                <div key={comment.id} className="flex gap-3 pb-4 border-b last:border-0">
                  <img
                    src={avatarUrl}
                    alt={comment.authorName}
                    className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <div className="font-semibold text-sm">{comment.authorName}</div>
                        <div className="text-xs text-muted-foreground">
                          @{comment.authorUsername} • {timeAgo}
                        </div>
                      </div>
                      {isAuthor && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDeleteComment(comment.id)}
                          disabled={deleteCommentMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

