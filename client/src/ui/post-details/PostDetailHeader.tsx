import { Link } from "react-router-dom";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { Button } from "@/ui2/components/ui/Button";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { cn } from "@/lib/utils";

interface PostDetailHeaderProps {
  breadcrumbLabel: string;
  backLabel: string;
  copied: boolean;
  onCopyLink: () => void;
  copyLinkLabel: string;
  copiedLabel: string;
}

export function PostDetailHeader({
  breadcrumbLabel,
  backLabel,
  copied,
  onCopyLink,
  copyLinkLabel,
  copiedLabel,
}: PostDetailHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Link to="/community">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-gray-300 hover:text-foreground hover:bg-cyan-500/10"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Button>
        </Link>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onCopyLink}
        className="gap-2 glass-neon-subtle border border-cyan-400/30 text-foreground hover:border-cyan-400/50"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            {copiedLabel}
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            {copyLinkLabel}
          </>
        )}
      </Button>
    </div>
  );
}
