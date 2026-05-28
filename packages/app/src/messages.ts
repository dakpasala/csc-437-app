import { NBAData } from "server/models";
import { Message } from "@unbndl/service";

export type Msg =
  | ["nba/request", { teamid: string; token: string }]
  | ["nba/load", { teamid: string; nbaData: NBAData }]
  | [
      "nba/save",
      {
        teamid: string;
        nbaData: NBAData;
        token: string;
      },
      Message.Reactions
    ];
