import { Trash2 } from "lucide-react";
import { Button } from "@/ui2/components/ui/Button";
import { Skeleton } from "@/ui2/components/ui/Skeleton";
import { MessageCircle } from "lucide-react";
import { generateAvatarUrl } from "@/lib/avatar";
import { formatTimeAgo } from "@/lib/timeAgo";
import { useLocaleStore } from "@/store/localeStore";
import { cn } from "@/lib/utils";

interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  content: string;
  createdAt: string;
}

interface CommentsListProps {
  comments: Comment[];
  isLoading: boolean;
  user: { id: string } | null;
  onDeleteComment: (commentId: string) => void;
  isDeleting: boolean;
  noCommentsLabel: string;
  noCommentsDescLabel: string;
  deleteConfirmLabel: string;
}

export function CommentsList({
  comments,
  isLoading,
  user,
  onDeleteComment,
  isDeleting,
  noCommentsLabel,
  noCommentsDescLabel,
  deleteConfirmLabel,
}: CommentsListProps) {
  const { locale } = useLocaleStore();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-500 opacity-50" />
        <p className="text-gray-300 dark:text-gray-300 mb-1">{noCommentsLabel}</p>
        <p className="text-sm text-gray-400 dark:text-gray-400">
          {noCommentsDescLabel}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => {
        const isAuthor = user?.id === comment.authorId;
        const avatarUrl = generateAvatarUrl(
          comment.authorName,
          comment.authorUsername
        );
        const timeAgo = formatTimeAgo(comment.createdAt, locale);

        return (
          <div
            key={comment.id}
            className="flex gap-3 pb-3 border-b border-cyan-400/20 last:border-0"
          >
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full border-2 border-cyan-400/30 overflow-hidden bg-gradient-to-br from-cyan-500/10 to-purple-500/10">
                <img
                  src={avatarUrl}
                  alt={comment.authorName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-foreground truncate">
                    {comment.authorName}
                  </div>
                  <div className="text-xs text-gray-300 dark:text-gray-300">
                    @{comment.authorUsername} • {timeAgo}
                  </div>
                </div>
                {isAuthor && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                    onClick={() => {
                      if (confirm(deleteConfirmLabel)) {
                        onDeleteComment(comment.id);
                      }
                    }}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                {comment.content}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
