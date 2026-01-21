import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teamsApi } from "@/lib/api";
import { useToast } from "@/ui2/components/ui/use-toast";
import { Button } from "@/ui2/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/ui2/components/ui/Card";
import { Skeleton } from "@/ui2/components/ui/Skeleton";
import { useAuthStore } from "@/store/authStore";
import {
  Loader2,
} from "lucide-react";
import { ManagePlayers } from "@/components/ManagePlayers";
import { TeamLogoUpload } from "@/components/team/TeamLogoUpload";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui2/components/ui/Dialog";
import { TeamDetailsUI } from "@/ui/team-details";

export function TeamDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [managePlayersOpen, setManagePlayersOpen] = useState(false);
  const [removeConfirmOpen, setRemoveConfirmOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [updateLogoOpen, setUpdateLogoOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["team", id],
    queryFn: () => teamsApi.getById(id!),
    enabled: !!id,
  });

  const removeMemberMutation = useMutation({
    mutationFn: ({ teamId, userId }: { teamId: string; userId: string }) =>
      teamsApi.removeMember(teamId, userId),
    onSuccess: () => {
      toast({
        title: t("common.success"),
        description: t("teams.memberRemovedSuccess"),
      });
      queryClient.invalidateQueries({ queryKey: ["team", id] });
      setRemoveConfirmOpen(false);
      setMemberToRemove(null);
    },
    onError: (error: any) => {
      toast({
        title: t("common.error"),
        description:
          error.response?.data?.message || t("teams.removeMemberError"),
        variant: "destructive",
      });
    },
  });

  const updateLogoMutation = useMutation({
    mutationFn: (logoUrl: string) => {
      if (!id) throw new Error("Team ID is required");
      return teamsApi.update(id, { logoUrl });
    },
    onSuccess: () => {
      toast({
        title: t("teams.logoUpdatedSuccess"),
        description: t("teams.logoUpdatedSuccessDesc"),
      });
      queryClient.invalidateQueries({ queryKey: ["team", id] });
      setUpdateLogoOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: t("common.error"),
        description:
          error.response?.data?.message || t("teams.logoUpdateError"),
        variant: "destructive",
      });
    },
  });

  const handleRemoveClick = (member: {
    user?: { id: string; name: string };
  }) => {
    if (!member.user) return;
    setMemberToRemove({ id: member.user.id, name: member.user.name });
    setRemoveConfirmOpen(true);
  };

  const handleConfirmRemove = () => {
    if (!memberToRemove || !id) return;
    removeMemberMutation.mutate({
      teamId: id,
      userId: memberToRemove.id,
    });
  };

  const team = data?.data.data;
  // Check if user is owner (captainId or has OWNER/ADMIN role)
  const isOwner =
    user &&
    team &&
    (team.captain?.id === user.id ||
      team.members?.some(
        (m: any) =>
          m.user?.id === user.id &&
          (m.role === "OWNER" || m.role === "ADMIN" || m.role === "CAPTAIN")
      ));

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-[1200px] px-4 pt-20 md:pt-24 pb-6">
        <Skeleton className="mb-6 h-6 w-48" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="mt-2 h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="container mx-auto max-w-[1200px] px-4 pt-20 md:pt-24 pb-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">{t("teams.teamNotFound")}</p>
            <Button onClick={() => navigate("/teams")} className="mt-4">
              {t("teams.backToTeams")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <TeamDetailsUI
        team={team}
        user={user}
        isOwner={isOwner}
        onUpdateLogo={() => setUpdateLogoOpen(true)}
        onManagePlayers={() => setManagePlayersOpen(true)}
        onRemoveMember={handleRemoveClick}
        isRemoving={removeMemberMutation.isPending}
        breadcrumbLabel={t("teams.title")}
        overviewLabel={t("teams.overview")}
        playersLabel={t("teams.players")}
        squadLabel={t("teams.squadTab")}
        preferredPitchLabel={t("teams.preferredPitch")}
        captainLabel={t("teams.captain")}
        membersLabel={t("teams.members")}
        teamRosterLabel={t("teams.teamRoster")}
        managePlayersLabel={t("teams.managePlayers")}
        ownerLabel={t("teams.owner")}
        joinedLabel={t("teams.joined")}
      />

      {/* Manage Players Drawer */}
      {team && (
        <ManagePlayers
          teamId={id!}
          open={managePlayersOpen}
          onOpenChange={setManagePlayersOpen}
          currentMembers={team.members || []}
        />
      )}

      {/* Remove Member Confirmation Dialog */}
      <Dialog open={removeConfirmOpen} onOpenChange={setRemoveConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("teams.removeMemberConfirmTitle")}</DialogTitle>
            <DialogDescription>
              {t("teams.removeMemberConfirm", { name: memberToRemove?.name })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRemoveConfirmOpen(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmRemove}
              disabled={removeMemberMutation.isPending}
            >
              {removeMemberMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("common.loading")}
                </>
              ) : (
                t("common.confirm")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Logo Dialog */}
      <Dialog open={updateLogoOpen} onOpenChange={setUpdateLogoOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("teams.updateLogo")}</DialogTitle>
            <DialogDescription>{t("teams.updateLogoDesc")}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <TeamLogoUpload
              value={team.logoUrl || ""}
              onChange={(url) => {
                // Handle both logo update and removal (empty string)
                updateLogoMutation.mutate(url || "");
              }}
              teamName={team.name}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUpdateLogoOpen(false)}
              disabled={updateLogoMutation.isPending}
            >
              {t("common.cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
