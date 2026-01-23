import FormattedDate from "@/components/FormattedDate";
import { MPFormatLink } from "@/components/MPFormat";
import Time from "@/components/Time";
import { SubBlock } from "@/components/ui/organisms/Block";
import { parseRecordsFilter } from "@/lib/records-filter";
import { css, Styles } from "../../../@shadow-panda/styled-system/css";
import { gql } from "../__generated__";
import {
  SortOrder,
  UnorderedRecordSortableField,
  type GetRecordsConnectionQuery,
} from "../__generated__/graphql";
import { query } from "../ApolloClient";
import PaginationButtons from "./PaginationButtons";
import { parsePaginationInput } from "@/lib/cursor-pagination";
import { Button } from "@/components/ui/molecules/Button";
import NonOverwritingForm from "./NonOverwritingForm";
import { FaArrowDownLong, FaArrowUpLong } from "react-icons/fa6";

const GET_RECORDS = gql(/* GraphQL */ `
  query GetRecordsConnection(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $filter: RecordsFilter
    $sort: UnorderedRecordSort
  ) {
    recordsConnection(
      first: $first
      last: $last
      before: $before
      after: $after
      filter: $filter
      sort: $sort
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

const rankWidth = {
  width: "5%",
} satisfies Styles;
const playerWidth = {
  width: "40%",
} satisfies Styles;
const mapWidth = {
  width: "40%",
} satisfies Styles;
const timeWidth = { width: "15%" } satisfies Styles;
const headerStyle = { textAlign: "left" } satisfies Styles;

function Table({
  records,
  isDesc,
}: {
  records: GetRecordsConnectionQuery["recordsConnection"]["nodes"];
  isDesc: boolean;
}) {
  return (
    <table
      className={css({
        margin: "token(spacing.2) token(spacing.5)",
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
              bgColor: "#AAA1",
            },
          },
        },
      })}
    >
      <thead
        className={css({
          fontSize: "larger",
          position: "sticky",
          top: 0,
        })}
      >
        <tr
          className={css({
            "& th": {
              bgColor: "#000A",
            },
          })}
        >
          <th className={css(rankWidth, headerStyle, { textAlign: "center" })}>
            #
          </th>
          <th className={css(playerWidth, headerStyle)}>Player</th>
          <th className={css(mapWidth, headerStyle)}>Map</th>
          <th className={css(timeWidth, headerStyle)}>Time</th>
          <th
            className={css(headerStyle, {
              display: "none",
              md: {
                textAlign: "right",
                pe: "token(spacing.1)",

                display: "flex",
                justifyContent: "end",
                alignItems: "center",
                gap: "token(spacing.1)",
              },
            })}
          >
            <NonOverwritingForm
              action="/records"
              keysToRemove={["first", "after", "before", "last"]}
            >
              <input
                type="hidden"
                name="order"
                id="order"
                value={isDesc ? "asc" : "desc"}
              />
              <Button
                className={css({
                  maxW: "calc(token(sizes.logoSize) - token(spacing.2) * 2)",
                  maxH: "calc(token(sizes.logoSize) - token(spacing.2) * 2)",
                  p: 0,
                  ps: "token(spacing.2)",
                  pe: "token(spacing.2)",
                  bg: "black",
                  color: "white",
                  border: "solid transparent 1px",
                  transition: "border-color .1s",
                  _hover: {
                    borderColor: "white",
                  },
                })}
                type="submit"
              >
                {isDesc ? <FaArrowUpLong /> : <FaArrowDownLong />}
              </Button>
            </NonOverwritingForm>
            Date
          </th>
        </tr>
      </thead>
      <tbody>
        {records.map((record) => (
          <tr
            className={css({
              textAlign: "left",
              "& > td:last-child": {
                textAlign: "right",
              },
            })}
            key={record.id}
          >
            <td className={css({ textAlign: "right" })}>
              <code>{record.rank}</code>
            </td>
            <td
              className={css({
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxW: 0,
              })}
            >
              <MPFormatLink path={`/player/${record.player.login}`}>
                {record.player.name}
              </MPFormatLink>
            </td>
            <td
              className={css({
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxW: 0,
              })}
            >
              <MPFormatLink path={`/map/${record.map.gameId}`}>
                {record.map.name}
              </MPFormatLink>
            </td>
            <td>
              <span
                className={css({
                  fontStyle: "italic",
                  color: "#346AB4",
                  fontWeight: "bold",
                })}
              >
                <code>
                  <Time>{record.time}</Time>
                </code>
              </span>
            </td>
            <td
              className={css({
                display: "none",
                md: {
                  display: "revert",
                },
              })}
            >
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

  let sort = undefined;
  if (searchParams.order === "desc") {
    sort = {
      field: UnorderedRecordSortableField.Date,
      order: SortOrder.Descending,
    };
  }

  const { data } = await query({
    query: GET_RECORDS,
    variables: {
      filter,
      ...pagination,
      ...(sort && {
        sort,
      }),
    },
  });

  return data === undefined ? (
    "Something went wrong"
  ) : (
    <>
      <SubBlock
        className={css({
          height: "100%",
          maxH: "calc(100vh - token(spacing.2) * 14 - token(sizes.logoSize) * 3)",
          overflowY: "scroll",
          lg: {
            maxH: "calc(100vh - token(spacing.2) * 11 - token(sizes.logoSize) * 2)",
          },
        })}
      >
        <Table
          records={data.recordsConnection.nodes}
          isDesc={sort !== undefined}
        />
      </SubBlock>
      <SubBlock>
        <PaginationButtons pageInfo={data.recordsConnection.pageInfo} />
      </SubBlock>
    </>
  );
}
