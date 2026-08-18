"use client";

import { useQuery } from "@apollo/client/react";

import { gql } from "@/app/__generated__";
import type { GetRecordQuery } from "@/app/__generated__/graphql";
import FormattedDate from "@/components/FormattedDate";
import { SubPanel } from "@/components/layout/Panel";
import { MPFormatLink } from "@/components/MPFormat";
import Stat from "@/components/Stat";
import Time from "@/components/Time";
import { Skeleton } from "@/components/ui/skeleton";
import CheckpointsChart from "./CheckpointsChart";
import RecordFlags from "./RecordFlags";

const GET_RECORD = gql(/* GraphQL */ `
  query GetRecord($recordId: Int!) {
    record(recordId: $recordId) {
      id
      rank
      time
      respawnCount
      recordDate
      flags
      player {
        login
        name
      }
      map {
        # Normalises the map, so holding its average here doesn't clobber the
        # leaner copy the leaderboards cached under the same record.
        id
        gameId
        name
        averageCpsTimes {
          cpNum
          time
        }
      }
      cpsTimes {
        cpNum
        time
      }
    }
  }
`);

export type SelectedRecord = GetRecordQuery["record"];

/**
 * The record a leaderboard row selected, shown either in a dialog or in the
 * side panel. The id comes from the query string, so anything a user could
 * type there has to be tolerated: only an actual record id selects one.
 */
export function useSelectedRecord(recordId: string | null) {
  const id = Number(recordId);
  const selected = recordId !== null && Number.isInteger(id) && id > 0;

  const { data, loading, error } = useQuery(GET_RECORD, {
    variables: { recordId: id },
    skip: !selected,
  });

  return {
    selected,
    error,
    // While a new record loads, `data` still holds the previous one.
    record: loading ? undefined : data?.record,
  };
}

export function RecordPlayerName({ record }: { record?: SelectedRecord }) {
  return record ? (
    <MPFormatLink path={`/player/${record.player.login}`}>
      {record.player.name}
    </MPFormatLink>
  ) : (
    <Skeleton className="inline-block h-6 w-48" />
  );
}

export function RecordMapName({ record }: { record?: SelectedRecord }) {
  return record ? (
    <>
      on{" "}
      <MPFormatLink path={`/map/${record.map.gameId}`}>
        {record.map.name}
      </MPFormatLink>
    </>
  ) : (
    <Skeleton className="inline-block h-4 w-32" />
  );
}

function StatSkeleton() {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <Skeleton className="h-3 w-14" />
      <Skeleton className="h-5 w-20" />
    </div>
  );
}

/** Everything below the record's own name: what both presentations share. */
export default function RecordDetails({
  record,
  error,
}: {
  record?: SelectedRecord;
  error?: { message: string };
}) {
  if (error) {
    return <p className="px-3 pb-2 text-destructive">{error.message}</p>;
  }

  return (
    <>
      {/* Sized against the container, not the window: the same four figures sit
          in a row inside the dialog and two-up inside the side panel, which is
          narrow on the very screens the window query would call wide. */}
      <SubPanel className="@container shrink-0 bg-sunken px-3 py-4">
        <div className="grid grid-cols-2 gap-4 @sm:flex @sm:justify-around">
          {record ? (
            <>
              <Stat label="Rank" value={record.rank} />
              <Stat
                label="Time"
                value={<Time>{record.time}</Time>}
                className="text-time italic"
              />
              <Stat label="Respawns" value={record.respawnCount} />
              <Stat
                label="Date"
                value={
                  <FormattedDate onlyDate>{record.recordDate}</FormattedDate>
                }
              />
            </>
          ) : (
            Array.from({ length: 4 }, (_, index) => <StatSkeleton key={index} />)
          )}
        </div>
      </SubPanel>

      <RecordFlags flags={record?.flags} />

      {record ? (
        record.cpsTimes.length > 0 && (
          <CheckpointsChart
            cpsTimes={record.cpsTimes}
            averageCpsTimes={record.map.averageCpsTimes}
          />
        )
      ) : (
        <SubPanel className="shrink-0 bg-sunken p-3">
          <Skeleton className="h-64 w-full" />
        </SubPanel>
      )}
    </>
  );
}
