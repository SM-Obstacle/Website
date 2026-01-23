import { SubBlock } from "@/components/ui/organisms/Block";
import { css } from "../../../@shadow-panda/styled-system/css";
import PaginationButtons from "../../components/ui/organisms/PaginationButtons";

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
          action="/records"
          pageInfo={{
            hasNextPage: false,
            hasPreviousPage: false,
          }}
        />
      </SubBlock>
    </>
  );
}
