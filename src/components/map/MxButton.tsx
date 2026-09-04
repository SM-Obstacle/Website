import Image from "next/image";

import mxPlanetLogo from "@/../public/img/planet_mx_logo.png";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const btnVariants = buttonVariants({
  size: "icon",
  className: "shrink-0 rounded-full! cursor-pointer p-2",
});

export function MxLogo() {
  return (
    <Image alt="Mania Exchange Logo" src={mxPlanetLogo} className="size-5" />
  );
}

export default function MxButton({ mxId }: { mxId: number | null }) {
  return mxId === null ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-block w-fit">
          <Button
            className={btnVariants}
            disabled
            aria-label="Map not available in ManiaExchange"
          >
            <MxLogo />
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>Map not available in ManiaExchange</TooltipContent>
    </Tooltip>
  ) : (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={`https://sm.mania-exchange.com/maps/${mxId}`}
          target="_blank"
          rel="noopeneer,noreferrer"
          className={btnVariants}
          aria-label="Open on ManiaExchange"
        >
          <MxLogo />
        </Link>
      </TooltipTrigger>
      <TooltipContent>Open on ManiaExchange</TooltipContent>
    </Tooltip>
  );
}
