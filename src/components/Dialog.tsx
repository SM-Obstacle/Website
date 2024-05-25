"use client";

import useSelectPlayer from "@/hooks/select-player";
import { ForwardedRef, MouseEvent, MutableRefObject, PropsWithChildren, forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { Box, styled } from "../../styled-system/jsx";
import { isArrowFunction } from "typescript";

const StyledDialog = styled("dialog", {
  base: {
    _backdrop: {
      bgColor: "#00000077",
    },
    bgColor: "#111",
    color: "white",
    width: "75%",
    border: "solid #222 1px",
    height: "75%",
    animation: "dropdownContentWrapperTransition .2s",
    borderRadius: "10px",
    overflowY: "hidden",
    p: 0,

    "@media only screen and (max-width: 870px)": {
      height: "calc(100% - 60px)",
      width: "calc(100% - 60px)",
    }
  }
});

const CloseButton = styled("button", {
  base: {
    position: "absolute",
    top: 3,
    right: 3,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    border: "solid black 2px",
    padding: 1,
    fontSize: "25px",
    width: 10,
    height: 10,
    bgColor: "#222",
    color: "white",
    transition: "border-color .2s, color .2s",
    zIndex: 1000,

    "&:hover, &:focus": {
      borderColor: "#d24f4f",
      cursor: "pointer",
    },
  }
});

function DialogInner({
  open = true,
  onClose,
  forwardedRef,
  children,
}: {
  open?: boolean,
  onClose?: () => void,
  forwardedRef: MutableRefObject<HTMLDialogElement | null>,
} & PropsWithChildren) {
  useEffect(() => {
    // Somehow the modal may be already opened on some frame
    if (!forwardedRef.current?.open && open) {
      forwardedRef.current?.showModal();
    }
  });

  const closeModal = () => {
    forwardedRef.current?.close();
    onClose && onClose();
  }

  const handleClose = (event: MouseEvent<HTMLDialogElement>) => {
    const rect = forwardedRef.current!.getBoundingClientRect();
    const isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
    if (!isInDialog) {
      closeModal();
    }
  };

  return (
    <StyledDialog ref={forwardedRef} onClick={handleClose}>
      <CloseButton type="button" onClick={closeModal}>✕</CloseButton>
      <Box display="flex" flexDirection="column" height="100%">
        {children}
      </Box>
    </StyledDialog>
  );
}

const Dialog = forwardRef<HTMLDialogElement | null, Omit<React.ComponentProps<typeof DialogInner>, "forwardedRef">>((props, ref) => {
  const innerRef = useRef<HTMLDialogElement | null>(null);
  useImperativeHandle(ref, () => innerRef.current!, []);
  return (
    <DialogInner {...props} forwardedRef={innerRef} />
  )
});

export default Dialog;