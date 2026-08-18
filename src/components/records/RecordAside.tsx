"use client";

import {
  DetailColumn,
  DetailPanel,
  WIDE_ENOUGH_FOR_A_PANEL,
} from "@/components/layout/DetailAside";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useRowSelection } from "@/hooks/useRowSelection";
import RecordDetails, {
  RecordMapName,
  RecordPlayerName,
  useSelectedRecord,
} from "./RecordDetails";
import RecordDialog from "./RecordDialog";

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
    <DetailPanel
      title={<RecordPlayerName record={record} />}
      subtitle={<RecordMapName record={record} />}
      closeLabel="Close record details"
      onClose={onClose}
    >
      <RecordDetails record={record} error={error} />
    </DetailPanel>
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
    <DetailColumn selected={selection.selected}>
      {(recordId) => (
        <RecordPanel recordId={recordId} onClose={selection.close} />
      )}
    </DetailColumn>
  ) : (
    <RecordDialog recordId={selection.selected} onClose={selection.close} />
  );
}
