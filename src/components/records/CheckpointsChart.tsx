"use client";

import { useState } from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";

import { SubPanel } from "@/components/layout/Panel";
import { formatTime } from "@/components/Time";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

export type CheckpointTime = {
  cpNum: number;
  time: number;
};

type Mode = "delta" | "total";

const chartConfig = {
  record: { label: "This record", color: "var(--color-chart-1)" },
  average: { label: "Map average", color: "var(--color-chart-2)" },
} satisfies ChartConfig;

type Series = keyof typeof chartConfig;

const SERIES_ORDER = Object.keys(chartConfig) as Series[];

/**
 * Left to itself, recharts lists the series in whichever order their marks
 * reached the chart — which isn't the same in both modes. The record leads.
 */
function inSeriesOrder<T extends { dataKey?: unknown }>(
  payload: readonly T[] | undefined,
) {
  const rank = (dataKey: unknown) =>
    SERIES_ORDER.indexOf(String(dataKey) as Series);

  return [...(payload ?? [])].sort(
    (a, b) => rank(a.dataKey) - rank(b.dataKey),
  );
}

/** Short enough to fit an axis tick: the full `formatTime` never is. */
function formatAxisTime(time: number): string {
  const seconds = time / 1000;
  if (seconds < 60) {
    // `Number` drops the decimal the whole seconds don't need, so a scale
    // doesn't mix "7.0s" with "11s".
    return `${Number(seconds.toFixed(1))}s`;
  }
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0")}`;
}

/**
 * The API sends one split per checkpoint, each holding the time spent since the
 * previous one — the last of them is the finish line, so they add up to the
 * record time. `total` mode is what we sum here.
 *
 * Both series keep the same keys in both modes, so the legend and the tooltip
 * can name them from `chartConfig` whichever one is showing. The map average is
 * read positionally and may run short: a checkpoint it doesn't cover leaves a
 * gap rather than a wrong comparison.
 */
function buildSplits(
  cpsTimes: readonly CheckpointTime[],
  averageCpsTimes: readonly CheckpointTime[],
  mode: Mode,
) {
  let elapsed = 0;
  let averageElapsed = 0;

  return cpsTimes.map((cp, index) => {
    elapsed += cp.time;

    const average = averageCpsTimes[index];
    if (average) {
      averageElapsed += average.time;
    }

    return {
      label: index === cpsTimes.length - 1 ? "Finish" : `CP ${cp.cpNum + 1}`,
      record: mode === "delta" ? cp.time : elapsed,
      average: !average
        ? undefined
        : mode === "delta"
          ? average.time
          : averageElapsed,
    };
  });
}

/** Legend that doubles as the switch for a series, the way charts usually do. */
function SeriesToggle({
  series,
  shown,
  locked,
  onToggle,
}: {
  series: Series;
  shown: boolean;
  locked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={locked}
      aria-pressed={shown}
      className={cn(
        "flex items-center gap-1.5 rounded-sm px-1 py-0.5 text-xs transition-opacity",
        "not-disabled:cursor-pointer not-disabled:hover:opacity-80",
        !shown && "opacity-40",
      )}
    >
      <span
        className="size-2 shrink-0 rounded-[2px]"
        style={{ backgroundColor: chartConfig[series].color }}
      />
      {chartConfig[series].label}
    </button>
  );
}

