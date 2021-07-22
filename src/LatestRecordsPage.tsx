import { usePreloadedQuery } from 'react-relay/hooks';
import graphql from 'babel-plugin-relay/macro';
import React from 'react';

import RecordRowComponent from "./RecordRowComponent.tsx"

export default function LatestRecordsPage(props: any) {
    // Defines *what* data the component needs via a query. The responsibility of
    // actually fetching this data belongs to the route definition: it calls
    // preloadQuery() with the query and variables, and the result is passed
    // on props.prepared.mapQuery - see src/routes.js
    const data: any = usePreloadedQuery(
        graphql`
      query LatestRecordsPageQuery {
        records {
          rank,
          player {
            login,
            name
          },
          map {
            name,
            gameId
          }
          time,
          respawnCount,
          tryCount,
          updatedAt,
          flags
        }
      }
    `,
        props.prepared.latestRecordsQuery,
    );

    return <div>
        <h1>Latest records</h1>
         <table>
         <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Map</th>
            <th>Time</th>
            <th>Date</th>
            <th>RS bug</th>
            <th>Alt glitch</th>
            <th>PvP Weapons</th>
            <th>PvP Collisions</th>
          </tr>
          </thead>
          <tbody>
            { data.records.map((record, i) =>
                <RecordRowComponent key={i} record={record} />
            )}
            </tbody>
        </table>
    </div>;
}