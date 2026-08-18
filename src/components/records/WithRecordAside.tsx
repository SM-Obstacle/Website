import WithDetailAside from "@/components/layout/WithDetailAside";
import RecordAside from "./RecordAside";

/**
 * Wraps a page whose lists select records: the selected one takes a column of
 * its own beside the page.
 */
export default function WithRecordAside({ children }: React.PropsWithChildren) {
  return <WithDetailAside aside={<RecordAside />}>{children}</WithDetailAside>;
}
