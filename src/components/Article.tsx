import { css } from "../../styled-system/css";
import { styled } from "../../styled-system/jsx";
import Link from "./Link";
import { H1, H2 } from "./ui/typography";

export const LastUpdate = styled("span", {
  base: {
    position: "sticky",
    top: 0,
  },
});

export const Article = styled("div", {
  base: {
    gap: 2,
    position: "relative",
    display: "flex",
    flexDir: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",

    "@media only screen and (max-width: 870px)": {
      flexDir: "column",
    },
  },
});

export const MdH1 = (props: React.ComponentProps<"h1">) => <H1 {...props} />;
export const MdH2 = (props: React.ComponentProps<"h1">) => <H2 {...props} />;

export const MdLink = (props: React.ComponentProps<"a">) => (
  <Link {...(props as React.ComponentProps<typeof Link>)} explicit />
);

export const MdImg = (props: React.ComponentProps<"img">) => (
  // biome-ignore lint/a11y/useAltText: The alt text is provided by the caller.
  // biome-ignore lint/performance/noImgElement: The img element is used in a Markdown context.
  <img {...props} className={css({ maxWidth: "100%" })} />
);

export const MdIframe = (props: React.ComponentProps<"iframe">) => (
  <iframe {...props} className={css({ maxWidth: "100%" })} />
);
