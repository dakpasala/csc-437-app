import { css, html, shadow } from "@unbndl/html";
import { createViewModel, fromAttributes } from "@unbndl/view";
import { fromAuth } from "@unbndl/auth";
import { Store, fromStore } from "@unbndl/store";
import { NBAData } from "server/models";

import { Model } from "../model.ts";
import { Msg } from "../messages.ts";

import "../components/nba-card.ts";
import { NBAElement } from "../components/nba-element.ts";
import { applyTeamTheme } from "../team-themes.ts";

type TeamViewAttributes = {
    "team-id"?: string;
};

interface TeamViewModel {
    authenticated: boolean;
    token?: string;
    teamId?: string;
    nbaTeamId?: string;
    nbaData?: NBAData;
    nbaError?: string;
}


export class TeamViewElement extends HTMLElement {
    private requestedTeamId?: string;

    viewModel = createViewModel<TeamViewModel>({
        authenticated: false,
    })
        .with(fromAuth(this), "authenticated", "token")
        .withRenamed(fromAttributes<TeamViewAttributes>(this), {
            teamId: "team-id"
        })
        .with(fromStore<Model>(this), "nbaTeamId", "nbaData", "nbaError");

    view = html<TeamViewModel[]>`
        <main class="layout">
            <section class="content">
                ${($) => NBAElement.renderCard(
                    $.nbaTeamId === $.teamId ? $.nbaData : undefined
                )}
            </section>
        </main>
    `;

    constructor() {
        super();

        shadow(this)
            .styles(TeamViewElement.styles)
            .replace(this.viewModel.render(this.view));

        this.viewModel.createEffect(($) => {
            applyTeamTheme(
                $.nbaTeamId === $.teamId
                    ? $.nbaData?.id
                    : $.teamId
            );
        });

        this.viewModel.createEffect(($) => {
            if (!$.authenticated || !$.teamId || !$.token) return;
            if ($.nbaTeamId === $.teamId) return;

            if (this.requestedTeamId === $.teamId) return;

            this.requestedTeamId = $.teamId;
            Store.dispatch<Msg>(this, [
                "nba/request",
                { teamid: $.teamId, token: $.token }
            ]);
        });
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
