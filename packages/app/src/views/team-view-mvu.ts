import { css, html, shadow } from "@unbndl/html";
import { createViewModel, fromAttributes } from "@unbndl/view";
import { fromAuth } from "@unbndl/auth";
import { NBAData } from "server/models";

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
    nbaData?: NBAData;
}


export class TeamViewElement extends HTMLElement {
    private requestedTeamId?: string;

    viewModel = createViewModel<TeamViewModel>({
        authenticated: false,
    })
        .with(fromAuth(this), "authenticated", "token")
        .withRenamed(fromAttributes<TeamViewAttributes>(this), {
            teamId: "team-id"
        });

    constructor() {
        super();

        this.viewModel.createEffect(($) => {
            applyTeamTheme($.nbaData?.id || $.teamId);
        });

        this.viewModel.createEffect(($) => {
            if (!$.teamId || !$.token) {
                this.viewModel.update({
                    nbaData: undefined,
                });
                return;
            }

            if (this.requestedTeamId === $.teamId) return;

            this.requestedTeamId = $.teamId;
            this.viewModel.update({ nbaData: undefined });

            fetch(`/api/nba/${$.teamId}`, {
                headers: {
                    Authorization: `Bearer ${$.token}`
                }
            })
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error(`Server error ${response.status}`);
                }

                return response.json();
            })
            .then((nbaData: NBAData) => {
                this.viewModel.update({
                    nbaData,
                });
            })
            .catch((error) => {
                console.error(`fetching team ${$.teamId} was invalid:`, error);
                this.requestedTeamId = undefined;
                this.viewModel.update({
                    nbaData: undefined
                });
            });
        });

        this.viewModel.createEffect(($) => {
            this.render($.nbaData);
        });
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