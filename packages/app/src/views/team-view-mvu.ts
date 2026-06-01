import { css, html, shadow } from "@unbndl/html";
import { createViewModel, fromAttributes } from "@unbndl/view";
import { fromAuth } from "@unbndl/auth";
import { Store, fromStore } from "@unbndl/store";
import { BrowserHistory } from "@unbndl/switch";
import { NBAData } from "server/models";

import { Model } from "../model.ts";
import { Msg } from "../messages.ts";

import "../components/nba-card.ts";
import { NBAElement } from "../components/nba-element.ts";
import { applyTeamTheme } from "../team-themes.ts";

type TeamViewAttributes = {
    "team-id"?: string;
    mode?: TeamViewMode;
};

type TeamViewMode = "view" | "edit";

interface TeamViewModel {
    authenticated: boolean;
    mode: TeamViewMode;
    error?: string;
    token?: string;
    teamId?: string;
    requestedTeamId?: string;
    nbaTeamId?: string;
    nbaData?: NBAData;
}


export class TeamViewElement extends HTMLElement {
    viewModel = createViewModel<TeamViewModel>({
        authenticated: false,
        mode: "view"
    })
        .with(fromAuth(this), "authenticated", "token")
        .withRenamed(fromAttributes<TeamViewAttributes>(this), {
            teamId: "team-id",
            mode: "mode"
        })
        .with(fromStore<Model>(this), "requestedTeamId", "nbaTeamId", "nbaData");

    currentView = html<TeamViewModel[]>`
        <main class="layout">
            ${($) => $.error ? html`<p class="error">${$.error}</p>` : ""}

            ${($) => $.nbaTeamId === $.teamId && $.nbaData
                ? $.mode === "edit"
                    ? this.renderEditForm($.nbaData)
                    : this.renderMainView($.nbaData)
                : this.renderLoadingView()}
        </main>
    `;

    renderMainView(data: NBAData) {
        return html`
            <section class="toolbar">
                <button id="edit-mode" type="button">Edit</button>
            </section>

            <section class="content">
                ${NBAElement.renderCard(data)}
            </section>
        `;
    }

    renderEditForm(data: NBAData) {
        return html`
            <form class="edit-form">
                <header class="form-header">
                    <h2>Edit Team</h2>

                    <button id="cancel-edit" type="button">Cancel</button>
                </header>

                <label>
                    Coach
                    <input name="Coach" value=${data.Coach} />
                </label>

                <label>
                    Conference
                    <input name="Conference" value=${data.Conference} />
                </label>

                <button type="submit">Save</button>
            </form>
        `;
    }

    renderLoadingView() {
        return html`
            <section class="content">
                ${NBAElement.renderCard(undefined)}
            </section>
        `;
    }

    submitForm(ev: Event) {
        ev.preventDefault();

        const form = ev.target as HTMLFormElement;
        const json: object = this.formDataToJSON(form);
        const teamid = this.viewModel.$.teamId;
        const token = this.viewModel.$.token;
        const current = this.viewModel.$.nbaData;

        if (teamid && token && current)
            Store.dispatch<Msg>(this, [
                "nba/save",
                {
                    teamid,
                    token,
                    nbaData: {
                        ...current,
                        ...json,
                        id: current.id
                    } as NBAData
                },
                {
                    onSuccess: () => {
                        this.viewModel.set("error", undefined);
                        this.navigateToMode("view");
                    },
                    onFailure: (error: Error) => {
                        console.log("ERROR:", error);
                        this.viewModel.set("error", "Error");
                        this.navigateToMode("view");
                    }
                }
            ]);
    }

    formDataToJSON(form: HTMLFormElement): object {
        const inputs = Array.from(form.elements).filter(
            (el) => el instanceof HTMLInputElement && el.name
        ) as Array<HTMLInputElement>;

        const entries = inputs.map((el) => [el.name, el.value]);
        return Object.fromEntries(entries);
    }

    navigateToMode(mode: TeamViewMode) {
        const teamid = this.viewModel.$.teamId;

        if (teamid)
            BrowserHistory.dispatch(this, "history/navigate", {
                href: `/app/team/${teamid}?mode=${mode}`
            });
    }

    constructor() {
        super();

        shadow(this)
            .styles(TeamViewElement.styles)
            .replace(this.viewModel.render(this.currentView))
            .delegate("#edit-mode", {
                click: () => {
                    this.viewModel.set("error", undefined);
                    this.navigateToMode("edit");
                }
            })
            .delegate("#cancel-edit", {
                click: () => this.navigateToMode("view")
            })
            .listen({
                submit: (event: Event) => this.submitForm(event)
            });

        this.viewModel.createEffect(($) => {
            applyTeamTheme( $.nbaTeamId === $.teamId ? $.nbaData?.id : $.teamId);
        });

        this.viewModel.createEffect(($) => {
            if (!$.authenticated || !$.teamId || !$.token) return;
            if ($.nbaTeamId === $.teamId) return;
            if ($.requestedTeamId === $.teamId) return;

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

        .toolbar {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 1rem;
        }

        .error {
            color: red;
        }

        .edit-form {
            display: grid;
            gap: 1rem;
            color: var(--color-text);
        }

        .form-header {
            display: flex;
            justify-content: space-between;
        }

        .edit-form label {
            display: grid;
            gap: 0.5rem;
        }

        .edit-form input {
            padding: 0.5rem;
        }

        button {
            width: fit-content;
            padding: 0.5rem 1rem;
            cursor: pointer;
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
