import { css, html, shadow } from "@unbndl/html";
import { Auth } from "@unbndl/auth";
import { NBAData } from "server/models";

import "../components/nba-card.ts";
import { NBAElement } from "../components/nba-element.ts";
import { applyTeamTheme } from "../team-themes.ts";

export class TeamViewElement extends HTMLElement {
    static observedAttributes = ["team-id"];

    private requestedTeamId?: string;

    connectedCallback() {
        this.loadTeam();
    }

    attributeChangedCallback() {
        this.loadTeam();
    }

    get teamId() {
        return this.getAttribute("team-id") || undefined;
    }

    loadTeam() {
        const teamId = this.teamId;
        const token = localStorage.getItem(Auth.User.TOKEN_KEY);

        applyTeamTheme(teamId);

        if (!teamId || !token || this.requestedTeamId === teamId) {
            if (!teamId || !token) this.render();
            return;
        }

        this.requestedTeamId = teamId;
        this.render();

        fetch(`/api/nba/${teamId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((response) => {
            if (response.status !== 200) {
                throw new Error(`Server error ${response.status}`);
            }

            return response.json();
        })
        .then((nbaData: NBAData) => {
            applyTeamTheme(nbaData.id || teamId);
            this.render(nbaData);
        })
        .catch((error) => {
            console.error(`Could not fetch team ${teamId}:`, error);
            this.requestedTeamId = undefined;
            this.render();
        });
    }

    render(nbaData?: NBAData) {
        if (!nbaData) {
            shadow(this)
                .styles(TeamViewElement.styles)
                .replace(html`
                    <main class="layout">
                        <section class="content">
                            <p>Loading...</p>
                        </section>
                    </main>
                `);
            return;
        }

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
