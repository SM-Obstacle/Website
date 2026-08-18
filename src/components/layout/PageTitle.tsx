import { cn } from "@/lib/utils";

/** Heading used for the segments of the floating title bar. */
export default function PageTitle({
  className,
  ...props
}: React.ComponentProps<"h1">) {
  return <h1 className={cn("m-0 text-3xl", className)} {...props} />;
}
