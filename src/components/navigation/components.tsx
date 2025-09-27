import { css } from "../../../styled-system/css";
import { styled } from "../../../styled-system/jsx";
import { NavLink, NavSpan } from "../Link";

export const Nav = styled("nav", {
  base: {
    display: "flex",
    height: "51px",
    background: "linear-gradient(#000000, #000000bb)",
    letterSpacing: ".1em",
    userSelect: "none",
    "@media only screen and (max-width: 870px)": {
      position: "relative",
      justifyContent: "right",
    },
  },
});

export const Logo = styled("div", {
  base: {
    margin: "0 0 0 10px",
    display: "flex",
    alignItems: "center",
    fontStyle: "italic",
    fontWeight: 700,
    fontSize: "34px",
    "@media only screen and (max-width: 870px)": {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      justifyContent: "center",
      margin: 0,
    },
  },
});

export const Label = ({ htmlFor }: { htmlFor: string }) => (
  <label
    className={css({
      cursor: "pointer",
      lineHeight: "51px",
      fontSize: "30px",
      padding: "0 10px 0 30px",
      position: "relative",
      zIndex: 1,
    })}
    htmlFor={htmlFor}
  >
    ☰
  </label>
);

export const Burger = styled("div", {
  base: {
    "@media only screen and (min-width: 870px)": {
      display: "none",
    },
  },
});

export const List = styled("ul", {
  base: {
    flexGrow: 1,
    margin: 0,
    padding: 0,
    height: "100%",
    zIndex: 1,

    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    fontSize: "25px",
    textTransform: "uppercase",

    listStyleType: "none",

    "@media only screen and (max-width: 870px)": {
      maxHeight: "500px",
      transition: "padding .2s ease-in, max-height .2s linear",

      position: "absolute",
      boxSizing: "border-box",
      top: "51px",
      width: "100%",
      height: "auto",
      paddingTop: "20px",

      backgroundColor: "#000000dd",
      flexDirection: "column",
    },
  },
});

export const ListItem = styled(
  "li",
  {
    base: {
      "@media only screen and (min-width: 870px)": {
        padding: "0 10px",
      },
      "@media only screen and (min-width: 1300px)": {
        padding: "0 50px",
      },
      "@media only screen and (max-width: 870px)": {
        paddingBottom: "20px",
      },
    },
  },
  { defaultProps: { className: "ListItem" } },
);

export const Dropdown = styled(
  ListItem,
  {
    base: {
      position: "relative",
      display: "inline-block",
      paddingBottom: "20px",
    },
  },
  { defaultProps: { className: "Dropdown" } },
);

export const Separator = styled("li", {
  base: {
    "@media only screen and (min-width: 870px)": {
      display: "none",
    },
    "@media only screen and (max-width: 870px)": {
      backgroundColor: "white",
      width: "100%",
      height: "3px",
      paddingBottom: 0,
      marginBottom: "20px",
    },
  },
});

export const DropBtn = styled(
  NavSpan,
  {
    base: {
      backgroundColor: "inherit",
      color: "white",
      transition: "background-color .1s",
      ".Dropdown:hover &": {
        background: "#111",
      },
      _hover: {
        cursor: "default",
      },
    },
  },
  { defaultProps: { className: "DropBtn" } },
);

export const DropdownContent = styled(
  "div",
  {
    base: {
      marginTop: "20px",
      borderRadius: "10px",
      background: "radial-gradient(black, #111111dd)",
      minWidth: "160px",
      boxShadow: "0 8px 16px 0 rgba(0, 0, 0, .2)",
    },
  },
  { defaultProps: { className: "DropdownContent" } },
);

export const DropdownContentWrapper = styled(
  "div",
  {
    base: {
      zIndex: 100,
      display: "none",
      position: "absolute",
      transform: "translateY(-5px)",
      animation: "dropdownContentWrapperTransition .2s",
      ".Dropdown:hover &": {
        display: "block",
      },
    },
  },
  { defaultProps: { className: "DropdownContentWrapper" } },
);

export const DropdownContentItem = styled(NavLink, {
  base: {
    textShadow: "0 0 1em black",
    padding: "8px 12px",
    display: "block",
    border: "solid transparent 1px",
    transition: "background-color .2s, border-color .3s",

    _first: {
      borderTopLeftRadius: "10px",
      borderTopRightRadius: "10px",
    },

    _last: {
      borderBottomLeftRadius: "10px",
      borderBottomRightRadius: "10px",
    },

    _hover: {
      backgroundColor: "#000000dd",
      borderColor: "#346ab4",
    },
  },
});
