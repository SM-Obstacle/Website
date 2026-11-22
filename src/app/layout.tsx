import type { Metadata, Viewport } from "next";
import Script from "next/script";
import NextTopLoader from "nextjs-toploader";

import ToolbarBleed from "@/components/layout/ToolbarBleed";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ApolloWrapper } from "./ApolloWrapper";
import { forkawesomeManiaicons, kenneyIcons, lato } from "./fonts";
import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";

// Tints the browser's own chrome, so it follows the theme along with the page.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Lets the page (and so the background photo) run under iOS Safari's
  // floating toolbar instead of stopping above it on a solid bar. The shell
  // pads itself by the safe-area insets to keep its content clear.
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f5f6" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1c1e" },
  ],
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
      className={cn(
        lato.variable,
        kenneyIcons.variable,
        forkawesomeManiaicons.variable,
      )}
      suppressHydrationWarning
    >
      <body>
        {/* Runtime config (API URL) for the browser, see src/app/env.js/route.ts */}
        <Script src="/env.js" strategy="beforeInteractive" />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ApolloWrapper>
            <TooltipProvider delayDuration={300}>
              <NextTopLoader height={2} showSpinner={false} color="#346ab4" />
              <ToolbarBleed />
              {children}
            </TooltipProvider>
          </ApolloWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
