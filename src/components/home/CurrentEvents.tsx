import Image from "next/image";

import { gql } from "@/app/__generated__";
import { query } from "@/app/ApolloClient";
import { SubPanel } from "@/components/layout/Panel";
import { MPFormatLink } from "@/components/MPFormat";
import podiumImg from "../../../public/img/podium.svg";
import catchGqlError from "@/lib/catchError";

const GET_TRENDING_EVENT_EDITIONS = gql(/* GraphQL */ `
  query GetTrendingEventEditions($limit: Int, $lastDays: Int, $lbLimit: Int) {
    trendingEventEditions(limit: $limit, lastDays: $lastDays) {
      id
      name
      event {
        handle
      }
      mappack {
        leaderboard(limit: $lbLimit) {
          rank
          player {
            login
            name
          }
        }
      }
    }
  }
`);

/** Where each podium place sits around the podium image. */
const PODIUM_PLACES = [
  "col-start-2 row-start-1 text-center text-2xl",
  "col-start-1 row-start-2 text-right text-xl",
  "col-start-3 row-start-3 text-left",
];

export default async function CurrentEvents() {
  const { data } = await query({
    query: GET_TRENDING_EVENT_EDITIONS,
    variables: { limit: 2, lbLimit: 3 },
  }).catch(catchGqlError);

  const editions = data?.trendingEventEditions ?? [];

  if (editions.length === 0) {
    return (
      <SubPanel className="flex h-full items-center justify-center p-6 text-muted-foreground">
        No event is running right now.
      </SubPanel>
    );
  }

  return (
    <div className="flex h-full flex-1 flex-col gap-2 md:flex-row *:flex-1">
      {editions.map((edition, i) => (
        // The API can surface the same edition twice, so the index disambiguates.
        <SubPanel key={`${edition.event.handle}-${edition.id}-${i}`}>
          <div className="flex h-full flex-col items-center p-2">
            <h3 className="m-0 truncate text-base font-bold">
              <MPFormatLink
                path={`/event/${edition.event.handle}/${edition.id}`}
              >
                {edition.name}
              </MPFormatLink>
            </h3>

            <div className="m-auto grid grid-cols-3 grid-rows-4 gap-x-2 p-5">
              <Image
                src={podiumImg}
                alt=""
                className="col-start-2 row-span-full row-start-2"
              />

              {(edition.mappack?.leaderboard ?? [])
                .slice(0, 3)
                .map((entry, i) => (
                  <span
                    key={entry.player.login}
                    className={`min-w-0 truncate ${PODIUM_PLACES[i]}`}
                  >
                    <MPFormatLink path={`/player/${entry.player.login}`}>
                      {entry.player.name}
                    </MPFormatLink>
                  </span>
                ))}
            </div>
          </div>
        </SubPanel>
      ))}
    </div>
  );
}
