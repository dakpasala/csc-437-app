import { NBAData } from "server/models";

export interface Model {
  nbaTeamId?: string;
  nbaData?: NBAData;
  nbaError?: string;
}

export const init: Model = {};
