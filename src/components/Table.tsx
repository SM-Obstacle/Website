import { styled } from "../../styled-system/jsx";

export const Table = styled('div', {
  base: {
    margin: 0,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    borderRadius: "10px",
    backgroundColor: "#000000dd",
  }
});

export const Thead = styled('div', {
  base: {
    fontSize: "25px",
    display: "flex",
    flexDir: "column",
    justifyContent: "space-evenly",
  }
}, { defaultProps: { className: "Thead" } });

export const Tbody = styled("div", {
  base: {
    fontSize: "20px",
    display: "block",
    overflowY: "scroll",
  }
}, { defaultProps: { className: "Tbody" } });

export const Tr = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    tableLayout: "fixed",
    fontWeight: 700,
    userSelect: "none",

    ".Thead &": {
      pe: "10px", // align with scrollbar padding of tbody
      "@media only screen and (max-width: 870px)": {
        ps: "40px",
      },
    },

    ".Tbody &": {
      position: "relative",
      minHeight: 39,
      borderTop: "2px solid transparent",
      borderBottom: "2px solid transparent",
      fontStyle: "italic",
      transition: "border-color .1s",

      _active: {
        _even: {
          backgroundColor: "#292b2d",
        },

        _odd: {
          backgroundColor: "#3d3f42",
        }
      },

      _hover: {
        borderTopColor: "#346ab4",
        borderBottomColor: "#346ab4",
      },

      _even: {
        backgroundColor: "#1d1e20",
      },

      _odd: {
        backgroundColor: "#2f3134",
      },
    },
  }
}, { defaultProps: { tabIndex: 0 } });

const ThTd = styled("div", {
  base: {
    flex: 0,
    boxSizing: "border-box",
    minWidth: 100,
    overflowX: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",

    _first: {
      ps: 10,
    },

    _last: {
      pe: 10,
    }
  },
  variants: {
    rank: {
      true: {
        minWidth: 130,
        textAlign: "center",
      }
    },
    player: {
      true: {
        flex: 1.5,
        "@media only screen and (max-width: 870px)": {
          flex: 1.2,
          fontSize: ".8em",
        }
      }
    },
    campaignAttr: {
      true: {
        minWidth: "200px",
        "@media only screen and (max-width: 1300px)": {
          minWidth: "125px",
        },
        "@media only screen and (max-width: 870px)": {
          fontSize: ".8em",
          minWidth: "100px",
        }
      }
    },
    alignRightSm: {
      true: {
        "@media only screen and (max-width: 870px)": {
          textAlign: "right",
        }
      }
    },
    map: {
      true: {
        flex: 2,
        "@media only screen and (max-width: 870px)": {
          fontSize: ".8em",
        }
      }
    },
    time: {
      true: {
        color: "#346ab4",
        minWidth: 130,
      }
    },
    date: {
      true: {
        minWidth: 200,
        textAlign: "right",
      }
    },
    hideRespv: {
      true: {
        "@media only screen and (max-width: 870px)": {
          display: "none",
        }
      }
    },
  }
});

export const Th = styled(ThTd, {
  base: {
    padding: "12px 8px",
    fontWeight: 900,
  },
  variants: {
    padRespvFirst: {
      true: {
        "@media only screen and (max-width: 870px)": {
          ps: 5,
        }
      }
    },
    padRespvLast: {
      true: {
        "@media only screen and (max-width: 870px)": {
          pe: 10,
          textAlign: "right",
        }
      }
    }
  },
});

export const Td = styled(ThTd, {
  base: {
    padding: "4px 8px",
  },
  variants: {
    respvUnpadRank: {
      true: {
        "@media only screen and (max-width: 870px)": {
          padding: "4px 3px !important",
          minWidth: 50,
          fontSize: ".8em",
        }
      }
    },
    respvMb: {
      true: {
        "@media only screen and (max-width: 870px)": {
          mb: 3.5,
        }
      }
    },
    respvTime: {
      true: {
        "@media only screen and (max-width: 870px)": {
          fontSize: ".8em",
        }
      }
    },
    respvAbsoluteDate: {
      true: {
        "@media only screen and (max-width: 870px)": {
          fontSize: ".8em",
          position: "absolute",
          left: "55px",
          bottom: 0,
          padding: 0,
          margin: 0,
          textAlign: "left",
        }
      }
    }
  }
});