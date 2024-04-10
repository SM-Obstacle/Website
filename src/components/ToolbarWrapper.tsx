import { styled } from "../../styled-system/jsx";

export const ToolBarWrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: "20px 30px",
    backgroundColor: "#2c2e3188",
    borderRadius: "10px 10px 0 0",
  }
}, { defaultProps: { className: "ToolbarWrapper" } });

export const ToolbarTitle = styled('h1', {
  base: {
    ".ToolbarWrapper &": {
      fontSize: "2em",
      flexGrow: 1,
      fontWeight: 900,
    },
  },
  variants: {
    withShadow: {
      true: {
        textShadow: "2px 2px 10px black",
      }
    }
  }
});

export const ToolbarTitleWrapper = styled("div", {
  base: {
    flexGrow: 1,
    "& h1": {
      fontSize: "2em",
      fontWeight: 900,
    }
  }
});

export const ToolbarSpan = styled("span", {
  base: {
    ".ToolbarWrapper > &": {
      padding: "1em",
      fontStyle: "italic",
    }
  }
});

export const ToolbarInput = styled("input", {
  base: {
    ".ToolbarWrapper &": {
      "&[type=image]": {
        width: "30px",
        "&[disabled]": {
          opacity: .4,
          cursor: "not-allowed",
        }
      }
    }
  }
});