"use client";

import { useMutation } from "@apollo/client/react";
import { LoaderCircle } from "lucide-react";

import { gql } from "@/app/__generated__";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import MxButton, { btnVariants, MxLogo } from "./MxButton";

const FORCE_FETCH_MX_ID = gql(/* GraphQL */ `
  mutation ForceFetchMxId($mapUid: String!) {
    forceFetchMxId(mapUid: $mapUid) {
      mxId
    }
  }
`);

/**
 * Shown in place of {@link MxButton} when the API has no answer about this map yet: pressing it
 * makes the API go and ask ManiaExchange right now, instead of waiting for it to be fetched in
 * the background.
 */
export default function FallbackMxButton({ mapUid }: { mapUid: string }) {
  const [forceFetchMxId, { data, loading, error }] = useMutation(
    FORCE_FETCH_MX_ID,
    { variables: { mapUid } },
  );

  // ManiaExchange answered: whether it has the map or not is exactly what MxButton renders, so
  // this button has nothing left to do.
  if (data) {
    return <MxButton mxId={data.forceFetchMxId.mxId ?? null} />;
  }

  const label = error
    ? "Couldn't reach ManiaExchange, try again"
    : "Try to open on ManiaExchange";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {/* A disabled button fires no pointer event, so the tooltip needs a wrapper of its own
            to stay reachable while the request is in flight. */}
        <span className="inline-block w-fit">
          <Button
            className={btnVariants}
            disabled={loading}
            aria-label={label}
            // The rejection is the same thing as `error` above, which is what we render.
            onClick={() => void forceFetchMxId().catch(() => {})}
          >
            {loading ? (
              <LoaderCircle className="size-5 animate-spin" />
            ) : (
              <MxLogo />
            )}
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
