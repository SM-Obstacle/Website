import FormattedDate from "@/components/FormattedDate";
import { MPFormatLink } from "@/components/MPFormat";
import Time from "@/components/Time";
import { SubBlock } from "@/components/ui/Block";
import { parseRecordsFilter } from "@/lib/records-filter";
import { css } from "../../../@shadow-panda/styled-system/css";
import { gql } from "../__generated__";
import type { GetRecordsConnectionQuery } from "../__generated__/graphql";
import { query } from "../ApolloClient";
import PaginationButtons from "./PaginationButtons";
import { parsePaginationInput } from "@/lib/cursor-pagination";

const GET_RECORDS = gql(/* GraphQL */ `
  query GetRecordsConnection(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $filter: RecordsFilter
  ) {
    recordsConnection(
      first: $first
      last: $last
      before: $before
      after: $after
      filter: $filter
    ) {
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
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

function Table({
  records,
}: {
  records: GetRecordsConnectionQuery["recordsConnection"]["nodes"];
}) {
  return (
    <table
      className={css({
        display: "flex",
        flexDir: "column",
        width: "100%",
        borderSpacing: 0,
        textOverflow: "ellipsis",
        height: "100%",
        "& tr": {
          display: "flex",
          width: "100%",
        },
        "& td": {
          flexBasis: "100%",
          flexGrow: 2,
          display: "block",
        },
        "& th": {
          flexBasis: "100%",
          flexGrow: 2,
          display: "block",
        },
      })}
    >
      <thead
        className={css({
          display: "block",
          bgColor: "token(colors.mainBg)",
          width: "100%",
        })}
      >
        <tr
          className={css({
            display: "flex",
            textAlign: "left",
            "& > *:last-child": {
              textAlign: "right",
              display: "flex",
              justifyContent: "end",
            },
          })}
        >
          <th
            className={css({
              flexBasis: "20%",
              flexGrow: 1,
            })}
          >
            #
          </th>
          <th>Player</th>
          <th>Map</th>
          <th>Time</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody
        className={css({
          width: "100%",
          display: "flex",
          flexDir: "column",
          flexGrow: 1,
          overflowY: "auto",
          height: 0,
        })}
      >
        {records.map((record) => (
          <tr
            className={css({
              textAlign: "left",
              "& > *:last-child": {
                display: "flex",
                justifyContent: "end",
                textAlign: "right",
              },
              borderTop: "solid transparent",
              borderBottom: "solid transparent",
              transition: "border 0.1s, borderBottom 0.1s",
              _hover: {
                borderTop: "solid token(colors.blue.500)",
                borderBottom: "solid token(colors.blue.500)",
              },
            })}
            key={record.id}
          >
            <td
              className={css({
                flexGrow: 0.5,
              })}
            >
              {record.rank}
            </td>
            <td>
              <MPFormatLink path={`/player/${record.player.login}`}>
                {record.player.name}
              </MPFormatLink>
            </td>
            <td>
              <MPFormatLink path={`/map/${record.map.gameId}`}>
                {record.map.name}
              </MPFormatLink>
            </td>
            <td>
              <Time>{record.time}</Time>
            </td>
            <td>
              <FormattedDate onlyDate>{record.recordDate}</FormattedDate>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default async function Records(props: PageProps<"/records">) {
  const searchParams = await props.searchParams;
  const filter = parseRecordsFilter(searchParams);
  const pagination = parsePaginationInput(searchParams);

  const { data } = await query({
    query: GET_RECORDS,
    variables: {
      filter,
      ...pagination,
    },
  });

  return data === undefined ? (
    "Something went wrong"
  ) : (
    <>
      <SubBlock
        className={css({
          height: "100%",
        })}
      >
        <Table records={data.recordsConnection.nodes} />
      </SubBlock>
      <SubBlock>
        <PaginationButtons pageInfo={data.recordsConnection.pageInfo} />
      </SubBlock>
    </>
  );
}
