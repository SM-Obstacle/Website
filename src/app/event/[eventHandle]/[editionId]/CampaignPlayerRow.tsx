"use client";

import type { PropsWithChildren } from "react";
import { Tr } from "@/components/Table";
import useToggleSelectPlayer from "@/hooks/select-player";

export default function CampaignPlayerRow({
  login,
  children,
}: {
  login: string;
} & PropsWithChildren) {
  const toggleSelectPlayer = useToggleSelectPlayer(login);

  return <Tr onClick={toggleSelectPlayer}>{children}</Tr>;
}
