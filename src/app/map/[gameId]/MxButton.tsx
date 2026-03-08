"use client";

import { useRef, useState } from "react";
import { ToolbarInput } from "@/components/ToolbarWrapper";
import { Button } from "@/components/ui/molecules/Button";
import Image from "next/image";
import mxPlanetLogo from "@/../public/img/planet_mx_logo.png";
import { css } from "@shadow-panda/styled-system/css";

// TODO: fetch our API instead of MX
export default function MxButton({ gameId }: { gameId: string }) {
  const mxUrl = useRef<string | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const openMxUrl = () => {
    if (mxUrl.current) {
      window.open(mxUrl.current, "_blank");
    }
  };

  const handleMxClick = async () => {
    if (typeof mxUrl.current === "string") {
      openMxUrl();
    } else {
      const mapsIds: { TrackID: number }[] = await fetch(
        `https://sm.mania.exchange/api/maps/get_map_info/multi/${gameId}`,
      )
        .then((res) => res.json())
        .catch((e) => {
          alert(`Error when fetching the MX API: ${e}`);
          setIsDisabled(true);
        });

      if (mapsIds.length > 0) {
        mxUrl.current = `https://sm.mania-exchange.com/maps/${mapsIds[0].TrackID}`;
        openMxUrl();
      } else {
        alert("This map does not seem to be uploaded to sm.mania.exchange");
        setIsDisabled(true);
      }
    }
  };

  return (
    <Button
      onClick={handleMxClick}
      size="icon"
      className={css({
        bgColor: "black",
        rounded: "full",
      })}
      disabled={isDisabled}
    >
      <Image alt="MX logo" src={mxPlanetLogo} />
    </Button>
  );
}
