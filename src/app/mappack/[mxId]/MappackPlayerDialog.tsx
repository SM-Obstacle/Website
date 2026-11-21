"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import MappackPlayerDetails, {
  MappackPlayerName,
  useMappackPlayer,
} from "./MappackPlayerDetails";

export default function MappackPlayerDialog({
  mappackId,
  mappackName,
  login,
  onClose,
}: {
  mappackId: string;
  mappackName: string;
  login: string | null;
  onClose: () => void;
}) {
  const player = useMappackPlayer(mappackId, login);

  return (
    <Dialog open={login !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85dvh] gap-inset rounded-block bg-popover p-inset sm:max-w-2xl">
        <DialogHeader className="px-3 pe-10 pt-2">
          <DialogTitle className="truncate text-xl">
            {login && (
              <MappackPlayerName player={player} />
            )}
          </DialogTitle>
          <DialogDescription>on {mappackName}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="min-h-0 rounded-panel">
          <MappackPlayerDetails mappackId={mappackId} login={login} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
