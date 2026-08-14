"use client";

import Link, { type LinkProps } from "@/components/Link";

/** A link inside a clickable row: keeps the row's own click handler from firing. */
export default function NoPropagationLink(props: LinkProps) {
  return <Link {...props} onClick={(e) => e.stopPropagation()} />;
}
