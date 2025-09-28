import { styled } from "../../../styled-system/jsx";
import { Td, Tr } from "../Table";

export const HeadRow = styled(Tr, {
  base: {
    position: "sticky!",
    top: 0,
    justifyContent: "flex-start",
    borderBottom: "solid black 2px",
    zIndex: 2000,

    _hover: {
      cursor: "pointer",
    },
  },
});

export const Rows = styled("div", {
  base: {
    overflowY: "hidden",
    transition: "max-height .2s",
  },
});

export const ArrowTd = styled(Td, {
  base: {
    flex: 0.1,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
