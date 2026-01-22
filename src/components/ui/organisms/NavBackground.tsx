"use client";

import HiddenCheckbox from "@/components/navigation/HiddenCheckbox";
import { useRef } from "react";
import { css } from "../../../../@shadow-panda/styled-system/css";

export default function NavBackground({
  checkboxName,
}: {
  checkboxName: string;
}) {
  const ref = useRef<HTMLInputElement>(null);

  const onNavClick = () => {
    if (ref.current?.checked) {
      ref.current.checked = false;
    }
  };

  return (
    <>
      <HiddenCheckbox name={checkboxName} ref={ref} />
      <div
        onClick={onNavClick}
        className={css({
          position: "fixed",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          zIndex: 500,
          opacity: 0.7,
          md: {
            display: "none",
          },
        })}
      >
        <div
          className={css({
            width: "100%",
            height: "100%",
            bgColor: "black",
            animation: "opacityAnimation .3s",
          })}
        ></div>
      </div>
    </>
  );
}
