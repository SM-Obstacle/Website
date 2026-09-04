"use client";

import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { memo, useMemo, useState } from "react";

import { useFilters } from "@/components/layout/ListPage";
import { Panel, SubPanel } from "@/components/layout/Panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSetUrlParams, useUrlParams } from "@/hooks/useUrlParams";
import { exactKey } from "@/lib/filters";
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

/**
 * Text fields carry a companion `<name>Exact` param, holding whether the value
 * is matched as a whole, case-sensitively, rather than looked for anywhere in
 * the column.
 */
function paramNames(groups: FilterGroup[]): string[] {
  return groups.flatMap((group) =>
    group.fields.flatMap((field) =>
      field.type === "text" ? [field.name, exactKey(field.name)] : [field.name],
    ),
  );
}

export interface FilterGroup {
  title: string;
  fields: FilterField[];
}

/**
 * Filters for a list page. The values live in the query string, and the list
 * itself re-queries from the client — so applying a filter never reloads the
 * page.
 *
 * Everything reading the query string is re-rendered whenever any part of it
 * changes, and picking a row in the list beside these filters changes it. So
 * this half is kept as thin as it can be: it reads the params the filters are
 * actually made of and hands the form the same object as last time unless one
 * of those params moved, which is what lets the form itself sit still.
 */
export default function FilterPanel({ groups }: { groups: FilterGroup[] }) {
  const { searchParams } = useUrlParams();

  const names = useMemo(() => paramNames(groups), [groups]);

  // What the list is actually filtered by right now.
  const read = Object.fromEntries(
    names.map((name) => [name, searchParams.get(name) ?? ""]),
  );
  const [applied, setApplied] = useState(read);
  if (names.some((name) => applied[name] !== read[name])) {
    setApplied(read);
  }

  return <FilterForm groups={groups} applied={applied} />;
}

const FilterForm = memo(function FilterForm({
  groups,
  applied,
}: {
  groups: FilterGroup[];
  applied: Record<string, string>;
}) {
  const setParams = useSetUrlParams();

  const [values, setValues] = useState(applied);
  const [lastApplied, setLastApplied] = useState(applied);
  // Owned by the layout: opening the filters hides the results beside them.
  const { expanded, setExpanded } = useFilters();

  // Going back and forward in history changes the filters under us; follow it.
  if (Object.keys(applied).some((key) => applied[key] !== lastApplied[key])) {
    setLastApplied(applied);
    setValues(applied);
  }

  const activeCount = groups
    .flatMap((group) => group.fields)
    .filter((field) => values[field.name] !== "").length;

  const setValue = (name: string, value: string) =>
    setValues((current) => ({ ...current, [name]: value }));

  const setExact = (name: string, exact: boolean) =>
    setValues((current) => ({ ...current, [exactKey(name)]: exact ? "1" : "" }));

  const apply = (event: React.FormEvent) => {
    event.preventDefault();
    // An "exact match" left behind by a field the user emptied has nothing to
    // qualify, so it shouldn't end up in the URL they share.
    const applied = { ...values };
    for (const group of groups) {
      for (const field of group.fields) {
        if (values[field.name] === "") applied[exactKey(field.name)] = "";
      }
    }
    // A new filter invalidates the cursor we were paging from.
    setParams(applied, { remove: PAGINATION_KEYS });
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
      className={cn(
        // Only as tall as its content, and never taller than the space it has:
        // `min-h-0` lets the flex column above shrink it past that content, and
        // the fields then scroll inside.
        "min-h-0 overflow-hidden w-full",
        // Collapsed on the narrow layout it is a bar, so it matches the height
        // of the title bar above it and the corners round the same way. Opened,
        // it takes the row the results gave up.
        expanded && "h-full lg:h-auto",
      )}
      header={
        <div className="flex h-logo items-center justify-between gap-2 lg:h-[calc(var(--logo-size)/1.5)]">
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
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-controls="filters-form"
            aria-label={expanded ? "Hide filters" : "Show filters"}
            className="rounded-full bg-sunken hover:bg-accent lg:hidden"
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
          "min-h-0 flex-1 flex-col justify-between gap-inset lg:flex",
          expanded ? "flex" : "hidden",
        )}
      >
        {/* Rounded like a sub-panel so the groups are clipped along the same
            curve as the panel around them. */}
        <div className="scrollbar-slim flex min-h-0 flex-1 flex-col gap-inset overflow-y-auto rounded-panel">
          {groups.map((group) => (
            <SubPanel key={group.title} className="shrink-0 gap-1 p-3">
              <h3 className="m-0 px-2 text-base font-bold">{group.title}</h3>

              <div className="space-y-3 p-1">
                {group.fields.map((field) => (
                  <div key={field.name} className="flex flex-col gap-1">
                    <Label htmlFor={field.name}>{field.label}</Label>

                    {field.type === "text" && (
                      <>
                        <Input
                          id={field.name}
                          name={field.name}
                          placeholder={field.placeholder}
                          className="rounded-full"
                          value={values[field.name]}
                          onChange={(e) => setValue(field.name, e.target.value)}
                        />

                        <Label
                          htmlFor={exactKey(field.name)}
                          className="px-2 pt-0.5 text-xs font-normal text-muted-foreground"
                        >
                          <Checkbox
                            id={exactKey(field.name)}
                            name={exactKey(field.name)}
                            checked={values[exactKey(field.name)] === "1"}
                            onCheckedChange={(checked) =>
                              setExact(field.name, checked === true)
                            }
                          />
                          Exact match
                        </Label>
                      </>
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

        <div className="flex shrink-0 gap-inset">
          <Button
            type="submit"
            variant="secondary"
            className="h-logo flex-1 rounded-full border border-transparent bg-sunken transition-colors hover:bg-accent active:border-foreground"
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
});
