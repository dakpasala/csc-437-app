import { html, css, shadow } from "@unbndl/html";

export class HomeViewElement extends HTMLElement {
    static template = html`
        <template>
            <main class="layout">
                <section class="content">
                    <lakers-element src="/api/nba/lakers"></lakers-element>
                </section>
            </main>
        </template>
    `;

    static styles = css``;

    constructor() {
        super();

        shadow(this)
            .template(HomeViewElement.template)
            .styles(HomeViewElement.styles);
    }
}