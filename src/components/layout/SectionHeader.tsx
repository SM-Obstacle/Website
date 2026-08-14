import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Title of a panel, with an optional link to the full page of that section. */
export default function SectionHeader({
  title,
  href,
  linkLabel = "See more",
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

      {href && (
        <Button
          asChild
          size="sm"
          className="group shrink-0 rounded-full border border-[#152A48] bg-linear-[-75deg,#152A48,#275087] text-base text-white transition-colors hover:border-black hover:bg-linear-[-75deg,black,#152A48] active:border-white"
        >
          <Link href={href}>
            {linkLabel}
            <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      )}
    </div>
  );
}
