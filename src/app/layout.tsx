import type { Metadata, Viewport } from "next";
import NextTopLoader from "nextjs-toploader";
import Navigation from "@/components/Navigation";
import { styled } from "../../styled-system/jsx";
import { gql } from "./__generated__";
import { query } from "./ApolloClient";
import { ApolloWrapper } from "./ApolloWrapper";
import { forkawesomeManiaicons, kenneyIcons, lato } from "./fonts";
import "./globals.css";
import { css } from "../../styled-system/css";

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

const GET_EVENTS = gql(/* GraphQL */ `
  query GetEventList {
    events {
      handle
      lastEdition {
        id
      }
    }
  }
`);

const MainWrapper = styled("div", {
  base: {
    maxHeight: "calc(100% - 51px)",
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

const Main = styled("main", {
  base: {
    height: "85%",
    width: "80%",
    maxHeight: "85%",
    maxWidth: "70em",
    position: "relative",

    display: "flex",
    flexDirection: "column",

    borderRadius: "10px",
    backgroundColor: "#000000dd",

    overflowY: "auto",

    "@media only screen and (max-width: 870px)": {
      height: "calc(100% - 14px)",
      width: "calc(100% - 4px)",
      maxHeight: "100%",
      maxWidth: "100%",
    },
  },
});

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
    overflow: "hidden",
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
  const events = await query({ query: GET_EVENTS });
  const filteredEvents = {
    ...events,
    events: events.data?.events.filter((event) => event.lastEdition) ?? [],
  };

  return (
    <html
      lang="en"
      className={`${lato.variable} ${kenneyIcons.variable} ${forkawesomeManiaicons.variable} ${htmlStyles}`}
    >
      <body className={bodyStyles}>
        <ApolloWrapper>
          <NextTopLoader height={2} showSpinner={false} color="#346ab4" />
          <Navigation events={filteredEvents} />

          <MainWrapper>
            <Main>{children}</Main>
          </MainWrapper>
        </ApolloWrapper>
      </body>
    </html>
  );
}
