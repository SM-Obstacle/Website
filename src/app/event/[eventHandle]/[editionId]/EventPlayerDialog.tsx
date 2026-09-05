"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import EventPlayerDetails, {
  EventPlayerName,
  useSelectedEventPlayer,
} from "./EventPlayerDetails";

/** The selected player on the layouts too narrow to keep a panel open. */
export default function EventPlayerDialog({
  eventHandle,
  editionId,
  eventName,
  login,
  onClose,
}: {
  eventHandle: string;
  editionId: number;
  eventName: string;
  login: string | null;
  onClose: () => void;
}) {
  const { selected, player, error } = useSelectedEventPlayer({
    eventHandle,
    editionId,
    login,
  });

  return (
    <Dialog open={selected} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85dvh] gap-inset rounded-block bg-popover p-inset sm:max-w-3xl">
        <DialogHeader className="px-3 pe-10 pt-2">
          <DialogTitle className="truncate text-xl">
            <EventPlayerName player={player} login={login} />
          </DialogTitle>
          <DialogDescription>on {eventName}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="min-h-0 rounded-panel">
          <div className="flex flex-col gap-inset">
            <EventPlayerDetails
              eventHandle={eventHandle}
              editionId={editionId}
              player={player}
              error={error}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
