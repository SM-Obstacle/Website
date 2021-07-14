import React from 'react';
import graphql from 'babel-plugin-relay/macro';
import { useFragment } from 'react-relay';
import { PlayerComponent_player$key } from "./__generated__/PlayerComponent_player.graphql"

interface Props {
    player: PlayerComponent_player$key;
    [key: string]: any;
}

function PlayerComponent(props: Props) {
    const data = useFragment(
        graphql`
          fragment PlayerComponent_player on Player {
            name
          }
        `,
        props.player,
    );

    return (
        <>
            <p>{data?.name}</p>
        </>
    );
}

export default PlayerComponent;
