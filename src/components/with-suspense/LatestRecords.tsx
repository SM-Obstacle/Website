import { gql } from "@/app/__generated__";
import { query } from "@/app/ApolloClient";
import type { GlobalRankedRecord } from "@/lib/ranked-record";
import { css } from "../../../@shadow-panda/styled-system/css";
import { MPFormatLink } from "../MPFormat";
import Time from "../Time";
import { SiSharp } from "react-icons/si";
import { FormattedTimeAgo } from "../FormattedDate";

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

export default async function LatestRecords() {
  const { data } = await query({
    query: GET_RECORDS,
    variables: {
      first: 5,
    },
  });

  const records = data?.recordsConnection.nodes as GlobalRankedRecord[];

  return (
    <ul
      className={css({
        display: "flex",
        flexDir: "column",
        gap: "token(spacing.2)",
        margin: 0,
        padding:
          "token(spacing.2) token(spacing.5) token(spacing.2) token(spacing.5)",
        fontSize: "lg",
      })}
    >
      {records.map((record) => (
        <li
          className={css({
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          })}
          key={record.id}
        >
          <span
            className={css({
              flexBasis: "100%",
              flexGrow: 2,
              overflowX: "hidden",
              textOverflow: "ellipsis",
              textWrap: "nowrap",
              me: "token(spacing.2)",
            })}
          >
            <MPFormatLink path={`/player/${record.player.login}`}>
              {record.player.name}
            </MPFormatLink>{" "}
            finished{" "}
            <MPFormatLink path={`/map/${record.map.gameId}`}>
              {record.map.name}
            </MPFormatLink>{" "}
            in{" "}
            <span
              className={css({
                fontWeight: "bold",
                fontStyle: "italic",
                color: "#346AB4",
              })}
            >
              <Time>{record.time}</Time>
            </span>
          </span>
          <span
            className={css({
              flexBasis: "50%",
              flexGrow: 2,
            })}
          >
            <FormattedTimeAgo>{record.recordDate}</FormattedTimeAgo>
          </span>
          <span
            className={css({
              flexBasis: "20%",
              flexGrow: 1,
              display: "flex",
              flexDir: "row",
              justifyContent: "end",
              alignItems: "center",
              gap: 1,
            })}
          >
            {record.rank}
            <SiSharp
              className={css({
                fontSize: "sm",
              })}
            />
          </span>
        </li>
      ))}
    </ul>
  );
}
