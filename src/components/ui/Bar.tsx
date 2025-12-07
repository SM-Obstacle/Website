import { styled } from "../../../@shadow-panda/styled-system/jsx";

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
        minW: "token(sizes.logoSize)",
        height: "calc(100% - token(spacing.2) * 2)",
      },
      horizontal: {
        minH: "token(sizes.logoSize)",
        width: "calc(100% - token(spacing.2) * 2)",
      },
    },
  },

  defaultVariants: {
    orientation: "horizontal",
  },
});

export default function Bar({
  orientation,
  children,
}: React.PropsWithChildren<{
  orientation: Required<React.ComponentProps<typeof BarBase>>["orientation"];
}>) {
  return <BarBase orientation={orientation}>{children}</BarBase>;
}
