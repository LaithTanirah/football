import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/ui2/components/ui/Card";

interface TeamOverviewProps {
  preferredPitch?: {
    name: string;
  } | null;
  captain?: {
    name: string;
  } | null;
  memberCount: number;
  preferredPitchLabel: string;
  captainLabel: string;
  membersLabel: string;
  overviewLabel: string;
}

export function TeamOverview({
  preferredPitch,
  captain,
  memberCount,
  preferredPitchLabel,
  captainLabel,
  membersLabel,
  overviewLabel,
}: TeamOverviewProps) {
  return (
    <Card className="glass-neon-strong rounded-3xl border-2 border-cyan-400/20 shadow-[0_0_25px_rgba(6,182,212,0.15)]">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl text-foreground">
          {overviewLabel}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {preferredPitch && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-300 dark:text-gray-300 uppercase tracking-wide">
              {preferredPitchLabel}
            </p>
            <p className="text-lg text-foreground font-medium">
              {preferredPitch.name}
            </p>
          </div>
        )}
        {captain && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-300 dark:text-gray-300 uppercase tracking-wide">
              {captainLabel}
            </p>
            <p className="text-lg text-foreground font-medium">
              {captain.name}
            </p>
          </div>
        )}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-300 dark:text-gray-300 uppercase tracking-wide">
            {membersLabel}
          </p>
          <p className="text-lg text-foreground font-medium">
            {memberCount} {membersLabel}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
