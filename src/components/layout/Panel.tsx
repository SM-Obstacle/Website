import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * The translucent rounded shell every page section sits in.
 *
 * `Panel` is the outer block; `SubPanel` is the surface it holds — tables,
 * leaderboards, filter groups. A `SubPanel` sits one `inset` inside its
 * `Panel` and is rounded one step less, so the two curves stay concentric.
 * Anything nested a step further down uses `rounded-inset`.
 */
export function Panel({
  className,
  header,
  children,
  ...props
}: React.ComponentProps<typeof Card> & { header?: React.ReactNode }) {
  return (
    <Card
      className={cn(
        "gap-inset rounded-block border-0 bg-card p-inset shadow-none backdrop-blur-sm",
        className,
      )}
      {...props}
    >
      {header && <div className="w-full px-3">{header}</div>}
      {children}
    </Card>
  );
}

export function SubPanel({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  return (
    <Card
      className={cn(
        "gap-inset overflow-hidden rounded-panel border-0 bg-card p-0 shadow-none",
        className,
      )}
      {...props}
    />
  );
}
