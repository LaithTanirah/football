import { Link } from "react-router-dom";
import { Button } from "@/ui2/components/ui/Button";
import { Textarea } from "@/ui2/components/ui/Textarea";
import { Card, CardContent } from "@/ui2/components/ui/Card";

interface CommentFormProps {
  user: { id: string } | null;
  commentContent: string;
  onCommentChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  placeholderLabel: string;
  postLabel: string;
  postingLabel: string;
  loginRequiredDescLabel: string;
  loginLabel: string;
}

export function CommentForm({
  user,
  commentContent,
  onCommentChange,
  onSubmit,
  isSubmitting,
  placeholderLabel,
  postLabel,
  postingLabel,
  loginRequiredDescLabel,
  loginLabel,
}: CommentFormProps) {
  if (!user) {
    return (
      <Card className="glass-neon-subtle rounded-xl border border-cyan-400/20">
        <CardContent className="p-4 text-center">
          <p className="text-sm text-gray-300 dark:text-gray-300 mb-3">
            {loginRequiredDescLabel}
          </p>
          <Link to="/auth/login">
            <Button
              size="sm"
              className="glass-neon-strong border border-cyan-400/30 text-foreground hover:border-cyan-400/50"
            >
              {loginLabel}
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <Textarea
        placeholder={placeholderLabel}
        value={commentContent}
        onChange={(e) => onCommentChange(e.target.value)}
        rows={3}
        maxLength={1000}
        className="glass-neon-subtle border border-cyan-400/20 text-foreground placeholder:text-gray-400 focus:border-cyan-400/50 resize-none"
      />
      <div className="flex justify-end">
        <Button
          onClick={onSubmit}
          disabled={!commentContent.trim() || isSubmitting}
          className="glass-neon-strong border border-cyan-400/30 text-foreground hover:border-cyan-400/50 disabled:opacity-50"
        >
          {isSubmitting ? postingLabel : postLabel}
        </Button>
      </div>
    </div>
  );
}
