import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { PitchBoard, SquadSlot } from "@/components/PitchBoard";
import { Formation } from "@/lib/formations";
import {
  Card,
  CardContent,
} from "@/ui2/components/ui/Card";

interface SquadPitchBoardProps {
  formation: Formation;
  slots: SquadSlot[];
  activeSlot: string | null;
  isCaptain: boolean;
  captainId?: string;
  onSelectSlot: (slotKey: string) => void;
  onRemovePlayer: (slotKey: string) => void;
  onDragEnd: (event: DragEndEvent) => void;
}

export function SquadPitchBoard({
  formation,
  slots,
  activeSlot,
  isCaptain,
  captainId,
  onSelectSlot,
  onRemovePlayer,
  onDragEnd,
}: SquadPitchBoardProps) {
  return (
    <Card className="glass-neon-strong rounded-3xl border-2 border-cyan-400/20 shadow-[0_0_25px_rgba(6,182,212,0.15)] overflow-hidden">
      <CardContent className="p-6 md:p-8">
        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <PitchBoard
            formation={formation}
            slots={slots}
            activeSlot={activeSlot}
            isCaptain={isCaptain}
            captainId={captainId}
            onSelectSlot={onSelectSlot}
            onRemovePlayer={onRemovePlayer}
          />
        </DndContext>
      </CardContent>
    </Card>
  );
}
