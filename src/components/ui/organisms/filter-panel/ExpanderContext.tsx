"use client";

import { createContext, RefObject, useContext, useRef, useState } from "react";

type ExpanderState = {
  ref: RefObject<HTMLElement | null>;
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
};

const ExpanderContext = createContext<ExpanderState | null>(null);

export function ExpanderWrapper({ children }: React.PropsWithChildren) {
  const ref = useRef<HTMLElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <ExpanderContext
      value={{
        isExpanded,
        setIsExpanded: (isExpanded) => {
          setIsExpanded(isExpanded);
          if (ref.current) {
            if (isExpanded) {
              ref.current.setAttribute("data-expanded", "");
            } else {
              ref.current.removeAttribute("data-expanded");
            }
          }
        },
        ref,
      }}
    >
      {children}
    </ExpanderContext>
  );
}

export function useExpander(): ExpanderState {
  const ctx = useContext(ExpanderContext);

  if (ctx === null) {
    throw new Error("useExpander must be called inside a <ExpanderWrapper>");
  }

  return ctx;
}
