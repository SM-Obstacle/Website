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
		  map0: map(gameId: "DmxfMk0gebxmrBzC8GniCvpzocf") { name, records { rank, player { id, login, name } } }
		  map1: map(gameId: "ViILpz0CS0i87hUTjcZbDXOn_1c") { name, records { rank, player { id, login, name } } }
		  map2: map(gameId: "BbhSJcUjjJ_0BPsoPWpg6O8IUQk") { name, records { rank, player { id, login, name } } }

		  map3: map(gameId: "AX4ksxLixAo15Nwnnmahr7Cc3u7") { name, records { rank, player { id, login, name } } }
		  map4: map(gameId: "FP9_OxlDlTfOAtJ802IivbIT1B4") { name, records { rank, player { id, login, name } } }
		  map5: map(gameId: "kiL06IMGUEe0syqYfIH0sWC2w_b") { name, records { rank, player { id, login, name } } }

		  map6: map(gameId: "620n4zRgE8APuKiDrWepWIxdC49") { name, records { rank, player { id, login, name } } }
		  map7: map(gameId: "07EcTsJILmBI_2aeI4aG3PcL5_7") { name, records { rank, player { id, login, name } } }
		  map8: map(gameId: "42CFscE_gb68PNzDwgVWKQomYe5") { name, records { rank, player { id, login, name } } }
	  }
	`,
		props.prepared.stormRunnerQuery,
	);

	const [active, setActive] = useState(0);

	type StormRecord = {
		rank: number;
		map_record_count: number;
	};

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
					rank: 0
				});
			}
		}
	}

	let map_number = 1;
	for (let map_id in data) {
		for (let record of data[map_id].records) {
			let idx = players.findIndex((p) => p.login === record.player.login);
			players[idx].ranks.push({rank: record.rank, map: data[map_id].name, map_id: data[map_id].id});
		}

		const last_rank = data[map_id].records[data[map_id].records.length - 1].rank;

		for (let player in players) {
			if (players[player].ranks.length < map_number) {
				players[player].ranks.push({rank: last_rank, map: data[map_id].name, map_id: data[map_id].id});
			}
		}
		map_number++;
	}

	for (let player in players) {
		if (players[player].ranks.length < map_number - 1) {
			console.error(player, players[player]);
		}

		const ranks = players[player].ranks.sort((a, b) => a.rank - b.rank);
		players[player].worst = ranks[ranks.length-1];
		players[player].score = ranks.reduce(( acc, rank ) => acc + rank.rank, 0) / ranks.length;
	}

	players.sort((a, b) => (a.score - b.score));

	let rank = 0;
	let old_score = 0;
	let old_rank = 0;
	for (let player of players) {
		rank += 1;

		player.rank = old_score === player.score ? old_rank : rank;

		old_score = player.score;
		old_rank = player.rank;
	}

	return <div>
			   <h1>Storm Runners #1</h1>
			   <table className="table is-fullwidth is-hoverable">
				   <thead>
					   <tr>
						   <th>Rank</th>
						   <th>Score</th>
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
								   <td className="score">{player.score.toFixed(2)}</td>
								   <td className="name"><a href={`/player/${player.login}`}>{<MPFormattingcomponent name={player.name}/>}</a></td>
								   <td className="worst">{player.worst.rank}</td>
							   </tr>
						   );

						   if (active !== pindex)
							   return score_row;

						   const subranks = player.ranks.map((rank, rindex) => (
							   <tr key={players.length + pindex * player.ranks.length + rindex}>
								   <td></td>
								   <td className="rank">{rank.rank}</td>
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
