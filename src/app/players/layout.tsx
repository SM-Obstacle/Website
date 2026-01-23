import PageBase from "@/components/ui/organisms/PageBase";
import Block from "@/components/ui/organisms/Block";
import { H1 } from "@/components/ui/atoms/typography";
import { css } from "../../../@shadow-panda/styled-system/css";
import PlayersFilter from "./PlayersFilter";

export default function PlayersLayout({ children }: LayoutProps<"/players">) {
  return (
    <PageBase titleSegments={[<H1>Players</H1>]} selectedMenu="players">
      <div
        className={css({
          "--filter-width": "19rem",
          display: "grid",
          gridTemplateRows: "auto 1fr",
          gridGap: "token(spacing.2)",
          maxW: "calc(token(sizes.maxContentWidth) + var(--filter-width))",
          margin: "auto",
          height: "100%",
          lg: {
            gridTemplateRows: "none",
            gridTemplateColumns: "var(--filter-width) auto",
          },
        })}
      >
        <PlayersFilter />
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
