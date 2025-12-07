import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { Button } from "@/components/ui/Button";
import { css } from "../../../@shadow-panda/styled-system/css";
import NonOverwritingForm from "./NonOverwritingForm";

export interface PageButtonsInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor?: string | null;
  endCursor?: string | null;
}

export default function PaginationButtons({
  pageInfo,
}: {
  pageInfo: PageButtonsInfo;
}) {
  const isPreviousPageEnabled =
    pageInfo.hasPreviousPage &&
    pageInfo.startCursor !== undefined &&
    pageInfo.startCursor !== null;

  const isNextPageEnabled =
    pageInfo.hasNextPage &&
    pageInfo.endCursor !== undefined &&
    pageInfo.endCursor !== null;

  return (
    <div
      className={css({
        display: "flex",
        flexDir: "row",
        gap: "token(spacing.2)",
        justifyContent: "center",
        alignItems: "center",
        padding: "token(spacing.3)",
        margin: "auto",
      })}
    >
      <NonOverwritingForm action="/records" keysToRemove={["after", "first"]}>
        <input type="hidden" name="last" value="50" />
        {isPreviousPageEnabled ? (
          <>
            {/** biome-ignore lint/style/noNonNullAssertion: startCursor can't be null at this point */}
            <input type="hidden" name="before" value={pageInfo.startCursor!} />
            <Button rounded="full" type="submit">
              <FaArrowLeft />
            </Button>
          </>
        ) : (
          <Button rounded="full" type="submit" disabled>
            <FaArrowLeft />
          </Button>
        )}
      </NonOverwritingForm>
      <NonOverwritingForm action="/records" keysToRemove={["before", "last"]}>
        <input type="hidden" name="first" value="50" />
        {isNextPageEnabled ? (
          <>
            {/** biome-ignore lint/style/noNonNullAssertion: endCursor can't be null at this point */}
            <input type="hidden" name="after" value={pageInfo.endCursor!} />
            <Button rounded="full" type="submit">
              <FaArrowRight />
            </Button>
          </>
        ) : (
          <Button rounded="full" type="submit" disabled>
            <FaArrowRight />
          </Button>
        )}
      </NonOverwritingForm>
    </div>
  );
}
