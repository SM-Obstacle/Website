import WithDetailAside from "@/components/layout/WithDetailAside";
import RecordAside from "./RecordAside";

/**
 * Wraps a page whose lists select records: the selected one takes a column of
 * its own beside the page. See `WithDetailAside` for `centered`.
 */
export default function WithRecordAside({
  centered,
  children,
}: React.PropsWithChildren<{ centered?: boolean }>) {
  return (
    <WithDetailAside centered={centered} aside={<RecordAside />}>
      {children}
    </WithDetailAside>
  );
}
