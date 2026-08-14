import NextLink from "next/link";

import { cn } from "@/lib/utils";

export type LinkProps = React.ComponentProps<typeof NextLink> & {
  /** Renders the link visibly, for prose where it must stand out. */
  explicit?: boolean;
};

export default function Link({ className, explicit, ...props }: LinkProps) {
  return (
    <NextLink
      className={cn(
        "text-inherit no-underline",
        explicit && "text-link hover:underline",
        className,
      )}
      {...props}
    />
  );
}
