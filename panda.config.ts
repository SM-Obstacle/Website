import { defineAnimationStyles, defineConfig } from "@pandacss/dev";

export default defineConfig({
  presets: ["@shadow-panda/preset"],

  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      keyframes: {
        opacityAnimation: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        navMenuHorizontalSlide: {
          from: {
            maxHeight: "calc(token(sizes.logoSize) + token(spacing.2) * 2)",
          },
          to: {
            maxHeight: "100%",
          },
        },
      },

      tokens: {
        colors: {
          mainBg: { value: "rgba(11, 11, 11, 0.77)" },
          buttonPrimaryLightBlue: { value: "#275087" },
          buttonPrimaryDarkBlue: { value: "#152A48" },
          buttonPrimaryLightBlueHover: { value: "#0b1626" },
          buttonPrimaryDarkBlueHover: { value: "black" },
        },
        opacity: {
          50: { value: 0.5 },
        },
        sizes: {
          logoSize: { value: "50px " },
          maxContentWidth: { value: "1300px" },
        },
      },
    },
  },

  jsxFramework: "react",

  globalVars: {
    "--color-gradient-1": {
      syntax: "<color>",
      inherits: false,
      initialValue: "black",
    },
    "--color-gradient-2": {
      syntax: "<color>",
      inherits: false,
      initialValue: "white",
    },
  },

  // The output directory for your css system
  outdir: "@shadow-panda/styled-system",
});
