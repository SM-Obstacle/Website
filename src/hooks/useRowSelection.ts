"use client";

import { useCallback } from "react";

import { useUrlParams } from "@/hooks/useUrlParams";

/**
 * The props that make one row selectable.
 *
 * Kept out of the hook so a memoised row can build them from what it already
 * holds — the two things that actually change about it — instead of taking a
 * fresh object from a parent that re-rendered for some other reason.
 */
export function selectableRowProps(
  value: string,
  selected: boolean,
  select: (value: string) => void,
) {
  return {
    tabIndex: 0,
    onClick: () => select(value),
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        select(value);
      }
    },
    "data-state": selected ? "selected" : undefined,
    className: "cursor-pointer data-[state=selected]:[&>td]:bg-selected",
  };
}

/**
 * The "click a row to open its details" mechanic shared by every leaderboard.
 *
 * The picked row lives in the query string under `param`, so the open popup
 * survives a reload and can be linked to. Spread `rowProps` on a
 * `LeaderboardRow` to make it selectable; the caller renders whatever the
 * selection opens, typically a dialog. Links inside a selectable row should use
 * `NoPropagationLink` so following them doesn't also select the row.
 *
 * `clears` names the params that whatever else could be sharing that popup is
 * held in: picking or unpicking a row drops them, so the last thing picked is
 * the one on screen and closing the popup leaves nothing behind to reopen it.
 */
export function useRowSelection(
  param: string,
  { clears }: { clears?: readonly string[] } = {},
) {
  const { searchParams, setParams } = useUrlParams();
  const selected = searchParams.get(param);

  // Reading what is picked off the URL rather than closing over it keeps this
  // callback identical from one render to the next, which is what lets a
  // memoised row hold on to it and skip re-rendering when its neighbour is
  // picked.
  const select = useCallback(
    (value: string) => {
      const current = new URLSearchParams(window.location.search).get(param);
      setParams(
        { [param]: value === current ? undefined : value },
        { remove: clears },
      );
    },
    [clears, param, setParams],
  );

  const close = useCallback(() => {
    setParams({ [param]: undefined }, { remove: clears });
  }, [clears, param, setParams]);

  const rowProps = (value: string) =>
    selectableRowProps(value, value === selected, select);

  return { selected, select, close, rowProps };
}
