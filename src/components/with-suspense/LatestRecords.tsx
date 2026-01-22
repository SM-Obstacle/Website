import { gql } from "@/app/__generated__";
import { query } from "@/app/ApolloClient";
import type { GlobalRankedRecord } from "@/lib/ranked-record";
import { css, Styles } from "../../../@shadow-panda/styled-system/css";
import { MPFormatLink } from "../MPFormat";
import Time from "../Time";
import { SiSharp } from "react-icons/si";
import { FormattedTimeAgo } from "../FormattedDate";
import { styled } from "../../../@shadow-panda/styled-system/jsx";
import { CiMedal } from "react-icons/ci";

const GET_RECORDS = gql(/* GraphQL */ `
  query GetRecords(
    $first: Int
    $last: Int
    $after: String
    $before: String
    $filter: RecordsFilter
  ) {
    recordsConnection(
      first: $first
      last: $last
      after: $after
      before: $before
      filter: $filter
    ) {
      nodes {
        player {
          login
          name
        }
        map {
          gameId
          name
        }
        ...RecordBase
      }
    }
  }
`);

const playerWidth = {
  width: "40%",
} satisfies Styles;
const mapWidth = {
  width: "40%",
} satisfies Styles;
const timeWidth = { width: "10%" } satisfies Styles;
const dateWidth = { width: "5%" } satisfies Styles;
const headerStyle = { textAlign: "left" } satisfies Styles;

export default async function LatestRecords() {
  const { data } = await query({
    query: GET_RECORDS,
    variables: {
      first: 5,
    },
  });

  const records = data?.recordsConnection.nodes as GlobalRankedRecord[];

  return (
    <div
      className={css({
        overflowX: "auto",
        flex: 1,
        minW: 0,
      })}
    >
      <table
        className={css({
          margin: "token(spacing.2) token(spacing.5)",
          width: "calc(100% - token(spacing.5) * 2)",
          "& tr": {
            whiteSpace: "nowrap",
            minW: "token(spacing.5)",
            "& td, & th": {
              padding: "token(spacing.1) token(spacing.1)",
              _first: {
                roundedStart: "token(radii.md)",
              },
              _last: {
                roundedEnd: "token(radii.md)",
              },
            },
            _even: {
              "& td": {
                bgColor: "#0002",
              },
            },
          },
        })}
      >
        <thead
          className={css({
            fontSize: "larger",
            opacity: 0.5,
          })}
        >
          <tr
            className={css({
              "& th": {
                bgColor: "#000A",
              },
            })}
          >
            <th className={css(playerWidth, headerStyle)}>Player</th>
            <th className={css(mapWidth, headerStyle)}>Map</th>
            <th className={css(timeWidth, headerStyle)}>Time</th>
            <th
              className={css(dateWidth, headerStyle, {
                display: "none",
                sm: {
                  display: "revert",
                },
              })}
            >
              Date
            </th>
            <th
              className={css({
                textAlign: "right",
                pe: "token(spacing.1)",
              })}
            >
              #
            </th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td
                className={css({
                  width: "40%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxW: 0,
                })}
              >
                <MPFormatLink
                  path={`/player/${record.player.login}`}
                  fontWeight="bold"
                >
                  {record.player.name}
                </MPFormatLink>
              </td>
              <td
                className={css({
                  width: "40%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxW: 0,
                })}
              >
                <MPFormatLink
                  path={`/map/${record.map.gameId}`}
                  fontWeight="bold"
                >
                  {record.map.name}
                </MPFormatLink>
              </td>
              <td className={css({ width: "10%" })}>
                <span
                  className={css({
                    fontStyle: "italic",
                    color: "#346AB4",
                    fontWeight: "bold",
                  })}
                >
                  <Time>{record.time}</Time>
                </span>
              </td>
              <td
                className={css({
                  display: "none",
                  sm: {
                    width: "5%",
                    display: "revert",
                  },
                })}
              >
                <FormattedTimeAgo>{record.recordDate}</FormattedTimeAgo>
              </td>
              <td
                data-rank={`r${record.rank}`}
                className={css({
                  // TODO: save these colors
                  "--gold-color": "#e6c043",
                  "--silver-color": "#C4C4C4",
                  "--bronze-color": "#CE8946",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "end",
                  "&[data-rank=r1], &[data-rank=r2], &[data-rank=r3]": {
                    fontWeight: "bold",
                    textShadow: "md",
                  },
                  "&[data-rank=r3]": {
                    color: "var(--bronze-color)",
                  },
                  "&[data-rank=r2]": {
                    color: "var(--silver-color)",
                  },
                  "&[data-rank=r1]": {
                    color: "var(--gold-color)",
                  },
                })}
              >
                <CiMedal />
                {record.rank}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
