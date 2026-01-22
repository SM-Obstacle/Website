import type { Metadata, Viewport } from "next";
import NextTopLoader from "nextjs-toploader";
import { ApolloWrapper } from "./ApolloWrapper";
import { forkawesomeManiaicons, kenneyIcons, lato } from "./fonts";
import "@/styles/globals.css";
import { css } from "../../@shadow-panda/styled-system/css";

export const viewport: Viewport = {
  themeColor: "#060503",
};

export const metadata: Metadata = {
  title: {
    default: "Obstacle Leaderboards",
    template: "Obstacle Leaderboards - %s",
  },
  icons: "/img/favicon.ico",
};

const bodyHtmlCommonStyles = css.raw({
  margin: 0,
  height: "100%",
  minWidth: "390px",
  minHeight: "390px",

  fontWeight: 400,
  fontFamily:
    'var(--lato), "Trebuchet MS", sans-serif, var(--forkAwesome), var(--kenneyIcons)',
  color: "white",
  overflow: "overlay",
});

const bodyStyles = css(
  bodyHtmlCommonStyles,
  css.raw({
    backgroundImage: 'url("/img/background.jpg")',
    backgroundAttachment: "fixed",
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",

    display: "flex",
    flexDir: "column",
    // TODO: keep
    // overflow: "hidden",
  }),
);

const htmlStyles = css(
  bodyHtmlCommonStyles,
  css.raw({
    "@media only screen and (max-width: 420px)": {
      zoom: 0.8,
    },
    "@media only screen and (max-width: 320px)": {
      zoom: 0.6,
    },
  }),
);

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lato.variable} ${kenneyIcons.variable} ${forkawesomeManiaicons.variable} ${htmlStyles} dark`}
    >
      <body className={bodyStyles}>
        <ApolloWrapper>
          <NextTopLoader height={2} showSpinner={false} color="#346ab4" />
          {children}
        </ApolloWrapper>
      </body>
    </html>
  );
}
