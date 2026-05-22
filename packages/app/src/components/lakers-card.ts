import { html, css, shadow } from "@unbndl/html";
import reset from "./reset.css.js";

export class LakersCardElement extends HTMLElement {
  static template = html`
    <template>
      <div class="card">
        <h2><slot name="title"></slot></h2>
        <div class="content">
          <slot name="content"></slot>
        </div>
      </div>
    </template>
  `;

  constructor() {
    super();
    shadow(this)
      .template(LakersCardElement.template)
      .styles(...LakersCardElement.styles);
  }

  static styles = [
    reset.styles,
    css`
      .card {
        background-color: var(--color-background-card);
        padding: 1rem;
        border-radius: 8px;

        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        height: 100%;
      }

      h2 {
        font-size: 16px;
        color: var(--color-text-second-heading);
        margin-bottom: 0.5rem;
      }
    `,
  ];
}
