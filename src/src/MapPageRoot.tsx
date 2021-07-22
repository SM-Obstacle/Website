import { usePreloadedQuery } from 'react-relay/hooks';
import graphql from 'babel-plugin-relay/macro';
import React from 'react';

import MPFormattingcomponent from "./MPFormattingComponent.tsx";
import RecordRowComponent from "./RecordRowComponent.tsx"


export default function MapPageRoot(props: any) {
    // Defines *what* data the component needs via a query. The responsibility of
    // actually fetching this data belongs to the route definition: it calls
    // preloadQuery() with the query and variables, and the result is passed
    // on props.prepared.mapQuery - see src/routes.js
    const data: any = usePreloadedQuery(
        graphql`
      query MapPageRootQuery($gameId: String!) {
        map(gameId: $gameId) {
          name,
          player {
            name,
          }
          records {
            rank,
            player {
              login,
              name
            }
            time,
            respawnCount,
            tryCount,
            updatedAt,
            flags
          }
        }
      }
    `,
        props.prepared.mapQuery,
    );

    return <div>
        <h1><span className="outline"><MPFormattingcomponent name={data.map.name} /></span></h1>
        <p>Made by <span className="outline"><MPFormattingcomponent name={data.map.player.name} /></span></p>
        <table>
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>Time</th>
                    <th>Date</th>
                    <th>RS bug</th>
                    <th>Alt glitch</th>
                    <th>PvP Weapons</th>
                    <th>PvP Collisions</th>
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
