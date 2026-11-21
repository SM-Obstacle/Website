import { Suspense } from "react";

import PlayerRecordsTable from "./PlayerRecordsTable";

export default async function PlayerRecordsPage(
  props: PageProps<"/player/[login]">,
) {
  const { login } = await props.params;

  return (
    <Suspense>
      <PlayerRecordsTable login={login} />
    </Suspense>
  );
}
