import { NBAData } from "server/models";

export interface Model {
  requestedTeamId?: string;
  nbaTeamId?: string;
  nbaData?: NBAData;
}

export const init: Model = {};
