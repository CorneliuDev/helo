import { LitElement, html, css } from "https://esm.sh/lit";

class Category extends LitElement {
  static properties = {
    icon: { type: String },
    title: { type: String },
    id: { type: String },
  };

  static styles = css`
    .category-radio {
      display: none;
    }

    .category-label {
      display: flex;
      gap: 8px;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      margin-inline: 5px;
      height: 35px;
      padding-inline: 10px;
      border-radius: 10px;
      border: solid 0.5px var(--borderColor);
      width: auto;
    }

    .category-icon {
      width: 20px;
      aspect-ratio: 1 / 1;
    }

    .category-text {
      font-weight: 500;
    }

    .category-radio:checked + .category-label {
      background-color: var(--blue);
      color: white;
    }

    .category-radio:checked + .category-label .category-text {
      color: white;
    }

    .category-radio:checked + .category-label .category-icon {
      filter: brightness(0) invert(1);
    }
  `;

  constructor() {
    super();
    this.icon = "";
    this.title = "";
    this.id = "";
  }

  render() {
    return html`
      <input
        type="radio"
        name="category"
        id="${this.id}"
        class="category-radio"
      />
      <label for="${this.id}" class="category-label">
      ${this.icon
        ? html`<img src="${this.icon}" alt="${this.title}" class="category-icon" />`
        : ''}
        <p class="category-text">${this.title}</p>
      </label>
    `;
  }
}

customElements.define("category-component", Category);
