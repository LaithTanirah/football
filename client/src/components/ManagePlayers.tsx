import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi, teamsApi } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, UserPlus, UserMinus, User, Crown, Loader2 } from 'lucide-react';
import { useLocaleStore } from '@/store/localeStore';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ManagePlayersProps {
  teamId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentMembers: Array<{
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
  }>;
}

export function ManagePlayers({ teamId, open, onOpenChange, currentMembers }: ManagePlayersProps) {
  const { t } = useTranslation();
  const { locale } = useLocaleStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isRTL = locale === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [removeConfirmOpen, setRemoveConfirmOpen] = useState(false);
  const [userToRemove, setUserToRemove] = useState<{ id: string; name: string } | null>(null);
  const [addingUserId, setAddingUserId] = useState<string | null>(null);
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch suggestions
  const { data: suggestionsData, isLoading: suggestionsLoading } = useQuery({
    queryKey: ['team-suggestions', teamId],
    queryFn: () => teamsApi.getSuggestions(teamId),
    enabled: open,
  });

  const suggestions = suggestionsData?.data.data || [];

  // Fetch search results
  const { data: searchData, isLoading: searchLoading } = useQuery({
    queryKey: ['user-search', debouncedQuery, teamId],
    queryFn: () =>
      usersApi.search({
        q: debouncedQuery,
        excludeTeamId: teamId,
        limit: 10,
      }),
    enabled: open && debouncedQuery.length >= 2,
  });

  const searchResults = searchData?.data.data || [];

  // Add member mutation
  const addMemberMutation = useMutation({
    mutationFn: (userId: string) => teamsApi.addMember(teamId, { userId }),
    onSuccess: () => {
      toast({
        title: t('teams.memberAddedSuccess'),
        description: t('teams.memberAddedSuccessDesc'),
      });
      queryClient.invalidateQueries({ queryKey: ['team', teamId] });
      queryClient.invalidateQueries({ queryKey: ['team-suggestions', teamId] });
      queryClient.invalidateQueries({ queryKey: ['user-search'] });
      setAddingUserId(null);
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.response?.data?.message || t('teams.addMemberError'),
        variant: 'destructive',
      });
      setAddingUserId(null);
    },
  });

  // Remove member mutation
  const removeMemberMutation = useMutation({
    mutationFn: (userId: string) => teamsApi.removeMember(teamId, userId),
    onSuccess: () => {
      toast({
        title: t('teams.memberRemovedSuccess'),
        description: t('teams.memberRemovedSuccessDesc'),
      });
      queryClient.invalidateQueries({ queryKey: ['team', teamId] });
      queryClient.invalidateQueries({ queryKey: ['team-suggestions', teamId] });
      queryClient.invalidateQueries({ queryKey: ['user-search'] });
      setRemovingUserId(null);
      setRemoveConfirmOpen(false);
      setUserToRemove(null);
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.response?.data?.message || t('teams.removeMemberError'),
        variant: 'destructive',
      });
      setRemovingUserId(null);
    },
  });

  const handleAddMember = (userId: string) => {
    if (addingUserId) return; // Prevent double clicks
    setAddingUserId(userId);
    addMemberMutation.mutate(userId);
  };

  const handleRemoveClick = (member: { id: string; user?: { id: string; name: string } }) => {
    if (!member.user) return;
    setUserToRemove({ id: member.user.id, name: member.user.name });
    setRemoveConfirmOpen(true);
  };

  const handleConfirmRemove = () => {
    if (!userToRemove) return;
    if (removingUserId) return; // Prevent double clicks
    setRemovingUserId(userToRemove.id);
    removeMemberMutation.mutate(userToRemove.id);
  };

  const memberUserIds = useMemo(
    () => new Set(currentMembers.map((m) => m.user?.id).filter(Boolean)),
    [currentMembers]
  );

  const isMember = (userId: string) => memberUserIds.has(userId);

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="sm:max-w-lg">
          <DrawerHeader className={cn("space-y-3 pb-6", isRTL ? "pl-14 pr-6" : "pl-6 pr-12")}>
            <DrawerTitle className="text-xl font-semibold">{t('teams.managePlayers')}</DrawerTitle>
            <DrawerDescription className="text-sm leading-relaxed text-muted-foreground">{t('teams.managePlayersDesc')}</DrawerDescription>
          </DrawerHeader>

          <div className="px-6 pb-6 space-y-6">
            {/* Search Input */}
            <div className="relative">
              <Search
                className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground ${
                  isRTL ? 'right-3' : 'left-3'
                }`}
              />
              <Input
                placeholder={t('teams.searchPlayers')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`h-11 ${isRTL ? 'pr-9' : 'pl-9'}`}
              />
            </div>

            {/* Tabs */}
            <Tabs defaultValue="suggested" className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-11">
                <TabsTrigger value="suggested" className="text-sm">{t('teams.suggested')}</TabsTrigger>
                <TabsTrigger value="search" className="text-sm">{t('teams.searchResults')}</TabsTrigger>
                <TabsTrigger value="members" className="text-sm">{t('teams.currentMembers')}</TabsTrigger>
              </TabsList>

              {/* Suggested Players */}
              <TabsContent value="suggested" className="space-y-3 mt-6">
                {suggestionsLoading ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : suggestions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-base">{t('teams.noSuggestions')}</p>
                    <p className="text-sm mt-2">{t('teams.noSuggestionsDesc')}</p>
                  </div>
                ) : (
                  suggestions.map((user: any) => (
                    <PlayerCard
                      key={user.id}
                      user={user}
                      isMember={isMember(user.id)}
                      onAdd={() => handleAddMember(user.id)}
                      isLoading={addingUserId === user.id}
                      isRTL={isRTL}
                    />
                  ))
                )}
              </TabsContent>

              {/* Search Results */}
              <TabsContent value="search" className="space-y-3 mt-6">
                {!debouncedQuery ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>{t('teams.startTypingToSearch')}</p>
                  </div>
                ) : searchLoading ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-base">{t('teams.noSearchResults')}</p>
                    <p className="text-sm mt-2">{t('teams.noSearchResultsDesc')}</p>
                  </div>
                ) : (
                  searchResults.map((user: any) => (
                    <PlayerCard
                      key={user.id}
                      user={user}
                      isMember={isMember(user.id)}
                      onAdd={() => handleAddMember(user.id)}
                      isLoading={addingUserId === user.id}
                      isRTL={isRTL}
                    />
                  ))
                )}
              </TabsContent>

              {/* Current Members */}
              <TabsContent value="members" className="space-y-3 mt-6">
                {currentMembers.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-base">{t('teams.noMembers')}</p>
                    <p className="text-sm mt-2">{t('teams.noMembersDesc')}</p>
                  </div>
                ) : (
                  currentMembers.map((member) => (
                    <MemberCard
                      key={member.id}
                      member={member}
                      onRemove={() => handleRemoveClick(member)}
                      isLoading={removingUserId === member.user?.id}
                      isRTL={isRTL}
                      t={t}
                    />
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Remove Confirmation Dialog */}
      <Dialog open={removeConfirmOpen} onOpenChange={setRemoveConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('teams.removeMemberConfirmTitle')}</DialogTitle>
            <DialogDescription>
              {t('teams.removeMemberConfirm', { name: userToRemove?.name })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveConfirmOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmRemove}
              disabled={removeMemberMutation.isPending}
            >
              {removeMemberMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common.loading')}
                </>
              ) : (
                t('common.confirm')
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface PlayerCardProps {
  user: {
    id: string;
    name: string;
    username: string;
    email?: string;
    phone?: string;
    city?: string;
  };
  isMember: boolean;
  onAdd: () => void;
  isLoading: boolean;
  isRTL: boolean;
}

function PlayerCard({ user, isMember, onAdd, isLoading, isRTL }: PlayerCardProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between rounded-lg border p-4 bg-card hover:bg-accent/50 transition-colors">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted flex-shrink-0">
          <User className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-base truncate">{user.name}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <span className="truncate">@{user.username}</span>
            {user.city && (
              <>
                <span>•</span>
                <span className="truncate">{user.city}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <Button
        size="sm"
        onClick={onAdd}
        disabled={isMember || isLoading}
        className="flex-shrink-0 ml-3"
      >
        {isLoading ? (
          <Loader2 className={`h-4 w-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />
        ) : (
          <UserPlus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
        )}
        {isMember ? t('teams.added') : t('teams.add')}
      </Button>
    </div>
  );
}

