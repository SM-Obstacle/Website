"use client";

import { useState } from "react";

export default function TableRow({ children }: { children: React.ReactNode }) {
  const [unfolded, setUnfolded] = useState(false);

  return (
    <tr tabIndex={0} onClick={() => setUnfolded(!unfolded)} className={unfolded ? "unfolded" : undefined}>
      {children}
    </tr>
  );
}