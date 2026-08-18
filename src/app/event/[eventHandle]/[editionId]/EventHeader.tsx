import { format } from "date-fns";
import { CalendarDays, Map as MapIcon, RefreshCw } from "lucide-react";
import { Fragment } from "react";

import type { GetCampaignLeaderboardQuery } from "@/app/__generated__/graphql";
import Countdown from "@/components/Countdown";
import { parseApiDate } from "@/lib/date";
import { Panel, SubPanel } from "@/components/layout/Panel";
import MPFormat, { MPFormatLink } from "@/components/MPFormat";
import { Badge } from "@/components/ui/badge";

type Edition = NonNullable<GetCampaignLeaderboardQuery["event"]["edition"]>;

function Authors({ admins }: { admins: Edition["admins"] }) {
  if (admins.length === 0) return null;

  return (
    <span className="text-sm">
      By{" "}
      {admins.map((admin, i) => (
        <Fragment key={admin.login}>
          <MPFormatLink path={`/player/${admin.login}`}>
            {admin.name}
          </MPFormatLink>
          {i < admins.length - 2 ? ", " : i === admins.length - 2 ? " and " : ""}
        </Fragment>
      ))}
    </span>
  );
}

/** Freshness of the mappack leaderboard, which the API recomputes in batches. */
function UpdateBadge({ edition }: { edition: Edition }) {
  const nextUpdateIn = edition.mappack?.nextUpdateIn;

  if (!nextUpdateIn) {
    return <Badge variant="destructive">Expired</Badge>;
  }

  const expiresIn = edition.expiresIn;
  if (expiresIn != null && expiresIn >= 0 && expiresIn < nextUpdateIn) {
    return (
      <Badge className="bg-medal-bronze text-background">
        Expires in <Countdown start={expiresIn} />
      </Badge>
    );
  }

  return (
    <Badge variant="secondary">
      <RefreshCw />
      Next update in <Countdown start={nextUpdateIn} />
    </Badge>
  );
}

export default function EventHeader({
  edition,
  admins,
}: {
  edition: Edition;
  admins: Edition["admins"];
}) {
  return (
    <Panel>
      {/* Dark whichever theme is on — `dark` re-declares the palette for this
          subtree. What the header has to hold against is the edition's own
          banner under the scrim, not the page around it. */}
      <SubPanel
        className="dark gap-3 border border-transparent bg-black/50 bg-cover bg-center p-5 shadow-[inset_0_0_7em_black]"
        style={
          edition.bannerImgUrl
            ? { backgroundImage: `url(${edition.bannerImgUrl})` }
            : undefined
        }
      >
        <div>
          <h2 className="m-0 text-2xl font-black drop-shadow-[2px_2px_10px_black]">
            <MPFormat>{edition.name}</MPFormat>
            {edition.subtitle ? ` ${edition.subtitle}` : ""}
          </h2>
          <Authors admins={admins} />
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">
            <CalendarDays />
            {format(parseApiDate(edition.startDate), "dd/MM/yyyy")}
          </Badge>

          {edition.mappack && (
            <Badge variant="secondary">
              <MapIcon />
              {edition.mappack.nbMaps} maps
            </Badge>
          )}

          <UpdateBadge edition={edition} />
        </div>
      </SubPanel>
    </Panel>
  );
}
