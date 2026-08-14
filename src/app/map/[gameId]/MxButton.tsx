"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import mxPlanetLogo from "@/../public/img/planet_mx_logo.png";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// TODO: fetch our API instead of MX
export default function MxButton({ gameId }: { gameId: string }) {
  const mxUrl = useRef<string | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const openMxUrl = () => {
    if (mxUrl.current) {
      window.open(mxUrl.current, "_blank", "noopener,noreferrer");
    }
  };

  const handleMxClick = async () => {
    if (typeof mxUrl.current === "string") {
      openMxUrl();
      return;
    }

    const mapsIds: { TrackID: number }[] = await fetch(
      `https://sm.mania.exchange/api/maps/get_map_info/multi/${gameId}`,
    )
      .then((res) => res.json())
      .catch((e) => {
        alert(`Error when fetching the MX API: ${e}`);
        setIsDisabled(true);
      });

    if (mapsIds?.length > 0) {
      mxUrl.current = `https://sm.mania-exchange.com/maps/${mapsIds[0].TrackID}`;
      openMxUrl();
    } else {
      alert("This map does not seem to be uploaded to sm.mania.exchange");
      setIsDisabled(true);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={handleMxClick}
          variant="secondary"
          size="icon"
          className="shrink-0 rounded-full bg-black hover:bg-white/15"
          disabled={isDisabled}
          aria-label="Open on ManiaExchange"
        >
          <Image alt="" src={mxPlanetLogo} className="size-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Open on ManiaExchange</TooltipContent>
    </Tooltip>
  );
}
