import { LitElement, html, css } from 'https://esm.sh/lit';

class ProductCard extends LitElement {
  static properties = {
    link: { type: String },
    image: { type: String },
    title: { type: String },
    currentPrice: { type: String },
    oldPrice: { type: String },
    rating: { type: String },
    starIcon:{type: String}
  };

  static styles = css`
    .product-card {
      color: inherit;
      text-decoration: none;
      cursor: pointer;
      padding: clamp(6px, 1vw, 12px);
      width: 100%;
      aspect-ratio: 6/9;
      background: white;
      box-shadow: 0 4px 10px rgba(31, 47, 84, 0.1);
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      justify-content: space-between;
      box-sizing: border-box;
      transition: transform 0.2s ease-in-out;
    }

    .product-card:hover {
      transform: scale(1.02);
    }

    .product-image {
      width: 100%;
      aspect-ratio: 1 / 1;
      border-radius: 10px;
      object-fit: cover;
    }

    .product-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex-grow: 1;
    }

    .product-prices {
      display: flex;
      gap: 6px;
      align-items: center;
      height: 24px;
      margin: 0;
      padding: 0;
    }

    .current-price {
      font-weight: 600;
      font-size: clamp(1rem, 5vw, 1.6em);
      color: #ff4363;
    }

    .old-price {
      position: relative;
      font-size: clamp(0.8rem, 1vw, 1rem);
      color: gray;
    }

    .old-price::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      height: 2px;
      background: gray;
      transform: rotate(10deg);
    }

    .product-title {
      font-size: clamp(0.9em, 4vw, 1.2em);
      line-height: 1.2;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .product-rating-add-cart {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 10px;
    }

    .product-rating {
      display: flex;
      align-items: center;
      gap: 3px;
      justify-content: center;
      background: #f9f9f9;
      padding: 6px;
      border-radius: 8px;
      width: clamp(30px, 10vw, 60px);
    }

    .product-rating p {
      margin: 0;
      font-size: clamp(0.8rem, 1vw, 1rem);
      line-height: 1;
    }

    .product-rating img {
      height: clamp(12px, 1.2vw, 16px);
    }

    .add-to-cart {
      font-size: clamp(0.8em, 3vw, 1.2em);
      aspect-ratio: 3 / 1.2;
      width: 42%;
      background: var(--coral, #ff5733);
      color: white;
      border-radius: 8px;
      transition: transform 0.15s;
      border: solid 0.5px #f2f2f2;
      z-index: 1;
      cursor: pointer;
    }

    button:active {
      transform: scale(0.95);
    }
  `;

  constructor() {
    super();
    this.link = '';
    this.image = '';
    this.title = '';
    this.currentPrice = '';
    this.oldPrice = '';
    this.rating = '';
    this.starIcon = new URL("/assets/icons/star.svg", import.meta.url).href;

  }


  render() {
    return html`
      <a href="${this.link}" class="product-card">
        <img class="product-image" src="${this.image}" alt="Product Image" />
        <div class="product-info">
          <div class="product-prices">
            ${this.oldPrice
              ? html`
                  <p class="current-price">${this.currentPrice} MDL</p>
                  <div class="old-price">${this.oldPrice}</div>
                `
              : html`
                  <p class="current-price" style="color:black">${this.currentPrice} MDL</p>
                `}
          </div>
          <p class="product-title truncate-text">${this.title}</p>
          <div class="product-rating-add-cart">
            <div class="product-rating">
              ${this.rating == 5
                ? html`<p style="color: #ff4363 !important; font-weight: 500">${this.rating}</p>`
                : html`<p>${this.rating}</p>`}
              <img src="${this.starIcon}" alt="Star" />
            </div>
            <!-- <button class="add-to-cart">În coș</button> -->
          </div>
        </div>
      </a>
    `;
  }
}

customElements.define('product-card', ProductCard);

export default ProductCard;
