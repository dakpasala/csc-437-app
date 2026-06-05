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

                ${this.renderPlayersEditor(data)}
                ${this.renderGamesEditor(data)}
                ${this.renderChampionshipsEditor(data)}

                <button type="submit">Save</button>
            </form>
        `;
    }

    renderPlayersEditor(data: NBAData) {
        return html`
            <fieldset class="array-editor" data-field="Players">
                <legend>Players</legend>

                ${data.Players.map((player) => html`
                    <div class="array-row" data-field="Players">
                        <input name="Players.player" value=${player.player} />
                        <input name="Players.href" type="hidden" value=${player.href || ""} />
                        <button class="remove-item" type="button">Remove</button>
                    </div>
                `)}

                <button class="add-item" data-field="Players" type="button">
                    Add an item
                </button>
            </fieldset>
        `;
    }

    renderGamesEditor(data: NBAData) {
        return html`
            <fieldset class="array-editor" data-field="Games">
                <legend>Games</legend>

                ${data.Games.map((game) => html`
                    <div class="array-row" data-field="Games">
                        <input name="Games.game" value=${game.game} />
                        <input name="Games.opponentId" type="hidden" value=${game["opponent-id"] || ""} />
                        <input name="Games.href" type="hidden" value=${game.href || ""} />
                        <button class="remove-item" type="button">Remove</button>
                    </div>
                `)}

                <button class="add-item" data-field="Games" type="button">
                    Add an item
                </button>
            </fieldset>
        `;
    }

    renderChampionshipsEditor(data: NBAData) {
        return html`
            <fieldset class="array-editor" data-field="Championships">
                <legend>Championships</legend>

                ${data.Championships.map((championship) => html`
                    <div class="array-row" data-field="Championships">
                        <input name="Championships.championship" value=${championship.championship} />
                        <input name="Championships.href" type="hidden" value=${championship.href || ""} />
                        <button class="remove-item" type="button">Remove</button>
                    </div>
                `)}

                <button class="add-item" data-field="Championships" type="button">
                    Add an item
                </button>
            </fieldset>
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
        const json = this.formDataToJSON(form);
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
                        Coach: json.Coach,
                        Conference: json.Conference,
                        Players: this.readPlayers(form),
                        Games: this.readGames(form),
                        Championships: this.readChampionships(form),
                        id: current.id
                    }
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

    formDataToJSON(form: HTMLFormElement): Record<string, string> {
        const inputs = Array.from(form.elements).filter(
            (el) => el instanceof HTMLInputElement && el.name
        ) as Array<HTMLInputElement>;

        const entries = inputs.map((el) => [el.name, el.value]);
        return Object.fromEntries(entries);
    }

    readPlayers(form: HTMLFormElement) {
        return this.rowsFor(form, "Players")
            .map((row) => {
                const player = this.inputValue(row, "Players.player");
                const href = this.inputValue(row, "Players.href");

                return {
                    player,
                    ...(href && { href })
                };
            })
            .filter((player) => player.player);
    }

    readGames(form: HTMLFormElement) {
        return this.rowsFor(form, "Games")
            .map((row) => {
                const game = this.inputValue(row, "Games.game");
                const opponentId = this.inputValue(row, "Games.opponentId");
                const href = this.inputValue(row, "Games.href");

                return {
                    game,
                    ...(opponentId && { "opponent-id": opponentId }),
                    ...(href && { href })
                };
            })
            .filter((game) => game.game);
    }

    readChampionships(form: HTMLFormElement) {
        return this.rowsFor(form, "Championships")
            .map((row) => {
                const championship = this.inputValue(
                    row,
                    "Championships.championship"
                );
                const href = this.inputValue(row, "Championships.href");

                return {
                    championship,
                    ...(href && { href })
                };
            })
            .filter((championship) => championship.championship);
    }

    rowsFor(form: HTMLFormElement, field: string) {
        return Array.from(
            form.querySelectorAll<HTMLElement>(`.array-row[data-field="${field}"]`)
        );
    }

    inputValue(row: HTMLElement, name: string) {
        return row.querySelector<HTMLInputElement>(`input[name="${name}"]`)
            ?.value.trim() || "";
    }

    addItem(ev: Event) {
        const button = ev.target as HTMLElement;
        const field = button.getAttribute("data-field");
        const editor = button.closest(".array-editor");

        if (!field || !editor) return;

        editor.insertBefore(this.createArrayRow(field), button);
    }

    removeItem(ev: Event) {
        const button = ev.target as HTMLElement;
        button.closest(".array-row")?.remove();
    }

    createArrayRow(field: string) {
        const row = document.createElement("div");
        row.className = "array-row";
        row.dataset.field = field;

        const names =
            field === "Players"
                ? ["Players.player"]
                : field === "Games"
                    ? ["Games.game"]
                    : ["Championships.championship"];

        names.forEach((name) => {
            const input = document.createElement("input");
            input.name = name;
            input.placeholder = name.split(".")[1];
            row.append(input);
        });

        const remove = document.createElement("button");
        remove.className = "remove-item";
        remove.type = "button";
        remove.textContent = "Remove";
        row.append(remove);

        return row;
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
            .delegate(".add-item", {
                click: (event: Event) => this.addItem(event)
            })
            .delegate(".remove-item", {
                click: (event: Event) => this.removeItem(event)
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

        a,
        a:visited {
            color: currentColor;
            text-decoration: underline;
            font-weight: bold;
        }

        a:hover {
            color: var(--color-accent);
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

        .array-editor {
            display: grid;
            gap: 0.5rem;
        }

        .array-row {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 0.5rem;
        }

        .add-item {
            width: 100%;
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
