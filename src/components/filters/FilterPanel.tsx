"use client";

import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Panel, SubPanel } from "@/components/layout/Panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUrlParams } from "@/hooks/useUrlParams";
import { PAGINATION_KEYS } from "@/lib/pagination";
import { cn } from "@/lib/utils";
import DateField from "./DateField";
import DurationField from "./DurationField";

export type FilterField = {
  name: string;
  label: string;
  type: "text" | "date" | "duration";
  placeholder?: string;
};

export interface FilterGroup {
  title: string;
  fields: FilterField[];
}

/**
 * Filters for a list page. The values live in the query string, and the list
 * itself re-queries from the client — so applying a filter never reloads the
 * page.
 */
export default function FilterPanel({ groups }: { groups: FilterGroup[] }) {
  const { searchParams, setParams } = useUrlParams();

  // What the list is actually filtered by right now.
  const applied = useMemo(
    () =>
      Object.fromEntries(
        groups.flatMap((group) =>
          group.fields.map((field) => [
            field.name,
            searchParams.get(field.name) ?? "",
          ]),
        ),
      ),
    [groups, searchParams],
  );

  const [values, setValues] = useState(applied);
  const [lastApplied, setLastApplied] = useState(applied);
  const [expanded, setExpanded] = useState(false);

  // Going back and forward in history changes the filters under us; follow it.
  if (
    Object.keys(applied).some((key) => applied[key] !== lastApplied[key])
  ) {
    setLastApplied(applied);
    setValues(applied);
  }

  const activeCount = Object.values(values).filter(
    (value) => value !== "",
  ).length;

  const setValue = (name: string, value: string) =>
    setValues((current) => ({ ...current, [name]: value }));

  const apply = (event: React.FormEvent) => {
    event.preventDefault();
    // A new filter invalidates the cursor we were paging from.
    setParams(values, { remove: PAGINATION_KEYS });
    setExpanded(false);
  };

  const clear = () => {
    setValues(Object.fromEntries(Object.keys(values).map((key) => [key, ""])));
    setParams(
      Object.fromEntries(Object.keys(values).map((key) => [key, undefined])),
      { remove: PAGINATION_KEYS },
    );
  };

  return (
    <Panel
      className={cn("h-fit overflow-hidden lg:h-full", expanded && "h-full")}
      header={
        <div className="flex h-[calc(var(--logo-size)/1.5)] items-center justify-between gap-2">
          <h2 className="m-0 flex items-center gap-3 text-xl font-extrabold">
            <SlidersHorizontal className="size-5 lg:hidden" aria-hidden />
            Filters
            {activeCount > 0 && (
              <Badge variant="secondary" className="rounded-full">
                {activeCount}
              </Badge>
            )}
          </h2>

          <Button
            variant="secondary"
            size="icon"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            aria-controls="filters-form"
            aria-label={expanded ? "Hide filters" : "Show filters"}
            className="rounded-full bg-black hover:bg-white/15 lg:hidden"
          >
            <ChevronDown
              className={cn("transition-transform", !expanded && "-rotate-90")}
            />
          </Button>
        </div>
      }
    >
      <form
        id="filters-form"
        onSubmit={apply}
        className={cn(
          "min-h-0 flex-1 flex-col justify-between gap-2 lg:flex",
          expanded ? "flex" : "hidden",
        )}
      >
        <div className="scrollbar-slim min-h-0 flex-1 space-y-2 overflow-y-auto rounded-panel">
          {groups.map((group) => (
            <SubPanel key={group.title} className="shrink-0 gap-1 p-3">
              <h3 className="m-0 px-2 text-base font-bold">{group.title}</h3>

              <div className="space-y-3 p-1">
                {group.fields.map((field) => (
                  <div key={field.name} className="flex flex-col gap-1">
                    <Label htmlFor={field.name}>{field.label}</Label>

                    {field.type === "text" && (
                      <Input
                        id={field.name}
                        name={field.name}
                        placeholder={field.placeholder}
                        className="rounded-full"
                        value={values[field.name]}
                        onChange={(e) => setValue(field.name, e.target.value)}
                      />
                    )}

                    {field.type === "date" && (
                      <DateField
                        id={field.name}
                        value={values[field.name]}
                        onChange={(value) => setValue(field.name, value)}
                      />
                    )}

                    {field.type === "duration" && (
                      <DurationField
                        id={field.name}
                        value={values[field.name]}
                        onChange={(value) => setValue(field.name, value)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </SubPanel>
          ))}
        </div>

        <div className="flex shrink-0 gap-2">
          <Button
            type="submit"
            variant="secondary"
            className="h-logo flex-1 rounded-full border border-transparent bg-black transition-colors hover:bg-white/10 active:border-white"
          >
            Filter
          </Button>

          {activeCount > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              onClick={clear}
              aria-label="Clear filters"
              className="h-logo w-logo rounded-full"
            >
              <X />
            </Button>
          )}
        </div>
      </form>
    </Panel>
  );
}
