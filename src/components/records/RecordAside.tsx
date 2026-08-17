"use client";

import { X } from "lucide-react";

import { Panel } from "@/components/layout/Panel";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useRowSelection } from "@/hooks/useRowSelection";
import RecordDetails, {
  RecordMapName,
  RecordPlayerName,
  useSelectedRecord,
} from "./RecordDetails";
import RecordDialog from "./RecordDialog";

/** Tailwind's `xl`: below it the panel would leave the list nothing to live on. */
const WIDE_ENOUGH_FOR_A_PANEL = "(min-width: 80rem)";

function RecordPanel({
  recordId,
  onClose,
}: {
  recordId: string | null;
  onClose: () => void;
}) {
  const { selected, record, error } = useSelectedRecord(recordId);

  if (!selected) return null;

  return (
    <aside className="flex min-h-0 w-80 shrink-0 flex-col 2xl:w-96">
      <Panel
        // Only as tall as the record needs, and never taller than the column
        // it has: `min-h-0` lets the flex column above shrink it past that
        // content, and the details then scroll inside.
        className="min-h-0 overflow-hidden"
        header={
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <h2 className="m-0 truncate text-xl font-bold">
                <RecordPlayerName record={record} />
              </h2>
              {/* A div, not a p: the placeholder it holds while loading is a
                  block, which a paragraph may not contain. */}
              <div className="truncate text-sm text-muted-foreground">
                <RecordMapName record={record} />
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              aria-label="Close record details"
              className="-me-1 shrink-0"
            >
              <X />
            </Button>
          </div>
        }
      >
        {/* Rounded like a sub-panel so what scrolls is clipped along the same
            curve as the panel around it. */}
        <div className="scrollbar-slim flex min-h-0 flex-1 flex-col gap-inset overflow-y-auto rounded-panel">
          <RecordDetails record={record} error={error} />
        </div>
      </Panel>
    </aside>
  );
}

/**
 * The selected record, beside the page on a screen wide enough to hold it and
 * in a dialog otherwise. Both read the selection from the query string, so
 * neither needs anything passed down from the list that made it.
 */
export default function RecordAside() {
  const selection = useRowSelection("record");
  const wide = useMediaQuery(WIDE_ENOUGH_FOR_A_PANEL);

  return wide ? (
    <RecordPanel recordId={selection.selected} onClose={selection.close} />
  ) : (
    <RecordDialog recordId={selection.selected} onClose={selection.close} />
  );
}
