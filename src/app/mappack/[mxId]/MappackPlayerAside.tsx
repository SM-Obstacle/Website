"use client";

import {
  DetailColumn,
  DetailPanel,
  WIDE_ENOUGH_FOR_A_PANEL,
} from "@/components/layout/DetailAside";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useRowSelection } from "@/hooks/useRowSelection";
import MappackPlayerDetails, {
  MappackPlayerName,
  useMappackPlayer,
} from "./MappackPlayerDetails";
import MappackPlayerDialog from "./MappackPlayerDialog";

function MappackPlayerPanel({
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
  if (!login) return null;

  return (
    <DetailPanel
      title={
        <MappackPlayerName player={player} />
      }
      subtitle={<>on {mappackName}</>}
      closeLabel="Close player details"
      onClose={onClose}
    >
      <MappackPlayerDetails mappackId={mappackId} login={login} />
    </DetailPanel>
  );
}

export default function MappackPlayerAside({
  mappackId,
  mappackName,
}: {
  mappackId: string;
  mappackName: string;
}) {
  const selection = useRowSelection("player");
  const wide = useMediaQuery(WIDE_ENOUGH_FOR_A_PANEL);

  return wide ? (
    <DetailColumn selected={selection.selected}>
      {(login) => (
        <MappackPlayerPanel
          mappackId={mappackId}
          mappackName={mappackName}
          login={login}
          onClose={selection.close}
        />
      )}
    </DetailColumn>
  ) : (
    <MappackPlayerDialog
      mappackId={mappackId}
      mappackName={mappackName}
      login={selection.selected}
      onClose={selection.close}
    />
  );
}
