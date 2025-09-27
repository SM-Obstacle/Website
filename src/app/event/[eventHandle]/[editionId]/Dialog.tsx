"use client";

import DialogInner from "@/components/Dialog";
import useSelectPlayer from "@/hooks/select-player";

export default function Dialog({
  login,
  children,
}: {
  login: string;
} & React.PropsWithChildren) {
  const selectPlayer = useSelectPlayer(login);
  return <DialogInner onClose={selectPlayer}>{children}</DialogInner>;
}
