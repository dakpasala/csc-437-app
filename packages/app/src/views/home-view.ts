import { html, css, shadow } from "@unbndl/html";
import { applyTeamTheme } from "../team-themes.ts";

export class HomeViewElement extends HTMLElement {
    static template = html`
        <template>
            <main class="layout">
                <section class="content">
                    <nba-element src="/api/nba/lakers"></nba-element>
                </section>
            </main>
        </template>
    `;

    static styles = css``;

    constructor() {
        super();

        applyTeamTheme("lakers");

        shadow(this)
            .template(HomeViewElement.template)
            .styles(HomeViewElement.styles);
    }
}