export default function CheckpointsChart({
  cpsTimes,
  averageCpsTimes,
}: {
  cpsTimes: readonly CheckpointTime[];
  averageCpsTimes: readonly CheckpointTime[];
}) {
  const [mode, setMode] = useState<Mode>("delta");
  const [hidden, setHidden] = useState<Partial<Record<Series, boolean>>>({});

  const splits = buildSplits(cpsTimes, averageCpsTimes, mode);
  const hasAverage = splits.some((split) => split.average !== undefined);
  // Marking every point turns into a solid band once a map has many of them.
  const sparse = splits.length <= 24;

  const available = SERIES_ORDER.filter(
    (series) => series !== "average" || hasAverage,
  );
  // Dropping a series from the tree rather than hiding it is what lets the
  // vertical scale forget it: recharts reads its domain off what it renders.
  const shown = available.filter((series) => !hidden[series]);
  const showing = (series: Series) => shown.includes(series);

  return (
    // `shrink-0`: in the side panel this sits in a scrolling column, and a
    // squashed chart is worse than one you scroll to.
    <SubPanel className="shrink-0 gap-3 bg-sunken px-3 py-4">
      <div className="flex flex-wrap items-center justify-between gap-2 px-2">
        <h3 className="m-0 text-base font-bold">Checkpoints</h3>

        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          value={mode}
          onValueChange={(value) => value && setMode(value as Mode)}
          aria-label="Checkpoint times display"
        >
          <ToggleGroupItem value="delta">Delta</ToggleGroupItem>
          <ToggleGroupItem value="total">Total</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
        {/* `barGap` keeps the panel showing between the two bars of a
            checkpoint, so a pair reads as two marks rather than one block. */}
        <ComposedChart data={splits} margin={{ top: 4, right: 8 }} barGap={2}>
          <defs>
            <linearGradient id="checkpoints-record" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--color-record)"
                stopOpacity={0.35}
              />
              <stop
                offset="100%"
                stopColor="var(--color-record)"
                stopOpacity={0.02}
              />
            </linearGradient>
          </defs>

          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            interval="preserveStartEnd"
            tickFormatter={(label: string) => label.replace("CP ", "")}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={4}
            width={48}
            tickFormatter={formatAxisTime}
          />
          <ChartTooltip
            content={({ active, label, payload }) => (
              <ChartTooltipContent
                active={active}
                label={label}
                payload={inSeriesOrder(payload)}
                formatter={(value, name, item) => (
                  <>
                    <span
                      className="size-2.5 shrink-0 rounded-[2px]"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="flex flex-1 items-center justify-between gap-4">
                      <span className="text-muted-foreground">
                        {chartConfig[name as keyof typeof chartConfig]?.label ??
                          name}
                      </span>
                      <span className="font-mono font-medium text-foreground tabular-nums">
                        {formatTime(Number(value))}
                      </span>
                    </span>
                  </>
                )}
              />
            )}
          />
          {mode === "delta" ? (
            <>
              {showing("record") && (
                <Bar
                  dataKey="record"
                  fill="var(--color-record)"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={false}
                />
              )}
              {showing("average") && (
                <Bar
                  dataKey="average"
                  fill="var(--color-average)"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={false}
                />
              )}
            </>
          ) : (
            <>
              {showing("record") && (
                <Area
                  dataKey="record"
                  type="linear"
                  stroke="var(--color-record)"
                  strokeWidth={2}
                  fill="url(#checkpoints-record)"
                  dot={sparse && { r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                  isAnimationActive={false}
                />
              )}
              {showing("average") && (
                <>
                  {/* Here the average runs over the area it is compared with,
                      and a thin line loses against a fill. Repeating it
                      underneath in the panel's own colour, same dashes but
                      wider, outlines each dash instead of laying a solid line
                      behind the gaps. */}
                  <Line
                    dataKey="average"
                    type="linear"
                    stroke="var(--chart-surface)"
                    strokeWidth={5}
                    strokeDasharray="5 4"
                    dot={false}
                    activeDot={false}
                    legendType="none"
                    tooltipType="none"
                    isAnimationActive={false}
                  />
                  <Line
                    dataKey="average"
                    type="linear"
                    stroke="var(--color-average)"
                    strokeWidth={2}
                    strokeDasharray="5 4"
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                    // Recharts draws a line in by animating its dash pattern,
                    // which fights the dashes above: the series lands at
                    // "0px, <length>" and paints nothing. Nothing here needs to
                    // animate anyway — the dialog opens on loaded data.
                    isAnimationActive={false}
                  />
                </>
              )}
            </>
          )}
        </ComposedChart>
      </ChartContainer>

      {available.length > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-4">
          {available.map((series) => (
            <SeriesToggle
              key={series}
              series={series}
              shown={showing(series)}
              // The chart has to keep a series: an empty plot reads as broken.
              locked={showing(series) && shown.length === 1}
              onToggle={() =>
                setHidden((current) => ({
                  ...current,
                  [series]: !current[series],
                }))
              }
            />
          ))}
        </div>
      )}
    </SubPanel>
  );
}
