import { define, html } from "@unbndl/html";
import { Auth } from "@unbndl/auth";
import { BrowserHistory, Switch } from "@unbndl/switch";

import { LakersCardElement } from "../../proto/public/src/lakers-card.js";
import { LakersElement } from "../../proto/public/src/lakers-element.js";
import { LakersHeaderElement } from "../../proto/public/src/lakers-header.js";
import { HomeViewElement } from "./views/home-view";
import { TeamViewElement } from "./views/team-view";

const routes = [
    {
        path: "/app/team/:id",
        view: html`
            <team-view team-id=${($: any) => $.params.id}></team-view>
        `
    },
    {
        path: "/",
        redirect: "/app/team/lakers"
    }
];

define({
    "auth-provider": Auth.Provider,
    "history-provider": BrowserHistory.Provider,
    "lakers-card": LakersCardElement,
    "lakers-element": LakersElement,
    "lakers-header": LakersHeaderElement,
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
});