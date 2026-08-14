"use client";

import type { MappackLbFragment } from "@/app/__generated__/graphql";
import MappackLeaderboard from "@/components/mappack/MappackLeaderboard";
import MappackPlayerDialog from "./MappackPlayerDialog";

export default function MappackStandings({
  mappackId,
  mappackName,
  mappack,
}: {
  mappackId: string;
  mappackName: string;
  mappack: MappackLbFragment | null | undefined;
}) {
  return (
    <MappackLeaderboard
      mappack={mappack}
      renderSelected={(login, close) => (
        <MappackPlayerDialog
          mappackId={mappackId}
          mappackName={mappackName}
          login={login}
          onClose={close}
        />
      )}
    />
  );
}
