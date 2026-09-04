import { Flag, Map as MapIcon } from "lucide-react";

import { type MapInfoFragment, MxIdStatus } from "@/app/__generated__/graphql";
import Link from "@/components/Link";
import { Panel, SubPanel } from "@/components/layout/Panel";
import MPFormat, { MPFormatLink } from "@/components/MPFormat";
import { Badge } from "@/components/ui/badge";
import FallbackMxButton from "./FallbackMxButton";
import MxButton from "./MxButton";

/**
 * The event edition a map is being looked at through.
 *
 * An edition keeps a copy of every map it runs, with records of its own, so the
 * page has to say which edition this is and where the map it was taken from
 * lives.
 */
export type MapEventContext = {
  handle: string;
  editionId: number;
  /** The edition's name, subtitle included. */
  name: string;
  /** The map this copy was made from, when there is one to link to. */
  originalGameId?: string | null;
};

/** One of the places this map can also be played, as a badge. */
function MapBadge({
  href,
  children,
}: React.PropsWithChildren<{ href: string }>) {
  return (
    <Badge variant="secondary" asChild>
      <Link href={href}>{children}</Link>
    </Badge>
  );
}

export default function MapInfo({
  map,
  event,
}: {
  map: MapInfoFragment;
  event?: MapEventContext;
}) {
  // The edition being looked at gets a badge of its own below, pointing at the
  // event rather than at this very page.
  const otherEditions = map.relatedEventEditions.filter(
    (related) =>
      !event ||
      related.edition.event.handle !== event.handle ||
      related.edition.id !== event.editionId,
  );

  return (
    <Panel className="flex-row items-start">
      {/* Placeholder thumbnail: the API has no map previews. Sitting one inset
          in from the panel, it takes the panel's radius so both corners curve
          together. */}
      <div className="flex aspect-square h-full min-w-(--profile-picture-size) shrink-0 items-center justify-center rounded-panel bg-sunken">
        <MapIcon className="size-1/3" />
      </div>

      <SubPanel className="h-full w-full min-w-0 gap-3 px-5 py-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col gap-inset">
            <div className="min-w-0">
              <h2 className="m-0 truncate text-2xl font-bold">
                <MPFormat>{map.name}</MPFormat>
              </h2>

              <h3 className="m-0 truncate text-base">
                by{" "}
                <MPFormatLink path={`/player/${map.player.login}`}>
                  {map.player.name}
                </MPFormatLink>
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {!!map.cpsNumber && (
                <Badge variant="secondary">
                  <Flag />
                  {map.cpsNumber} cp{map.cpsNumber > 1 ? "s" : ""}
                </Badge>
              )}

              {event && (
                <MapBadge href={`/event/${event.handle}/${event.editionId}`}>
                  {event.name}
                </MapBadge>
              )}

              {event?.originalGameId && (
                <MapBadge href={`/map/${event.originalGameId}`}>
                  Original map
                </MapBadge>
              )}

              {otherEditions.map((related) => (
                <MapBadge
                  key={`${related.edition.event.handle}-${related.edition.id}`}
                  href={`/event/${related.edition.event.handle}/${related.edition.id}/map/${related.map.gameId}`}
                >
                  {related.edition.name}
                  {related.edition.subtitle
                    ? ` ${related.edition.subtitle}`
                    : ""}
                </MapBadge>
              ))}
            </div>
          </div>

          {map.mxIdStatus === MxIdStatus.Unknown ? (
            <FallbackMxButton mapUid={map.gameId} />
          ) : (
            <MxButton mxId={map.mxId ?? null} />
          )}
        </div>
      </SubPanel>
    </Panel>
  );
}
