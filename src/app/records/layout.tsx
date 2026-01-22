import PageBase from "@/components/ui/organisms/PageBase";
import Block from "@/components/ui/organisms/Block";
import { H1 } from "@/components/ui/atoms/typography";
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
          gridGap: "token(spacing.2)",
          maxW: "calc(token(sizes.maxContentWidth) + var(--filter-width))",
          margin: "auto",
          height: "100%",
        })}
      >
        <RecordsFilter />
        <div className={css({ flexGrow: 1, height: "100%" })}>
          <Block
            className={css({
              height: "100%",
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
