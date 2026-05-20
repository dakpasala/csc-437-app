import { css, html, shadow } from "@unbndl/html";

export class TeamViewElement extends HTMLElement {
    static observedAttributes = ["team-id"];

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
        if (name === "team-id" && newValue) {
            this.render(newValue);
        }
    }

    connectedCallback() {
        const id = this.getAttribute("team-id");
        if (id) this.render(id);
    }

    render(teamId: string) {
        shadow(this)
        .styles(TeamViewElement.styles)
        .replace(html`
            <main class="layout">
                <section class="content">
                    <lakers-element src=${`/api/nba/${teamId}`}></lakers-element>
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