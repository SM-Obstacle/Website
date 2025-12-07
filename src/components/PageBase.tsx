import { css } from "../../@shadow-panda/styled-system/css";
import NavigationSideBar from "./NavigationSideBar";
import TitleBar from "./TitleBar";

export default function PageBase({
  selectedMenu,
  titleSegments,
  children,
}: React.PropsWithChildren<{
  titleSegments: React.ComponentProps<typeof TitleBar>["segments"];
  selectedMenu: React.ComponentProps<typeof NavigationSideBar>["selected"];
}>) {
  return (
    <div
      className={css({
        "--pad": "token(spacing.2)",
        padding: "var(--pad)",
        display: "flex",
        height: "100%",
        flexDir: "row",
        gap: "token(spacing.2)",
        maxHeight: "calc(100vh - var(--pad) * 2)",
      })}
    >
      <NavigationSideBar selected={selectedMenu} />
      <div
        className={css({
          flexGrow: 1,
          display: "flex",
          flexDir: "column",
          gap: "token(spacing.2)",
        })}
      >
        <TitleBar segments={titleSegments} />
        <div
          className={css({
            flexGrow: 1,
          })}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
