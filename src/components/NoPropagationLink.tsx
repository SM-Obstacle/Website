"use client";

import type { PropsWithChildren } from "react";
import Link, { type LinkProps } from "@/components/Link";

export default function NoPropagationLink({
  children,
  ...rest
}: PropsWithChildren & LinkProps) {
  return (
    <Link {...rest} onClick={(e) => e.stopPropagation()}>
      {children}
    </Link>
  );
}
