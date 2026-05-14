import { css, html, shadow } from "@unbndl/html";
import { createViewModel } from "@unbndl/view";
import { fromAuth } from "@unbndl/auth";
import reset from "./reset.css.js";

export class LakersHeaderElement extends HTMLElement {
    viewModel = createViewModel({
        authenticated: false,
        username: ""
    }).with(fromAuth(this), "authenticated", "username");

    view = html`
        <header class="header">
            <h1>
                <svg class="icon">
                    <use href="/icons/icons.svg#icon-basketball"></use>
                </svg>

                Los Angeles Lakers

                <svg class="icon">
                    <use href="/icons/icons.svg#icon-championship"></use>
                </svg>
            </h1>

            <nav class=${($) => $.authenticated ? "logged-in" : "logged-out"}>
                <p>Hello, ${($) => $.username || "traveler"}</p>

                <menu>
                    <li class="when-signed-in">
                        <button>Sign Out</button>
                    </li>

                    <li class="when-signed-out">
                        <a href="/login.html">Sign In</a>
                    </li>
                </menu>

                <label>
                    <input type="checkbox" />
                    Dark Mode
                </label>
            </nav>
        </header>
    `;

    static styles = css`
        :host {
            display: block;
        }

        header {
            background-color: var(--color-background-header);
            color: white;

            display: flex;
            align-items: center;
            justify-content: space-between;

            padding: 1rem 2rem;
        }

        h1 {
            display: flex;
            align-items: center;
            gap: 1rem;

            margin: 0;
            font-size: 2rem;
            font-family: 'Inter', sans-serif;
        }

        nav {
            display: flex;
            align-items: center;
            gap: 1.5rem;
        }

        nav p {
            margin: 0;
        }

        menu {
            display: flex;
            align-items: center;
            margin: 0;
            padding: 0;
            list-style: none;
        }

        li {
            display: none;
        }

        .logged-in .when-signed-in,
        .logged-out .when-signed-out {
            display: block;
        }

        button {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
        }

        label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .icon {
            width: 48px;
            height: 48px;
            fill: currentColor;
        }
    `;

    constructor() {
        super();

        shadow(this)
            .styles(reset.styles, LakersHeaderElement.styles)
            .replace(this.viewModel.render(this.view))
            .delegate(".when-signed-in button", {
                click: () => this.signout()
            })
            .delegate("input[type='checkbox']", {
                change: (event) => this.toggleDarkMode(event)
            });
    }

    signout() {
        const customEvent = new CustomEvent("auth:message", {
            bubbles: true,
            composed: true,
            detail: ["auth/signout"]
        });

        this.dispatchEvent(customEvent);
    }

    toggleDarkMode(event) {
        const checked = event.target.checked;

        document.body.classList.toggle("dark-mode", checked);
    }
}