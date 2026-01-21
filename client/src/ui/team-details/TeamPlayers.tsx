import { Users, UserCog, Crown, User, Trash2 } from "lucide-react";
import { Button } from "@/ui2/components/ui/Button";
import { Badge } from "@/ui2/components/ui/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui2/components/ui/Card";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";

interface Member {
  id: string;
  user?: {
    id: string;
    name: string;
  } | null;
  role: string;
  joinedAt: string;
}

interface TeamPlayersProps {
  members: Member[];
  isOwner: boolean;
  currentUserId?: string | null;
  onManagePlayers: () => void;
  onRemoveMember: (member: Member) => void;
  isRemoving?: boolean;
  teamRosterLabel: string;
  membersLabel: string;
  managePlayersLabel: string;
  ownerLabel: string;
  joinedLabel: string;
}

export function TeamPlayers({
  members,
  isOwner,
  currentUserId,
  onManagePlayers,
  onRemoveMember,
  isRemoving = false,
  teamRosterLabel,
  membersLabel,
  managePlayersLabel,
  ownerLabel,
  joinedLabel,
}: TeamPlayersProps) {
  return (
    <Card className="glass-neon-strong rounded-3xl border-2 border-cyan-400/20 shadow-[0_0_25px_rgba(6,182,212,0.15)]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl md:text-3xl text-foreground">
              <Users className="h-6 w-6 text-cyan-300" />
              {teamRosterLabel}
            </CardTitle>
            <CardDescription className="text-gray-300 dark:text-gray-300 mt-2">
              {members.length} {membersLabel}
            </CardDescription>
          </div>
          {isOwner && (
            <Button
              size="sm"
              variant="outline"
              onClick={onManagePlayers}
              className="border-cyan-400/40 hover:bg-cyan-500/20 hover:border-cyan-400/60"
            >
              <UserCog className="mr-2 h-4 w-4" />
              {managePlayersLabel}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between rounded-2xl glass-neon-subtle border-2 border-cyan-400/20 p-4 hover:border-cyan-400/40 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-2 border-cyan-400/30">
                <User className="h-6 w-6 text-cyan-300" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-lg">
                  {member.user?.name || "Unknown"}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  {(member.role === "OWNER" || member.role === "CAPTAIN") && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-cyan-500/20 border-cyan-400/40 text-cyan-300"
                    >
                      <Crown className="mr-1 h-3 w-3" />
                      {ownerLabel}
                    </Badge>
                  )}
                  <span className="text-xs text-gray-400 dark:text-gray-400">
                    {joinedLabel}{" "}
                    {format(new Date(member.joinedAt), "MMM yyyy", {
                      locale: enUS,
                    })}
                  </span>
                </div>
              </div>
            </div>
            {isOwner &&
              member.role !== "OWNER" &&
              member.role !== "CAPTAIN" &&
              member.user?.id !== currentUserId && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveMember(member)}
                  disabled={isRemoving}
                  className="hover:bg-red-500/20 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
