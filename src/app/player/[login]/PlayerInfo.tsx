import { AtSign, Flag, Gauge, User } from "lucide-react";

import type { GetPlayerQuery } from "@/app/__generated__/graphql";
import { PlayerRole } from "@/app/__generated__/graphql";
import { Panel, SubPanel } from "@/components/layout/Panel";
import MPFormat from "@/components/MPFormat";
import { Badge } from "@/components/ui/badge";

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
      <div className="flex aspect-square w-(--profile-picture-size) shrink-0 items-center justify-center rounded-full bg-sunken">
        <User className="size-1/3" />
      </div>

      <SubPanel className="h-full w-full min-w-0 gap-3 px-5 py-2">
        <h2 className="m-0 truncate text-2xl font-bold">
          <MPFormat>{player.name}</MPFormat>
        </h2>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">
            <AtSign />
            <code>{player.login}</code>
          </Badge>

          <Badge variant="secondary">
            <Gauge />
            Score:{" "}
            {player.score.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </Badge>

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
