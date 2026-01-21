import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, User, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocaleStore } from '@/store/localeStore';
import { cn } from '@/lib/utils';

interface TeamMember {
  id: string;
  userId: string;
  role: string;
  user?: {
    id: string;
    name: string;
    username: string;
    email?: string;
    phone?: string;
    city?: string;
  };
}

interface PlayerPickerProps {
  members: TeamMember[];
  assignedPlayerIds: Set<string>;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectPlayer: (playerId: string) => void;
  activeSlot: string | null;
  isCaptain: boolean;
}

export function PlayerPicker({
  members,
  assignedPlayerIds,
  searchQuery,
  onSearchChange,
  onSelectPlayer,
  activeSlot,
  isCaptain,
}: PlayerPickerProps) {
  const { t, i18n } = useTranslation();
  const { locale } = useLocaleStore();
  const isRTL = locale === 'ar';

  // Filter and prioritize players
  const filteredPlayers = useMemo(() => {
    if (!searchQuery.trim()) {
      // Show unassigned players first, then all players
      const unassigned = members.filter(
        (m) => m.user && !assignedPlayerIds.has(m.user.id)
      );
      const assigned = members.filter(
        (m) => m.user && assignedPlayerIds.has(m.user.id)
      );
      return [...unassigned, ...assigned];
    }

    const query = searchQuery.toLowerCase();
    return members.filter(
      (m) =>
        m.user &&
        (m.user.name.toLowerCase().includes(query) ||
          m.user.username.toLowerCase().includes(query))
    );
  }, [members, assignedPlayerIds, searchQuery]);

  const handlePlayerClick = (playerId: string) => {
    if (!isCaptain || !activeSlot) return;
    onSelectPlayer(playerId);
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search
          className={cn(
            'absolute top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400',
            isRTL ? 'right-3' : 'left-3'
          )}
        />
        <Input
          placeholder={t('teams.addPlayerToSlot')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          disabled={!isCaptain || !activeSlot}
          className={cn(
            'h-11 border-cyan-400/12 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 text-foregroundplaceholder:text-gray-400',
            'focus:border-cyan-400/18 focus:ring-cyan-400/10',
            isRTL ? 'pr-9' : 'pl-9'
          )}
        />
      </div>

      {/* Active Slot Indicator */}
      {activeSlot && isCaptain ? (
        <div className="rounded-xl border border-cyan-400/12 bg-cyan-500/10 p-3 text-sm">
          <p className="font-medium text-cyan-300">
            {t('teams.selectSlotFirst')} → {activeSlot}
          </p>
        </div>
      ) : !isCaptain ? (
        <div className="rounded-xl border border-cyan-400/12 bg-cyan-500/10 p-3 text-sm text-gray-300">
          <p>{t('teams.onlyCaptainCanEdit')}</p>
        </div>
      ) : (
        <div className="rounded-xl border border-cyan-400/12 bg-cyan-500/10 p-3 text-sm text-gray-300">
          <p>{t('teams.selectSlotFirst')}</p>
        </div>
      )}

      {/* Players List */}
      <div className="max-h-[400px] space-y-2 overflow-y-auto">
        {filteredPlayers.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-400">
            <User className="mx-auto mb-2 h-8 w-8 opacity-50 text-gray-400" />
            <p className="text-gray-400">{t('teams.noSearchResults')}</p>
          </div>
        ) : (
          filteredPlayers.map((member) => {
            if (!member.user) return null;

            const isAssigned = assignedPlayerIds.has(member.user.id);
            const isOwner = member.role === 'OWNER' || member.role === 'CAPTAIN';
            const initials = member.user.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);

            return (
              <div
                key={member.user.id}
                className={cn(
                  'flex items-center justify-between rounded-xl border border-cyan-400/12 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-3 transition-all',
                  isAssigned
                    ? 'opacity-60'
                    : isCaptain && activeSlot
                      ? 'cursor-pointer hover:border-cyan-400/18 hover:bg-gradient-to-r hover:from-cyan-500/15 hover:to-purple-500/15'
                      : '',
                  !isCaptain && 'cursor-not-allowed opacity-60'
                )}
                onClick={() => handlePlayerClick(member.user!.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/18 text-xs font-bold text-foreground">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold truncate text-foreground">{member.user.name}</p>
                      {isOwner && (
                        <Badge variant="secondary" className="text-xs bg-cyan-500/10 border-cyan-400/15 text-cyan-300 px-2 py-0.5">
                          {t('teams.captain')}
                        </Badge>
                      )}
                      {isAssigned && (
                        <Badge variant="outline" className="text-xs border-cyan-400/15 text-cyan-300">
                          {t('teams.added')}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate">
                      @{member.user.username}
                    </p>
                  </div>
                </div>
                {isAssigned && (
                  <X className="h-4 w-4 text-gray-400 flex-shrink-0" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

