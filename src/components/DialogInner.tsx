"use client";
import {
  type MouseEvent,
  type PropsWithChildren,
  type RefObject,
  useEffect,
} from "react";
import { Box } from "../../styled-system/jsx";
import { CloseButton, StyledDialog } from "./Dialog";

export function DialogInner({
  open = true,
  onClose,
  forwardedRef,
  children,
}: {
  open?: boolean;
  onClose?: () => void;
  forwardedRef: RefObject<HTMLDialogElement | null>;
} & PropsWithChildren) {
  useEffect(() => {
    // Somehow the modal may be already opened on some frame
    if (!forwardedRef.current?.open && open) {
      forwardedRef.current?.showModal();
    }
  });

  const closeModal = () => {
    forwardedRef.current?.close();
    onClose?.();
  };

  const handleClose = (event: MouseEvent<HTMLDialogElement>) => {
    if (forwardedRef.current) {
      const rect = forwardedRef.current.getBoundingClientRect();
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
    <StyledDialog ref={forwardedRef} onClick={handleClose}>
      <CloseButton type="button" onClick={closeModal}>
        ✕
      </CloseButton>
      <Box display="flex" flexDirection="column" height="100%">
        {children}
      </Box>
    </StyledDialog>
  );
}
