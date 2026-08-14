import { Suspense } from "react";

import MapRecordsTable from "./MapRecordsTable";

export default async function MapRecordsPage(
  props: PageProps<"/map/[gameId]">,
) {
  const { gameId } = await props.params;

  return (
    <Suspense>
      <MapRecordsTable gameId={gameId} />
    </Suspense>
  );
}
