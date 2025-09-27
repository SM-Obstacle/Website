"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { css } from "../../../styled-system/css";

export default function HiddenCheckbox({ name }: { name: string }) {
  const ref = useRef<HTMLInputElement>(null);
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
          "&:not(:checked) ~ ul": {
            overflow: "hidden",
            maxHeight: 0,
            padding: 0,
          },
        },
      })}
      type="checkbox"
      id={name}
      name={name}
    />
  );
}
