import { html, css, shadow } from "@unbndl/html";

import { createViewModel, fromAttributes } from "@unbndl/view";
import { fromAuth } from "@unbndl/auth";
import { NBAData } from "server/models";

import "./nba-card.js";
import { getTeamTheme } from "../team-themes.ts";


export class NBAElement extends HTMLElement {
    viewModel = createViewModel({
        src:"",
        authenticated: false,
        token:"",
    })
    .with(fromAttributes<{ src?: string }>(this)) // uhhhhh had to look this up cause TS annoyed?
    .with(fromAuth(this), "authenticated", "token");

    constructor() {
        super();
        this.viewModel.createEffect(($) => {
            if ($.authenticated && $.src) {
                this.hydrate($.src).then((data) => {
                    if (!data) return;

                    const view = NBAElement.renderCard(data);

                    shadow(this)
                        .styles(NBAElement.styles)
                        .replace(view);
                })
            }
        })
    }

    static styles = css`
        :host {
            display: contents;
            color: var(--color-text);
        }

        h2 {
            font-family: 'Playfair Display', serif;
            font-size: 24px;
            color: var(--color-text-second-heading);
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        ul {
            padding-left: 20px;
        }

        li {
            margin: 0.25rem 0;
            color: var(--color-text);
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

        svg.icon {
            display: inline-block;
            height: 1em;
            width: 1em;
            fill: currentColor;
        }
    `;

    get authorization(): HeadersInit {
        const $ = this.viewModel.toObject();

        if ($.authenticated) {
            return {
                Authorization: `Bearer ${$.token}`
            };
        }

        return {};
    }

    static makeLink(href: string, label: string) {
        const a = document.createElement("a");
        a.href = href;
        a.textContent = label;
        return a;
    }

    static renderCard(data?: NBAData) {
        if (!data) 
            return html`<loading>`;

        // had to include this loading thing because something kept getting called leading to an error, so i just threw this in...

        const { id, Coach, Conference, Players, Games, Championships } = data;

        const playerList = Players.map(p =>
            p.href
                ? html`<li>${NBAElement.makeLink(p.href, p.player)}</li>`
                : html`<li>${p.player}</li>`
        );

        const gameList = Games.map(g => {
            const[teamName, opponent] = g.game.split(" vs ");

            return g["opponent-id"]
                ? html`
                    <li>
                        ${teamName} vs
                        <a href=${"/app/team/" + g["opponent-id"]}>
                            ${opponent}
                        </a>
                    </li>
                `
                : html`<li>${g.game}</li>`;
        });

        const chipList = Championships.map(c =>
            c.href
                ? html`<li>${NBAElement.makeLink(c.href, c.championship)}</li>`
                : html`<li>${c.championship}</li>`
        );

        return html`
            <nba-card>
                <h2 slot="title">Coach</h2>
                <ul slot="content">${Coach}</ul>
            </nba-card>

            <nba-card>
                <h2 slot="title">Conference</h2>
                <ul slot="content">${Conference}</ul>
            </nba-card>

            <nba-card>
                <h2 slot="title">Players</h2>
                <ul slot="content">${playerList}</ul>
            </nba-card>

            <nba-card>
                <h2 slot="title">Games</h2>
                <ul slot="content">${gameList}</ul>
            </nba-card>

            <nba-card>
                <h2 slot="title">Championships</h2>
                <ul slot="content">${chipList}</ul>
            </nba-card>
        `;
    }

    hydrate(src: string): Promise<NBAData | undefined> {
        return fetch(src, { headers: this.authorization })
        .then((response) => {
            if (response.status !== 200)
                throw `HTTP Status ${response.status}`;

            return response.json();
        })
        .catch((error) => {
            console.log(`Could not fetch ${src}:`, error);
        });
    }
}
