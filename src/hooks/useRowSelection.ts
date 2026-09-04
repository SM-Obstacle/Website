"use client";

import { useCallback } from "react";

import { useUrlParams } from "@/hooks/useUrlParams";

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

  const select = useCallback(
    (value: string) => {
      setParams(
        { [param]: value === selected ? undefined : value },
        { remove: clears },
      );
    },
    [clears, param, selected, setParams],
  );

  const close = useCallback(() => {
    setParams({ [param]: undefined }, { remove: clears });
  }, [clears, param, setParams]);

  const rowProps = (value: string) => ({
    tabIndex: 0,
    onClick: () => select(value),
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        select(value);
      }
    },
    "data-state": value === selected ? "selected" : undefined,
    className: "cursor-pointer data-[state=selected]:[&>td]:bg-selected",
  });

  return { selected, select, close, rowProps };
}
