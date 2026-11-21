import { cn } from "@/lib/utils";

/** A labelled figure, as shown in the summary row of the detail dialogs. */
export default function Stat({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-xs text-muted-foreground">{label}</span>
      <code className={cn("text-lg font-bold", className)}>{value}</code>
    </div>
  );
}
