import { css, html, shadow } from "@unbndl/html";
import { createViewModel } from "@unbndl/view";
import { fromAuth } from "@unbndl/auth";
import { fromStore } from "@unbndl/store";
import { NBAData } from "server/models";

import { Model } from "../model.ts";
import { Msg } from "../messages.ts";

import "../components/nba-card.ts";
import { NBAElement } from "../components/nba-element.ts";

interface TeamViewModel {
    authenticated: boolean;
    token?: string;
    nbaTeamId?: string;
    nbaData?: NBAData;
}

export class TeamViewElement extends HTMLElement {
    static observedAttributes = ["team-id"];

    private requestedTeamId?: string;
    private renderedTeamId?: string;

    viewModel = createViewModel<TeamViewModel>({
        authenticated: false
    })
        .with(fromAuth(this), "authenticated", "token")
        .with(fromStore<Model>(this), "nbaTeamId", "nbaData");

    constructor() {
        super();

        this.viewModel.createEffect(($) => {
            this.requestData($);
        });

        this.viewModel.createEffect(($) => {
            this.renderData($);
        });
    }

    attributeChangedCallback() {
        const $ = this.viewModel.toObject();

        this.requestData($);
        this.renderData($);
    }

    get teamId() {
        return this.getAttribute("team-id") || undefined;
    }

    requestData($: TeamViewModel) {
        const teamId = this.teamId;

        if (
            $.authenticated &&
            $.token &&
            teamId &&
            $.nbaTeamId !== teamId &&
            this.requestedTeamId !== teamId
        ) {
            this.requestedTeamId = teamId;
            this.dispatch([
                "nba/request",
                { teamid: teamId, token: $.token }
            ]);
        }
    }

    renderData($: TeamViewModel) {
        const teamId = this.teamId;
        const nbaData =
            $.nbaTeamId === teamId ? $.nbaData : undefined;

        if (this.renderedTeamId !== `${teamId}:${$.nbaTeamId}`) {
            this.renderedTeamId = `${teamId}:${$.nbaTeamId}`;
            this.render(nbaData);
        }
    }

    dispatch(msg: Msg) {
        const event = new CustomEvent("store:message", {
            bubbles: true,
            composed: true,
            detail: msg
        });

        this.dispatchEvent(event);
    }

    render(nbaData?: NBAData) {
        const view = NBAElement.renderCard(nbaData);

        shadow(this)
            .styles(TeamViewElement.styles)
            .replace(html`
                <main class="layout">
                    <section class="content">
                        ${view}
                    </section>
                </main>
            `);
    }

    static styles = css`
        .layout {
            display: grid;
            grid-template-columns: 1fr;
            padding: 1.5rem;
        }

        .content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
        }

        @media (max-width: 600px) {
            .layout {
                padding: 1rem;
            }

            .content {
                grid-template-columns: 1fr;
            }
        }
    `;
}
