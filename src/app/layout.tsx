import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@/styles/globals.css";
import {
  forkawesomeManiaicons,
  kenneyIcons,
  lato,
} from "./fonts";
import Navigation from "@/components/Navigation";
import NextTopLoader from "nextjs-toploader";
import { gql } from "./__generated__";
import { fetchGraphql } from "@/lib/utils";
import { styled } from "../../styled-system/jsx";

export const viewport: Viewport = {
  themeColor: '#060503',
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
      lastEdition { id }
    }
  }
`);

const MainWrapper = styled('div', {
  base: {
    maxHeight: "calc(100% - 51px)",
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }
});

const Main = styled('main', {
  base: {
    height: "85%",
    width: "80%",
    maxHeight: "85%",
    maxWidth: "70em",

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
    }
  }
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const events = await fetchGraphql(GET_EVENTS);
  const filteredEvents = {
    ...events,
    events: events.events.filter((event) => event.lastEdition),
  };

  return (
    <html
      lang="en"
      className={`${lato.variable} ${kenneyIcons.variable} ${forkawesomeManiaicons.variable}`}
    >
      <body>
        <NextTopLoader height={2} showSpinner={false} color="#346ab4" />
        <Navigation events={filteredEvents} />

        <MainWrapper>
          <Main>
            {children}
          </Main>
        </MainWrapper>
      </body>
    </html>
  );
}
