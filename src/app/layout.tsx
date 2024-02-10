import type { Metadata } from "next";
import "./styles.css";
import {
  forkawesomeManiaicons,
  kenneyIcons,
  lato,
} from "./fonts";
import Navigation from "@/components/Navigation";
import NextTopLoader from "nextjs-toploader";
import { gql } from "./__generated__";
import { fetchGraphql } from "@/lib/utils";

export const revalidate = 60;

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const events = await fetchGraphql(GET_EVENTS);

  return (
    <html
      lang="en"
      className={`${lato.variable} ${kenneyIcons.variable} ${forkawesomeManiaicons.variable}`}
    >
      <body>
        <NextTopLoader height={2} showSpinner={false} />
        <Navigation events={events} />

        <div id="main_wrapper">
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
