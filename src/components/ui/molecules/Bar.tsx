import { styled } from "../../../../@shadow-panda/styled-system/jsx";

const BarBase = styled("div", {
  base: {
    borderRadius: "calc(token(sizes.logoSize) + token(spacing.2))",
    color: "token(colors.white)",
    padding: "token(spacing.2)",
    bgColor: "token(colors.mainBg)",
    backdropBlur: "sm",
  },

  variants: {
    orientation: {
      vertical: {
        minW: "calc(token(sizes.logoSize) + 2 * token(spacing.2))",
        height: "100%",
      },
      horizontal: {
        minH: "calc(token(sizes.logoSize) + 2 * token(spacing.2))",
        width: "100%",
      },
    },
  },

  defaultVariants: {
    orientation: "horizontal",
  },
});

const Bar = BarBase;
export default Bar;
