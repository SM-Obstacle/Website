import { SubBlock } from "@/components/ui/Block";
import { css } from "../../../@shadow-panda/styled-system/css";
import PaginationButtons from "./PaginationButtons";

export default function Loading() {
  return (
    <>
      <SubBlock
        className={css({
          height: "100%",
        })}
      ></SubBlock>
      <SubBlock>
        <PaginationButtons
          pageInfo={{
            hasNextPage: false,
            hasPreviousPage: false,
          }}
        />
      </SubBlock>
    </>
  );
}
