"use client";

import DialogInner from "@/components/Dialog";
import useToggleSelectPlayer from "@/hooks/select-player";

export default function Dialog({
  login,
  children,
}: {
  login: string;
} & React.PropsWithChildren) {
  const toggleSelectPlayer = useToggleSelectPlayer(login);
  return <DialogInner onClose={toggleSelectPlayer}>{children}</DialogInner>;
}
