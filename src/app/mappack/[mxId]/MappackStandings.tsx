"use client";

import type { MappackLbFragment } from "@/app/__generated__/graphql";
import MappackLeaderboard from "@/components/mappack/MappackLeaderboard";
import { useRowSelection } from "@/hooks/useRowSelection";
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
  const selection = useRowSelection("player");

  return (
    <>
      <MappackLeaderboard mappack={mappack} selectable />

      <MappackPlayerDialog
        mappackId={mappackId}
        mappackName={mappackName}
        login={selection.selected}
        onClose={selection.close}
      />
    </>
  );
}
