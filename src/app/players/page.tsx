import { parseMapsFilter } from "@/lib/maps-filter";
import { gql } from "../__generated__";
import { parsePaginationInput } from "@/lib/cursor-pagination";
import { query } from "../ApolloClient";
import { SubBlock } from "@/components/ui/organisms/Block";
import { css, Styles } from "../../../@shadow-panda/styled-system/css";
import PaginationButtons from "@/components/ui/organisms/PaginationButtons";
import { GetMapsQuery, GetPlayersQuery } from "../__generated__/graphql";
import { MPFormatLink } from "@/components/MPFormat";
import { Table as StyledTable, Thead } from "@/components/ui/organisms/Table";
import { parsePlayersFilter } from "@/lib/players-filter";

const GET_PLAYERS = gql(/* GraphQL */ `
  query GetPlayers(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $filter: PlayersFilter
    $sort: PlayerMapRankingSort
  ) {
    players(
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
        rank
        player {
          id
          login
          name
          score
        }
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
const headerStyle = { textAlign: "left" } satisfies Styles;

function Table({ players }: { players: GetPlayersQuery["players"]["nodes"] }) {
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
          <th className={css(playerWidth, headerStyle)}>Player</th>
          <th
            className={css(headerStyle, {
              display: "none",
              md: {
                display: "revert",
                textAlign: "right",
                pe: "token(spacing.1)",
              },
            })}
          >
            Score
          </th>
        </tr>
      </Thead>
      <tbody>
        {players.map((player) => (
          <tr
            className={css({
              textAlign: "left",
              "& > td:last-child": {
                textAlign: "right",
              },
            })}
            key={player.player.id}
          >
            <td className={css({ textAlign: "right" })}>
              <code>{player.rank}</code>
            </td>
            <td
              className={css({
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxW: 0,
              })}
            >
              <MPFormatLink path={`/player/${player.player.login}`}>
                {player.player.name}
              </MPFormatLink>
            </td>
            <td
              className={css({
                display: "none",
                md: {
                  display: "revert",
                },
              })}
            >
              <code>
                {player.player.score.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </code>
            </td>
          </tr>
        ))}
      </tbody>
    </StyledTable>
  );
}

export default async function Players(props: PageProps<"/players">) {
  const searchParams = await props.searchParams;
  const filter = parsePlayersFilter(searchParams);
  const pagination = parsePaginationInput(searchParams);

  const { data } = await query({
    query: GET_PLAYERS,
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
          maxH: "calc(100vh - token(spacing.2) * 14 - token(sizes.logoSize) * 3)",
          overflowY: "scroll",
          lg: {
            maxH: "calc(100vh - token(spacing.2) * 11 - token(sizes.logoSize) * 2)",
          },
        })}
      >
        <Table players={data.players.nodes} />
      </SubBlock>
      <SubBlock>
        <PaginationButtons action="/players" pageInfo={data.players.pageInfo} />
      </SubBlock>
    </>
  );
}
