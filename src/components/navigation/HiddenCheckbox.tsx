"use client";

import { usePathname } from "next/navigation";
import { RefObject, useEffect, useRef } from "react";
import { css } from "../../../@shadow-panda/styled-system/css";

export default function HiddenCheckbox({
  name,
  ref,
}: {
  name: string;
  ref: RefObject<HTMLInputElement | null>;
}) {
  const pathname = usePathname();

  // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  useEffect(() => {
    if (ref.current?.checked) {
      ref.current.checked = false;
    }
  }, [pathname, ref]);

  return (
    <input
      ref={ref}
      className={css({
        display: "none",
        "@media only screen and (max-width: 870px)": {
          "&:not(:checked) ~ .__mainNav": {
            display: "block",
          },
        },
      })}
      type="checkbox"
      id={name}
      name={name}
    />
  );
}
