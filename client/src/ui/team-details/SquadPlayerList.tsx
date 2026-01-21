import { Users, Lock, Crown } from "lucide-react";
import { PlayerPicker } from "@/components/PlayerPicker";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/ui2/components/ui/Card";
import { Badge } from "@/ui2/components/ui/Badge";
import { cn } from "@/lib/utils";

interface Member {
  id: string;
  userId: string;
  role: string;
  user?: {
    id: string;
    name: string;
    username: string;
  } | null;
}

interface SquadPlayerListProps {
  members: Member[];
  assignedPlayerIds: Set<string>;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectPlayer: (playerId: string) => void;
  activeSlot: string | null;
  isCaptain: boolean;
  benchPlayers: Member[];
  playersLabel: string;
  benchLabel: string;
  onlyCaptainCanEditLabel: string;
  ownerLabel: string;
}

export function SquadPlayerList({
  members,
  assignedPlayerIds,
  searchQuery,
  onSearchChange,
  onSelectPlayer,
  activeSlot,
  isCaptain,
  benchPlayers,
  playersLabel,
  benchLabel,
  onlyCaptainCanEditLabel,
  ownerLabel,
}: SquadPlayerListProps) {
  return (
    <Card className="glass-neon-strong rounded-3xl border-2 border-cyan-400/20 shadow-[0_0_25px_rgba(6,182,212,0.15)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl md:text-3xl text-foreground">
          <Users className="h-6 w-6 text-cyan-300" />
          {playersLabel}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Player Picker */}
        <PlayerPicker
          members={members}
          assignedPlayerIds={assignedPlayerIds}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onSelectPlayer={onSelectPlayer}
          activeSlot={activeSlot}
          isCaptain={isCaptain}
        />

        {/* Only Captain Notice */}
        {!isCaptain && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-cyan-500/10 border border-cyan-400/30">
            <Lock className="h-4 w-4 text-cyan-300" />
            <span className="text-sm text-gray-300">{onlyCaptainCanEditLabel}</span>
          </div>
        )}

        {/* Bench / Unassigned Players */}
        {benchPlayers.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-300 dark:text-gray-300 uppercase tracking-wide">
              {benchLabel}
            </h3>
            <div className="max-h-[300px] space-y-2 overflow-y-auto rounded-xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 p-3 scrollbar-hide">
              {benchPlayers.map((member) => {
                if (!member.user) return null;
                const initials = member.user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);

                const isCaptain = member.role === "OWNER" || member.role === "CAPTAIN";

                return (
                  <div
                    key={member.user.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-3 transition-all",
                      "hover:border-cyan-400/40 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20",
                      isCaptain && activeSlot && "cursor-pointer",
                      !isCaptain && "cursor-not-allowed opacity-60"
                    )}
                    onClick={() => isCaptain && activeSlot && onSelectPlayer(member.user!.id)}
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border-2 border-cyan-400/40 text-sm font-bold text-foreground">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {member.user.name}
                        </p>
                        {isCaptain && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-cyan-500/20 border-cyan-400/40 text-cyan-300 px-2 py-0.5"
                          >
                            <Crown className="mr-1 h-3 w-3" />
                            {ownerLabel}
                          </Badge>
                        )}
                      </div>
                      <p className="truncate text-xs text-gray-400">
                        @{member.user.username}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
