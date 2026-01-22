import { gql } from "@/app/__generated__";
import { query } from "@/app/ApolloClient";
import { css } from "../../../@shadow-panda/styled-system/css";
import { SubBlock } from "../ui/organisms/Block";
import { H3 } from "../ui/atoms/typography";
import Image from "next/image";

import podiumImg from "../../../public/img/podium.svg";
import { MPFormatLink } from "../MPFormat";

const GET_TRENDING_EVENT_EDITIONS = gql(/* GraphQL */ `
  query GetTrendingEventEditions($limit: Int, $lastDays: Int, $lbLimit: Int) {
    trendingEventEditions(limit: $limit, lastDays: $lastDays) {
      name
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

export default async function CurrentEvents() {
  const { data } = await query({
    query: GET_TRENDING_EVENT_EDITIONS,
    variables: { limit: 2, lastDays: 30, lbLimit: 3 },
  });

  return (
    <div
      className={css({
        flexGrow: 1,
        display: "flex",
        flexDir: "column",
        height: "100%",
        gap: "token(spacing.2)",
        "& > *": {
          flex: 1,
        },
        md: {
          flexDir: "row",
        },
      })}
    >
      {(data?.trendingEventEditions ?? []).slice(0, 2).map((event, i) => (
        <SubBlock key={`${event.name}_${i}`}>
          <div
            className={css({
              display: "flex",
              flexDir: "column",
              alignItems: "center",
              height: "100%",
            })}
          >
            <H3 fontWeight="bold">{event.name}</H3>

            <div
              className={css({
                margin: "auto",
                display: "grid",
                gridTemplateColumns: "auto auto auto",
                gridTemplateRows: "auto auto auto auto",
                gridColumnGap: "token(spacing.2)",
                padding: "token(spacing.5)",
              })}
            >
              <Image
                src={podiumImg}
                alt="Podium image"
                className={css({
                  gridRow: "2 / 10",
                  gridColumn: 2,
                })}
              />

              {/* First */}
              {event.mappack?.leaderboard[0] && (
                <span
                  className={css({
                    fontSize: "2xl",
                    gridRow: 1,
                    gridColumn: 2,
                    textAlign: "center",
                  })}
                >
                  <MPFormatLink
                    path={`/player/${event.mappack.leaderboard[0].player.login}`}
                  >
                    {event.mappack.leaderboard[0].player.name}
                  </MPFormatLink>
                </span>
              )}

              {/* Second */}
              {event.mappack?.leaderboard[1] && (
                <span
                  className={css({
                    fontSize: "xl",
                    gridRow: 3,
                    gridColumn: 1,
                    textAlign: "right",
                  })}
                >
                  <MPFormatLink
                    path={`/player/${event.mappack.leaderboard[1].player.login}`}
                  >
                    {event.mappack.leaderboard[1].player.name}
                  </MPFormatLink>
                </span>
              )}

              {/* Third */}
              {event.mappack?.leaderboard[2] && (
                <span
                  className={css({
                    gridRow: 4,
                    gridColumn: 3,
                    textAlign: "left",
                  })}
                >
                  <MPFormatLink
                    path={`/player/${event.mappack.leaderboard[2].player.login}`}
                  >
                    {event.mappack.leaderboard[2].player.name}
                  </MPFormatLink>
                </span>
              )}
            </div>
          </div>
        </SubBlock>
      ))}
    </div>
  );
}
