"use client";

import type { PropsWithChildren } from "react";
import { Tr } from "@/components/Table";
import useSelectPlayer from "@/hooks/select-player";

export default function CampaignPlayerRow({
  login,
  children,
}: {
  login: string;
} & PropsWithChildren) {
  const selectPlayer = useSelectPlayer(login);

  return <Tr onClick={selectPlayer}>{children}</Tr>;
}
