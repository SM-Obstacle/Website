import { styled } from "../../styled-system/jsx";
import Link from "./Link";
import { css } from "../../styled-system/css";

export const LastUpdate = styled("span", {
  base: {
    position: "sticky",
    top: 0,
  }
});

export const Article = styled("div", {
  base: {
    p: 5,
    gap: 2,
    position: "relative",
    display: "flex",
    flexDir: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    overflowY: "auto",

    "@media only screen and (max-width: 870px)": {
      flexDir: "column",
    }
  }
});

export const MdLink = (props: React.ComponentProps<'a'>) => (
  <Link {...props as React.ComponentProps<typeof Link>} explicit />
);

export const MdImg = (props: React.ComponentProps<'img'>) => (
  <img {...props} className={css({ maxWidth: "100%" })} />
)

export const MdIframe = (props: React.ComponentProps<'iframe'>) => (
  <iframe {...props} className={css({ maxWidth: "100%" })} />
)