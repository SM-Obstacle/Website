import type { Metadata } from "next";
import "./styles.css";
import {
  forkawesomeManiaicons,
  kenneyIcons,
  lato,
} from "./fonts";
import Navigation from "@/components/Navigation";
import NextTopLoader from "nextjs-toploader";

export const revalidate = 60;

export const metadata: Metadata = {
  title: {
    default: "Obstacle Leaderboards",
    template: "Obstacle Leaderboards - %s",
  },
  icons: "/img/favicon.ico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lato.variable} ${kenneyIcons.variable} ${forkawesomeManiaicons.variable}`}
    >
      <body>
        <NextTopLoader height={2} showSpinner={false} />
        <Navigation />

        <div id="main_wrapper">
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
