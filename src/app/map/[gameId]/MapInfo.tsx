import { Flag, Map as MapIcon } from "lucide-react";

import type { GetMapQuery } from "@/app/__generated__/graphql";
import Link from "@/components/Link";
import { Panel, SubPanel } from "@/components/layout/Panel";
import MPFormat, { MPFormatLink } from "@/components/MPFormat";
import { Badge } from "@/components/ui/badge";
import MxButton from "./MxButton";

export default function MapInfo({ map }: { map: GetMapQuery["map"] }) {
  return (
    <Panel className="flex-row items-start">
      {/* Placeholder thumbnail: the API has no map previews. Sitting one inset
          in from the panel, it takes the panel's radius so both corners curve
          together. */}
      <div className="flex aspect-square w-(--profile-picture-size) shrink-0 items-center justify-center rounded-panel bg-black">
        <MapIcon className="size-1/3" />
      </div>

      <SubPanel className="h-full w-full min-w-0 gap-3 px-5 py-2">
        <div className="flex items-start justify-between gap-2">
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

          <MxButton gameId={map.gameId} />
        </div>

        <div className="flex flex-wrap gap-2">
          {!!map.cpsNumber && (
            <Badge variant="secondary">
              <Flag />
              {map.cpsNumber} cp{map.cpsNumber > 1 ? "s" : ""}
            </Badge>
          )}

          {map.relatedEventEditions.map((related) => (
            <Badge
              key={`${related.edition.event.handle}-${related.edition.id}`}
              variant="secondary"
              asChild
            >
              <Link
                href={`/event/${related.edition.event.handle}/${related.edition.id}/map/${related.map.gameId}`}
              >
                {related.edition.name}
                {related.edition.subtitle ? ` ${related.edition.subtitle}` : ""}
              </Link>
            </Badge>
          ))}
        </div>
      </SubPanel>
    </Panel>
  );
}
