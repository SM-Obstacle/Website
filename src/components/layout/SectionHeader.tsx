import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * The "there is more of this elsewhere" button. It sits beside a section's
 * title most of the time, and at the foot of the panels too narrow to hold a
 * title and a button on one line.
 */
export function SectionLink({
  href,
  label = "See more",
  compact = false,
  className,
}: {
  href: string;
  label?: React.ReactNode;
  /** Down to the arrow alone on phones, for the panels sharing a row. */
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      // The label is hidden outright on phones, so it has to name the link.
      aria-label={compact && typeof label === "string" ? label : undefined}
      // Mobile-first on purpose: Tailwind compiles `max-sm:` to
      // `@media not (min-width: …)`, which iOS Safari ignores.
      className={buttonVariants({
        className: cn(
          "group shrink-0 rounded-full! border border-cta-from bg-linear-[-75deg,var(--cta-from),var(--cta-to)] text-base text-cta-foreground transition-[filter,border-color] hover:brightness-90 active:border-cta-foreground",
          compact && "aspect-square px-0 sm:aspect-auto sm:px-2.5",
          className,
        ),
      })}
    >
      <span className={cn(compact && "hidden sm:inline")}>{label}</span>
      <ArrowRight className="transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

/** Title of a panel, with an optional link to the full page of that section. */
export default function SectionHeader({
  title,
  shortTitle,
  href,
  linkLabel,
  className,
}: {
  title: React.ReactNode;
  /** Shown instead of `title` on phones, where the panel is too narrow. */
  shortTitle?: React.ReactNode;
  href?: string;
  linkLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-2", className)}>
      <h2 className="m-0 min-w-0 truncate text-lg font-extrabold sm:text-xl">
        {shortTitle ? (
          <>
            <span className="sm:hidden">{shortTitle}</span>
            <span className="hidden sm:inline">{title}</span>
          </>
        ) : (
          title
        )}
      </h2>

      {href && (
        <SectionLink href={href} label={linkLabel} compact={!!shortTitle} />
      )}
    </div>
  );
}
