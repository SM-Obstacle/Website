"use client";

import TableRow from "@/components/TableRow";
import { useRouter, useSearchParams } from "next/navigation";
import { PropsWithChildren } from "react";

export default function CampaignPlayerRow({
  login,
  unfold,
  children,
}: {
  login: string,
  unfold: boolean,
} & PropsWithChildren) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const onClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.getAll('players').includes(login)) {
      params.delete('players', login);
    } else {
      params.append('players', login);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <TableRow unfold={unfold} onClick={onClick}>
      {children}
    </TableRow>
  );
}