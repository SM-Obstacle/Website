import { gql } from "@/app/__generated__";
import { GetMapInfoQuery, SortState } from "@/app/__generated__/graphql";
import { Metadata, ResolvingMetadata } from "next";
import { cache } from "react";
import MxButton from "./MxButton";
import MPFormat, { MPFormatLink } from "@/components/MPFormat";
import Time, { Date } from "@/components/Time";
import { RankedRecordOfMap } from "@/lib/ranked-record";
import { fetchGraphql } from "@/lib/utils";
import { ServerProps, getSortState } from "@/lib/server-props";
import { parse, toPlainText } from "@/lib/mpformat/mpformat";

const MAP_RECORDS_FRAGMENT = gql(/* GraphQL */ `
  fragment MapRecords on Map {
    records(rankSortBy: $rankSortBy, dateSortBy: $dateSortBy) {
      player {
        login
        name
      }
      ...RecordBase
    }
  }
`);

const GET_MAP_INFO = gql(/* GraphQL */ `
  query GetMapInfo(
    $gameId: String!
    $dateSortBy: SortState
    $rankSortBy: SortState
  ) {
    map(gameId: $gameId) {
      gameId
      name
      cpsNumber
      reversed
      player {
        login
        name
      }
      ...MapRecords
    }
  }
`);

const SORT_MAP_RECORDS = gql(/* GraphQL */ `
  query SortMapRecords(
    $gameId: String!
    $dateSortBy: SortState
    $rankSortBy: SortState
  ) {
    map(gameId: $gameId) {
      ...MapRecords
    }
  }
`);

type SP = ServerProps<{ gameId: string }, { dateSortBy?: string, rankSortBy?: string }>;

type MapRecordsProperty = GetMapInfoQuery["map"] & {
  records: RankedRecordOfMap[];
};

const fetchMapInfo = cache(async (gameId: string, dateSortBy?: SortState, rankSortBy?: SortState) => {
  return fetchGraphql(GET_MAP_INFO, { gameId, dateSortBy, rankSortBy });
});

export async function generateMetadata(
  {
    params,
    searchParams,
  }: SP,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const oldTitle = (await parent).title?.absolute;
  const mapInfo = (await fetchMapInfo(params.gameId, getSortState(searchParams["dateSortBy"]), getSortState(searchParams["rankSortBy"]))).map;

  return {
    title: `${oldTitle} - ${toPlainText(parse(mapInfo.name))}`,
  };
}

export default async function MapRecords({
  params,
  searchParams,
}: SP) {
  const data = await fetchMapInfo(params.gameId, getSortState(searchParams["dateSortBy"]), getSortState(searchParams["rankSortBy"]));
  const mapInfo = data.map as MapRecordsProperty;

  let cpsNumberText = "";
  const cpsNumber = data.map.cpsNumber;
  if (typeof cpsNumber === "number") {
    cpsNumberText = `${cpsNumber} cp${cpsNumber > 1 ? 's' : ''}`
  }

  return (
    <>
      <div id="toolbar_wrapper">
        <h1><MPFormat>{mapInfo.name}</MPFormat></h1>
        <span>{cpsNumberText}</span>
        <span>
          <MPFormatLink
            path={`/player/${mapInfo.player.login}`}
            name={mapInfo.player.name}
          />
        </span>
        <MxButton gameId={mapInfo.gameId} />
      </div>

      <table>
        <thead>
          <tr>
            <th className="rank"><span>Rank</span></th>
            <th className="player"><span>Player</span></th>
            <th className="time"><span>Time</span></th>
            <th className="date"><span>Date</span></th>
          </tr>
        </thead>
        <tbody>
          {mapInfo.records.map((record) => (
            <tr tabIndex={0} key={record.id}>
              <td className="rank">{record.rank}</td>
              <td className="player">
                <MPFormatLink
                  path={`/player/${record.player.login}`}
                  name={record.player.name}
                />
              </td>
              <td className="time">
                <Time>{record.time}</Time>
              </td>
              <td className="date">
                <Date onlyDate>{record.recordDate}</Date>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}