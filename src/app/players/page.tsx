import type { Metadata } from "next";
import { Suspense } from "react";

import PlayersTable from "./PlayersTable";

export const metadata: Metadata = {
  title: "Players",
};

export default function PlayersPage() {
  return (
    <Suspense>
      <PlayersTable />
    </Suspense>
  );
}
