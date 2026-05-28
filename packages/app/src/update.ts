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
  const [type, payload, callbacks] = message;

  switch (type) {
    case "nba/request":
      if (model.nbaTeamId === payload.teamid) {
        return { ...model };
      }

      if (!payload.token) {
        return { ...model };
      }

      return [
        { ...model, requestedTeamId: payload.teamid },
        requestNBA(payload, user)
      ];

    case "nba/load":
      return {
        ...model,
        requestedTeamId: undefined,
        nbaTeamId: payload.teamid,
        nbaData: payload.nbaData
      };
    
    case "nba/save":
      return [model, saveNBA(payload, user, callbacks)];

    default: {
      const unhandled: never = type;
      throw new Error(`Unhandled message ${unhandled}`);
    }
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
        throw new Error(`Server error ${response.status}`);

      return response.json();
    })
    .then((json) => [
      "nba/load",
      { teamid: payload.teamid, nbaData: json }
    ] as Cmd);
}

function saveNBA(
  payload: { teamid: string; nbaData: NBAData; token: string },
  auth: Auth.Model,
  callbacks: Message.Reactions
): Promise<Cmd> {
  const authHeaders = Auth.headers(auth);

  return fetch(`/api/nba/${payload.teamid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...(!authHeaders.Authorization && {
        Authorization: `Bearer ${payload.token}`
      })
    },
    body: JSON.stringify(payload.nbaData)
  })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(
          `${response.status} status; saving NBA team ${payload.teamid}`
        );
      }

      return response.json();
    })
    .then((json: NBAData) => {
      if (json) {
        callbacks.onSuccess?.();
        return [
          "nba/load",
          { teamid: payload.teamid, nbaData: json }
        ] as Cmd;
      }
      throw new Error(`No JSON in API response`);
    })
    .catch((err: Error) => {
      callbacks.onFailure?.(err);
      throw err;
    });
}
