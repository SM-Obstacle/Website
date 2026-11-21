import type { Metadata } from "next";
import { Suspense } from "react";

import MapsTable from "./MapsTable";

export const metadata: Metadata = {
  title: "Maps",
};

export default function MapsPage() {
  return (
    <Suspense>
      <MapsTable />
    </Suspense>
  );
}
