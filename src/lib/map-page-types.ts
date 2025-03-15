import { Medal } from "./ranked-record";

export interface Player {
  login: string;
  name: string;
}

export interface RecordLine {
  time: number;
}

export class RankedRecordLine implements RecordLine {
  id: number;
  rank: number;
  player: Player;
  time: number;
  recordDate: string;
  
  constructor(id: number, rank: number, player: Player, time: number, recordDate: string) {
    this.id = id;
    this.rank = rank;
    this.player = player;
    this.time = time;
    this.recordDate = recordDate;
  }
}

export class MedalRecord implements RecordLine {
  time: number;
  medal: Medal;

  constructor(time: number, medal: Medal) {
    this.time = time;
    this.medal = medal;
  }
}

export interface Map {
  cpsNumber?: number;
  player: Player;
  gameId: string;
  records: RecordLine[];
}

export interface MapContent {
  map: Map,
}