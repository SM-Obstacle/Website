'use client';

import { GetEventListQuery } from "@/app/__generated__/graphql";
import { usePathname } from "next/navigation";
import { css as css2 } from "../../styled-system/css";
import { MutableRefObject, forwardRef, useCallback, useEffect, useRef } from "react";
import { DiscriminatedUnion } from "@/lib/utils";
import { NavLink, NavSpan } from "./Link";
import { styled } from "../../styled-system/jsx";

type NormalPage = {
  label: string,
  path: string,
};

type Page = DiscriminatedUnion<"type", {
  normal: NormalPage,
  dropdown: {
    label: string,
    menu: NormalPage[],
  },
  separator: {},
}>;

function cleanUpHandle(eventHandle: string) {
  return eventHandle.split('_').map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

const pages = (events: GetEventListQuery) => [
  {
    type: "normal",
    label: "Home",
    path: "/latest",
  },
  {
    type: "dropdown",
    label: "Events",
    menu: events.events.map((event) => ({
      label: cleanUpHandle(event.handle),
      path: `/event/${event.handle}/${event.lastEdition?.id}`,
    })),
  },
  { type: "separator" },
  {
    type: "normal",
    label: "Resources",
    path: "/links"
  },
] as Page[];

const Nav = styled("nav", {
  base: {
    display: "flex",
    height: "51px",
    background: "linear-gradient(#000000, #000000bb)",
    letterSpacing: ".1em",
    userSelect: "none",
    "@media only screen and (max-width: 870px)": {
      position: "relative",
      justifyContent: "right",
    }
  }
});

const Logo = styled("div", {
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
    }
  }
})

const checkboxName = "menu_opened";
const HiddenInput = forwardRef<HTMLInputElement>(({ }, ref) => (
  <input ref={ref} className={css2({
    display: "none",
    "@media only screen and (max-width: 870px)": {
      "&:not(:checked) ~ ul": {
        overflow: "hidden",
        maxHeight: 0,
        padding: 0,
      },
    }
  })} type="checkbox" id={checkboxName} name={checkboxName} />
));
HiddenInput.displayName = "HiddenInput";
const Label = () => <label className={css2({
  cursor: "pointer",
  lineHeight: "51px",
  fontSize: "30px",
  padding: "0 10px 0 30px",
  position: "relative",
  zIndex: 1,
})} htmlFor={checkboxName}>☰</label>
const Burger = styled("div", {
  base: {
    "@media only screen and (min-width: 870px)": {
      display: "none",
    }
  }
});

const List = styled('ul', {
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
    }
  }
});
const ListItem = styled("li", {
  base: {
    "@media only screen and (min-width: 870px)": {
      padding: "0 10px",
    },
    "@media only screen and (min-width: 1300px)": {
      padding: "0 50px",
    },
    "@media only screen and (max-width: 870px)": {
      paddingBottom: "20px",
    }
  }
}, { defaultProps: { className: "ListItem" } });
const Dropdown = styled(ListItem, {
  base: {
    position: "relative",
    display: "inline-block",
    paddingBottom: "20px",
  }
}, { defaultProps: { className: "Dropdown" } });

const Separator = styled('li', {
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
    }
  }
});

const DropBtn = styled(NavSpan, {
  base: {
    backgroundColor: "inherit",
    color: "white",
    transition: "background-color .1s",
    ".Dropdown:hover &": {
      background: "#111",
    },
    _hover: {
      cursor: "default",
    }
  }
}, { defaultProps: { className: "DropBtn" } });
const DropdownContent = styled('div', {
  base: {
    marginTop: "20px",
    borderRadius: "10px",
    background: "radial-gradient(black, #111111dd)",
    minWidth: "160px",
    boxShadow: "0 8px 16px 0 rgba(0, 0, 0, .2)",
  }
}, { defaultProps: { className: "DropdownContent" } });
//const DropdownContent = withClass('div', css.dropdownContent);
const DropdownContentWrapper = styled('div', {
  base: {
    zIndex: 100,
    display: "none",
    position: "absolute",
    transform: "translateY(-5px)",
    animation: "dropdownContentWrapperTransition .2s",
    ".Dropdown:hover &": {
      display: "block",
    }
  }
}, { defaultProps: { className: "DropdownContentWrapper" } });
// const DropdownContentWrapper = withClass('div', css.dropdownContentWrapper);
// const DropdownContentItem = withClass(DropdownLink, css.dropdownContentItem);
const DropdownContentItem = styled(NavLink, {
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
    }
  },
});

function Menu({
  events,
  checkboxRef,
}: {
  events: GetEventListQuery,
  checkboxRef: MutableRefObject<HTMLInputElement | null>,
}) {
  const pathname = usePathname();
  const isActive = useCallback((link: string) => pathname === link, [pathname]);

  useEffect(() => {
    if (checkboxRef.current?.checked) {
      checkboxRef.current.checked = false;
    }
  }, [pathname, checkboxRef]);

  return (
    <List>
      {pages(events).map((page, i) => page.type === "separator" ? (
        <Separator key={`sep_${i}`} />
      ) : page.type === "normal" ? (
        <ListItem key={page.path}>
          <NavLink
            href={page.path}
            active={isActive(page.path)}
          >
            {page.label}
          </NavLink>
        </ListItem>
      ) : (
        <Dropdown key={page.label}>
          <DropBtn active={page.menu.some((link) => isActive(link.path))}>
            {page.label}
          </DropBtn>
          <DropdownContentWrapper>
            <DropdownContent>
              {page.menu.map((link) => (
                <DropdownContentItem
                  key={link.path}
                  href={link.path}
                  active={isActive(link.path)}
                >
                  {link.label}
                </DropdownContentItem>
              ))}
            </DropdownContent>
          </DropdownContentWrapper>
        </Dropdown>
      ))}
    </List>
  );
}

export default function Navigation(props: Omit<React.ComponentProps<typeof Menu>, "checkboxRef">) {
  const ref = useRef(null);

  return (
    <Nav>
      <HiddenInput ref={ref} />
      <Logo><NavLink href="/">Obstacle</NavLink></Logo>

      <Burger>
        <Label />
      </Burger>

      <Menu {...props} checkboxRef={ref} />
    </Nav>
  );
}