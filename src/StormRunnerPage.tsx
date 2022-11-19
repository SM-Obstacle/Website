import { usePreloadedQuery } from 'react-relay/hooks';
import graphql from 'babel-plugin-relay/macro';
import React, {useState} from 'react';

import MPFormattingcomponent from "./MPFormattingComponent.tsx";

export default function StormRunnerPage(props: any) {
	// Defines *what* data the component needs via a query. The responsibility of
	// actually fetching this data belongs to the route definition: it calls
	// preloadQuery() with the query and variables, and the result is passed
	// on props.prepared.mapQuery - see src/routes.js
	const data: any = usePreloadedQuery(
		graphql`
	  query StormRunnerPageQuery {
		map0: map(gameId: "AJUMu8dNAI9fXkHaaodLRQWb0i5") { gameId, name, records { rank, player { id, login, name } } }
		map1: map(gameId: "VTDeDSyoLphHbg4xpKgJPjCULu2") { gameId, name, records { rank, player { id, login, name } } }
		map2: map(gameId: "m94pYMVmW7fdnVdpBbK8ns7j__d") { gameId, name, records { rank, player { id, login, name } } }
		map3: map(gameId: "wVdm82BaI4zrD7PUT9GgLsElCl6") { gameId, name, records { rank, player { id, login, name } } }
		map4: map(gameId: "wi5t9nsWrFsUdW9TVrpNkOHZVEh") { gameId, name, records { rank, player { id, login, name } } }
		map5: map(gameId: "p4ZBFCtaFT_LQscpCi3J0IZqiG2") { gameId, name, records { rank, player { id, login, name } } }
		map6: map(gameId: "Wg_ueBq7ovovY1z2PGJsguwNf_9") { gameId, name, records { rank, player { id, login, name } } }
		map7: map(gameId: "IyyNms4JhN1BCvoltgli4tgllL6") { gameId, name, records { rank, player { id, login, name } } }
		map8: map(gameId: "LPOsdLqT5NKvefQT6y_vzZXsf23") { gameId, name, records { rank, player { id, login, name } } }
		map9: map(gameId: "bveb4HoqLZSW1nsmyGRYe1a6I4c") { gameId, name, records { rank, player { id, login, name } } }
	  }
	`,
		props.prepared.stormRunnerQuery,
	);

	const [active, setActive] = useState(-1);

	let players = [];

	// Get all the unique players of each map
	for (let map_id in data) {
		for (let record of data[map_id].records) {
			let idx = players.findIndex((p) => p.login === record.player.login);
			if (idx === -1) {
				players.push({
					login: record.player.login,
					name: record.player.name,
					ranks: [],
					score: 0,
					maps_finished: 0,
					rank: 0
				});
			}
		}
	}

	let map_number = 1;
	for (let map_id in data) {
		const last_rank = data[map_id].records.length > 0 ? data[map_id].records[data[map_id].records.length - 1].rank : 99;
		
		for (let record of data[map_id].records) {
			let idx = players.findIndex((p) => p.login === record.player.login);
			players[idx].ranks.push({rank: record.rank, last_rank: last_rank, map: data[map_id].name, map_id: data[map_id].gameId});
			++players[idx].maps_finished;
		}

		for (let player in players) {
			if (players[player].ranks.length < map_number) {
				players[player].ranks.push({rank: last_rank+1, last_rank: last_rank, map: data[map_id].name, map_id: data[map_id].gameId});
			}
		}
		++map_number;
	}
	--map_number;

	for (let player in players) {
		if (players[player].ranks.length < map_number - 1) {
			console.error(player, players[player]);
		}

		const ranks = players[player].ranks.sort((a, b) => a.rank - b.rank);
		players[player].worst = ranks[ranks.length-1];
		players[player].score = ranks.reduce(( acc, rank ) => acc + rank.rank, 0) / ranks.length;
	}

	players.sort((a, b) => {
		if (a.maps_finished !== b.maps_finished) {
			return b.maps_finished - a.maps_finished;
		} else {
			return a.score - b.score;
		}
	});

	let rank = 0;
	let old_score = 0;
	let old_finishes = 0;
	let old_rank = 0;
	for (let player of players) {
		rank += 1;

		player.rank = old_score === player.score && old_finishes === player.map_finishes ? old_rank : rank;

		old_score = player.score;
		old_finishes = player.map_finishes;
		old_rank = player.rank;
	}

	return <div>
			   <h1>Storm Runners #2</h1>
			   <table className="table is-fullwidth is-hoverable">
				   <thead>
					   <tr>
						   <th>Rank</th>
						   <th>Maps finished</th>
						   <th>Rank Average</th>
						   <th>Player</th>
						   <th>Worst rank</th>
					   </tr>
				   </thead>
				   <tbody>
					   {players.map((player, pindex) => {
						   const score_row = (
							   <tr key={pindex} style={{cursor: 'pointer'}} onClick={() => {
									   if (active !== pindex) {
										   setActive(pindex);
									   } else {
										   setActive(-1);
									   }
								   }}>
								   <td className="rank">{player.rank}</td>
								   <td className="finishes">{player.maps_finished}<small>/{map_number}</small></td>
								   <td className="score">{player.score.toFixed(2)}</td>
								   <td className="name"><a href={`/player/${player.login}`}>{<MPFormattingcomponent name={player.name} placeholder={player.login}/>}</a></td>
								   <td className="worst">{player.worst.rank}</td>
							   </tr>
						   );

						   if (active !== pindex)
							   return score_row;

						   const subranks = player.ranks.map((rank, rindex) => (
							   <tr key={players.length + pindex * player.ranks.length + rindex}>
								   <td></td>
								   <td></td>
								   <td className="rank">{rank.rank}<small>/{rank.last_rank}</small></td>
								   <td><a href={`/map/${rank.map_id}`}>{<MPFormattingcomponent name={rank.map}/>}</a></td>
								   <td></td>
							   </tr>
						   ));

						   return [
							   score_row,
							   ...subranks];
					   })}
				   </tbody>
			   </table>
		   </div>;
}
