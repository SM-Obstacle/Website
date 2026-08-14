import Image from "next/image";

import type { Medal } from "@/lib/ranked-record";

export const MedalImg = ({ mdl }: { mdl: Medal | null }) =>
  mdl && (
    <Image
      src={`/Medals/${mdl.toLowerCase()}.png`}
      alt={mdl}
      width={20}
      height={20}
    />
  );
