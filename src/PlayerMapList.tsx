import React from 'react';
import graphql from 'babel-plugin-relay/macro';
import { usePaginationFragment } from 'react-relay/hooks';
import { PlayerMapList_player$key } from "./__generated__/PlayerMapList_player.graphql"
import { PlayerMapListPaginationQuery } from "./__generated__/PlayerMapListPaginationQuery.graphql"

interface Props {
    player: PlayerMapList_player$key;
    [key: string]: any;
}

function PlayerMapList(props: Props) {

    const { data, hasNext, loadNext } = usePaginationFragment<PlayerMapListPaginationQuery>(
        graphql`
          fragment PlayerMapList_player on Player
          @argumentDefinitions(
            cursor: { type: "String" }
            count: { type: "Int", defaultValue: 10 }
          )
          @refetchable(queryName: "PlayerMapListPaginationQuery") {
            name,
            maps(after: $cursor, first: $count)
              @connection(key: "PlayerMapList_player_maps") {
              edges {
                node {
                  id,
                  name
                }
              }
            }
          }
        `,
        props.player,
    );

    return (
        <div>
            {data.name != null ? <h1>Maps made by {data.name}:</h1> : null}

            <div className="player_map_list">
                {/* Extract each friend from the resulting data */}
                {(data.maps?.edges ?? []).map(edge => {
                    const node = edge.node;
                    return (
                        <p key={node.id}>{node.id} - {node.name}</p>
                    );
                })}
            </div>

            {hasNext ? <button onClick={() => loadNext(10)}>Load more</button> : null}
        </div>
    );
}

export default PlayerMapList;
