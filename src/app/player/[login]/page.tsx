import { gql } from "@/app/__generated__";
import { GetPlayerInfoQuery, SortState } from "@/app/__generated__/graphql";
import MPFormat, { MPFormatLink } from "@/components/MPFormat";
import Time, { Date } from "@/components/Time";
import { RankedRecordOfPlayer } from "@/lib/ranked-record";
import { ServerProps, getSortState } from "@/lib/server-props";
import { fetchGraphql } from "@/lib/utils";
import { parse, toPlainText } from "@altrd/mpformat";
import { Metadata, ResolvingMetadata } from "next";
import { cache } from "react";

export const PLAYER_RECORDS_FRAGMENT = gql(/* GraphQL */ `
  fragment PlayerRecords on Player {
    records(dateSortBy: $dateSortBy) {
      map {
        gameId
        name
      }
      ...RecordBase
    }
  }
`);

const GET_PLAYER_INFO = gql(/* GraphQL */ `
  query GetPlayerInfo($login: String!, $dateSortBy: SortState) {
    player(login: $login) {
      login
      name
      zonePath
      role
      ...PlayerRecords
    }
  }
`);

const SORT_PLAYER_RECORDS = gql(/* GraphQL */ `
  query SortPlayerRecords($login: String!, $dateSortBy: SortState) {
    player(login: $login) {
      ...PlayerRecords
    }
  }
`);

type PlayerRecordsProperty = GetPlayerInfoQuery["player"] & {
  records: RankedRecordOfPlayer[];
};

const fetchPlayerInfo = cache(async (login: string, dateSortBy?: SortState) => {
  return fetchGraphql(GET_PLAYER_INFO, { login, dateSortBy });
});

type SP = ServerProps<{ login: string }, { dateSortBy?: string }>;

export async function generateMetadata(
  {
    params,
    searchParams,
  }: SP,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const oldTitle = (await parent).title?.absolute;
  const playerInfo = (await fetchPlayerInfo(params.login, getSortState(searchParams.dateSortBy))).player;

  return {
    title: `${oldTitle} - ${toPlainText(parse(playerInfo.name))}`,
  };
}

export default async function PlayerRecords({
  params,
  searchParams,
}: SP) {
  const data = await fetchPlayerInfo(params.login, getSortState(searchParams["dateSortBy"]));
  const playerInfo = data.player as PlayerRecordsProperty;

  const playerRole = playerInfo.role[0] + playerInfo.role.slice(1).toLowerCase();
  const playerZone = playerInfo.zonePath?.split('|').slice(0, 3).join('/');

  return (
    <>
      <div id="toolbar_wrapper">
        <h1><MPFormat>{playerInfo.name}</MPFormat></h1>
        {playerZone && <span>{playerZone}</span>}
        <span>{playerRole}</span>
      </div>

      <table>
        <thead>
          <tr>
            <th className="rank"><span>Rank</span></th>
            <th className="map"><span>Map</span></th>
            <th className="time"><span>Time</span></th>
            <th className="date"><span>Date</span></th>
          </tr>
        </thead>
        <tbody>
          {playerInfo.records.map((record) => (
            <tr tabIndex={0} key={record.id}>
              <td className="rank">{record.rank}</td>
              <td className="map">
                <MPFormatLink
                  path={`/map/${record.map.gameId}`}
                  name={record.map.name}
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
  )
}