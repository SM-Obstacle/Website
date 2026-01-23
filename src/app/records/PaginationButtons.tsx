import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { Button } from "@/components/ui/molecules/Button";
import { css } from "../../../@shadow-panda/styled-system/css";
import NonOverwritingForm from "./NonOverwritingForm";

export interface PageButtonsInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor?: string | null;
  endCursor?: string | null;
}

function PaginationButton({
  isDisabled = false,
  children,
}: React.PropsWithChildren<{
  isDisabled?: boolean;
}>) {
  return (
    <Button
      className={css({
        rounded: "full",
        minH: "token(sizes.logoSize)",
        minW: "token(sizes.logoSize)",
        bgColor: "black",
        color: "white",
        transition: "background-color .1s, border-color .1s",
        border: "solid transparent 1px",
        _enabled: {
          bgColor: "#FFF1",
        },
        _active: {
          bgColor: "black",
          borderColor: "white",
        },
      })}
      type="submit"
      disabled={isDisabled}
    >
      {children}
    </Button>
  );
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
            <PaginationButton>
              <FaArrowLeft />
            </PaginationButton>
          </>
        ) : (
          <PaginationButton isDisabled>
            <FaArrowLeft />
          </PaginationButton>
        )}
      </NonOverwritingForm>
      <NonOverwritingForm action="/records" keysToRemove={["before", "last"]}>
        <input type="hidden" name="first" value="50" />
        {isNextPageEnabled ? (
          <>
            {/** biome-ignore lint/style/noNonNullAssertion: endCursor can't be null at this point */}
            <input type="hidden" name="after" value={pageInfo.endCursor!} />
            <PaginationButton>
              <FaArrowRight />
            </PaginationButton>
          </>
        ) : (
          <PaginationButton isDisabled>
            <FaArrowRight />
          </PaginationButton>
        )}
      </NonOverwritingForm>
    </div>
  );
}
