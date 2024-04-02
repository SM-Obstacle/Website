import { styled } from "../../styled-system/jsx";

export const LastUpdate = styled("span", {
  base: {
    position: "sticky",
    top: 0,
  }
});

export const Article = styled("div", {
  base: {
    p: 5,
    gap: 2,
    position: "relative",
    display: "flex",
    flexDir: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    overflowY: "auto",
  }
});