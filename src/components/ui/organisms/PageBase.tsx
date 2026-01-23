import { css } from "../../../../@shadow-panda/styled-system/css";
import NavigationSideBar from "./NavigationSideBar";
import TitleBar from "./TitleBar";
import NavBackground from "./NavBackground";

const CHECKBOX_NAME = "__nav_checkbox";

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
        display: "flex",
        height: "100%",
        padding: "token(spacing.2)",
      })}
    >
      <div
        className={css({
          display: "none",
          "&:has(:checked)": {
            display: "revert",
          },
          md: {
            display: "revert",
            me: "token(spacing.2)",
          },
        })}
      >
        <NavigationSideBar
          selected={selectedMenu}
          checkboxName={CHECKBOX_NAME}
          className={css({
            pb: "token(spacing.5)",
            position: "absolute",
            zIndex: 1000,
            height: "fit-content",
            animation: "navMenuHorizontalSlide 3s cubic-bezier(.08,.82,.17,1)",
            overflowY: "hidden",
            md: {
              animation: "none",
              position: "revert",
              height: "100%",
              pb: "revert",
            },
          })}
        />
        {/* Background */}
        <NavBackground checkboxName={CHECKBOX_NAME} />
      </div>
      <div
        className={css({
          display: "flex",
          width: "100%",
          height: "100%",
          gap: "token(spacing.2)",
          flexDir: "column",
        })}
      >
        <div
          className={css({
            position: "fixed",
            top: "token(spacing.2)",
            left: "token(spacing.2)",
            zIndex: 1000,
            width: "calc(100% - token(spacing.2) * 2)",
            md: {
              width: "revert",
              position: "revert",
              gridRow: 1,
              gridColumn: "2 / -1",
            },
          })}
        >
          <TitleBar checkboxName={CHECKBOX_NAME} segments={titleSegments} />
          <div
            className={css({
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "calc(token(sizes.logoSize) + token(spacing.2) * 4)",
              mask: "linear-gradient(black, transparent)",
              backdropFilter: "blur(8px)",
              // @ts-expect-error: backdropFilter doesn't expand to the backdrop-filter property
              "backdrop-filter": "blur(8px)",
              zIndex: -1000,
              md: {
                display: "none",
              },
            })}
          ></div>
        </div>
        <div
          className={css({
            height: "100%",
            mt: "calc(token(sizes.logoSize) + token(spacing.2) * 3)",
            md: {
              mt: "revert",
            },
          })}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
