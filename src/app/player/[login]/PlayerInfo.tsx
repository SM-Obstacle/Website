import {
  AtSign,
  CalendarDays,
  Flag,
  Gauge,
  ListOrdered,
  User,
} from "lucide-react";
import { Suspense } from "react";

import type { GetPlayerQuery } from "@/app/__generated__/graphql";
import { PlayerRole } from "@/app/__generated__/graphql";
import FormattedDate from "@/components/FormattedDate";
import { Panel, SubPanel } from "@/components/layout/Panel";
import MPFormat from "@/components/MPFormat";
import { Badge } from "@/components/ui/badge";
import PlayerMapsButton from "./PlayerMapsButton";

function PlayerZone({ zonePath }: { zonePath: string | null | undefined }) {
  if (!zonePath) return null;
  const [world, continent, country] = zonePath.split("|").slice(0, 3);

  return (
    <span>
      <span className="hidden md:inline">
        {world}/{continent}/
      </span>
      <span>{country}</span>
    </span>
  );
}

export default function PlayerInfo({
  player,
}: {
  player: GetPlayerQuery["player"];
}) {
  return (
    <Panel className="flex-row items-center">
      {/* Placeholder avatar: the API has no profile pictures. */}
      <div className="flex size-(--profile-picture-size) shrink-0 items-center justify-center rounded-full bg-sunken">
        <User className="size-1/3" />
      </div>

      <SubPanel className="h-full w-full min-w-0 gap-2 px-3 py-2 sm:gap-3 sm:px-5">
        <div className="flex items-center gap-3">
          <h2 className="m-0 min-w-0 flex-1 truncate text-xl font-bold sm:text-2xl">
            <MPFormat>{player.name}</MPFormat>
          </h2>

          <Suspense>
            <PlayerMapsButton />
          </Suspense>
        </div>

        {/* One line on phones, scrolling sideways, so a long list of badges
            never makes the header taller and squeezes the records below. */}
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 [mask-image:linear-gradient(to_right,black_85%,transparent)] [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 sm:[mask-image:none]">
          <Badge variant="secondary">
            <AtSign />
            <code>{player.login}</code>
          </Badge>

          <Badge variant="secondary" title="Score">
            <Gauge />
            <span className="hidden sm:inline">Score:</span>
            {player.score.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </Badge>

          <Badge variant="secondary" title="Records">
            <ListOrdered />
            {player.recordsAmount.toLocaleString()}
            <span className="hidden sm:inline">
              record{player.recordsAmount === 1 ? "" : "s"}
            </span>
          </Badge>

          {player.joinDate && (
            <Badge variant="secondary" title="Join date">
              <CalendarDays />
              <span className="hidden sm:inline">Joined</span>
              <FormattedDate onlyDate>{player.joinDate}</FormattedDate>
            </Badge>
          )}

          {player.zonePath && (
            <Badge variant="secondary">
              <Flag />
              <PlayerZone zonePath={player.zonePath} />
            </Badge>
          )}

          <Badge
            variant={
              player.role === PlayerRole.Player ? "secondary" : "destructive"
            }
          >
            {player.role}
          </Badge>
        </div>
      </SubPanel>
    </Panel>
  );
}
