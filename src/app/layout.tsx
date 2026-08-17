import type { Metadata, Viewport } from "next";
import NextTopLoader from "nextjs-toploader";

import { TooltipProvider } from "@/components/ui/tooltip";
import { ApolloWrapper } from "./ApolloWrapper";
import { forkawesomeManiaicons, kenneyIcons, lato } from "./fonts";
import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${lato.variable} ${kenneyIcons.variable} ${forkawesomeManiaicons.variable}`}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <ApolloWrapper>
            <TooltipProvider delayDuration={300}>
              <NextTopLoader height={2} showSpinner={false} color="#346ab4" />
              {children}
            </TooltipProvider>
          </ApolloWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
