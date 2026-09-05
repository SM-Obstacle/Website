"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import RecordDetails, {
  RecordMapName,
  RecordPlayerName,
  useSelectedRecord,
} from "./RecordDetails";

/** The selected record on the layouts too narrow to keep a panel open. */
export default function RecordDialog({
  recordId,
  onClose,
}: {
  recordId: string | null;
  onClose: () => void;
}) {
  const { selected, record, error } = useSelectedRecord(recordId);

  return (
    <Dialog open={selected} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[85dvh] gap-inset rounded-block bg-popover p-inset sm:max-w-2xl">
        <DialogHeader className="px-3 pe-10 pt-2">
          <DialogTitle className="truncate text-xl">
            <RecordPlayerName record={record} />
          </DialogTitle>

          <DialogDescription asChild>
            <div className="truncate">
              <RecordMapName record={record} />
            </div>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="min-h-0 rounded-panel">
          <div className="flex flex-col gap-inset">
            <RecordDetails record={record} error={error} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
