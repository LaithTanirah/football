import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/ui2/components/ui/use-toast";
import { Button } from "@/ui2/components/ui/Button";
import { Card } from "@/ui2/components/ui/Card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui2/components/ui/DropdownMenu";
import {
  Heart,
  MessageCircle,
  MoreVertical,
  Edit,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { postsApi } from "@/lib/api";
import { generateAvatarUrl } from "@/lib/avatar";
import { formatTimeAgo } from "@/lib/timeAgo";
import { useLocaleStore } from "@/store/localeStore";
import { cn } from "@/lib/utils";

interface CommunityPostCardProps {
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
  onDelete?: () => void;
  onUpdate?: () => void;
}

export function CommunityPostCard({
  post,
  onDelete,
  onUpdate,
}: CommunityPostCardProps) {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const { locale } = useLocaleStore();
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAuthor = user?.id === post.authorId;
  const avatarUrl =
    post.authorAvatar || generateAvatarUrl(post.authorName, post.authorUsername);
  const timeAgo = formatTimeAgo(post.createdAt, locale);
  const contentPreview = post.content.length > 200;
  const displayContent =
    isExpanded || !contentPreview
      ? post.content
      : post.content.substring(0, 200) + "...";

  const handleLike = async () => {
    if (!user) {
      toast({
        title: t("community.post.loginRequired"),
        description: t("community.post.loginRequiredDesc"),
        variant: "default",
      });
      return;
    }

    const previousLiked = isLiked;
    const previousCount = likesCount;

    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      if (isLiked) {
        await postsApi.unlike(post.id);
      } else {
        await postsApi.like(post.id);
      }
    } catch (error) {
      setIsLiked(previousLiked);
      setLikesCount(previousCount);
      toast({
        title: t("common.error"),
        description: t("community.post.likeError"),
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm(t("community.post.deleteConfirm"))) {
      return;
    }

    setIsDeleting(true);
    try {
      await postsApi.delete(post.id);
      toast({
        title: t("common.success"),
        description: t("community.post.deletedSuccess"),
      });
      onDelete?.();
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("community.post.deleteError"),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="glass-neon-strong rounded-2xl border-2 border-cyan-400/20 shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:border-cyan-400/40 transition-all overflow-hidden">
      <div className="p-5 space-y-3">
        {/* Author Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-cyan-400/20">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full border-2 border-cyan-400/30 overflow-hidden bg-gradient-to-br from-cyan-500/10 to-purple-500/10">
                <img
                  src={avatarUrl}
                  alt={post.authorName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-lg truncate text-foreground">
                {post.authorName}
              </div>
              <div className="text-sm text-gray-300 dark:text-gray-300 flex items-center gap-2 flex-wrap">
                <span>@{post.authorUsername}</span>
                {post.city && (
                  <>
                    <span>•</span>
                    <span>{post.city}</span>
                  </>
                )}
                <span>•</span>
                <span>{timeAgo}</span>
              </div>
            </div>
          </div>

          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-300 hover:text-foreground"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="glass-neon-strong border-cyan-400/30"
              >
                <DropdownMenuItem
                  onClick={onUpdate}
                  className="text-foreground"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {t("community.post.edit")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t("community.post.delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Content */}
        <div className="space-y-3">
          <p className="text-base leading-relaxed whitespace-pre-wrap text-foreground">
            {displayContent}
          </p>
          {contentPreview && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
            >
              {isExpanded
                ? t("community.post.readLess")
                : t("community.post.readMore")}
            </button>
          )}

          {/* Media */}
          {post.mediaType === "image" && post.mediaUrl && (
            <div className="rounded-2xl overflow-hidden border-2 border-cyan-400/20 relative group -mx-6">
              <img
                src={post.mediaUrl}
                alt="Post media"
                className="w-full h-auto max-h-96 object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </div>
          )}

          {/* Tagged entities */}
          {(post.taggedPitch || post.taggedTeam) && (
            <div className="flex flex-wrap gap-2 pt-2">
              {post.taggedPitch && (
                <Link
                  to={`/pitches/${post.pitchId}`}
                  className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  {t("community.post.taggedPitch")}:{" "}
                  {post.taggedPitch.name ||
                    post.taggedPitch.nameAr ||
                    post.taggedPitch.nameEn}
                </Link>
              )}
              {post.taggedTeam && (
                <Link
                  to={`/teams/${post.teamId}`}
                  className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  {t("community.post.taggedTeam")}: {post.taggedTeam.name}
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-3 pt-4 border-t border-cyan-400/20">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={cn(
              "gap-2 rounded-xl px-4 py-2 h-auto font-semibold transition-all",
              isLiked
                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border-2 border-red-500/30"
                : "text-gray-300 hover:text-foreground hover:bg-cyan-500/10"
            )}
          >
            <Heart
              className={cn("h-4 w-4", isLiked && "fill-current")}
            />
            <span className="text-sm">{likesCount}</span>
          </Button>

          <Link to={`/community/post/${post.id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 rounded-xl px-4 py-2 h-auto font-semibold text-gray-300 hover:text-foreground hover:bg-cyan-500/10 transition-all"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">{post.commentsCount}</span>
            </Button>
          </Link>

          <Link to={`/community/post/${post.id}`} className="flex-1 ml-auto">
            <Button
              variant="outline"
              size="sm"
              className="text-foreground"
            >
              {t("community.post.open")}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
