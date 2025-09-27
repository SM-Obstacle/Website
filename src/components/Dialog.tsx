"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { styled } from "../../styled-system/jsx";
import { DialogInner } from "./DialogInner";

export const StyledDialog = styled("dialog", {
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
    },
  },
});

export const CloseButton = styled("button", {
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
  },
});

const Dialog = forwardRef<
  HTMLDialogElement | null,
  Omit<React.ComponentProps<typeof DialogInner>, "forwardedRef">
>((props, ref) => {
  const innerRef = useRef<HTMLDialogElement | null>(null);
  useImperativeHandle(ref, () => innerRef.current, []);
  return <DialogInner {...props} forwardedRef={innerRef} />;
});
Dialog.displayName = "DialogInner";

export default Dialog;
