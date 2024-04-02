"use client";

import { Tr } from "@/components/Table";
import useSelectPlayer from "@/hooks/select-player";
import { PropsWithChildren } from "react";

export default function CampaignPlayerRow({
  login,
  children,
}: {
  login: string,
} & PropsWithChildren) {
  const selectPlayer = useSelectPlayer(login);

  return (
    <Tr onClick={selectPlayer}>{children}</Tr>
  );
}