interface MemberCardProps {
  member: {
    id: string;
    role: string;
    user?: {
      id: string;
      name: string;
      username: string;
      city?: string;
    };
  };
  onRemove: () => void;
  isLoading: boolean;
  isRTL: boolean;
  t: (key: string) => string;
}

function MemberCard({ member, onRemove, isLoading, isRTL, t }: MemberCardProps) {
  if (!member.user) return null;

  const isOwner = member.role === 'OWNER' || member.role === 'CAPTAIN';

  return (
    <div className="flex items-center justify-between rounded-lg border p-4 bg-card hover:bg-accent/50 transition-colors">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted flex-shrink-0">
          <User className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-medium text-base truncate">{member.user.name}</p>
            {isOwner && (
              <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                <Crown className="h-3 w-3" />
                {t('teams.owner')}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="truncate">@{member.user.username}</span>
            {member.user.city && (
              <>
                <span>•</span>
                <span className="truncate">{member.user.city}</span>
              </>
            )}
          </div>
        </div>
      </div>
      {!isOwner && (
        <Button
          size="sm"
          variant="ghost"
          onClick={onRemove}
          disabled={isLoading}
          className="flex-shrink-0 ml-3 text-destructive hover:text-destructive"
        >
          {isLoading ? (
            <Loader2 className={`h-4 w-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />
          ) : (
            <UserMinus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          )}
          {t('teams.remove')}
        </Button>
      )}
    </div>
  );
}

