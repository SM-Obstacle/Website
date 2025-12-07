import { css } from "../../../@shadow-panda/styled-system/css";
import { styled } from "../../../@shadow-panda/styled-system/jsx";

const BlockBase = styled("div", {
  base: {
    bgColor: "token(colors.mainBg)",
    backdropBlur: "sm",
    borderRadius: "calc(token(sizes.logoSize) / 2 + token(spacing.2))",
    padding: 2,
    display: "flex",
    flexDir: "column",
    gap: 3,
  },
});

const SubBlockBase = styled(BlockBase, {
  base: {
    borderRadius: "calc(token(sizes.logoSize) / 2)",
    backdropBlur: "none",
    padding: 0,
    overflow: "hidden",
  },
});

export function SubBlock({
  children,
  ...props
}: React.PropsWithChildren & React.ComponentProps<typeof SubBlockBase>) {
  return <SubBlockBase {...props}>{children}</SubBlockBase>;
}

export default function Block({
  titleBar,
  children,
  ...props
}: React.PropsWithChildren<{
  titleBar?: React.ReactNode;
}> &
  React.ComponentProps<typeof BlockBase>) {
  return (
    <BlockBase {...props}>
      {/* Title bar */}
      {titleBar && (
        <div
          className={css({
            width: "calc(100% - token(spacing.3) * 2)",
            ps: "token(spacing.3)",
            pe: "token(spacing.3)",
          })}
        >
          {titleBar}
        </div>
      )}

      {children}
    </BlockBase>
  );
}
