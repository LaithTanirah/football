import { SquadTabContent } from "./SquadTabContent";

interface TeamSquadProps {
  teamId: string;
  members: Array<{
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
    } | null;
  }>;
  captainId: string;
  currentUserId: string | null;
}

export function TeamSquad({
  teamId,
  members,
  captainId,
  currentUserId,
}: TeamSquadProps) {
  // Map members to the format expected by SquadTabContent
  const mappedMembers = members.map((m) => ({
    id: m.id,
    userId: m.user?.id || m.userId || "",
    role: m.role,
    user: m.user
      ? {
          id: m.user.id,
          name: m.user.name,
          username: m.user.username || m.user.name.toLowerCase().replace(/\s+/g, ""),
          email: m.user.email,
          phone: m.user.phone,
          city: m.user.city,
        }
      : undefined,
  }));

  return (
    <SquadTabContent
      teamId={teamId}
      members={mappedMembers}
      captainId={captainId}
      currentUserId={currentUserId}
    />
  );
}
