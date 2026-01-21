import { Link } from "react-router-dom";
import { Plus, Users } from "lucide-react";
import { Button } from "@/ui2/components/ui/Button";
import {
  Card,
  CardContent,
} from "@/ui2/components/ui/Card";

interface PostComposerProps {
  createPostLabel: string;
  shareYourThoughtsLabel: string;
  createPostHref: string;
}

export function PostComposer({
  createPostLabel,
  shareYourThoughtsLabel,
  createPostHref,
}: PostComposerProps) {
  return (
    <Card className="glass-neon-strong rounded-2xl border-2 border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.15)] overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-2 border-cyan-400/30 flex items-center justify-center flex-shrink-0">
            <Users className="h-5 w-5 text-cyan-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-base text-foreground">
              {createPostLabel}
            </h3>
            <p className="text-xs text-gray-300 dark:text-gray-300">
              {shareYourThoughtsLabel}
            </p>
          </div>
        </div>
        <Link to={createPostHref}>
          <Button
            className="w-full bg-gradient-to-r from-cyan-500/30 to-purple-500/30 border border-cyan-400/50 text-foreground font-bold py-4 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all"
            size="default"
          >
            <Plus className="h-4 w-4 mr-2" />
            {createPostLabel}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
