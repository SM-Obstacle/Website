import { usePreloadedQuery } from 'react-relay/hooks';
import graphql from 'babel-plugin-relay/macro';
import React from 'react';

import MPFormattingcomponent from "./MPFormattingComponent.tsx";
import RecordRowComponent from "./RecordRowComponent.tsx"

export default function PlayerPageRoot(props: any) {
    // Defines *what* data the component needs via a query. The responsibility of
    // actually fetching this data belongs to the route definition: it calls
    // preloadQuery() with the query and variables, and the result is passed
    // on props.prepared.playerQuery - see src/routes.js
    const data: any = usePreloadedQuery(
        graphql`
      query PlayerPageRootQuery($login: String!) {
        player(login: $login) {
            login,
            name,
            records {
              rank,
              time,
              map {
                  gameId,
                  name
              }
              respawnCount,
              tryCount,
              flags
            }
        }
      }
    `,
        props.prepared.playerQuery,
    );

    return <div>
        <h1><span className="outline"><MPFormattingcomponent name={data.player.name} /></span></h1>
        <table>
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Map</th>
                    <th>Time</th>
                    <th>Date</th>
                    <th>PvP Weapons</th>
                    <th>PvP Colisions</th>
                    <th>Alt glitch</th>
                    <th>RS bug</th>
                </tr>
            </thead>
            <tbody>
                {data.map.records.map((record, i) =>
                    <RecordRowComponent key={i} record={record} />
                )}
            </tbody>
        </table>
    </div>;
}
