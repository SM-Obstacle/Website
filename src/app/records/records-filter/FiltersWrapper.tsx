"use client";

import Block from "@/components/ui/organisms/Block";
import { css } from "../../../../@shadow-panda/styled-system/css";
import { H2 } from "@/components/ui/atoms/typography";
import ExpanderButton from "./ExpanderButton";
import { Ref, RefObject } from "react";
import { useExpander } from "./ExpanderContext";

export default function FiltersWrapper({ children }: React.PropsWithChildren) {
  const { ref } = useExpander();

  return (
    <Block
      ref={ref as Ref<HTMLDivElement | null>}
      className={css({
        display: "flex",
        flexDir: "column",
        gap: "token(spacing.2)",
        height: "calc(token(sizes.logoSize) + token(spacing.2) * 2)",
        overflow: "hidden",
        "&[data-expanded]": {
          height: "100%",
        },
        lg: {
          height: "revert",
          overflow: "revert",
        },
      })}
      titleBar={
        <H2
          className={css({
            fontWeight: "extrabold",
            height: "token(sizes.logoSize)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",

            lg: {
              display: "revert",
              height: "calc(token(sizes.logoSize) / 1.5)",
            },
          })}
        >
          <div
            className={css({
              display: "flex",
              gap: "token(spacing.4)",
            })}
          >
            <span>Filters</span>
            <code
              className={css({
                bgColor: "#0007",
                rounded: "md",
                lg: { display: "none" },
                "[data-expanded] &": {
                  display: "none",
                },
              })}
            >
              ...
            </code>
          </div>
          <div
            className={css({
              lg: {
                display: "none",
              },
            })}
          >
            <ExpanderButton />
          </div>
        </H2>
      }
    >
      {children}
    </Block>
  );
}
