import { LitElement, html, css } from "lit";

class Slide extends LitElement {
  static properties = {
    link: { type: String },
    image: { type: String },
    title: { type: String },
    subtitle: { type: String },
    backgroundColor: { type: String },
    textColor: { type: String },
  };

  static styles = css`
    :host {
      width: 100vw;
      max-width: 1200px;
      height: 450px;
      border-radius: 20px;
      flex: 1;
    }

    :host a {
      text-decoration: none;
      display: flex;
      align-items: center;
      height: 100%;
      width: 100%;
      justify-content: space-between;
      padding-inline: 10%;
    }

    img {
      height: 350px;
      width: auto;
    }

    .slide-text h1 {
      font-weight: 500;
      font-size: 50px;
    }

    .slide-text p {
      margin-top: 10px;
      font-size: 20px;
    }
  `;

  constructor() {
    super();
    this.link = "#";
    this.image = "";
    this.title = "";
    this.subtitle = "";
    this.backgroundColor = "";
    this.textColor = "";
  }

  updated(changedProperties) {
    if (changedProperties.has('backgroundColor')) {
      this.textColor = this.getTextColor(this.backgroundColor);
    }
  }

  getTextColor(hex) {
    const rgb = this.hexToRgb(hex);
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b);
    return luminance > 186 ? '#000000' : '#ffffff';
  }

  hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: (bigint & 255)
    };
  }

  render() {
    return html`
      <div style="background-color: ${this.backgroundColor}; color: ${this.textColor};">
        <a href="${this.link}">
          <div class="slide-text">
            <h1>Descoperă<br />${this.title}</h1>
            <p>${this.subtitle}</p>
          </div>
          <img src="${this.image}" />
        </a>
      </div>
    `;
  }
}

customElements.define("slide", Slide);
