"use client";

import useSelectPlayer from "@/hooks/select-player";
import { Box, styled } from "../../../../../styled-system/jsx";
import { MouseEvent, PropsWithChildren, useEffect, useRef } from "react";

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

export default function Dialog({ login, children }: { login: string } & PropsWithChildren) {
  const selectPlayer = useSelectPlayer(login);
  const ref = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    // Somehow the modal may be already opened on some frame
    if (!ref.current?.open) {
      ref.current?.showModal();
    }
  });

  const closeModal = () => {
    ref.current?.close();
    // will unselect them
    selectPlayer();
  }

  const handleClose = (event: MouseEvent<HTMLDialogElement>) => {
    const rect = ref.current!.getBoundingClientRect();
    const isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
    if (!isInDialog) {
      closeModal();
    }
  };

  return (
    <StyledDialog ref={ref} onClick={handleClose}>
      <CloseButton type="button" onClick={closeModal}>✕</CloseButton>
      <Box display="flex" flexDirection="column" height="100%">
        {children}
      </Box>
    </StyledDialog>
  );
}