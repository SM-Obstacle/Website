import { MPFormatLink } from "@/components/MPFormat";
import { Skeleton } from "@/components/ui/skeleton";

export default function OfTheWeek({
  path,
  name,
  icon,
}: {
  path: string;
  name: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full items-center justify-center gap-2 p-6 text-center text-4xl font-bold">
      {icon}
      <MPFormatLink className="min-w-0 truncate" path={path}>
        {name}
      </MPFormatLink>
    </div>
  );
}

export function OfTheWeekSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <Skeleton className="h-10 w-2/3" />
    </div>
  );
}
