import { TabsContent } from "@/ui2/components/ui/Tabs";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TeamHero } from "./TeamHero";
import { TeamTabs } from "./TeamTabs";
import { TeamOverview } from "./TeamOverview";
import { TeamPlayers } from "./TeamPlayers";
import { TeamSquad } from "./TeamSquad";
import { cn } from "@/lib/utils";
import { useDirection } from "@/hooks/useDirection";

interface TeamDetailsUIProps {
  // Team data
  team: {
    id: string;
    name: string;
    city: string;
    logoUrl?: string | null;
    preferredPitch?: { name: string } | null;
    captain?: { name: string } | null;
    members: Array<{
      id: string;
      user?: { id: string; name: string } | null;
      role: string;
      joinedAt: string;
    }>;
    captainId: string;
  };

  // User data
  user: {
    id: string;
  } | null;
  isOwner: boolean;

  // Handlers
  onUpdateLogo: () => void;
  onManagePlayers: () => void;
  onRemoveMember: (member: any) => void;
  isRemoving?: boolean;

  // Translations
  breadcrumbLabel: string;
  overviewLabel: string;
  playersLabel: string;
  squadLabel: string;
  preferredPitchLabel: string;
  captainLabel: string;
  membersLabel: string;
  teamRosterLabel: string;
  managePlayersLabel: string;
  ownerLabel: string;
  joinedLabel: string;
}

export function TeamDetailsUI({
  team,
  user,
  isOwner,
  onUpdateLogo,
  onManagePlayers,
  onRemoveMember,
  isRemoving = false,
  breadcrumbLabel,
  overviewLabel,
  playersLabel,
  squadLabel,
  preferredPitchLabel,
  captainLabel,
  membersLabel,
  teamRosterLabel,
  managePlayersLabel,
  ownerLabel,
  joinedLabel,
}: TeamDetailsUIProps) {
  const { isRTL } = useDirection();

  return (
    <div className="container mx-auto max-w-7xl px-4 pt-28 md:pt-32 pb-16 md:pb-24 relative z-10">
      {/* Breadcrumbs */}
      <div className="mb-8">
        <Breadcrumbs
          items={[
            { label: breadcrumbLabel, href: "/teams" },
            { label: team.name },
          ]}
        />
      </div>

      {/* Hero Section */}
      <div className="mb-12">
        <TeamHero
          name={team.name}
          city={team.city}
          logoUrl={team.logoUrl}
          isOwner={isOwner}
          onUpdateLogo={onUpdateLogo}
        />
      </div>

      {/* Tabs */}
      <TeamTabs
        overviewLabel={overviewLabel}
        playersLabel={playersLabel}
        squadLabel={squadLabel}
      >
        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-0">
          <TeamOverview
            preferredPitch={team.preferredPitch}
            captain={team.captain}
            memberCount={team.members?.length || 0}
            preferredPitchLabel={preferredPitchLabel}
            captainLabel={captainLabel}
            membersLabel={membersLabel}
            overviewLabel={overviewLabel}
          />
        </TabsContent>

        {/* Players Tab */}
        <TabsContent value="players" className="mt-0">
          <TeamPlayers
            members={team.members}
            isOwner={isOwner}
            currentUserId={user?.id || null}
            onManagePlayers={onManagePlayers}
            onRemoveMember={onRemoveMember}
            isRemoving={isRemoving}
            teamRosterLabel={teamRosterLabel}
            membersLabel={membersLabel}
            managePlayersLabel={managePlayersLabel}
            ownerLabel={ownerLabel}
            joinedLabel={joinedLabel}
          />
        </TabsContent>

        {/* Squad Tab */}
        <TabsContent value="squad" className="mt-0">
          <TeamSquad
            teamId={team.id}
            members={team.members.map((m) => ({
              id: m.id,
              userId: m.user?.id || "",
              role: m.role,
              user: m.user
                ? {
                    id: m.user.id,
                    name: m.user.name,
                    username: m.user.name.toLowerCase().replace(/\s+/g, ""),
                  }
                : null,
            }))}
            captainId={team.captainId}
            currentUserId={user?.id || null}
          />
        </TabsContent>
      </TeamTabs>
    </div>
  );
}
