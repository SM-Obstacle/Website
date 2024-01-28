import type { Metadata } from "next";
import "./styles.css";
import {
  forkawesomeManiaicons,
  kenneyIcons,
  lato,
} from "./fonts";
import Navigation from "@/components/Navigation";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Obstacle Leaderboards",
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
