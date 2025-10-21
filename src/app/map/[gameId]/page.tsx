import type { Metadata } from "next";
import { redirect } from "next/navigation";
import React, { cache } from "react";
import { gql } from "@/app/__generated__";
import type {
  GetMapInfoQuery,
  MapRecordSortableField,
  RecordsFilter,
} from "@/app/__generated__/graphql";
import { query } from "@/app/ApolloClient";
import Link from "@/components/Link";
import MPFormat from "@/components/MPFormat";
import {
  ToolbarTitle as RawToolbarTitle,
  ToolbarTitleWrapper,
} from "@/components/ToolbarWrapper";
import {
  type PaginationInput,
  parsePaginationInput,
  type RawPaginationInput,
} from "@/lib/cursor-pagination";
import { type MapContent, RankedRecordLine } from "@/lib/map-page-types";
import { parse, toPlainText } from "@/lib/mpformat/mpformat";
import {
  parseRecordsFilter,
  type RawRecordsFilter,
} from "@/lib/records-filter";
import type { ServerProps } from "@/lib/server-props";
import { parseMapSortField } from "@/lib/sort-field";
import { MapRecordsContent } from "./MapRecordsContent";

const _MAP_RECORDS_FRAGMENT = gql(/* GraphQL */ `
  fragment MapRecords on Map {
    recordsConnection(
      after: $after
      before: $before
      first: $first
      last: $last
      sortField: $sortField
      filter: $filter
    ) {
      nodes {
        player {
          login
          name
        }
        ...RecordBase
      }
    }
  }
`);

const GET_MAP_INFO = gql(/* GraphQL */ `
  query GetMapInfo(
    $gameId: String!
    $sortField: MapRecordSortableField
    $first: Int
    $last: Int
    $after: String
    $before: String
    $filter: RecordsFilter
  ) {
    map(gameId: $gameId) {
      relatedEventEditions {
        map {
          gameId
        }
        redirectToEvent
        edition {
          name
          subtitle
          event {
            handle
          }
          id
        }
      }
      gameId
      name
      cpsNumber
      player {
        login
        name
      }
      ...MapRecords
    }
  }
`);

export type SP = ServerProps<
  { gameId: string },
  { sortField?: string } & RawPaginationInput & RawRecordsFilter
>;

type Item<Array> = Array extends (infer T)[] ? T : never;
type RelatedEventEdition = Item<GetMapInfoQuery["map"]["relatedEventEditions"]>;
export type MapRecordsProperty = {
  map: Omit<GetMapInfoQuery["map"], "relatedEventEditions" | "__typename">;
};

const fetchMapInfo = cache(
  async (
    gameId: string,
    paginationInput: PaginationInput,
    filter: RecordsFilter,
    sortField?: MapRecordSortableField,
  ) => {
    return query({
      query: GET_MAP_INFO,
      variables: { gameId, sortField, filter, ...paginationInput },
      errorPolicy: "all",
    });
  },
);

export async function generateMetadata(props: SP): Promise<Metadata> {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const mapInfo = (
    await fetchMapInfo(
      params.gameId,
      parsePaginationInput(searchParams),
      parseRecordsFilter(searchParams),
      searchParams.sortField
        ? parseMapSortField(searchParams.sortField)
        : undefined,
    )
  ).data?.map;

  return {
    title: toPlainText(parse(mapInfo?.name ?? "")),
  };
}

function ToolbarTitle({
  data,
  relatedEvents,
}: {
  data: GetMapInfoQuery;
  relatedEvents: RelatedEventEdition[];
}) {
  return relatedEvents.length > 0 ? (
    <ToolbarTitleWrapper>
      <RawToolbarTitle>
        <MPFormat>{data.map.name}</MPFormat>
      </RawToolbarTitle>
      <span>
        Related to{" "}
        {relatedEvents.map((relatedEvent, i) => (
          <React.Fragment
            key={`${relatedEvent.edition.event.handle}_${relatedEvent.edition.id}`}
          >
            <Link
              explicit
              href={`/event/${relatedEvent.edition.event.handle}/${relatedEvent.edition.id}/map/${relatedEvent.map.gameId}`}
            >
              {relatedEvent.edition.name +
                (relatedEvent.edition.subtitle
                  ? ` ${relatedEvent.edition.subtitle}`
                  : "")}
            </Link>
            {i < relatedEvents.length - 1 ? ", " : null}
          </React.Fragment>
        ))}
      </span>
    </ToolbarTitleWrapper>
  ) : (
    <RawToolbarTitle>
      <MPFormat>{data.map.name}</MPFormat>
    </RawToolbarTitle>
  );
}

export default async function MapRecords(sp: SP) {
  const params = await sp.params;
  const searchParams = await sp.searchParams;

  const data = await fetchMapInfo(
    params.gameId,
    parsePaginationInput(searchParams),
    parseRecordsFilter(searchParams),
    searchParams.sortField
      ? parseMapSortField(searchParams.sortField)
      : undefined,
  );

  // If there is only one related event edition and it has a redirect, we redirect to the event map page.
  if (
    data.data?.map.relatedEventEditions?.length === 1 &&
    data.data?.map.relatedEventEditions[0].redirectToEvent
  ) {
    const relatedEvent = data.data?.map.relatedEventEditions[0];
    return redirect(
      `/event/${relatedEvent.edition.event.handle}/${relatedEvent.edition.id}/map/${params.gameId}`,
    );
  }

  const content = {
    map: {
      gameId: data.data?.map.gameId ?? "",
      player: data.data?.map.player ?? { login: "", name: "" },
      cpsNumber: data.data?.map.cpsNumber ?? undefined,
      records: (data.data?.map.recordsConnection.nodes ?? []).map(
        (record) =>
          new RankedRecordLine(
            record.id,
            record.rank,
            record.player,
            record.time,
            record.recordDate,
          ),
      ),
    },
  } satisfies MapContent;

  return data.error ? (
    data.error.message
  ) : data.data ? (
    <MapRecordsContent
      data={content}
      toolbarTitle={
        <ToolbarTitle
          data={data.data}
          relatedEvents={data.data?.map.relatedEventEditions ?? []}
        />
      }
    />
  ) : (
    "Something went wrong."
  );
}
