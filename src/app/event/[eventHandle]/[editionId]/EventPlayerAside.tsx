"use client";

import {
  DetailColumn,
  DetailPanel,
  WIDE_ENOUGH_FOR_A_PANEL,
} from "@/components/layout/DetailAside";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useRowSelection } from "@/hooks/useRowSelection";
import EventPlayerDetails, {
  EventPlayerName,
  useSelectedEventPlayer,
} from "./EventPlayerDetails";
import EventPlayerDialog from "./EventPlayerDialog";

function EventPlayerPanel({
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

  if (!selected) return null;

  return (
    <DetailPanel
      title={<EventPlayerName player={player} login={login} />}
      subtitle={<>on {eventName}</>}
      closeLabel="Close player details"
      onClose={onClose}
    >
      <EventPlayerDetails
        eventHandle={eventHandle}
        editionId={editionId}
        player={player}
        error={error}
      />
    </DetailPanel>
  );
}

/**
 * The selected player, beside the page on a screen wide enough to hold it and
 * in a dialog otherwise. Both read the selection from the query string, so
 * neither needs anything passed down from the leaderboard that made it.
 */
export default function EventPlayerAside({
  eventHandle,
  editionId,
  eventName,
}: {
  eventHandle: string;
  editionId: number;
  eventName: string;
}) {
  const selection = useRowSelection("player");
  const wide = useMediaQuery(WIDE_ENOUGH_FOR_A_PANEL);

  return wide ? (
    <DetailColumn selected={selection.selected}>
      {(login) => (
        <EventPlayerPanel
          eventHandle={eventHandle}
          editionId={editionId}
          eventName={eventName}
          login={login}
          onClose={selection.close}
        />
      )}
    </DetailColumn>
  ) : (
    <EventPlayerDialog
      eventHandle={eventHandle}
      editionId={editionId}
      eventName={eventName}
      login={selection.selected}
      onClose={selection.close}
    />
  );
}
