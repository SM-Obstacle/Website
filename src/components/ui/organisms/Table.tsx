import { styled } from "../../../../@shadow-panda/styled-system/jsx";

export const Thead = styled("thead", {
  base: {
    fontSize: "larger",
    position: "sticky",
    top: 0,
  },
});

export const Table = styled("table", {
  base: {
    margin: "token(spacing.2) token(spacing.5)",
    "& tr": {
      whiteSpace: "nowrap",
      minW: "token(spacing.5)",
      "& td, & th": {
        padding: "token(spacing.1) token(spacing.1)",
        _first: {
          roundedStart: "token(radii.md)",
        },
        _last: {
          roundedEnd: "token(radii.md)",
        },
      },
      _even: {
        "& td": {
          bgColor: "#AAA1",
        },
      },
    },
  },
});
