import { gql } from "@/app/__generated__";
import { GetPlayerRecordsQuery } from "@/app/__generated__/graphql";
import { query } from "@/app/ApolloClient";
import FormattedDate from "@/components/FormattedDate";
import { MPFormatLink } from "@/components/MPFormat";
import NonOverwritingForm from "@/components/NonOverwritingForm";
import Time from "@/components/Time";
import { Button } from "@/components/ui/molecules/Button";
import { SubBlock } from "@/components/ui/organisms/Block";
import { Table as StyledTable, Thead } from "@/components/ui/organisms/Table";
import { css, Styles } from "@shadow-panda/styled-system/css";
import { FaArrowDownLong, FaArrowUpLong } from "react-icons/fa6";

const GET_PLAYER_RECORDS = gql(/* GraphQL */ `
  query GetPlayerRecords(
    $login: String!
    $first: Int
    $last: Int
    $after: String
    $before: String
    $filter: RecordsFilter
  ) {
    player(login: $login) {
      recordsConnection(
        first: $first
        last: $last
        after: $after
        before: $before
        filter: $filter
      ) {
        nodes {
          map {
            gameId
            name
          }
          ...RecordBase
        }
      }
    }
  }
`);

const rankWidth = {
  width: "5%",
} satisfies Styles;
const mapWidth = {
  width: "80%",
} satisfies Styles;
const timeWidth = { width: "15%" } satisfies Styles;
const headerStyle = { textAlign: "left" } satisfies Styles;

function Table({
  records,
  isDesc,
}: {
  records: GetPlayerRecordsQuery["player"]["recordsConnection"]["nodes"];
  isDesc: boolean;
}) {
  return (
    <StyledTable>
      <Thead>
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
      </Thead>
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
    </StyledTable>
  );
}

export default async function PlayerRecords(
  props: PageProps<"/player/[login]">,
) {
  const params = await props.params;
  const login = params.login;

  const { data } = await query({
    query: GET_PLAYER_RECORDS,
    variables: { login, first: 10 },
  });

  return data === undefined ? (
    "Something went wrong"
  ) : (
    <SubBlock
      className={css({
        overflowY: "scroll",
      })}
    >
      <Table records={data.player.recordsConnection.nodes} isDesc={false} />
    </SubBlock>
  );
}
