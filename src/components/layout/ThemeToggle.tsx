"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/**
 * The settings the button walks through, in order. `system` comes first: it is
 * the default, and what a visitor who never touches this keeps.
 */
const SETTINGS = [
  { value: "system", name: "system", icon: Monitor },
  { value: "light", name: "light", icon: Sun },
  { value: "dark", name: "dark", icon: Moon },
] as const;

/** Never fires: what is being read changes once, at hydration. */
const subscribe = () => () => {};

function useThemeSetting() {
  const { theme, setTheme } = useTheme();

  // Which setting is stored is only known on the client, so the first render
  // has to be the one the server produced: `system` until we have hydrated.
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const index = mounted
    ? Math.max(
        0,
        SETTINGS.findIndex((setting) => setting.value === theme),
      )
    : 0;

  return {
    current: SETTINGS[index],
    label: `Theme: ${SETTINGS[index].name}`,
    cycle: () => setTheme(SETTINGS[(index + 1) % SETTINGS.length].value),
  };
}

/**
 * Cycles between following the system and pinning one of the two themes.
 *
 * A cycle rather than a switch: there are three settings, and the rail this
 * sits in only has room for one icon.
 */
export default function ThemeToggle({
  className,
  iconClassName,
  withLabel = false,
  tooltipSide,
}: {
  className?: string;
  iconClassName?: string;
  /** Names the setting beside the icon, for the wider mobile sheet. */
  withLabel?: boolean;
  /** Names it in a tooltip instead, for the icon rail. */
  tooltipSide?: React.ComponentProps<typeof TooltipContent>["side"];
}) {
  const { current, label, cycle } = useThemeSetting();
  const Icon = current.icon;

  const button = (
    <button
      type="button"
      onClick={cycle}
      aria-label={label}
      className={cn(
        "flex cursor-pointer items-center transition-colors hover:text-primary",
        className,
      )}
    >
      <Icon className={iconClassName} aria-hidden />
      {withLabel && <span className="first-letter:uppercase">{label}</span>}
    </button>
  );

  if (!tooltipSide) return button;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side={tooltipSide} className="first-letter:uppercase">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
