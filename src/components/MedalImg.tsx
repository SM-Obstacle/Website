import Image from "next/image";
import type { Medal } from "@/lib/ranked-record";

const getImg = (medal: string) => `/Medals/${medal}.png`;

export const MedalImg = ({ mdl }: { mdl: Medal | null }) =>
  mdl && (
    <Image src={getImg(mdl.toLowerCase())} alt={mdl} width={20} height={20} />
  );
