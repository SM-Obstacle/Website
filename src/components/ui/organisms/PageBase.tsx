import HiddenCheckbox from "@/components/navigation/HiddenCheckbox";
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
        <TitleBar
          checkboxName={CHECKBOX_NAME}
          segments={titleSegments}
          gridRow={1}
          gridColumn="2 / -1"
        />
        <div
          className={css({
            height: "100%",
          })}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
