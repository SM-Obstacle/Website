"use client";

import type { MappackLbFragment } from "@/app/__generated__/graphql";
import MappackLeaderboard from "@/components/mappack/MappackLeaderboard";

export default function MappackStandings({
  mappack,
}: {
  mappack: MappackLbFragment | null | undefined;
}) {
  return <MappackLeaderboard mappack={mappack} selectable />;
}
