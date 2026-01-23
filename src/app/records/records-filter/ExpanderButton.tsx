"use client";

import { Button } from "@/components/ui/molecules/Button";
import { css } from "../../../../@shadow-panda/styled-system/css";
import { FaChevronRight } from "react-icons/fa";
import { useExpander } from "./ExpanderContext";
import { FaChevronDown } from "react-icons/fa6";

export default function ExpanderButton() {
  const { isExpanded, setIsExpanded } = useExpander();

  return (
    <Button
      size="icon"
      onClick={() => setIsExpanded(!isExpanded)}
      className={css({
        rounded: "full",
        position: "relative",
        right: "calc(-1 * token(spacing.2))",
        bgColor: "black",
        color: "white",
        transition: "background-color .1s",
        _hover: { bgColor: "#222" },
      })}
    >
      {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
    </Button>
  );
}
