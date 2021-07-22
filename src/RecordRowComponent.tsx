import TimeComponent from "./TimeComponent.tsx";
import TimeAgoComponent from "./TimeAgoComponent.tsx"
import MPFormattingcomponent from "./MPFormattingComponent.tsx";

type Player = {
  login: string;
  name: string;
};

type Map = {
name: string;
gameId: string;
};

type Record = {
  rank: number;
  player?: Player;
  map?: Map;
  time: number;
  respawnCount: number;
  tryCount: number;
  updatedAt: string;
  flags: number;
};

const RecordRowComponent = ({ record }: { record: Record }) => (
            <tr>
                <td data-label="Rank">{record.rank}</td>
                {record.player ? <td data-label="Player"><a href={`/player/${record.player.login}`}><MPFormattingcomponent name={record.player.name}/></a></td> : null}
                {record.map ? <td data-label="Map"><a href={`/map/${record.map.gameId}`}><MPFormattingcomponent name={record.map.name} /></a></td> : null}
                <td data-label="Time"><TimeComponent time={record.time}/></td>
                { record.updatedAt ? <td data-label="Date"><TimeAgoComponent date={record.updatedAt}/></td> : null }
                <td data-label="RS bug">{(record.flags >> 0) & 0b00000011}</td>
                <td data-label="Alt glitch">{(record.flags >> 2) & 0b00000011}</td>
                <td data-label="PvP Weapons">{(record.flags >> 4) & 0b00000011}</td>
                <td data-label="PvP Collisions">{(record.flags >> 6) & 0b00000011}</td>
            </tr>
);

export default RecordRowComponent;
