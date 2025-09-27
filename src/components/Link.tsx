import NextLink from "next/link";
import { cva } from "../../styled-system/css";
import { styled } from "../../styled-system/jsx";

export type LinkProps = React.ComponentProps<typeof Link>;

export const navLinkStyles = cva({
  base: {
    transition: "color .15s, border-color .3s",
    position: "relative",
    padding: 1,
    border: "solid transparent 1px",
    borderRadius: 5,

    ".ListItem:hover &": {
      borderColor: "#346ab4",
    },
  },
  variants: {
    active: {
      true: {
        color: "#346ab4",
        ".ListItem:hover &": {
          borderColor: "transparent",
        },
      },
    },
    dropdown: {
      true: {
        transition: "background-color .1s, border-color .1s",
      },
    },
  },
});

const Link = styled(NextLink, {
  base: {
    color: "inherit",
    textDecoration: "none",
  },
  variants: {
    explicit: {
      true: {
        color: "#87b0e9",
        _hover: {
          textDecoration: "underline",
        },
      },
    },
  },
});

export const NavLink = styled(Link, navLinkStyles);
export const NavSpan = styled("span", navLinkStyles);

export default Link;
