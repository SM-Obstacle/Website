"use client";

import type { MappackLbFragment } from "@/app/__generated__/graphql";
import MappackLeaderboard from "@/components/mappack/MappackLeaderboard";
import EventPlayerDialog from "./EventPlayerDialog";

export default function EventLeaderboard({
  eventHandle,
  editionId,
  eventName,
  mappack,
}: {
  eventHandle: string;
  editionId: number;
  eventName: string;
  mappack: MappackLbFragment | null | undefined;
}) {
  return (
    <MappackLeaderboard
      mappack={mappack}
      renderSelected={(login, close) => (
        <EventPlayerDialog
          eventHandle={eventHandle}
          editionId={editionId}
          eventName={eventName}
          login={login}
          onClose={close}
        />
      )}
    />
  );
}
