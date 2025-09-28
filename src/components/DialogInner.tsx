"use client";

import {
  type MouseEvent,
  type PropsWithChildren,
  useEffect,
  useRef,
} from "react";
import { CloseButton, StyledDialog } from "./Dialog";

export function DialogInner({
  open = true,
  onClose,
  children,
}: {
  open?: boolean;
  onClose?: () => void;
} & PropsWithChildren) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    // Somehow the modal may be already opened on some frame, so we check if the modal isn't already open.
    if (ref.current?.open === false && open) {
      ref.current?.showModal();
    }
  });

  const closeModal = () => {
    ref.current?.close();
    onClose?.();
  };

  const handleClose = (event: MouseEvent<HTMLDialogElement>) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const isInDialog =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (!isInDialog) {
        closeModal();
      }
    }
  };

  return (
    <StyledDialog ref={ref} onClick={handleClose}>
      <CloseButton type="button" onClick={closeModal}>
        ✕
      </CloseButton>
      {children}
    </StyledDialog>
  );
}
