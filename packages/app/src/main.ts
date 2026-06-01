import { define, html } from "@unbndl/html";
import { Auth } from "@unbndl/auth";
import { Store } from "@unbndl/store";
import { BrowserHistory, Switch } from "@unbndl/switch";

import { Msg } from "./messages.ts";
import { Model, init } from "./model.ts";
import { Cmd, update } from "./update.ts";

import { NBACardElement } from "./components/nba-card.ts";
import { NBAElement } from "./components/nba-element.ts";
import { NBAHeaderElement } from "./components/nba-header.ts";
import { HomeViewElement } from "./views/home-view.ts";
import { TeamViewElement } from "./views/team-view-mvu.ts";
import { applyTeamTheme } from "./team-themes.ts";

const routes: Switch.Route[] = [
    {
        path: "/app/team/:id",
        auth: "protected", // added this and it worked??
        view: html<[Switch.Args]>`
            <team-view
                team-id=${($) => $.params.id}
                mode=${($) => $.query.get("mode") || "view"}>
            </team-view>
        `
    },
    {
        path: "/app",
        redirect: "/app/team/lakers"
    },
    {
        path: "/",
        redirect: "/app/team/lakers"
    }
];

define({
    "store-provider": class AppStore extends Store.Provider<Model, Msg, Cmd> {
        constructor() {
            super(update, init);
        }
    },
    "auth-provider": Auth.Provider,
    "history-provider": BrowserHistory.Provider,
    "nba-card": NBACardElement,
    "nba-element": NBAElement,
    "nba-header": NBAHeaderElement,
    "home-view": HomeViewElement,
    "team-view": TeamViewElement,

    "router-switch": class AppSwitch extends Switch.Element {
        constructor() { 
            super(routes);
        }
    }
});

document.body.addEventListener("dark-mode:toggle", (event: Event) => {
    const customEvent = event as CustomEvent;
    document.body.classList.toggle("dark-mode", customEvent.detail.checked);
    applyTeamTheme(document.body.dataset.team);
});
