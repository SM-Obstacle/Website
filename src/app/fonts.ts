import localFont from "next/font/local";

export const lato = localFont({
  src: [
    {
      path: "./fonts/Lato-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "./fonts/Lato-ThinItalic.ttf",
      weight: "100",
      style: "italic",
    },
    {
      path: "./fonts/Lato-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/Lato-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "./fonts/Lato-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Lato-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/Lato-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Lato-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "./fonts/Lato-Black.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/Lato-BlackItalic.ttf",
      weight: "900",
      style: "italic",
    }
  ],
  variable: "--lato",
  fallback: ["rebuchet MS", "sans-serif"],
});

export const forkawesomeManiaicons = localFont({
  src: "./fonts/forkawesome-maniaicons.woff2",
  variable: "--forkAwesome",
});

export const kenneyIcons = localFont({
  src: "./fonts/kenney-icon-font.ttf",
  variable: "--kenneyIcons",
});
