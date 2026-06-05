import { css, html, shadow } from "@unbndl/html";
import { createViewModel, fromInputs } from "@unbndl/view";
import reset from "./reset.css.js";

interface LoginFormViewModel {
  username: string;
  password: string;
  error?: string;
}

export class LoginFormElement extends HTMLElement {
  viewModel = createViewModel<LoginFormViewModel>({
    username: "",
    password: "",
    error: undefined
  }).with(
    fromInputs<{ username: string; password: string }>(this),
    "username",
    "password"
  );

  view = html<[LoginFormViewModel]>
    `<form>
      <slot></slot>
      ${($) => $.error ? html`<p class="error">${$.error}</p>` : ""}
      <button type="submit">
        <slot name="submit-label">Login</slot>
      </button>
    </form>`;

  constructor() {
    super();
    shadow(this)
      .replace(this.viewModel.render(this.view));

    this.shadowRoot?.addEventListener("submit", (ev) => {
        this.submitLogin(ev, this.getAttribute("api") || "#");
    })
  }

  submitLogin(event: Event, endpoint: string) {
    event.preventDefault();
    const data = this.viewModel.toObject();
    const method = "POST";
    const headers = {
        "Content-Type": "application/json"
    };
    const body = JSON.stringify(data);
    console.log("Posting login form:", endpoint, body, event);
    this.viewModel.set("error", undefined);

    fetch(endpoint, { method, headers, body })
        .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
            if (endpoint.includes("register") && res.status === 409) {
                this.viewModel.set("error", "Username exists");
                return undefined;
            }

            if (endpoint.includes("login") && res.status === 401) {
                this.viewModel.set("error", "Invalid username or password");
                return undefined;
            }

            this.viewModel.set("error", `Form submission failed: Status ${res.status}`);
            return undefined;
        }
        
        return res.json();
        })
        .then((json) => {
        if (!json) return;

        const { token } = json;
        const customEvent = new CustomEvent("auth:message", {
            bubbles: true,
            composed: true,
            detail: ["auth/signin", { token, redirect: "/" }]
        });
        this.dispatchEvent(customEvent);
        });
    }
}
