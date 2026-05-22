import { NBAData } from "server/models";

export interface Model {
  nbaTeamId?: string;
  nbaData?: NBAData;
}

export const init: Model = {};
