"use client";

import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Td, Tr } from "@/components/Table";
import { styled } from "../../../../../styled-system/jsx";

const HeadRow = styled(Tr, {
  base: {
    position: "sticky!",
    top: 0,
    justifyContent: "flex-start",
    borderBottom: "solid black 2px",
    zIndex: 2000,

    _hover: {
      cursor: "pointer",
    },
  },
});

const Rows = styled("div", {
  base: {
    overflowY: "hidden",
    transition: "max-height .2s",
  },
});

const ArrowTd = styled(Td, {
  base: {
    flex: 0.1,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});

export default function GroupedRows({
  head,
  medal,
  children,
}: {
  head: React.ReactNode;
  medal?: React.ReactNode;
} & PropsWithChildren) {
  const [contentElem, setContentElem] = useState<HTMLDivElement | null>(null);
  const [opened, setOpened] = useState(true);

  const contentRef = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      setContentElem(node);
    }
  }, []);

  const toggleOpen = () => {
    setOpened(!opened);
    if (contentElem) {
      if (!opened) {
        contentElem.style.maxHeight = `${contentElem.scrollHeight}px`;
      } else {
        contentElem.style.maxHeight = "1px";
      }
    }
  };

  useEffect(() => {
    if (contentElem) {
      contentElem.style.maxHeight = `${contentElem.scrollHeight}px`;
    }
  }, [contentElem]);

  return (
    <div>
      <HeadRow onClick={toggleOpen}>
        {head}
        {medal && <ArrowTd>{medal}</ArrowTd>}
        <ArrowTd>{opened ? <IoIosArrowDown /> : <IoIosArrowUp />}</ArrowTd>
      </HeadRow>
      <Rows ref={contentRef}>{children}</Rows>
    </div>
  );
}
