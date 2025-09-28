"use client";

import { useCallback, useEffect, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { ArrowTd, HeadRow, Rows } from "./components";

export default function GroupedRows({
  medal,
  head,
  children,
}: {
  medal?: React.ReactNode;
  head: React.ReactNode;
  children: React.ReactNode;
}) {
  const [contentElem, setContentElem] = useState<HTMLDivElement | null>(null);
  const [opened, setOpened] = useState(true);

  const contentRef = useCallback((node: HTMLDivElement | null) => {
    console.log("ok", node);
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
