import type { Metadata } from "next";
import { Suspense } from "react";

import RecordsTable from "./RecordsTable";

export const metadata: Metadata = {
  title: "Records",
};

export default function RecordsPage() {
  return (
    <Suspense>
      <RecordsTable />
    </Suspense>
  );
}
