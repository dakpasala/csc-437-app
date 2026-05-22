import { NBAData } from "server/models";

export type Msg =
  | ["nba/request", { teamid: string; token: string }]
  | ["nba/load", { teamid: string; nbaData: NBAData }];
