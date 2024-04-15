"use client";

import useSelectPlayer from "@/hooks/select-player";
import DialogInner from "@/components/Dialog";

export default function Dialog({
  login,
  children,
}: {
  login: string
} & React.PropsWithChildren) {
  const selectPlayer = useSelectPlayer(login);
  return (
    <DialogInner onClose={selectPlayer}>
      {children}
    </DialogInner>
  )
}