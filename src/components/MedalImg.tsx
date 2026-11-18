import Image from "next/image";

import type { Medal } from "@/lib/ranked-record";

export const MedalImg = ({ mdl }: { mdl: Medal | null }) =>
  mdl === null ? (
    <div style={{ width: 20, height: 20 }}></div>
  ) : (
    <Image
      src={`/Medals/${mdl.toLowerCase()}.png`}
      alt={mdl}
      width={20}
      height={20}
    />
  );
