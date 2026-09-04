import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * The "there is more of this elsewhere" button. It sits beside a section's
 * title most of the time, and at the foot of the panels too narrow to hold a
 * title and a button on one line.
 */
export function SectionLink({
  href,
  label = "See more",
  className,
}: {
  href: string;
  label?: React.ReactNode;
  className?: string;
}) {
  return (
    <Button
      asChild
      size="sm"
      // Hover darkens the whole button rather than swapping in a second
      // gradient, so the two themes need one pair of stops between them.
      className={cn(
        "group shrink-0 rounded-full border border-cta-from bg-linear-[-75deg,var(--cta-from),var(--cta-to)] text-base text-cta-foreground transition-[filter,border-color] hover:brightness-90 active:border-cta-foreground",
        className,
      )}
    >
      <Link href={href}>
        {label}
        <ArrowRight className="transition-transform group-hover:translate-x-1" />
      </Link>
    </Button>
  );
}

/** Title of a panel, with an optional link to the full page of that section. */
export default function SectionHeader({
  title,
  href,
  linkLabel,
  className,
}: {
  title: React.ReactNode;
  href?: string;
  linkLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-2", className)}>
      <h2 className="m-0 truncate text-xl font-extrabold">{title}</h2>

      {href && <SectionLink href={href} label={linkLabel} />}
    </div>
  );
}
