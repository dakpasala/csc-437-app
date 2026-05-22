import { Auth } from "@unbndl/auth";
import { Message } from "@unbndl/service";
import { NBAData } from "server/models";

import { Model } from "./model.ts";
import { Msg } from "./messages.ts";

export type Cmd =
  ["nba/load", { teamid: string; nbaData: NBAData }];

export function update(
  model: Readonly<Model>,
  message: Msg | Cmd,
  user: Auth.Model
): Model | Message.Async<Model, Cmd> {
  const [type, payload] = message;

  switch (type) {
    case "nba/request":
      if (model.nbaTeamId === payload.teamid) {
        return { ...model };
      }

      if (!payload.token) {
        return { ...model };
      }

      return [
        { ...model },
        requestNBA(payload, user)
      ];

    case "nba/load":
      return {
        ...model,
        nbaTeamId: payload.teamid,
        nbaData: payload.nbaData
      };

    default:
      throw new Error(`Unhandled message ${type}`);
  }
}

function requestNBA(
  payload: { teamid: string; token: string },
  _user: Auth.Model
): Promise<Cmd> {
  return fetch(`/api/nba/${payload.teamid}`, {
    headers: {
      Authorization: `Bearer ${payload.token}`
    }
  })
    .then((response) => {
      if (response.status !== 200)
        throw "Server error";

      return response.json();
    })
    .then((json) => [
      "nba/load",
      { teamid: payload.teamid, nbaData: json }
    ] as const);
}
