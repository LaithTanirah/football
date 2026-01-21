import { PostDetailHeader } from "./PostDetailHeader";
import { PostDetailCard } from "./PostDetailCard";
import { CommentForm } from "./CommentForm";
import { CommentsList } from "./CommentsList";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/ui2/components/ui/Card";
import { MessageCircle } from "lucide-react";
import { Skeleton } from "@/ui2/components/ui/Skeleton";
import { EmptyState } from "@/components/EmptyState";

interface PostDetailUIProps {
  // Post data
  post: {
    id: string;
    authorId: string;
    authorName: string;
    authorUsername: string;
    authorAvatar?: string | null;
    content: string;
    mediaType: "none" | "image";
    mediaUrl?: string | null;
    city?: string | null;
    pitchId?: string | null;
    teamId?: string | null;
    likesCount: number;
    commentsCount: number;
    isLiked: boolean;
    createdAt: string;
    taggedPitch?: any;
    taggedTeam?: any;
  };

  // Comments
  comments: Array<any>;
  commentsLoading: boolean;
  commentsTotal: number;

  // User
  user: { id: string } | null;

  // State
  commentContent: string;
  onCommentChange: (value: string) => void;
  copied: boolean;
  onCopyLink: () => void;

  // Handlers
  onSubmitComment: () => void;
  onDeleteComment: (commentId: string) => void;
  onDeletePost?: () => void;
  onUpdatePost?: () => void;
  isSubmittingComment: boolean;
  isDeletingComment: boolean;

  // Translations
  breadcrumbLabel: string;
  backLabel: string;
  copyLinkLabel: string;
  copiedLabel: string;
  commentsLabel: string;
  placeholderLabel: string;
  postLabel: string;
  postingLabel: string;
  loginRequiredDescLabel: string;
  loginLabel: string;
  noCommentsLabel: string;
  noCommentsDescLabel: string;
  deleteConfirmLabel: string;
  postNotFoundLabel: string;
  postNotFoundDescLabel: string;
}

export function PostDetailUI({
  post,
  comments,
  commentsLoading,
  commentsTotal,
  user,
  commentContent,
  onCommentChange,
  copied,
  onCopyLink,
  onSubmitComment,
  onDeleteComment,
  onDeletePost,
  onUpdatePost,
  isSubmittingComment,
  isDeletingComment,
  breadcrumbLabel,
  backLabel,
  copyLinkLabel,
  copiedLabel,
  commentsLabel,
  placeholderLabel,
  postLabel,
  postingLabel,
  loginRequiredDescLabel,
  loginLabel,
  noCommentsLabel,
  noCommentsDescLabel,
  deleteConfirmLabel,
  postNotFoundLabel,
  postNotFoundDescLabel,
}: PostDetailUIProps) {
  return (
    <div className="container mx-auto max-w-4xl px-4 pt-20 md:pt-24 pb-8 md:pb-12 relative overflow-visible">
      {/* Header */}
      <PostDetailHeader
        breadcrumbLabel={breadcrumbLabel}
        backLabel={backLabel}
        copied={copied}
        onCopyLink={onCopyLink}
        copyLinkLabel={copyLinkLabel}
        copiedLabel={copiedLabel}
      />

      {/* Post Card */}
      <div className="mb-4">
        <PostDetailCard
          post={post}
          onDelete={onDeletePost}
          onUpdate={onUpdatePost}
        />
      </div>

      {/* Comments Section */}
      <Card className="glass-neon-strong rounded-2xl border-2 border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
            <MessageCircle className="h-5 w-5 text-cyan-400" />
            {commentsLabel} ({commentsTotal})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Comment Form */}
          <CommentForm
            user={user}
            commentContent={commentContent}
            onCommentChange={onCommentChange}
            onSubmit={onSubmitComment}
            isSubmitting={isSubmittingComment}
            placeholderLabel={placeholderLabel}
            postLabel={postLabel}
            postingLabel={postingLabel}
            loginRequiredDescLabel={loginRequiredDescLabel}
            loginLabel={loginLabel}
          />

          {/* Comments List */}
          <CommentsList
            comments={comments}
            isLoading={commentsLoading}
            user={user}
            onDeleteComment={onDeleteComment}
            isDeleting={isDeletingComment}
            noCommentsLabel={noCommentsLabel}
            noCommentsDescLabel={noCommentsDescLabel}
            deleteConfirmLabel={deleteConfirmLabel}
          />
        </CardContent>
      </Card>
    </div>
  );
}
