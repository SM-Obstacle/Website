"use client";

import { Map } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useUrlParams } from "@/hooks/useUrlParams";
import { cn } from "@/lib/utils";
import { PLAYER_MAPS_PARAM } from "./playerPanel";

const LABEL = "See their maps";

/**
 * Puts the maps this player authored in the side panel. It takes the panel
 * from whatever record was picked, which is what dropping `record` here means.
 */
export default function PlayerMapsButton() {
  const { searchParams, setParams } = useUrlParams();
  const open = searchParams.get(PLAYER_MAPS_PARAM) === "1";

  return (
    <Button
      variant="outline"
      size="sm"
      aria-pressed={open}
      aria-label={LABEL}
      onClick={() =>
        setParams(
          { [PLAYER_MAPS_PARAM]: open ? undefined : "1" },
          { remove: ["record"] },
        )
      }
      className={cn(
        "shrink-0 cursor-pointer rounded-full",
        open && "bg-accent text-accent-foreground",
      )}
    >
      <Map />
      {/* The panel it opens says what it is, so the narrow layouts — where the
          name beside it has little enough room already — keep the icon only. */}
      <span className="hidden sm:inline">{LABEL}</span>
    </Button>
  );
}
