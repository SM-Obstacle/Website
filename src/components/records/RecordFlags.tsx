import { Check, CircleHelp, X } from "lucide-react";

import { SubPanel } from "@/components/layout/Panel";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type FlagState,
  RECORD_FLAGS,
  type RecordFlag,
  readRecordFlag,
} from "@/lib/record-flags";
import { cn } from "@/lib/utils";

/**
 * Nothing here is a verdict: a respawn bug is a fault where PvP weapons are
 * only a setting, so the three states are told apart by their mark and by how
 * loudly they are set, never by a colour that would judge them.
 */
const STATES = {
  on: { icon: Check, label: "Yes", className: "text-foreground" },
  off: { icon: X, label: "No", className: "text-muted-foreground" },
  unknown: {
    icon: CircleHelp,
    label: "Unknown",
    className: "text-muted-foreground",
  },
} satisfies Record<
  FlagState,
  {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    className: string;
  }
>;

function FlagValue({ state }: { state: FlagState }) {
  const { icon: Icon, label, className } = STATES[state];

  return (
    <span className={cn("flex items-center gap-1 text-sm font-bold", className)}>
      <Icon className="size-3.5 shrink-0" />
      {label}
    </span>
  );
}

function FlagRow({ flag, flags }: { flag: RecordFlag; flags?: number }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-inset bg-card px-2.5 py-1.5">
      <dt className="text-xs text-muted-foreground">{flag.label}</dt>
      <dd>
        {flags === undefined ? (
          <Skeleton className="h-5 w-16" />
        ) : (
          <FlagValue state={readRecordFlag(flags, flag)} />
        )}
      </dd>
    </div>
  );
}

/**
 * The flags the record carries. The labels are known before the record is, so
 * loading only blanks the values — the panel keeps its height either way.
 */
export default function RecordFlags({ flags }: { flags?: number }) {
  return (
    // Sized against the container for the same reason the stats above it are:
    // the side panel is narrow on the screens a window query calls wide, and
    // only the dialog is ever wide enough for two columns of these.
    <SubPanel className="@container shrink-0 gap-3 bg-sunken px-3 py-4">
      <h3 className="m-0 px-2 text-base font-bold">Flags</h3>

      <dl className="grid gap-1.5 @sm:grid-cols-2">
        {RECORD_FLAGS.map((flag) => (
          <FlagRow key={flag.label} flag={flag} flags={flags} />
        ))}
      </dl>
    </SubPanel>
  );
}
