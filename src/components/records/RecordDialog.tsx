"use client";

import { useQuery } from "@apollo/client/react";

import { gql } from "@/app/__generated__";
import FormattedDate from "@/components/FormattedDate";
import { SubPanel } from "@/components/layout/Panel";
import { MPFormatLink } from "@/components/MPFormat";
import Stat from "@/components/Stat";
import Time from "@/components/Time";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import CheckpointsChart from "./CheckpointsChart";

const GET_RECORD = gql(/* GraphQL */ `
  query GetRecord($recordId: Int!) {
    record(recordId: $recordId) {
      id
      rank
      time
      respawnCount
      recordDate
      player {
        login
        name
      }
      map {
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

function StatSkeleton() {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <Skeleton className="h-3 w-14 bg-white/10" />
      <Skeleton className="h-5 w-20 bg-white/10" />
    </div>
  );
}

/**
 * Details of the record selected in a leaderboard. The id comes from the query
 * string, so anything a user could type there has to be tolerated: only an
 * actual record id opens the dialog.
 */
export default function RecordDialog({
  recordId,
  onClose,
}: {
  recordId: string | null;
  onClose: () => void;
}) {
  const id = Number(recordId);
  const open = recordId !== null && Number.isInteger(id) && id > 0;

  const { data, loading, error } = useQuery(GET_RECORD, {
    variables: { recordId: id },
    skip: !open,
  });

  // While a new record loads, `data` still holds the previous one.
  const record = loading ? undefined : data?.record;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[85dvh] gap-inset overflow-y-auto rounded-block bg-popover p-inset sm:max-w-2xl">
        <DialogHeader className="px-3 pt-2">
          <DialogTitle className="truncate text-xl">
            {record ? (
              <MPFormatLink path={`/player/${record.player.login}`}>
                {record.player.name}
              </MPFormatLink>
            ) : (
              <Skeleton className="inline-block h-6 w-48 bg-white/10" />
            )}
          </DialogTitle>

          <DialogDescription asChild>
            <div className="truncate">
              {record ? (
                <>
                  on{" "}
                  <MPFormatLink path={`/map/${record.map.gameId}`}>
                    {record.map.name}
                  </MPFormatLink>
                </>
              ) : (
                <Skeleton className="inline-block h-4 w-32 bg-white/10" />
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <p className="px-3 pb-2 text-destructive">{error.message}</p>
        ) : (
          <>
            <SubPanel className="bg-black/40 px-3 py-4">
              <div className="flex flex-wrap justify-around gap-4">
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
                        <FormattedDate onlyDate>
                          {record.recordDate}
                        </FormattedDate>
                      }
                    />
                  </>
                ) : (
                  Array.from({ length: 4 }, (_, index) => (
                    <StatSkeleton key={index} />
                  ))
                )}
              </div>
            </SubPanel>

            {record ? (
              record.cpsTimes.length > 0 && (
                <CheckpointsChart
                  cpsTimes={record.cpsTimes}
                  averageCpsTimes={record.map.averageCpsTimes}
                />
              )
            ) : (
              <SubPanel className="bg-black/40 p-3">
                <Skeleton className="h-64 w-full bg-white/5" />
              </SubPanel>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
