"use client";

import TableRow from "@/components/TableRow";
import { useRouter, useSearchParams } from "next/navigation";
import { PropsWithChildren, useEffect, useRef } from "react";

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
  const selectedRowRef = useRef<HTMLTableRowElement | null>(null);

  const onClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get('player') === login) {
      params.delete('player');
    } else {
      params.set('player', login);
    }
    router.push(`?${params.toString()}`);
  };

  // useEffect instead of calling `scrollIntoView` directly because it would scroll from the top of the page.
  useEffect(() => {
    if (unfold) {
      selectedRowRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  });

  return (
    <TableRow ref={selectedRowRef} unfold={unfold} onClick={onClick}>
      {children}
    </TableRow>
  );
}