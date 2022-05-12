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

function formatFlag(flag: number): string {
  switch(flag & 0b00000011) {
    case 1:
      return "✔️";
    case 2:
      return "no";
    default:
      return "?";
  }
}

const RecordRowComponent = ({ record }: { record: Record }) => (
            <tr>
                <td data-label="Rank">{record.rank}</td>
                {record.player ? <td data-label="Player"><a href={`/player/${record.player.login}`}><MPFormattingcomponent name={record.player.name} placeholder={record.player.login}/></a></td> : null}
                {record.map ? <td data-label="Map"><a href={`/map/${record.map.gameId}`}><MPFormattingcomponent name={record.map.name} /></a></td> : null}
                <td data-label="Time"><TimeComponent time={record.time}/></td>
                { record.updatedAt ? <td data-label="Date"><TimeAgoComponent date={record.updatedAt}/></td> : null }
                <td data-label="RS bug">{formatFlag(record.flags >> 0)}</td>
                <td data-label="Alt glitch">{formatFlag(record.flags >> 2)}</td>
                <td data-label="PvP Weapons">{formatFlag(record.flags >> 4)}</td>
                <td data-label="PvP Collisions">{formatFlag(record.flags >> 6)}</td>
                <td data-label="SH" class="sh">{formatFlag(record.flags >> 8)}</td>
            </tr>
);

export default RecordRowComponent;
