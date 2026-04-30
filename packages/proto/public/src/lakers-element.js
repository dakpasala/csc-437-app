import { html, shadow } from "@unbndl/html";
import "./lakers-card.js";

export class LakersElement extends HTMLElement {
    constructor() {
        super();
    }

    static observedAttributes = ["src"];

    attributeChangedCallback(name, _, newValue) {
        if (name === "src") {
            this.hydrate(newValue).then((data) => {
                const view = LakersElement.renderCard(data);
                shadow(this).replace(view);
            });
        }
    }

    static makeLink(href, label) {
        const a = document.createElement("a");
        a.href = href;
        a.textContent = label;
        return a;
    }

    static renderCard(data) {
        const { Players, Games, Championships } = data;

        const playerList = Players.map(p =>
            p.href
                ? html`<li>${LakersElement.makeLink(p.href, p.player)}</li>`
                : html`<li>${p.player}</li>`
        );

        const gameList = Games.map(g =>
            g.href
                ? html`<li>${LakersElement.makeLink(g.href, g.game)}</li>`
                : html`<li>${g.game}</li>`
        );

        const chipList = Championships.map(c =>
            c.href
                ? html`<li>${LakersElement.makeLink(c.href, c.championship)}</li>`
                : html`<li>${c.championship}</li>`
        );

        return html`
            <lakers-card>
                <h2 slot="title">Players</h2>
                <ul slot="content">${playerList}</ul>
            </lakers-card>

            <lakers-card>
                <h2 slot="title">Games</h2>
                <ul slot="content">${gameList}</ul>
            </lakers-card>

            <lakers-card>
                <h2 slot="title">Championships</h2>
                <ul slot="content">${chipList}</ul>
            </lakers-card>
        `;
    }

    hydrate(src) {
        return fetch(src)
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