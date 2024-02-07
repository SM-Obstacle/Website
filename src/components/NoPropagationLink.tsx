"use client";

import Link, { LinkProps } from "next/link";
import { PropsWithChildren } from "react";

export default function NoPropagationLink({
  children,
  ...rest
}: PropsWithChildren & LinkProps) {
  return (
    <Link {...rest} onClick={(e) => e.stopPropagation()}>{children}</Link>
  );
}