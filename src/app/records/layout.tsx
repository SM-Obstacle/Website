import PageBase from "@/components/PageBase";
import Block from "@/components/ui/Block";
import { H1 } from "@/components/ui/typography";
import { css } from "../../../@shadow-panda/styled-system/css";
import RecordsFilter from "./RecordsFilter";

export default function RecordsLayout({ children }: LayoutProps<"/records">) {
  return (
    <PageBase
      titleSegments={[<H1 key="title">Records</H1>]}
      selectedMenu="records"
    >
      <div
        className={css({
          "--filter-width": "15rem",
          display: "grid",
          gridTemplateColumns: "var(--filter-width) auto",
          gridGap: 3,
          maxW: "calc(token(sizes.maxContentWidth) + var(--filter-width))",
          margin: "auto",
          height: "100%",
        })}
      >
        <RecordsFilter />
        <div className={css({ flexGrow: 1, height: "100%" })}>
          <Block
            className={css({
              height: "calc(100% - var(--pad) * 2)",
            })}
          >
            <div
              className={css({
                display: "flex",
                flexDir: "column",
                gap: "token(spacing.2)",
                height: "100%",
              })}
            >
              {children}
            </div>
          </Block>
        </div>
      </div>
    </PageBase>
  );
}
