import { parseMapsFilter } from "@/lib/maps-filter";
import { gql } from "../__generated__";
import { parsePaginationInput } from "@/lib/cursor-pagination";
import { query } from "../ApolloClient";
import { SubBlock } from "@/components/ui/organisms/Block";
import { css, Styles } from "../../../@shadow-panda/styled-system/css";
import PaginationButtons from "@/components/ui/organisms/PaginationButtons";
import { GetMapsQuery } from "../__generated__/graphql";
import NonOverwritingForm from "@/components/NonOverwritingForm";
import { MPFormatLink } from "@/components/MPFormat";
import { Table as StyledTable, Thead } from "@/components/ui/organisms/Table";

const GET_MAPS = gql(/* GraphQL */ `
  query GetMaps(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $filter: MapsFilter
    $sort: PlayerMapRankingSort
  ) {
    maps(
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
        map {
          id
          gameId
          name
          score
          player {
            login
            name
          }
        }
      }
    }
  }
`);

const rankWidth = {
  width: "5%",
} satisfies Styles;
const mapWidth = {
  width: "40%",
} satisfies Styles;
const authorWidth = {
  width: "40%",
} satisfies Styles;
const headerStyle = { textAlign: "left" } satisfies Styles;

function Table({ maps }: { maps: GetMapsQuery["maps"]["nodes"] }) {
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
          <th className={css(authorWidth, headerStyle)}>Author</th>
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
        {maps.map((map) => (
          <tr
            className={css({
              textAlign: "left",
              "& > td:last-child": {
                textAlign: "right",
              },
            })}
            key={map.map.id}
          >
            <td className={css({ textAlign: "right" })}>
              <code>{map.rank}</code>
            </td>
            <td
              className={css({
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxW: 0,
              })}
            >
              <MPFormatLink path={`/map/${map.map.gameId}`}>
                {map.map.name}
              </MPFormatLink>
            </td>
            <td
              className={css({
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxW: 0,
              })}
            >
              <MPFormatLink path={`/player/${map.map.player.login}`}>
                {map.map.player.name}
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
                {map.map.score.toLocaleString(undefined, {
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

export default async function Maps(props: PageProps<"/maps">) {
  const searchParams = await props.searchParams;
  const filter = parseMapsFilter(searchParams);
  const pagination = parsePaginationInput(searchParams);

  const { data } = await query({
    query: GET_MAPS,
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
        <Table maps={data.maps.nodes} />
      </SubBlock>
      <SubBlock>
        <PaginationButtons action="/maps" pageInfo={data.maps.pageInfo} />
      </SubBlock>
    </>
  );
}
